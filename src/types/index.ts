export interface Product {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  descriptionBn: string;
  stock: number;
  badge?: 'new' | 'hot' | 'sale';
  featured: boolean;
  sizes?: string[];
  colors?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  paymentMethod: 'bkash' | 'cod';
  bkashNumber?: string;
  bkashTransactionId?: string;
  totalAmount: number;
  deliveryCharge: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  upazila: string;
  insideNarayanganj: boolean;
}

export interface Announcement {
  id: string;
  text: string;
  textBn: string;
  active: boolean;
  createdAt: string;
  type: 'info' | 'warning' | 'success' | 'promo';
}

export type Language = 'bn' | 'en';
export type Theme = 'light' | 'dark';
