export interface VideoService {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  iconName: string;
  gradient: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoPortfolioItem {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  customThumbnailUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoServiceFormData {
  title: string;
  description: string;
  price: string;
  features: string[];
  iconName: string;
  gradient: string;
  order: number;
  isActive: boolean;
}

export interface VideoPortfolioFormData {
  title: string;
  category: string;
  youtubeUrl: string;
  description?: string;
  customThumbnailUrl?: string;
}