import type { Product, ProductState } from '@/types/product';

/** A product captured at the moment it is published. Snapshot — safe from later edits. */
export interface PublishedProduct {
  id: number;
  product: ProductState;
  sourceImageUri: string | null;
  createdAt: number;
}

export type ProductPatch = Partial<ProductState>;

/** Merge a patch into the current product (single source of truth for edits). */
export function applyProductPatch(product: ProductState, patch: ProductPatch): ProductState {
  return { ...product, ...patch };
}

export function createPublishedProduct(
  product: ProductState,
  sourceImageUri: string | null
): PublishedProduct {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    product,
    sourceImageUri,
    createdAt: Date.now(),
  };
}

export function formatPrice(price: number | null | undefined): string {
  return price != null ? `₹${price.toLocaleString('en-IN')}` : '—';
}

/** Shape a published AI product into the catalog card shape used by the Products tab. */
export function publishedToProductCard(published: PublishedProduct): Product {
  const name = published.product.name.trim() || 'नया प्रोडक्ट';
  return {
    id: published.id,
    hindi: name,
    title: name,
    price: formatPrice(published.product.price),
    status: 'active',
    views: 0,
    orders: 0,
    img: published.sourceImageUri ?? '',
    published: true,
  };
}

/** Build a ProductState from a catalogue card (sample product) so it can be loaded into context. */
export function productCardToProductState(card: Product): ProductState {
  const digits = card.price.replace(/\D/g, '');
  return {
    name: card.hindi.trim() || card.title,
    category: '',
    description: '',
    materials: [],
    tags: [],
    weight: null,
    dimensions: null,
    price: digits ? Number(digits) : null,
    confidence: {},
    imagePath: card.img,
  };
}