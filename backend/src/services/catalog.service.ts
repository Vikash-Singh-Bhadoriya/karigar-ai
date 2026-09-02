import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CatalogProduct {
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

export interface CreateProductInput {
  name: string;
  category: string;
  description: string;
  materials: string[];
  tags: string[];
  weight?: string | null;
  dimensions?: string | null;
  price?: number | null;
  image_url?: string | null;
  selling_scope?: string;
  artisan_name?: string;
  artisan_location?: string;
}

export interface CreateOrderInput {
  product_id: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_message?: string;
}

export interface CatalogFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

/* ------------------------------------------------------------------ */
/*  Products                                                           */
/* ------------------------------------------------------------------ */

export async function getAllProducts(filters: CatalogFilters = {}): Promise<{
  products: CatalogProduct[];
  total: number;
  page: number;
  limit: number;
}> {
  const { search, category, minPrice, maxPrice } = filters;
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 20));
  const offset = (page - 1) * limit;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
  }
  if (category) {
    query = query.ilike('category', category);
  }
  if (minPrice != null) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice != null) {
    query = query.lte('price', maxPrice);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  const products: CatalogProduct[] = (data ?? []).map(normalizeRow);
  return { products, total: count ?? 0, page, limit };
}

export async function getProductById(id: number): Promise<CatalogProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return normalizeRow(data);
}

export async function createProduct(input: CreateProductInput): Promise<CatalogProduct> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name,
      category: input.category || '',
      description: input.description || '',
      materials: input.materials || [],
      tags: input.tags || [],
      weight: input.weight ?? null,
      dimensions: input.dimensions ?? null,
      price: input.price ?? null,
      image_url: input.image_url ?? null,
      selling_scope: input.selling_scope ?? 'local',
      artisan_name: input.artisan_name ?? 'कारीगर',
      artisan_location: input.artisan_location ?? '',
    })
    .select()
    .single();

  if (error) throw error;
  return normalizeRow(data);
}

export async function updateProduct(
  id: number,
  input: Partial<CreateProductInput>
): Promise<CatalogProduct | null> {
  const updates: Record<string, unknown> = {};

  if (input.name !== undefined) updates.name = input.name;
  if (input.category !== undefined) updates.category = input.category;
  if (input.description !== undefined) updates.description = input.description;
  if (input.materials !== undefined) updates.materials = input.materials;
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.weight !== undefined) updates.weight = input.weight;
  if (input.dimensions !== undefined) updates.dimensions = input.dimensions;
  if (input.price !== undefined) updates.price = input.price;
  if (input.image_url !== undefined) updates.image_url = input.image_url;
  if (input.selling_scope !== undefined) updates.selling_scope = input.selling_scope;
  if (input.artisan_name !== undefined) updates.artisan_name = input.artisan_name;
  if (input.artisan_location !== undefined) updates.artisan_location = input.artisan_location;

  if (Object.keys(updates).length === 0) return getProductById(id);

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return normalizeRow(data);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { error, count } = await supabase
    .from('products')
    .update({ status: 'draft', updated_at: new Date().toISOString() })
    .eq('id', id);

  return !error;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('status', 'active')
    .neq('category', '')
    .order('category');

  if (error || !data) return [];

  const unique = [...new Set(data.map((r: { category: string }) => r.category))];
  return unique;
}

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

export async function createOrder(input: CreateOrderInput) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      product_id: input.product_id,
      buyer_name: input.buyer_name,
      buyer_phone: input.buyer_phone,
      buyer_message: input.buyer_message ?? '',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrders() {
  // Get orders with product info via a join-like query
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !orders) return [];

  // Fetch product details for each order
  const productIds = [...new Set(orders.map((o: any) => o.product_id))];
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .in('id', productIds);

  const productMap = new Map((products ?? []).map((p: any) => [p.id, p]));

  return orders.map((o: any) => {
    const p = productMap.get(o.product_id) as any;
    return {
      ...o,
      product_name: p?.name ?? null,
      product_price: p?.price ?? null,
      product_image: p?.image_url ?? null,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeRow(row: Record<string, unknown>): CatalogProduct {
  return {
    ...row,
    materials: Array.isArray(row.materials) ? row.materials : parseJsonColumn(row.materials),
    tags: Array.isArray(row.tags) ? row.tags : parseJsonColumn(row.tags),
  } as CatalogProduct;
}

function parseJsonColumn(val: unknown): string[] {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}
