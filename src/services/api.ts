import type { ProductAnalysisResponse, ProductField, ProductState } from '@/types/product';

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

const ANALYZE_PATH = '/api/products/analyze';
const FOLLOW_UP_PATH = '/api/products/follow-up';

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface AnalyzeProductImage {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
}

export interface AnalyzeProductInput {
  image: AnalyzeProductImage;
  transcript: string;
  language: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

function guessMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'heic':
      return 'image/heic';
    case 'heif':
      return 'image/heif';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

export async function analyzeProduct(
  input: AnalyzeProductInput
): Promise<ProductAnalysisResponse> {
  if (!API_URL) {
    throw new ApiError(
      'EXPO_PUBLIC_API_URL set नहीं है। प्रोजेक्ट root में .env बनाकर अपना backend URL डालें।'
    );
  }

  const fileName = input.image.fileName || `product-${Date.now()}.jpg`;
  const mimeType = input.image.mimeType || guessMimeType(fileName);

  const body = new FormData();
  body.append('transcript', input.transcript);
  body.append('language', input.language);
  body.append('image', {
    uri: input.image.uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${ANALYZE_PATH}`, {
      method: 'POST',
      body,
    });
  } catch {
    throw new ApiError(
      `Server से कनेक्ट नहीं हो पाया (${API_URL})। Backend चल रहा है और फोन-कंप्यूटर एक ही Wi-Fi पर हैं?`
    );
  }

  let json: ApiEnvelope<ProductAnalysisResponse>;
  try {
    json = (await response.json()) as ApiEnvelope<ProductAnalysisResponse>;
  } catch {
    throw new ApiError(
      `${API_URL} ने गलत response दिया (${response.status})। क्या ${API_URL} backend है? backend port 5000 पर चलता है, Metro 8081 पर।`,
      response.status
    );
  }

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.message ?? `${API_URL} ने error दिया (${response.status})`,
      response.status
    );
  }
  if (!json.data) {
    throw new ApiError('Server से output नहीं मिला।');
  }

  return json.data;
}

export interface FollowUpInput {
  product: ProductState;
  missingFields: ProductField[];
  answer: string;
  language: string;
  questionCount: number;
}

export async function submitProductFollowUp(
  input: FollowUpInput
): Promise<ProductAnalysisResponse> {
  if (!API_URL) {
    throw new ApiError(
      'EXPO_PUBLIC_API_URL set नहीं है। प्रोजेक्ट root में .env बनाकर अपना backend URL डालें।'
    );
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${FOLLOW_UP_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiError(
      `Server से कनेक्ट नहीं हो पाया (${API_URL})। Backend चल रहा है और फोन-कंप्यूटर एक ही Wi-Fi पर हैं?`
    );
  }

  let json: ApiEnvelope<ProductAnalysisResponse>;
  try {
    json = (await response.json()) as ApiEnvelope<ProductAnalysisResponse>;
  } catch {
    throw new ApiError(
      `${API_URL} ने गलत response दिया (${response.status})। क्या ${API_URL} backend है? backend port 5000 पर चलता है।`,
      response.status
    );
  }

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.message ?? `${API_URL} ने error दिया (${response.status})`,
      response.status
    );
  }
  if (!json.data) {
    throw new ApiError('Server से output नहीं मिला।');
  }

  return json.data;
}

/* ------------------------------------------------------------------ */
/*  Marketplace publishing (buyer website catalog)                     */
/* ------------------------------------------------------------------ */

const CATALOG_PATH = '/api/catalog';

export interface PublishToServerInput {
  product: ProductState;
  imageUri: string | null;
  sellingScope: string;
  artisanName?: string;
  artisanLocation?: string;
}

export async function publishToServer(
  input: PublishToServerInput
): Promise<{ id: number } | null> {
  if (!API_URL) return null;

  try {
    const body = new FormData();
    body.append('name', input.product.name || '');
    body.append('category', input.product.category || '');
    body.append('description', input.product.description || '');
    body.append('materials', JSON.stringify(input.product.materials || []));
    body.append('tags', JSON.stringify(input.product.tags || []));
    body.append('weight', input.product.weight || '');
    body.append('dimensions', input.product.dimensions || '');
    body.append('price', String(input.product.price ?? ''));
    body.append('selling_scope', input.sellingScope || 'local');
    body.append('artisan_name', input.artisanName?.trim() || '');
    body.append(
      'artisan_location',
      input.artisanLocation?.trim() || input.product.sellerLocation?.trim() || ''
    );

    if (input.imageUri) {
      const fileName = `product-${Date.now()}.jpg`;
      body.append('image', {
        uri: input.imageUri,
        name: fileName,
        type: 'image/jpeg',
      } as unknown as Blob);
    }

    const response = await fetch(`${API_URL}${CATALOG_PATH}`, {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      console.log('[PUBLISH] Server publish failed:', response.status);
      return null;
    }

    const json = await response.json();
    return json?.data?.id ? { id: json.data.id } : null;
  } catch (err) {
    console.log('[PUBLISH] Server publish failed (network):', err);
    return null;
  }
}