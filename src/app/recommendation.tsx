import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { colors, radius, shadow } from '@/constants/colors';
import { DELIVERY_LOCATIONS, PRICE_BREAKDOWN, SELLING_SCOPES } from '@/constants/mockData';
import type { DeliveryLocation, SellingScope } from '@/types/product';

const statusColor = (s: DeliveryLocation['status']): string =>
  s === 'good' ? colors.ok : s === 'mod' ? colors.warn : colors.risk;

export default function RecommendationScreen() {
  const insets = useSafeAreaInsets();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [scope, setScope] = useState<SellingScope>('states');
  const [price, setPrice] = useState('649');

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
            <Text style={styles.heroLabel}>Suggested Price</Text>
            <Text style={styles.heroPrice}>₹{price}</Text>
            <Text style={styles.heroRange}>Market range: ₹550 – ₹750</Text>
          </View>

          <View style={styles.priceInputRow}>
            <Text style={styles.priceInputLabel}>अपनी price:</Text>
            <View style={styles.priceInputWrap}>
              <Text style={styles.priceInputCurrency}>₹</Text>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
                placeholderTextColor={colors.inkMuted}
              />
            </View>
            <Text style={styles.priceInputPencil}>✏️</Text>
          </View>

          <Pressable
            onPress={() => setShowBreakdown((v) => !v)}
            style={styles.breakdownToggle}
          >
            <Text style={styles.breakdownToggleText}>AI ने यह price क्यों सुझाया?</Text>
            <Text style={[styles.chevron, showBreakdown && styles.chevronOpen]}>▾</Text>
          </Pressable>

          {showBreakdown && (
            <View style={styles.breakdown}>
              {PRICE_BREAKDOWN.map((item, i) => (
                <View key={i} style={styles.breakdownRow}>
                  <View>
                    <Text style={styles.breakdownHindi}>{item.hindi}</Text>
                    <Text style={styles.breakdownEn}>{item.en}</Text>
                  </View>
                  <Text
                    style={[
                      styles.breakdownAmount,
                      i === PRICE_BREAKDOWN.length - 1 && styles.breakdownAmountFinal,
                    ]}
                  >
                    {item.amount}
                  </Text>
                </View>
              ))}
              <View style={styles.breakdownTotalRow}>
                <Text style={styles.breakdownTotalLabel}>कुल price</Text>
                <Text style={styles.breakdownTotalAmount}>₹{price}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Selling scope */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>📍</Text>
            <Text style={styles.cardHeaderText}>कहाँ बेचना चाहते हैं?</Text>
          </View>

          <View style={styles.scopeRow}>
            {SELLING_SCOPES.map((s) => {
              const active = scope === s.id;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setScope(s.id)}
                  style={[styles.scopeChip, active && styles.scopeChipActive]}
                >
                  <Text style={styles.scopeEmoji}>{s.emoji}</Text>
                  <Text style={[styles.scopeText, active && styles.scopeTextActive]}>
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.insight}>
            <Text style={styles.insightSparkle}>✨</Text>
            <View style={styles.insightTexts}>
              <Text style={styles.insightTitle}>मुंबई में इस प्रोडक्ट की अच्छी demand है</Text>
              <Text style={styles.insightSub}>दिल्ली तक delivery cost अधिक हो सकती है</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Delivery Feasibility</Text>
          <View style={styles.deliveryList}>
            {DELIVERY_LOCATIONS.map((loc, i) => (
              <View key={i} style={styles.deliveryRow}>
                <View style={styles.deliveryLeft}>
                  <Text style={styles.deliveryEmoji}>{loc.emoji}</Text>
                  <View>
                    <Text style={styles.deliveryCity}>{loc.city}</Text>
                    <Text style={styles.deliveryHindi}>{loc.hindi}</Text>
                  </View>
                </View>
                <Text style={[styles.deliveryCost, { color: statusColor(loc.status) }]}>
                  {loc.cost}
                </Text>
              </View>
            ))}
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
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownHindi: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '500',
  },
  breakdownEn: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 1,
  },
  breakdownAmount: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownAmountFinal: {
    color: colors.brand,
  },
  breakdownTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  breakdownTotalLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownTotalAmount: {
    color: colors.brand,
    fontSize: 18,
    fontWeight: '700',
  },
  scopeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  scopeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 13,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  scopeChipActive: {
    backgroundColor: colors.brand,
    ...shadow.brand,
  },
  scopeEmoji: {
    fontSize: 14,
  },
  scopeText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  scopeTextActive: {
    color: colors.white,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(224,123,30,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(224,123,30,0.2)',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 20,
  },
  insightSparkle: {
    fontSize: 17,
    marginTop: 1,
  },
  insightTexts: {
    flex: 1,
  },
  insightTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  insightSub: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 4,
  },
  sectionLabel: {
    color: colors.inkMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  deliveryList: {
    gap: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deliveryEmoji: {
    fontSize: 16,
  },
  deliveryCity: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryHindi: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 1,
  },
  deliveryCost: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
});