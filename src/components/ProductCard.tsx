import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '@/types/product';
import { colors, radius, shadow } from '@/constants/colors';

interface Props {
  product: Product;
  showMetrics?: boolean;
  onPress?: () => void;
}

export default function ProductCard({ product, showMetrics = false, onPress }: Props) {
  const active = product.status === 'active';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.img }} style={styles.image} resizeMode="cover" />
        {product.published && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>🆕 नया</Text>
          </View>
        )}
        <View style={[styles.status, active ? styles.statusActive : styles.statusDraft]}>
          <Text style={[styles.statusText, active ? styles.statusTextActive : styles.statusTextDraft]}>
            {active ? '● Live' : '○ Draft'}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {product.hindi}
        </Text>
        <Text style={styles.price}>{product.price}</Text>
        {showMetrics && (
          <View style={styles.metrics}>
            {product.views > 0 && <Text style={styles.metric}>👁️ {product.views}</Text>}
            {product.orders > 0 && <Text style={styles.metric}>📦 {product.orders}</Text>}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.card,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  status: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.brand,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  statusActive: {
    backgroundColor: colors.ok,
  },
  statusDraft: {
    backgroundColor: colors.surface2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextActive: {
    color: colors.white,
  },
  statusTextDraft: {
    color: colors.inkMuted,
  },
  body: {
    padding: 12,
  },
  name: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  price: {
    color: colors.brand,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  metric: {
    color: colors.inkMuted,
    fontSize: 11,
  },
});
