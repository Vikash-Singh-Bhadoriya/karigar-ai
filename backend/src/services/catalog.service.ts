import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

const supabase = createClient(config.supabaseUrl || '', config.supabaseSecretKey || '', {
  auth: { persistSession: false },
});

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

  let query = supabase.from('products').select('*', { count: 'exact' }).eq('status', 'active');

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

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    products: (data || []).map(normalizeRow),
    total: count || 0,
    page,
    limit,
  };
}

export async function getProductById(id: number): Promise<CatalogProduct | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return normalizeRow(data);
}

export async function createProduct(input: CreateProductInput): Promise<CatalogProduct> {
  const payload = {
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
  };

  const { data, error } = await supabase.from('products').insert(payload).select().single();
  if (error) throw error;
  return normalizeRow(data);
}

export async function updateProduct(
  id: number,
  input: Partial<CreateProductInput>
): Promise<CatalogProduct | null> {
  const payload: any = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.category !== undefined) payload.category = input.category;
  if (input.description !== undefined) payload.description = input.description;
  if (input.materials !== undefined) payload.materials = input.materials;
  if (input.tags !== undefined) payload.tags = input.tags;
  if (input.weight !== undefined) payload.weight = input.weight;
  if (input.dimensions !== undefined) payload.dimensions = input.dimensions;
  if (input.price !== undefined) payload.price = input.price;
  if (input.image_url !== undefined) payload.image_url = input.image_url;
  if (input.selling_scope !== undefined) payload.selling_scope = input.selling_scope;
  if (input.artisan_name !== undefined) payload.artisan_name = input.artisan_name;
  if (input.artisan_location !== undefined) payload.artisan_location = input.artisan_location;

  if (Object.keys(payload).length === 0) return getProductById(id);

  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return normalizeRow(data);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('products')
    .update({ status: 'draft', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) throw error;
  return (data?.length || 0) > 0;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('status', 'active')
    .neq('category', '')
    .order('category');

  if (error) throw error;
  
  // get distinct
  const uniqueCategories = new Set<string>();
  data?.forEach((row: { category: string }) => uniqueCategories.add(row.category));
  
  return Array.from(uniqueCategories);
}

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

export async function createOrder(input: CreateOrderInput) {
  const payload = {
    product_id: input.product_id,
    buyer_name: input.buyer_name,
    buyer_phone: input.buyer_phone,
    buyer_message: input.buyer_message ?? '',
  };
  const { data, error } = await supabase.from('orders').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        name,
        price,
        image_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map((order: any) => ({
    ...order,
    product_name: order.products?.name,
    product_price: order.products?.price,
    product_image: order.products?.image_url,
    products: undefined // remove the nested object to match previous pg output
  }));
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeRow(row: Record<string, unknown>): CatalogProduct {
  if (!row) return row as any;
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
