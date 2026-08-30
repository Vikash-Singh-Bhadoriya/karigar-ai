import { StyleSheet, Text, View } from 'react-native';
import type { StatItem } from '@/types/product';
import { colors, radius, shadow } from '@/constants/colors';

export default function StatCard({ item, centered = false }: { item: StatItem; centered?: boolean }) {
  const accent =
    item.accent === 'brand' ? colors.brand : item.accent === 'ok' ? colors.ok : colors.ink;
  return (
    <View style={[styles.card, centered && styles.centered]}>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: accent }]}>{item.value}</Text>
        {item.dot && <View style={styles.dot} />}
      </View>
      <Text style={styles.label}>{item.hindi}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    ...shadow.card,
  },
  centered: {
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ok,
    marginBottom: 2,
  },
  label: {
    color: colors.inkMuted,
    fontSize: 11,
    marginTop: 6,
  },
});
