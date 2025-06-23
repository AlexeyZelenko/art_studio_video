export interface Service {
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

export interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  features: string[];
  iconName: string;
  gradient: string;
  order: number;
  isActive: boolean;
}