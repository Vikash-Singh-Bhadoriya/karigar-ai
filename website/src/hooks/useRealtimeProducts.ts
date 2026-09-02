import { useEffect, useState, useCallback, useRef } from 'react';
import type { Product } from '../types';
import { getProducts } from '../api/client';
import { supabase } from '../lib/supabase';

interface UseRealtimeProductsArgs {
  search?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  limit?: number;
}

export function useRealtimeProducts(filters: UseRealtimeProductsArgs = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Keep filters in a ref so we can access them in the realtime callback
  // without re-subscribing every time filters change
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({
        search: filters.search || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        limit: filters.limit || 20,
      });
      setProducts(res.products);
      setTotal(res.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice, filters.limit]);

  // Initial fetch on mount or when filters change
  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          const currentFilters = filtersRef.current;
          
          if (payload.eventType === 'INSERT') {
            // Check if the new product matches the current active filters before adding it to UI
            const newProduct = payload.new as Product;
            
            if (currentFilters.category && currentFilters.category !== newProduct.category) return;
            if (currentFilters.minPrice && (newProduct.price || 0) < Number(currentFilters.minPrice)) return;
            if (currentFilters.maxPrice && (newProduct.price || 0) > Number(currentFilters.maxPrice)) return;
            
            // Add to the front of the list
            setProducts((prev) => [newProduct, ...prev]);
            setTotal((t) => t + 1);
          } 
          else if (payload.eventType === 'UPDATE') {
            setProducts((prev) => 
              prev.map((p) => (p.id === payload.new.id ? { ...p, ...payload.new } : p))
            );
          } 
          else if (payload.eventType === 'DELETE') {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
            setTotal((t) => Math.max(0, t - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  return { products, total, loading };
}
