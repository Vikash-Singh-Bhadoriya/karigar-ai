import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PublishedProduct } from '@/context/productFlow';

export const PUBLISHED_PRODUCTS_STORAGE_KEY = '@karigar_ai/published_products';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Basic shape check so corrupted/foreign rows in storage can't crash the app. */
function isPublishedProduct(value: unknown): value is PublishedProduct {
  if (!isRecord(value)) return false;
  const product = value.product;
  return (
    typeof value.id === 'number' &&
    typeof value.createdAt === 'number' &&
    (typeof value.sourceImageUri === 'string' || value.sourceImageUri === null) &&
    isRecord(product) &&
    typeof product.name === 'string'
  );
}

/** Read + validate the persisted published catalogue. Never throws. */
export async function loadPublishedProducts(): Promise<PublishedProduct[]> {
  try {
    const raw = await AsyncStorage.getItem(PUBLISHED_PRODUCTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPublishedProduct);
  } catch (err) {
    console.log('[PERSIST] Storage load failed', err);
    throw err;
  }
}

/** Persist the full published catalogue. */
export async function savePublishedProducts(products: PublishedProduct[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PUBLISHED_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.log('[PERSIST] Storage save failed', err);
    throw err;
  }
}