import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { colors, radius, shadow } from '@/constants/colors';
import { useProductAnalysis } from '@/context/ProductAnalysisContext';
import { formatPrice } from '@/context/productFlow';
import { useMarketPricing } from '@/hooks/useMarketPricing';
import AudioHelpButton from '@/components/AudioHelpButton';

export default function RecommendationScreen() {
  const insets = useSafeAreaInsets();
  const { currentProduct, updateProduct } = useProductAnalysis();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [priceText, setPriceText] = useState<string>(() =>
    currentProduct?.price != null ? String(currentProduct.price) : ''
  );
  const { pricing, state: pricingState } = useMarketPricing(
    currentProduct != null ? currentProduct : null
  );

  useEffect(() => {
    const next = currentProduct?.price != null ? String(currentProduct.price) : '';
    setPriceText((prev) => (prev === next ? prev : next));
  }, [currentProduct?.price]);

  if (!currentProduct) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader
          title="Price & Selling"
          subtitle="Step 3 of 3"
          stepIndex={3}
          totalSteps={3}
          backTo="/product-studio"
        />
        <View style={[styles.empty, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={styles.emptyEmoji}>🤔</Text>
          <Text style={styles.emptyTitle}>कोई प्रोडक्ट नहीं मिला</Text>
          <Text style={styles.emptySub}>पहले AI analysis करके कोई प्रोडक्ट तैयार करें।</Text>
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

  const priceDisplay = formatPrice(currentProduct.price);

  const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const rangeLine =
    pricingState === 'ready' && pricing
      ? !pricing.available
        ? 'बाज़ार मूल्य उपलब्ध नहीं है — आप अपना मूल्य दर्ज कर सकते हैं।'
        : pricing.marketAvailable
        ? `Market Reference: ${inr(pricing.observedMin ?? pricing.recommendedMin)} – ${inr(pricing.observedMax ?? pricing.recommendedMax)}`
        : `Estimated Market Range: ${inr(pricing.recommendedMin)} – ${inr(pricing.recommendedMax)} (अनुमानित)`
      : pricingState === 'unavailable'
      ? 'बाज़ार मूल्य उपलब्ध नहीं है — आप अपना मूल्य दर्ज कर सकते हैं।'
      : 'मूल्य सुझाव तैयार हो रहा है…';

  const rangeColor =
    pricingState === 'unavailable' ? styles.heroRangeWarn : styles.heroRange;

  const onPriceChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    setPriceText(clean);
    updateProduct({ price: clean ? Number(clean) : null });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Price & Selling"
        subtitle="Step 3 of 3"
        stepIndex={3}
        totalSteps={3}
        backTo="/product-studio"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Price card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>💰</Text>
            <Text style={styles.cardHeaderText}>AI Recommended Price</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>✨ AI</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Your Selling Price</Text>
            <Text style={styles.heroPrice}>{priceDisplay}</Text>
            <Text style={rangeColor}>{rangeLine}</Text>
          </View>

          <View style={styles.priceInputRow}>
            <Text style={styles.priceInputLabel}>Your Selling Price:</Text>
            <View style={styles.priceInputWrap}>
              <Text style={styles.priceInputCurrency}>₹</Text>
              <TextInput
                style={styles.priceInput}
                value={priceText}
                onChangeText={onPriceChange}
                keyboardType="number-pad"
                placeholderTextColor={colors.inkMuted}
              />
            </View>
            <Text style={styles.priceInputPencil}>✏️</Text>
          </View>

          {/* Engine #1: Fair-Trade Economic Living Wage Card */}
          {pricing?.fairTrade && (
            <View style={styles.fairTradeBox}>
              <View style={styles.fairTradeHeader}>
                <View style={styles.fairTradeBadge}>
                  <Text style={styles.fairTradeBadgeText}>🛡️ फेयर ट्रेड गारंटी (Living Wage)</Text>
                </View>
                <AudioHelpButton
                  helpTextKeyOrRaw={`यह मूल्य आपके ${pricing.fairTrade.laborHoursEstimated} घंटे के श्रम और सामग्री की लागत को ध्यान में रखकर तय किया गया है। इसमें से सीधे आपको ${inr(pricing.fairTrade.artisanDirectEarning)} मिलेंगे, जो आपके काम का उचित पारिश्रमिक है।`}
                  size="sm"
                />
              </View>

              <View style={styles.ftRow}>
                <Text style={styles.ftLabel}>कारीगर की सीधी कमाई (74%):</Text>
                <Text style={styles.ftValArtisan}>{inr(pricing.fairTrade.artisanDirectEarning)}</Text>
              </View>

              <View style={styles.ftRow}>
                <Text style={styles.ftLabel}>कच्ची सामग्री लागत (16%):</Text>
                <Text style={styles.ftVal}>{inr(pricing.fairTrade.materialCostEstimate)}</Text>
              </View>

              <View style={styles.ftRow}>
                <Text style={styles.ftLabel}>पैकेजिंग व सुरक्षा (10%):</Text>
                <Text style={styles.ftVal}>{inr(pricing.fairTrade.packagingLogisticsEstimate)}</Text>
              </View>

              <View style={styles.ftFooter}>
                <Text style={styles.ftFooterText}>
                  ⏱️ श्रम: {pricing.fairTrade.laborHoursEstimated} घंटे | 🌍 वैश्विक निर्यात: ${pricing.fairTrade.exportBenchmarkUSD.min}–${pricing.fairTrade.exportBenchmarkUSD.max}
                </Text>
              </View>

              {pricing.fairTrade.exploitationWarning && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>⚠️ {pricing.fairTrade.exploitationWarning}</Text>
                </View>
              )}
            </View>
          )}

          {/* "Why this price" — evidence-based explanation from the backend */}
          <Pressable
            onPress={() => setShowBreakdown((v) => !v)}
            style={styles.breakdownToggle}
          >
            <Text style={styles.breakdownToggleText}>यह price कैसे तय हुआ?</Text>
            <Text style={[styles.chevron, showBreakdown && styles.chevronOpen]}>▾</Text>
          </Pressable>

          {showBreakdown && (
            <View style={styles.breakdown}>
              {pricingState === 'ready' && pricing && pricing.available ? (
                <>
                  <Text style={styles.breakdownText}>{pricing.explanation}</Text>
                  {pricing.marketAvailable && pricing.comparableProducts.length > 0 ? (
                    <View style={styles.comparables}>
                      <Text style={styles.comparablesLabel}>Market Reference — कुछ मिलते-जुलते बाज़ार मूल्य:</Text>
                      {pricing.comparableProducts.slice(0, 5).map((c, i) => (
                        <View key={i} style={styles.comparableRow}>
                          <Text style={styles.comparableTitle} numberOfLines={1}>
                            {c.title}
                          </Text>
                          <Text style={styles.comparablePrice}>{inr(c.price)}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.breakdownNote}>
                      यह लाइव बाज़ार का आँकड़ा नहीं है, बल्कि आपके प्रोडक्ट की जानकारी के आधार पर
                      अनुमानित मूल्य है।
                    </Text>
                  )}
                </>
              ) : (
                <Text style={styles.breakdownNote}>
                  बाज़ार मूल्य उपलब्ध नहीं है — आप अपना मूल्य दर्ज कर सकते हैं।
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Selling location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>📍</Text>
            <Text style={styles.cardHeaderText}>Selling Location</Text>
          </View>

          <View style={styles.sellField}>
            <Text style={styles.sellLabel}>Seller Location</Text>
            <TextInput
              style={styles.sellInput}
              value={currentProduct.sellerLocation ?? ''}
              onChangeText={(text) => updateProduct({ sellerLocation: text })}
              placeholder="Gwalior, Madhya Pradesh"
              placeholderTextColor={colors.inkMuted}
              maxLength={80}
            />
          </View>

          <View style={styles.sellField}>
            <Text style={styles.sellLabel}>Selling Area</Text>
            <TextInput
              style={styles.sellInput}
              value={currentProduct.sellingArea ?? ''}
              onChangeText={(text) => updateProduct({ sellingArea: text })}
              placeholder="All India"
              placeholderTextColor={colors.inkMuted}
              maxLength={60}
            />
          </View>

          <View style={styles.deliveryNote}>
            <Text style={styles.deliveryEstimateLabel}>Delivery estimate</Text>
            <Text style={styles.deliveryNoteText}>
              Based on seller location and selected market. Actual courier
              serviceability would be verified through a logistics API in a later
              phase.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          icon="📋"
          label="Review & Publish करें →"
          large
          onPress={() => router.push('/review')}
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
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardHeaderIcon: {
    fontSize: 20,
  },
  cardHeaderText: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  aiBadge: {
    backgroundColor: 'rgba(224,123,30,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  aiBadgeText: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '700',
  },
  hero: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
    ...shadow.brand,
  },
  heroLabel: {
    color: colors.white70,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  heroPrice: {
    color: colors.white,
    fontSize: 52,
    lineHeight: 56,
    fontWeight: '700',
  },
  heroRange: {
    color: colors.white55,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  heroRangeWarn: {
    color: '#ffd9b3',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  priceInputLabel: {
    color: colors.inkMuted,
    fontSize: 14,
  },
  priceInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  priceInputCurrency: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  priceInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
    padding: 0,
    minWidth: 0,
  },
  priceInputPencil: {
    color: colors.inkMuted,
    fontSize: 15,
  },
  breakdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 2,
  },
  breakdownToggleText: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '600',
  },
  chevron: {
    color: colors.brand,
    fontSize: 16,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  breakdown: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
  },
  breakdownText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  breakdownNote: {
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  comparables: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  comparablesLabel: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  comparableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  comparableTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 13,
  },
  comparablePrice: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '700',
  },
  sellField: {
    gap: 6,
    marginBottom: 12,
  },
  sellLabel: {
    color: colors.inkMuted,
    fontSize: 14,
  },
  sellInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: colors.ink,
    fontSize: 15,
  },
  deliveryNote: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    gap: 4,
    marginTop: 12,
  },
  deliveryNoteTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  deliveryEstimateLabel: {
    color: colors.inkMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 10,
  },
  deliveryNoteText: {
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 20,
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
  fairTradeBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: radius.xl,
    padding: 14,
    marginTop: 14,
    gap: 8,
  },
  fairTradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fairTradeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  fairTradeBadgeText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  ftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ftLabel: {
    color: '#374151',
    fontSize: 13,
  },
  ftValArtisan: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '800',
  },
  ftVal: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },
  ftFooter: {
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    paddingTop: 8,
    marginTop: 4,
  },
  ftFooterText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '600',
  },
  warningBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: radius.md,
    padding: 8,
    marginTop: 4,
  },
  warningText: {
    color: '#991B1B',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});