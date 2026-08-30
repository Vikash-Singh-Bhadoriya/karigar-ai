import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '@/constants/colors';
import { ORDERS } from '@/constants/mockData';

const statusColor = (s: string): string => {
  switch (s) {
    case 'Delivered':
      return colors.ok;
    case 'Shipped':
      return colors.brand;
    default:
      return colors.warn;
  }
};

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>ऑर्डर</Text>
        <Text style={styles.subtitle}>हाल के ऑर्डर</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.list}>
          {ORDERS.map((o) => (
            <View key={o.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.productWrap}>
                  <View style={styles.iconBox}>
                    <Text style={styles.icon}>🧺</Text>
                  </View>
                  <View style={styles.productText}>
                    <Text style={styles.product}>{o.product}</Text>
                    <Text style={styles.meta}>
                      {o.id} · {o.qty} pcs
                    </Text>
                  </View>
                </View>
                <Text style={[styles.status, { color: statusColor(o.status) }]}>
                  {o.status}
                </Text>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.meta}>
                  🛍️ {o.buyer} · 📍 {o.city}
                </Text>
                <Text style={styles.amount}>{o.amount}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.emptyNote}>
          <Text style={styles.emptyText}>
            नए ऑर्डर आने पर यहां दिखाई देंगे। अभी ये सैंपल ऑर्डर हैं।
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: 14,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    ...shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  productText: {
    flex: 1,
  },
  product: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 2,
  },
  status: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  amount: {
    color: colors.brand,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyNote: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: radius.md,
    backgroundColor: 'rgba(224,123,30,0.08)',
  },
  emptyText: {
    color: colors.inkMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
