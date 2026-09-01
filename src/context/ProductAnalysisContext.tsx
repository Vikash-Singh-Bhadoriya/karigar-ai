import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProductField, ProductState, SellingScope } from '@/types/product';
import {
  applyProductPatch,
  createPublishedProduct,
  withSellerDefaults,
  type ProductPatch,
  type PublishedProduct,
} from '@/context/productFlow';
import { loadPublishedProducts, savePublishedProducts } from '@/services/productStorage';

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
  /** Seller's intended selling area (kept separate from AI product attributes). */
  sellingScope: SellingScope;
  setSellingScope: (scope: SellingScope) => void;
  /** Products published by the user (persisted in AsyncStorage). */
  publishedProducts: PublishedProduct[];
  /** id of the published product currently being edited (null = creating a NEW product). */
  editingProductId: number | null;
  /** Explicitly mark the current flow as editing an existing published product. */
  setEditingProductId: (id: number | null) => void;
  /** Create a new PublishedProduct OR overwrite the edited one (same id). Returns the snapshot. */
  publishCurrentProduct: () => PublishedProduct | null;
  /** True once the persisted catalogue has been read (even if empty/corrupted). */
  isProductsHydrated: boolean;
}

const ProductAnalysisContext = createContext<ProductAnalysisContextValue | undefined>(undefined);

export function ProductAnalysisProvider({ children }: { children: ReactNode }) {
  const [currentProduct, setCurrentProduct] = useState<ProductState | null>(null);
  const [sourceImageUri, setSourceImageUri] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<ProductField[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [publishedProducts, setPublishedProducts] = useState<PublishedProduct[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isProductsHydrated, setIsProductsHydrated] = useState(false);
  const [sellingScope, setSellingScope] = useState<SellingScope>('states');

  const setProduct = useCallback(
    (product: ProductState, imageUri: string, mf?: ProductField[], fq?: string | null) => {
      console.log('[FLOW DEBUG] setProduct called ->', product?.name ?? 'undefined', '| price:', product?.price ?? null, '| image:', imageUri.slice(0, 60));
      setCurrentProduct(withSellerDefaults(product));
      setSourceImageUri(imageUri);
      setMissingFields(mf ?? []);
      setFollowUpQuestion(typeof fq === 'string' ? fq : null);
      setEditingProductId(null);
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
    setEditingProductId(null);
  }, []);

  useEffect(() => {
    console.log('[FLOW DEBUG] context currentProduct changed ->', currentProduct ? currentProduct.name : 'null');
  }, [currentProduct]);

  // [PERSIST debug logs] Remove the four [PERSIST] logs after validation.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      console.log('[PERSIST] Loading published products');
      try {
        const stored = await loadPublishedProducts();
        if (!cancelled) setPublishedProducts(stored);
        console.log(`[PERSIST] Loaded ${stored.length} products`);
      } catch (err) {
        console.log('[PERSIST] Storage load failed', err);
      } finally {
        if (!cancelled) setIsProductsHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateProduct = useCallback((patch: ProductPatch) => {
    setCurrentProduct((prev) => (prev ? applyProductPatch(prev, patch) : prev));
  }, []);

  const publishCurrentProduct = useCallback(() => {
    if (!currentProduct) return null;
    // Build the snapshot once (outside the updater) so the returned item is stable.
    let item: PublishedProduct;
    if (editingProductId != null) {
      const existing = publishedProducts.find((p) => p.id === editingProductId);
      item = existing
        ? { ...existing, product: currentProduct, sourceImageUri }
        : createPublishedProduct(currentProduct, sourceImageUri);
    } else {
      item = createPublishedProduct(currentProduct, sourceImageUri);
    }

    setPublishedProducts((prev) => {
      const exists = editingProductId != null && prev.some((p) => p.id === editingProductId);
      // UPDATE in place (same id / same length) or CREATE by appending.
      const next = exists
        ? prev.map((p) => (p.id === editingProductId ? item : p))
        : [...prev, item];
      console.log(`[PERSIST] Saving ${next.length} products`);
      savePublishedProducts(next).catch(() => {
        // Graceful: keep the product in the UI even if the disk write failed.
      });
      return next;
    });

    // Editing session is done — next publish is a CREATE until a product is re-opened.
    setEditingProductId(null);
    return item;
  }, [currentProduct, sourceImageUri, editingProductId, publishedProducts]);

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
      sellingScope,
      setSellingScope,
      publishedProducts,
      editingProductId,
      setEditingProductId,
      publishCurrentProduct,
      isProductsHydrated,
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
      sellingScope,
      setSellingScope,
      publishedProducts,
      editingProductId,
      setEditingProductId,
      publishCurrentProduct,
      isProductsHydrated,
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