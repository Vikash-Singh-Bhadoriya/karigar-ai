export type ProductStatus = 'active' | 'draft';

export interface Product {
  id: number;
  hindi: string;
  title: string;
  price: string;
  status: ProductStatus;
  views: number;
  orders: number;
  img: string;
}

export interface StatItem {
  label?: string;
  hindi: string;
  value: string;
  accent?: 'brand' | 'ok' | 'ink';
  dot?: boolean;
}

export type Language = 'हिंदी' | 'मराठी' | 'English';

export type SellingScope = 'local' | 'states' | 'india';

export interface DeliveryLocation {
  city: string;
  emoji: string;
  status: 'good' | 'mod' | 'costly';
  cost: string;
  hindi: string;
}
