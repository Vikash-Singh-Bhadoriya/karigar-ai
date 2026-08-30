export type ProductField =
  | 'name'
  | 'category'
  | 'description'
  | 'materials'
  | 'weight'
  | 'price';

export interface ProductInput {
  transcript?: string;
  language?: string;
  imagePath?: string;
}

export interface ProductState {
  name: string;
  category: string;
  description: string;
  materials: string[];
  tags: string[];
  weight: string | null;
  dimensions: string | null;
  price: number | null;
  confidence: Record<string, number>;
  language?: string;
  imagePath?: string;
}

export interface ProductAnalysisResponse {
  product: ProductState;
  missingFields: ProductField[];
  followUpQuestion?: string;
  ready: boolean;
}

export interface ListingInput {
  transcript: string;
  language?: string;
}

export interface FollowUpInput {
  product: ProductState;
  missingFields: ProductField[];
  answer: string;
  language?: string;
  /** How many follow-up questions have already been asked (0 on the first visit). */
  questionCount?: number;
}
