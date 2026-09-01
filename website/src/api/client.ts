import axios from 'axios';
import type { Product, Order, ProductListResponse, ProductDetailResponse, CategoriesResponse, OrderResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL: API_BASE });

export async function getProducts(params?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}): Promise<ProductListResponse['data']> {
  const { data } = await api.get<ProductListResponse>('/api/catalog', { params });
  return data.data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<ProductDetailResponse>(`/api/catalog/${id}`);
  return data.data;
}

export async function getCategories(): Promise<string[]> {
  const { data } = await api.get<CategoriesResponse>('/api/catalog/categories');
  return data.data;
}

export async function placeOrder(order: {
  product_id: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_message?: string;
}): Promise<Order> {
  const { data } = await api.post<OrderResponse>('/api/orders', order);
  return data.data;
}

export function getImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&fit=crop';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE}${imageUrl}`;
}
