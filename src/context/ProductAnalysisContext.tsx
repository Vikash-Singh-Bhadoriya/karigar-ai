import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProductField, ProductState } from '@/types/product';
import {
  applyProductPatch,
  createPublishedProduct,
  type ProductPatch,
  type PublishedProduct,
} from '@/context/productFlow';

interface ProductAnalysisContextValue {
  /** Single source of truth for the product currently going through the AI flow. */
  currentProduct: ProductState | null;
  /** Selected photo of the current product (the one sent to the backend). */
  sourceImageUri: string | null;
  /** Fields still missing after the last analysis / follow-up answer. */
  missingFields: ProductField[];
  /** The AI's follow-up question to ask next (null when the flow can continue). */
  followUpQuestion: string | null;
  /** Store the REAL analyzed product + its selected image + optional follow-up state. */
  setProduct: (
    product: ProductState,
    imageUri: string,
    missingFields?: ProductField[],
    followUpQuestion?: string | null
  ) => void;
  /** Update ONLY the conversational missing-field state, keeping currentProduct intact. */
  setMissingFieldState: (missingFields: ProductField[], followUpQuestion: string | null) => void;
  /** Clear the current product (and its image). */
  clearProduct: () => void;
  /** Mutable update of the SAME current product (e.g. price edit). */
  updateProduct: (patch: ProductPatch) => void;
  /** Products published by the user during this session (in-memory demo catalog). */
  publishedProducts: PublishedProduct[];
  /** Add the current product to publishedProducts and return the snapshot. */
  publishCurrentProduct: () => PublishedProduct | null;
}

const ProductAnalysisContext = createContext<ProductAnalysisContextValue | undefined>(undefined);

export function ProductAnalysisProvider({ children }: { children: ReactNode }) {
  const [currentProduct, setCurrentProduct] = useState<ProductState | null>(null);
  const [sourceImageUri, setSourceImageUri] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<ProductField[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [publishedProducts, setPublishedProducts] = useState<PublishedProduct[]>([]);

  const setProduct = useCallback(
    (product: ProductState, imageUri: string, mf?: ProductField[], fq?: string | null) => {
      console.log('[FLOW DEBUG] setProduct called ->', product?.name ?? 'undefined', '| price:', product?.price ?? null, '| image:', imageUri.slice(0, 60));
      setCurrentProduct(product);
      setSourceImageUri(imageUri);
      setMissingFields(mf ?? []);
      setFollowUpQuestion(typeof fq === 'string' ? fq : null);
    },
    []
  );

  const setMissingFieldState = useCallback((mf: ProductField[], fq: string | null) => {
    setMissingFields(mf);
    setFollowUpQuestion(fq);
  }, []);

  const clearProduct = useCallback(() => {
    setCurrentProduct(null);
    setSourceImageUri(null);
    setMissingFields([]);
    setFollowUpQuestion(null);
  }, []);

  useEffect(() => {
    console.log('[FLOW DEBUG] context currentProduct changed ->', currentProduct ? currentProduct.name : 'null');
  }, [currentProduct]);

  const updateProduct = useCallback((patch: ProductPatch) => {
    setCurrentProduct((prev) => (prev ? applyProductPatch(prev, patch) : prev));
  }, []);

  const publishCurrentProduct = useCallback(() => {
    if (!currentProduct) return null;
    const item = createPublishedProduct(currentProduct, sourceImageUri);
    setPublishedProducts((prev) => [...prev, item]);
    return item;
  }, [currentProduct, sourceImageUri]);

  const value = useMemo(
    () => ({
      currentProduct,
      sourceImageUri,
      missingFields,
      followUpQuestion,
      setProduct,
      setMissingFieldState,
      clearProduct,
      updateProduct,
      publishedProducts,
      publishCurrentProduct,
    }),
    [
      currentProduct,
      sourceImageUri,
      missingFields,
      followUpQuestion,
      setProduct,
      setMissingFieldState,
      clearProduct,
      updateProduct,
      publishedProducts,
      publishCurrentProduct,
    ]
  );

  return (
    <ProductAnalysisContext.Provider value={value}>{children}</ProductAnalysisContext.Provider>
  );
}

export function useProductAnalysis(): ProductAnalysisContextValue {
  const ctx = useContext(ProductAnalysisContext);
  if (!ctx) {
    throw new Error('useProductAnalysis must be used inside ProductAnalysisProvider');
  }
  return ctx;
}