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