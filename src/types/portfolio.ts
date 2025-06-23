export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string; // Main image for backward compatibility
  images: string[]; // Array of all images
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
}