import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { colors, radius, shadow } from '@/constants/colors';
import { useProductAnalysis } from '@/context/ProductAnalysisContext';
import { formatPrice } from '@/context/productFlow';

export default function ProductStudioScreen() {
  const insets = useSafeAreaInsets();
  const { currentProduct, sourceImageUri } = useProductAnalysis();
  const [enhanced, setEnhanced] = useState(false);

  console.log('[FLOW DEBUG] 4. Studio renders -> currentProduct:', currentProduct ? currentProduct.name : 'null', '| imageUri:', sourceImageUri ? sourceImageUri.slice(0, 60) : 'null');

  if (!currentProduct) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader
          title="AI Product Studio"
          subtitle="Step 2 of 3"
          stepIndex={2}
          totalSteps={3}
          backTo="/add-product"
        />
        <View style={[styles.empty, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={styles.emptyEmoji}>🤔</Text>
          <Text style={styles.emptyTitle}>कोई प्रोडक्ट नहीं मिला</Text>
          <Text style={styles.emptySub}>
            पहले नया प्रोडक्ट जोड़कर AI analysis करें, फिर यहाँ उसकी details देखें।
          </Text>
          <PrimaryButton
            icon="📸"
            label="नया प्रोडक्ट जोड़ें"
            large
            onPress={() => router.replace('/add-product')}
          />
        </View>
      </View>
    );
  }

  const imageUri = sourceImageUri ?? '';
  const productName = currentProduct.name;
  const category = currentProduct.category;
  const tags = currentProduct.tags?.length ? currentProduct.tags : [];
  const priceText = formatPrice(currentProduct.price);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="AI Product Studio"
        subtitle="Step 2 of 3"
        stepIndex={2}
        totalSteps={3}
        backTo="/add-product"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Before / After card */}
        <View style={styles.studioCard}>
          <View style={styles.toggle}>
            <Pressable
              onPress={() => setEnhanced(false)}
              style={[styles.toggleBtn, !enhanced && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, !enhanced && styles.toggleTextActive]}>
                📷 Original
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setEnhanced(true)}
              style={[styles.toggleBtn, enhanced && styles.toggleBtnBrand]}
            >
              <Text style={[styles.toggleText, enhanced && styles.toggleTextActive]}>
                ✨ AI Enhanced
              </Text>
            </Pressable>
          </View>

          <View style={styles.imageWrap}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={[styles.tint, enhanced ? styles.tintEnhanced : styles.tintOriginal]} />
            <View style={[styles.badge, enhanced ? styles.badgeBrand : styles.badgeDark]}>
              <Text style={styles.badgeText}>{enhanced ? '✨ AI Enhanced' : 'Original'}</Text>
            </View>
            {enhanced && (
              <View style={styles.cleanChip}>
                <Text style={styles.cleanChipText}>Clean Background ✓</Text>
              </View>
            )}
          </View>
        </View>

        {/* Product details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <View style={styles.detailsHeaderText}>
              <Text style={styles.sectionLabel}>Product Name</Text>
              <Text style={styles.productTitle}>{productName}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              hitSlop={8}
            >
              <Text style={styles.iconBtnText}>✏️</Text>
            </Pressable>
          </View>

          <View style={styles.chipRow}>
            <View style={[styles.chip, styles.chipBrand]}>
              <Text style={styles.chipBrandText}>🏷️ {category}</Text>
            </View>
            <View style={[styles.chip, styles.chipSurface]}>
              <Text style={styles.chipSurfaceText}>⚖️ {currentProduct.weight ?? '—'}</Text>
            </View>
            {currentProduct.price != null && (
              <View style={[styles.chip, styles.chipOk]}>
                <Text style={styles.chipOkText}>💰 {priceText}</Text>
              </View>
            )}
            <View style={[styles.chip, styles.chipOk]}>
              <Text style={styles.chipOkText}>✨ AI Generated</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>{currentProduct.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Materials</Text>
            <Text style={styles.description}>
              {currentProduct.materials?.length ? currentProduct.materials.join(', ') : '—'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tagsRow}>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.description}>इस प्रोडक्ट के लिए कोई tags नहीं मिले।</Text>
              )}
              <Pressable
                style={({ pressed }) => [styles.addTag, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Text style={styles.addTagText}>+ जोड़ें</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          icon="💰"
          label="Price & Selling देखें →"
          large
          onPress={() => router.push('/recommendation')}
        />
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
  studioCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  toggle: {
    flexDirection: 'row',
    gap: 4,
    padding: 6,
    margin: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  toggleBtn: {
    flex: 1,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.card,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  toggleBtnBrand: {
    backgroundColor: colors.brand,
    ...shadow.brand,
  },
  toggleText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.ink,
  },
  imageWrap: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 230,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
  },
  tintOriginal: {
    backgroundColor: 'rgba(28,18,8,0.08)',
  },
  tintEnhanced: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  badgeDark: {
    backgroundColor: colors.ink55,
  },
  badgeBrand: {
    backgroundColor: colors.brand,
    ...shadow.brand,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  cleanChip: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  cleanChipText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    ...shadow.card,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailsHeaderText: {
    flex: 1,
  },
  productTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
    marginTop: 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.sm,
  },
  chipBrand: {
    backgroundColor: 'rgba(224,123,30,0.1)',
  },
  chipBrandText: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '600',
  },
  chipSurface: {
    backgroundColor: colors.surface,
  },
  chipSurfaceText: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  chipOk: {
    backgroundColor: colors.okBg,
  },
  chipOkText: {
    color: colors.ok,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 18,
  },
  sectionLabel: {
    color: colors.inkMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  description: {
    color: colors.inkLight,
    fontSize: 14,
    lineHeight: 21,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.sm,
  },
  tagText: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  addTag: {
    backgroundColor: 'rgba(224,123,30,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.sm,
  },
  addTagText: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '600',
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
});