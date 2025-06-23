import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Service, ServiceFormData } from '../types/service';

// Default services data
const defaultServices: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Портретна фотосесія',
    description: 'Індивідуальні та групові портрети з професійним освітленням',
    price: 'від 1500 грн',
    features: ['30+ оброблених фото', '2 години зйомки', 'Різні образи'],
    iconName: 'Camera',
    gradient: 'from-pink-500 to-rose-500',
    order: 1,
    isActive: true
  },
  {
    title: 'Весільна фотосесія',
    description: 'Незабутні моменти вашого найважливішого дня',
    price: 'від 8000 грн',
    features: ['Повний день зйомки', '300+ фото', 'Відеосупровід'],
    iconName: 'Heart',
    gradient: 'from-purple-500 to-indigo-500',
    order: 2,
    isActive: true
  },
  {
    title: 'Корпоративна зйомка',
    description: 'Професійні фото для бізнесу та соціальних мереж',
    price: 'від 2500 грн',
    features: ['Бізнес-портрети', 'Командні фото', 'Брендинг'],
    iconName: 'Briefcase',
    gradient: 'from-blue-500 to-cyan-500',
    order: 3,
    isActive: true
  },
  {
    title: 'Сімейна фотосесія',
    description: 'Теплі сімейні моменти в затишній атмосфері',
    price: 'від 2000 грн',
    features: ['Всі члени родини', '50+ фото', 'Домашня атмосфера'],
    iconName: 'Users',
    gradient: 'from-green-500 to-teal-500',
    order: 4,
    isActive: true
  },
  {
    title: 'Дитяча фотосесія',
    description: 'Милі та природні знімки ваших малюків',
    price: 'від 1800 грн',
    features: ['Ігрова форма', 'Батьки в кадрі', 'Безпечно для дітей'],
    iconName: 'Baby',
    gradient: 'from-yellow-500 to-orange-500',
    order: 5,
    isActive: true
  },
  {
    title: 'Fashion фотосесія',
    description: 'Стильні та креативні fashion-зйомки',
    price: 'від 3000 грн',
    features: ['Стиліст включено', 'Різні локації', 'Ретуш високої якості'],
    iconName: 'Zap',
    gradient: 'from-violet-500 to-purple-500',
    order: 6,
    isActive: true
  }
];

interface ServicesContextType {
  services: Service[];
  loading: boolean;
  addService: (serviceData: ServiceFormData) => Promise<string>;
  updateService: (id: string, updates: Partial<ServiceFormData>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  getActiveServices: () => Service[];
  refreshServices: () => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const items: Service[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Service);
      });
      
      // If no services in database, use default services
      if (items.length === 0) {
        await initializeDefaultServices();
        return;
      }
      
      setServices(items);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to default services if Firebase fails
      const fallbackServices: Service[] = defaultServices.map((service, index) => ({
        ...service,
        id: `default-${index}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      setServices(fallbackServices);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultServices = async () => {
    try {
      const promises = defaultServices.map(async (service) => {
        const newService = {
          ...service,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return await addDoc(collection(db, 'services'), newService);
      });
      
      await Promise.all(promises);
      await fetchServices(); // Refetch after initialization
    } catch (error) {
      console.error('Error initializing default services:', error);
    }
  };

  const addService = async (serviceData: ServiceFormData): Promise<string> => {
    try {
      const newService = {
        ...serviceData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'services'), newService);
      
      const service: Service = {
        id: docRef.id,
        ...newService,
      };
      
      setServices(prev => [...prev, service].sort((a, b) => a.order - b.order));
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  const updateService = async (id: string, updates: Partial<ServiceFormData>): Promise<void> => {
    try {
      const updateData = { ...updates, updatedAt: new Date() };
      
      await updateDoc(doc(db, 'services', id), updateData);
      
      setServices(prev => 
        prev.map(service => 
          service.id === id 
            ? { ...service, ...updateData }
            : service
        ).sort((a, b) => a.order - b.order)
      );
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  const deleteService = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'services', id));
      
      setServices(prev => prev.filter(service => service.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  };

  const getActiveServices = (): Service[] => {
    return services.filter(service => service.isActive).sort((a, b) => a.order - b.order);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const value: ServicesContextType = {
    services,
    loading,
    addService,
    updateService,
    deleteService,
    getActiveServices,
    refreshServices: fetchServices
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = (): ServicesContextType => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}; 