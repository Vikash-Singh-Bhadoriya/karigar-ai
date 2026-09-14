export type ProductStatus = 'active' | 'draft';

export interface Product {
  id: number;
  hindi: string;
  title: string;
  price: string;
  status: ProductStatus;
  views: number;
  orders: number;
  img: string;
  /** True when this catalog entry is a newly published AI product (not demo data). */
  published?: boolean;
}

export interface StatItem {
  label?: string;
  hindi: string;
  value: string;
  accent?: 'brand' | 'ok' | 'ink';
  dot?: boolean;
}

export type Language =
  | 'हिंदी'
  | 'मराठी'
  | 'English'
  | 'বাংলা'
  | 'తెలుగు'
  | 'தமிழ்'
  | 'ગુજરાતી'
  | 'ಕನ್ನಡ'
  | 'മലയാളം'
  | 'ଓଡ଼ିଆ'
  | 'ਪੰਜਾਬੀ'
  | 'অসমীয়া'
  | 'اردو'
  | 'कश्मीरी / كٲشُر'
  | 'कोंकणी'
  | 'मैथिली'
  | "बर'"
  | 'डोगरी'
  | 'মৈতৈলোন্'
  | 'नेपाली'
  | 'संस्कृतम्'
  | 'ᱥᱟᱱᱛᱟᱲᱤ'
  | 'سنڌي / सिन्धी'
  | (string & {});

export type SellingScope = 'local' | 'states' | 'india';

export type ProductField =
  | 'name'
  | 'category'
  | 'description'
  | 'materials'
  | 'weight'
  | 'price';

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
  /** Seller-provided location text (e.g. "Gwalior, Madhya Pradesh"). */
  sellerLocation?: string;
  /** Seller-provided selling area (e.g. "All India"). */
  sellingArea?: string;
}

export interface ProductAnalysisResponse {
  product: ProductState;
  missingFields: ProductField[];
  followUpQuestion?: string;
  ready: boolean;
}
