import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { PortfolioItem } from '../types/portfolio';

interface PortfolioContextType {
  portfolioItems: PortfolioItem[];
  loading: boolean;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'images'>, files: File[]) => Promise<string>;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>, newFiles?: File[]) => Promise<void>;
  deletePortfolioItem: (id: string, images: string[]) => Promise<void>;
  deleteImageFromPortfolio: (itemId: string, imageUrl: string) => Promise<void>;
  refreshPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: PortfolioItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          // Ensure backward compatibility with single image items
          images: data.images || (data.imageUrl ? [data.imageUrl] : []),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as PortfolioItem);
      });
      
      console.log('PortfolioContext: Fetched', items.length, 'items');
      setPortfolioItems(items);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    });
    
    return await Promise.all(uploadPromises);
  };

  const addPortfolioItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'images'>, files: File[]) => {
    try {
      const imageUrls = await uploadImages(files);
      const newItem = {
        ...item,
        imageUrl: imageUrls[0], // First image as main image for backward compatibility
        images: imageUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'portfolio'), newItem);
      
      // Create the complete portfolio item
      const portfolioItem: PortfolioItem = {
        id: docRef.id,
        ...newItem,
      };
      
      console.log('PortfolioContext: Adding new portfolio item:', portfolioItem);
      
      // Immediately update local state without refetching
      setPortfolioItems(prev => {
        const updated = [portfolioItem, ...prev];
        console.log('PortfolioContext: Updated portfolio items count:', updated.length);
        return updated;
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  };

  const updatePortfolioItem = async (id: string, updates: Partial<PortfolioItem>, newFiles?: File[]) => {
    try {
      let updateData = { ...updates, updatedAt: new Date() };
      
      // Get current item to preserve existing images if needed
      const currentItem = portfolioItems.find(item => item.id === id);
      
      if (newFiles && newFiles.length > 0) {
        const newImageUrls = await uploadImages(newFiles);
        const existingImages = currentItem?.images || [];
        
        // Combine existing and new images
        const allImages = [...existingImages, ...newImageUrls];
        updateData.images = allImages;
        updateData.imageUrl = allImages[0]; // Update main image
      }
      
      await updateDoc(doc(db, 'portfolio', id), updateData);
      
      // Immediately update local state
      setPortfolioItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...updateData }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  };

  const deletePortfolioItem = async (id: string, images: string[]) => {
    try {
      // Delete all images from storage
      const deletePromises = images.map(async (imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        return await deleteObject(imageRef);
      });
      
      await Promise.all(deletePromises);
      
      // Delete document from Firestore
      await deleteDoc(doc(db, 'portfolio', id));
      
      // Immediately update local state
      setPortfolioItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  };

  const deleteImageFromPortfolio = async (itemId: string, imageUrl: string) => {
    try {
      const currentItem = portfolioItems.find(item => item.id === itemId);
      if (!currentItem) return;

      // Remove image from storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Update images array
      const updatedImages = currentItem.images.filter(img => img !== imageUrl);
      
      if (updatedImages.length === 0) {
        // If no images left, delete the entire item
        await deletePortfolioItem(itemId, []);
        return;
      }

      const updateData = {
        images: updatedImages,
        imageUrl: updatedImages[0], // Set first remaining image as main
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'portfolio', itemId), updateData);

      // Update local state
      setPortfolioItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, ...updateData }
            : item
        )
      );
    } catch (error) {
      console.error('Error deleting image from portfolio:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const contextValue: PortfolioContextType = {
    portfolioItems,
    loading,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    deleteImageFromPortfolio,
    refreshPortfolio: fetchPortfolio,
  };

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
}; 