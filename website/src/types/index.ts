export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  materials: string[];
  tags: string[];
  weight: string | null;
  dimensions: string | null;
  price: number | null;
  image_url: string | null;
  selling_scope: string;
  artisan_name: string;
  artisan_location: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  product_id: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_message: string;
  status: string;
  created_at: string;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}
