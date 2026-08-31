import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '@/components/ProductCard';
import { colors, radius, shadow } from '@/constants/colors';
import { useProductAnalysis } from '@/context/ProductAnalysisContext';
import { productCardToProductState, publishedToProductCard } from '@/context/productFlow';
import { PRODUCTS } from '@/constants/mockData';
import type { ProductState, ProductStatus } from '@/types/product';

type Filter = 'all' | ProductStatus;

interface StudioEntry {
  state: ProductState;
  imageUri: string | null;
  /** Present only when this card represents an existing published product (EDIT mode). */
  publishedId?: number;
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'सभी' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Draft' },
];

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const { publishedProducts, isProductsHydrated, setProduct, setEditingProductId } =
    useProductAnalysis();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const publishedCards = [...publishedProducts]
    .reverse()
    .map(publishedToProductCard);
  const allProducts = [...publishedCards, ...PRODUCTS];

  const studioEntries = useMemo(() => {
    const byId = new Map<number, StudioEntry>();
    for (const p of publishedProducts) {
      byId.set(p.id, { state: p.product, imageUri: p.sourceImageUri, publishedId: p.id });
    }
    for (const p of PRODUCTS) {
      byId.set(p.id, { state: productCardToProductState(p), imageUri: p.img });
    }
    return byId;
  }, [publishedProducts]);

  const openStudio = (productId: number) => {
    const entry = studioEntries.get(productId);
    if (!entry) return;
    console.log('[PRODUCT SELECT] clicked product:', entry.state.name);
    console.log('[PRODUCT SELECT] loading into context:', entry.state.name);
    setProduct(entry.state, entry.imageUri ?? '');
    setEditingProductId(entry.publishedId ?? null);
    router.push('/product-studio');
  };

  const visible = allProducts.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesQuery =
      !query || p.hindi.includes(query) || p.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const count = (f: Filter) =>
    f === 'all' ? allProducts.length : allProducts.filter((p) => p.status === f).length;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>मेरे प्रोडक्ट</Text>
          <Pressable
            onPress={() => router.push('/add-product')}
            style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.search}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="प्रोडक्ट खोजें..."
            placeholderTextColor={colors.inkMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.filters}>
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {f.label} ({count(f.id)})
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {!isProductsHydrated ? (
        <View style={[styles.loading, { paddingBottom: insets.bottom + 24 }]}>
          <ActivityIndicator color={colors.brand} />
          <Text style={styles.loadingText}>आपके प्रोडक्ट लोड हो रहे हैं...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {visible.map((p) => (
            <View key={p.id} style={styles.gridItem}>
              <ProductCard product={p} showMetrics onPress={() => openStudio(p.id)} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.brand,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    padding: 0,
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.brand,
  },
  filterText: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loading: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  loadingText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  gridItem: {
    width: '47.5%',
    flexGrow: 1,
  },
});
