import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InfoCard from '@/components/InfoCard';
import ScreenHeader from '@/components/ScreenHeader';
import { colors, radius, shadow } from '@/constants/colors';
import { useProductAnalysis } from '@/context/ProductAnalysisContext';
import { formatPrice } from '@/context/productFlow';
import { useMarketPricing } from '@/hooks/useMarketPricing';

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { currentProduct, sourceImageUri, publishCurrentProduct } = useProductAnalysis();
  const { pricing, state: pricingState } = useMarketPricing(
    currentProduct != null ? currentProduct : null
  );
  const [publishing, setPublishing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onPublish = () => {
    if (publishing || !currentProduct) return;
    const item = publishCurrentProduct();
    setPublishing(true);
    timer.current = setTimeout(
      () => router.replace({ pathname: '/success', params: { publishedId: String(item?.id ?? '') } }),
      1700
    );
  };

  if (!currentProduct) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader title="Review & Publish" subtitle="सब कुछ सही है?" backTo="/recommendation" />
        <View style={[styles.empty, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={styles.emptyEmoji}>🤔</Text>
          <Text style={styles.emptyTitle}>कोई प्रोडक्ट नहीं मिला</Text>
          <Text style={styles.emptySub}>पहले AI analysis करके कोई प्रोडक्ट तैयार करें।</Text>
          <Pressable
            onPress={() => router.replace('/add-product')}
            style={({ pressed }) => [styles.publish, pressed && styles.pressed]}
          >
            <Text style={styles.publishIcon}>📸</Text>
            <Text style={styles.publishText}>नया प्रोडक्ट जोड़ें</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const tags = currentProduct.tags?.length ? currentProduct.tags : [];
  const name = currentProduct.name;
  const imageUri = sourceImageUri ?? '';
  const priceText = formatPrice(currentProduct.price);
  const description = currentProduct.description;
  const metaText = `🏷️ ${currentProduct.category || 'Handmade'}`;

  const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const marketLabel =
    pricingState === 'ready' && pricing
      ? pricing.marketAvailable
        ? `Market ${inr(pricing.observedMin ?? pricing.recommendedMin)} – ${inr(pricing.observedMax ?? pricing.recommendedMax)}`
        : `${inr(pricing.recommendedMin)} – ${inr(pricing.recommendedMax)} (अनुमानित)`
      : pricingState === 'unavailable'
      ? 'मूल्य दर्ज करें'
      : 'सुझाव तैयार हो रहा है…';
  const marketTitle = pricingState === 'ready' && pricing?.marketAvailable ? 'Market' : 'Suggested';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Review & Publish" subtitle="सब कुछ सही है?" backTo="/recommendation" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Product image */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Details */}
        <InfoCard
          icon="📝"
          title="Product Details"
          hindi="प्रोडक्ट की जानकारी"
          editLabel="बदलें"
          onEdit={() => router.push('/product-studio')}
        >
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.metaText}>{metaText}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.tags}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </InfoCard>

        {/* Price */}
        <InfoCard
          icon="💰"
          title="Selling Price"
          hindi="बिक्री की कीमत"
          editLabel="बदलें"
          onEdit={() => router.push('/recommendation')}
        >
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>{priceText}</Text>
              <Text style={styles.priceSub}>AI recommended</Text>
            </View>
            <View style={styles.marketBadge}>
              <Text style={styles.marketTitle}>{marketTitle}</Text>
              <Text style={styles.marketRange}>{marketLabel}</Text>
            </View>
          </View>
        </InfoCard>

        {/* Selling location */}
        <InfoCard
          icon="📍"
          title="Selling Location"
          hindi="बिक्री की जगह"
          editLabel="बदलें"
          onEdit={() => router.push('/recommendation')}
        >
          <View style={styles.sellRows}>
            <View style={styles.sellRow}>
              <Text style={styles.sellLabel}>Seller location</Text>
              <Text style={styles.sellValue}>
                {currentProduct.sellerLocation?.trim() || 'Location not set'}
              </Text>
            </View>
            <View style={styles.sellRow}>
              <Text style={styles.sellLabel}>Selling area</Text>
              <Text style={styles.sellValue}>
                {currentProduct.sellingArea?.trim() || 'All India'}
              </Text>
            </View>
          </View>
          <Text style={styles.deliveryEstimate}>
            Delivery estimate: Based on seller location and selected market. Actual
            courier serviceability would be verified through a logistics API in a
            later phase.
          </Text>
        </InfoCard>
      </ScrollView>

      {/* Publish CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          onPress={onPublish}
          disabled={publishing}
          style={({ pressed }) => [styles.publish, pressed && styles.pressed]}
        >
          {publishing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.publishIcon}>🛍️</Text>
              <Text style={styles.publishText}>Publish Product</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: 20,
    paddingBottom: 24,
    gap: 14,
  },
  imageCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  image: {
    width: '100%',
    height: 210,
  },
  productName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  metaText: {
    color: colors.inkMuted,
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    color: colors.inkLight,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  tagText: {
    color: colors.inkMuted,
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.brand,
    fontSize: 34,
    fontWeight: '700',
  },
  priceSub: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 2,
  },
  marketBadge: {
    backgroundColor: colors.okBg,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  marketTitle: {
    color: colors.ok,
    fontSize: 14,
    fontWeight: '700',
  },
  marketRange: {
    color: colors.ok,
    fontSize: 12,
    marginTop: 2,
  },
  sellRows: {
    gap: 8,
    marginBottom: 14,
  },
  sellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sellLabel: {
    color: colors.inkMuted,
    fontSize: 14,
  },
  sellValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  deliveryEstimate: {
    color: colors.inkMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 4,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySub: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  publish: {
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...shadow.brand,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  publishIcon: {
    fontSize: 24,
  },
  publishText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});