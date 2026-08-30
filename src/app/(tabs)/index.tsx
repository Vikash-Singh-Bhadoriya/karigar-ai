import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '@/components/ProductCard';
import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import { colors, radius, shadow } from '@/constants/colors';
import { HOME_STATS, IMAGES, PRODUCTS } from '@/constants/mockData';
import { useProductAnalysis } from '@/context/ProductAnalysisContext';
import { productCardToProductState } from '@/context/productFlow';
import type { Product } from '@/types/product';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { setProduct } = useProductAnalysis();
  const myProducts = PRODUCTS.slice(0, 2);

  const openStudio = (card: Product) => {
    const state = productCardToProductState(card);
    console.log('[PRODUCT SELECT] clicked product:', state.name);
    console.log('[PRODUCT SELECT] loading into context:', state.name);
    setProduct(state, card.img);
    router.push('/product-studio');
  };
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - extends full bleed behind status bar */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerRow}>
            <View style={styles.greeting}>
              <Text style={styles.greetingTitle}>नमस्ते, Ramesh 👋</Text>
              <Text style={styles.greetingSub}>आज क्या बेचना चाहते हैं?</Text>
            </View>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: IMAGES.avatar }} style={styles.avatar} />
              <View style={styles.notifBadge}>
                <Text style={styles.notifText}>3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main CTA floats over header */}
        <View style={styles.ctaWrap}>
          <Pressable
            onPress={() => router.push('/add-product')}
            style={({ pressed }) => [styles.ctaCard, pressed && styles.pressed]}
          >
            <View style={styles.ctaIcon}>
              <Text style={styles.ctaIconText}>📸</Text>
            </View>
            <View style={styles.ctaTexts}>
              <Text style={styles.ctaTitle}>नया प्रोडक्ट जोड़ें</Text>
              <Text style={styles.ctaSub}>फोटो खींचें या बोलकर बताएं</Text>
            </View>
            <View style={styles.ctaPlus}>
              <Text style={styles.ctaPlusText}>+</Text>
            </View>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          {HOME_STATS.map((s, i) => (
            <StatCard key={i} item={s} />
          ))}
        </View>

        {/* AI Insight strip */}
        <View style={styles.insight}>
          <Text style={styles.insightSparkle}>✨</Text>
          <Text style={styles.insightText}>
            मुंबई में आपके bags की demand बढ़ रही है
          </Text>
          <Text style={styles.insightLink}>देखें →</Text>
        </View>

        {/* Products grid */}
        <View style={styles.section}>
          <SectionHeader
            title="आपके प्रोडक्ट"
            actionLabel="सभी देखें"
            onAction={() => router.push('/products')}
          />
          <View style={styles.grid}>
            {myProducts.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} onPress={() => openStudio(p)} />
              </View>
            ))}
          </View>
        </View>

        {/* Prompt to continue/start */}
        <Pressable
          onPress={() => router.push('/add-product')}
          style={({ pressed }) => [
            styles.promptCta,
            { marginBottom: insets.bottom + 20 },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.promptCtaText}>✨ AI से नया प्रोडक्ट बनाएं</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: colors.brand,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    flex: 1,
  },
  greetingTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  greetingSub: {
    color: colors.white70,
    fontSize: 15,
    marginTop: 4,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.white55,
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.warn,
    borderWidth: 2,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  ctaWrap: {
    paddingHorizontal: 20,
    marginTop: -26,
  },
  ctaCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...shadow.card,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  ctaIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: 'rgba(224,123,30,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaIconText: {
    fontSize: 28,
  },
  ctaTexts: {
    flex: 1,
  },
  ctaTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700',
  },
  ctaSub: {
    color: colors.inkMuted,
    fontSize: 13,
    marginTop: 2,
  },
  ctaPlus: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.brand,
  },
  ctaPlusText: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: radius.md,
    backgroundColor: 'rgba(224,123,30,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(224,123,30,0.2)',
  },
  insightSparkle: {
    fontSize: 16,
  },
  insightText: {
    flex: 1,
    color: colors.inkLight,
    fontSize: 13,
    fontWeight: '500',
  },
  insightLink: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47.5%',
    flexGrow: 1,
  },
  promptCta: {
    marginHorizontal: 20,
    marginTop: 28,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...shadow.brand,
  },
  promptCtaText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
