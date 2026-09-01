import { db } from '../config/database';

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

  const conditions: string[] = [`status = 'active'`];
  const params: unknown[] = [];
  let idx = 1;

  if (search) {
    conditions.push(
      `(name ILIKE $${idx} OR description ILIKE $${idx} OR category ILIKE $${idx})`
    );
    params.push(`%${search}%`);
    idx++;
  }

  if (category) {
    conditions.push(`category ILIKE $${idx}`);
    params.push(category);
    idx++;
  }

  if (minPrice != null) {
    conditions.push(`price >= $${idx}`);
    params.push(minPrice);
    idx++;
  }

  if (maxPrice != null) {
    conditions.push(`price <= $${idx}`);
    params.push(maxPrice);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*)::int AS total FROM products ${where}`,
    params
  );
  const total: number = countResult.rows[0]?.total ?? 0;

  const dataResult = await db.query(
    `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...params, limit, offset]
  );

  const products: CatalogProduct[] = dataResult.rows.map(normalizeRow);

  return { products, total, page, limit };
}

export async function getProductById(id: number): Promise<CatalogProduct | null> {
  const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return normalizeRow(result.rows[0]);
}

export async function createProduct(input: CreateProductInput): Promise<CatalogProduct> {
  const result = await db.query(
    `INSERT INTO products (name, category, description, materials, tags, weight, dimensions, price, image_url, selling_scope, artisan_name, artisan_location)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [
      input.name,
      input.category || '',
      input.description || '',
      JSON.stringify(input.materials || []),
      JSON.stringify(input.tags || []),
      input.weight ?? null,
      input.dimensions ?? null,
      input.price ?? null,
      input.image_url ?? null,
      input.selling_scope ?? 'local',
      input.artisan_name ?? 'कारीगर',
      input.artisan_location ?? '',
    ]
  );
  return normalizeRow(result.rows[0]);
}

export async function updateProduct(
  id: number,
  input: Partial<CreateProductInput>
): Promise<CatalogProduct | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.name !== undefined) { fields.push(`name = $${idx++}`); values.push(input.name); }
  if (input.category !== undefined) { fields.push(`category = $${idx++}`); values.push(input.category); }
  if (input.description !== undefined) { fields.push(`description = $${idx++}`); values.push(input.description); }
  if (input.materials !== undefined) { fields.push(`materials = $${idx++}`); values.push(JSON.stringify(input.materials)); }
  if (input.tags !== undefined) { fields.push(`tags = $${idx++}`); values.push(JSON.stringify(input.tags)); }
  if (input.weight !== undefined) { fields.push(`weight = $${idx++}`); values.push(input.weight); }
  if (input.dimensions !== undefined) { fields.push(`dimensions = $${idx++}`); values.push(input.dimensions); }
  if (input.price !== undefined) { fields.push(`price = $${idx++}`); values.push(input.price); }
  if (input.image_url !== undefined) { fields.push(`image_url = $${idx++}`); values.push(input.image_url); }
  if (input.selling_scope !== undefined) { fields.push(`selling_scope = $${idx++}`); values.push(input.selling_scope); }
  if (input.artisan_name !== undefined) { fields.push(`artisan_name = $${idx++}`); values.push(input.artisan_name); }
  if (input.artisan_location !== undefined) { fields.push(`artisan_location = $${idx++}`); values.push(input.artisan_location); }

  if (fields.length === 0) return getProductById(id);

  fields.push(`updated_at = now()`);
  values.push(id);

  const result = await db.query(
    `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );

  if (result.rows.length === 0) return null;
  return normalizeRow(result.rows[0]);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await db.query(
    `UPDATE products SET status = 'draft', updated_at = now() WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function getCategories(): Promise<string[]> {
  const result = await db.query(
    `SELECT DISTINCT category FROM products WHERE status = 'active' AND category != '' ORDER BY category`
  );
  return result.rows.map((r: { category: string }) => r.category);
}

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

export async function createOrder(input: CreateOrderInput) {
  const result = await db.query(
    `INSERT INTO orders (product_id, buyer_name, buyer_phone, buyer_message)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [input.product_id, input.buyer_name, input.buyer_phone, input.buyer_message ?? '']
  );
  return result.rows[0];
}

export async function getOrders() {
  const result = await db.query(
    `SELECT o.*, p.name AS product_name, p.price AS product_price, p.image_url AS product_image
     FROM orders o
     LEFT JOIN products p ON o.product_id = p.id
     ORDER BY o.created_at DESC`
  );
  return result.rows;
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
