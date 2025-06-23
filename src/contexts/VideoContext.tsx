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
import { VideoService, VideoPortfolioItem, VideoServiceFormData, VideoPortfolioFormData } from '../types/video';

// Default video services data
const defaultVideoServices: Omit<VideoService, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Весільне відео',
    description: 'Кінематографічна зйомка вашого найважливішого дня',
    price: 'від 15000 грн',
    features: ['Повний день зйомки', 'Професійний монтаж', 'Музичний супровід', 'Кольорокорекція'],
    iconName: 'Heart',
    gradient: 'from-pink-500 to-rose-500',
    order: 1,
    isActive: true
  },
  {
    title: 'Корпоративне відео',
    description: 'Презентаційні ролики для вашого бізнесу',
    price: 'від 8000 грн',
    features: ['Сценарій включено', 'Професійний звук', 'Графічні елементи', 'Швидка доставка'],
    iconName: 'Briefcase',
    gradient: 'from-blue-500 to-cyan-500',
    order: 2,
    isActive: true
  },
  {
    title: 'Рекламний ролик',
    description: 'Креативні рекламні відео для соціальних мереж',
    price: 'від 5000 грн',
    features: ['Креативна концепція', 'Адаптація під платформи', 'Анімаційні елементи', 'Швидкий монтаж'],
    iconName: 'Zap',
    gradient: 'from-purple-500 to-indigo-500',
    order: 3,
    isActive: true
  },
  {
    title: 'Музичний кліп',
    description: 'Професійні музичні відео для артистів',
    price: 'від 12000 грн',
    features: ['Художня концепція', 'Спецефекти', 'Кольорокорекція', 'Синхронізація з музикою'],
    iconName: 'Video',
    gradient: 'from-violet-500 to-purple-500',
    order: 4,
    isActive: true
  },
  {
    title: 'Документальне відео',
    description: 'Історії, що залишаються в пам\'яті назавжди',
    price: 'від 10000 грн',
    features: ['Інтерв\'ю', 'Архівні матеріали', 'Професійний монтаж', 'Емоційна подача'],
    iconName: 'Camera',
    gradient: 'from-green-500 to-teal-500',
    order: 5,
    isActive: true
  },
  {
    title: 'Event відео',
    description: 'Зйомка заходів та святкувань',
    price: 'від 6000 грн',
    features: ['Багатокамерна зйомка', 'Живий звук', 'Highlights ролик', 'Швидка обробка'],
    iconName: 'Users',
    gradient: 'from-yellow-500 to-orange-500',
    order: 6,
    isActive: true
  }
];

// Default video portfolio data
const defaultVideoPortfolio: Omit<VideoPortfolioItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Весільний фільм Анни та Максима',
    category: 'Весілля',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Романтична історія кохання, зафіксована в кінематографічному стилі'
  },
  {
    title: 'Корпоративний ролик IT компанії',
    category: 'Корпоратив',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Презентаційне відео про інноваційну IT компанію та її команду'
  },
  {
    title: 'Рекламний ролик ресторану',
    category: 'Реклама',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Апетитний рекламний ролик для мережі ресторанів'
  },
  {
    title: 'Музичний кліп "Літо"',
    category: 'Музика',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Яскравий літній кліп з елементами анімації'
  },
  {
    title: 'Документальний фільм про мистецтво',
    category: 'Документальне',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Глибокий погляд на сучасне українське мистецтво'
  },
  {
    title: 'Відео з конференції Tech Summit',
    category: 'Event',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Highlights з найбільшої технологічної конференції року'
  }
];

interface VideoContextType {
  // Services
  videoServices: VideoService[];
  servicesLoading: boolean;
  addVideoService: (serviceData: VideoServiceFormData) => Promise<string>;
  updateVideoService: (id: string, updates: Partial<VideoServiceFormData>) => Promise<void>;
  deleteVideoService: (id: string) => Promise<void>;
  getActiveVideoServices: () => VideoService[];
  
  // Portfolio
  videoPortfolio: VideoPortfolioItem[];
  portfolioLoading: boolean;
  addVideoPortfolioItem: (itemData: VideoPortfolioFormData) => Promise<string>;
  updateVideoPortfolioItem: (id: string, updates: Partial<VideoPortfolioFormData>) => Promise<void>;
  deleteVideoPortfolioItem: (id: string) => Promise<void>;
  
  // Common
  refreshVideoData: () => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoServices, setVideoServices] = useState<VideoService[]>([]);
  const [videoPortfolio, setVideoPortfolio] = useState<VideoPortfolioItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  // Helper function to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper function to get YouTube thumbnail
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const fetchVideoServices = async () => {
    try {
      const q = query(collection(db, 'videoServices'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const items: VideoService[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as VideoService);
      });
      
      if (items.length === 0) {
        await initializeDefaultVideoServices();
        return;
      }
      
      setVideoServices(items);
    } catch (error) {
      console.error('Error fetching video services:', error);
      const fallbackServices: VideoService[] = defaultVideoServices.map((service, index) => ({
        ...service,
        id: `default-${index}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      setVideoServices(fallbackServices);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchVideoPortfolio = async () => {
    try {
      const q = query(collection(db, 'videoPortfolio'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: VideoPortfolioItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          thumbnailUrl: data.thumbnailUrl || getYouTubeThumbnail(data.youtubeUrl),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as VideoPortfolioItem);
      });
      
      if (items.length === 0) {
        await initializeDefaultVideoPortfolio();
        return;
      }
      
      setVideoPortfolio(items);
    } catch (error) {
      console.error('Error fetching video portfolio:', error);
      const fallbackPortfolio: VideoPortfolioItem[] = defaultVideoPortfolio.map((item, index) => ({
        ...item,
        id: `default-${index}`,
        thumbnailUrl: getYouTubeThumbnail(item.youtubeUrl),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      setVideoPortfolio(fallbackPortfolio);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const initializeDefaultVideoServices = async () => {
    try {
      const promises = defaultVideoServices.map(async (service) => {
        const newService = {
          ...service,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return await addDoc(collection(db, 'videoServices'), newService);
      });
      
      await Promise.all(promises);
      await fetchVideoServices();
    } catch (error) {
      console.error('Error initializing default video services:', error);
    }
  };

  const initializeDefaultVideoPortfolio = async () => {
    try {
      const promises = defaultVideoPortfolio.map(async (item) => {
        const newItem = {
          ...item,
          thumbnailUrl: getYouTubeThumbnail(item.youtubeUrl),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return await addDoc(collection(db, 'videoPortfolio'), newItem);
      });
      
      await Promise.all(promises);
      await fetchVideoPortfolio();
    } catch (error) {
      console.error('Error initializing default video portfolio:', error);
    }
  };

  // Service methods
  const addVideoService = async (serviceData: VideoServiceFormData): Promise<string> => {
    try {
      const newService = {
        ...serviceData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'videoServices'), newService);
      
      const service: VideoService = {
        id: docRef.id,
        ...newService,
      };
      
      setVideoServices(prev => [...prev, service].sort((a, b) => a.order - b.order));
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding video service:', error);
      throw error;
    }
  };

  const updateVideoService = async (id: string, updates: Partial<VideoServiceFormData>): Promise<void> => {
    try {
      const updateData = { ...updates, updatedAt: new Date() };
      
      await updateDoc(doc(db, 'videoServices', id), updateData);
      
      setVideoServices(prev => 
        prev.map(service => 
          service.id === id 
            ? { ...service, ...updateData }
            : service
        ).sort((a, b) => a.order - b.order)
      );
    } catch (error) {
      console.error('Error updating video service:', error);
      throw error;
    }
  };

  const deleteVideoService = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'videoServices', id));
      
      setVideoServices(prev => prev.filter(service => service.id !== id));
    } catch (error) {
      console.error('Error deleting video service:', error);
      throw error;
    }
  };

  // Portfolio methods
  const addVideoPortfolioItem = async (itemData: VideoPortfolioFormData): Promise<string> => {
    try {
      const newItem = {
        ...itemData,
        thumbnailUrl: getYouTubeThumbnail(itemData.youtubeUrl),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'videoPortfolio'), newItem);
      
      const portfolioItem: VideoPortfolioItem = {
        id: docRef.id,
        ...newItem,
      };
      
      setVideoPortfolio(prev => [portfolioItem, ...prev]);
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding video portfolio item:', error);
      throw error;
    }
  };

  const updateVideoPortfolioItem = async (id: string, updates: Partial<VideoPortfolioFormData>): Promise<void> => {
    try {
      const updateData = {
        ...updates,
        ...(updates.youtubeUrl && { thumbnailUrl: getYouTubeThumbnail(updates.youtubeUrl) }),
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'videoPortfolio', id), updateData);
      
      setVideoPortfolio(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...updateData }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating video portfolio item:', error);
      throw error;
    }
  };

  const deleteVideoPortfolioItem = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'videoPortfolio', id));
      
      setVideoPortfolio(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting video portfolio item:', error);
      throw error;
    }
  };

  const getActiveVideoServices = (): VideoService[] => {
    return videoServices.filter(service => service.isActive).sort((a, b) => a.order - b.order);
  };

  const refreshVideoData = async () => {
    await Promise.all([fetchVideoServices(), fetchVideoPortfolio()]);
  };

  useEffect(() => {
    fetchVideoServices();
    fetchVideoPortfolio();
  }, []);

  const value: VideoContextType = {
    videoServices,
    servicesLoading,
    addVideoService,
    updateVideoService,
    deleteVideoService,
    getActiveVideoServices,
    videoPortfolio,
    portfolioLoading,
    addVideoPortfolioItem,
    updateVideoPortfolioItem,
    deleteVideoPortfolioItem,
    refreshVideoData
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};