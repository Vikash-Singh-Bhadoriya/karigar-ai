import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '@/constants/colors';
import { useProductAnalysis } from '@/context/ProductAnalysisContext';
import { formatPrice } from '@/context/productFlow';

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  const { publishedProducts } = useProductAnalysis();
  const latest = publishedProducts.length
    ? publishedProducts[publishedProducts.length - 1]
    : null;
  const product = latest?.product ?? null;
  const name = product?.name ?? '';
  const imageUri = latest?.sourceImageUri ?? '';
  const priceText = formatPrice(product?.price ?? null);

  const scale = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 80,
    }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: -8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, float]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `KarigarAI पर ${name} — ${priceText} में बिक्री के लिए उपलब्ध है!`,
      });
    } catch {
      // sharing cancelled
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text style={[styles.emoji, { transform: [{ translateY: float }, { scale }] }]}>
          🎉
        </Animated.Text>
        <Text style={styles.title}>आपका प्रोडक्ट तैयार है!</Text>
        {name ? (
          <Text style={styles.subtitle}>{name} अब बेचने के लिए उपलब्ध है</Text>
        ) : (
          <Text style={styles.subtitle}>आपका प्रोडक्ट अब बेचने के लिए उपलब्ध है</Text>
        )}

        {/* Published product preview */}
        <View style={styles.previewCard}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <View style={styles.previewBody}>
            <View style={styles.previewTexts}>
              <Text style={styles.previewName}>{name}</Text>
              <Text style={styles.previewPrice}>{priceText}</Text>
            </View>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>🟢 Live</Text>
              <Text style={styles.liveSub}>Active</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={() => router.replace('/(tabs)/products')}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>प्रोडक्ट देखें</Text>
          </Pressable>
          <Pressable
            onPress={onShare}
            style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryText}>Catalog Share</Text>
          </Pressable>
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
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 18,
  },
  title: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'center',
  },
  previewCard: {
    width: '100%',
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: 28,
    ...shadow.card,
  },
  previewImage: {
    width: '100%',
    height: 180,
  },
  previewBody: {
    backgroundColor: colors.card,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewTexts: {
    flex: 1,
  },
  previewName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  previewPrice: {
    color: colors.brand,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  liveBadge: {
    backgroundColor: colors.okBg,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  liveText: {
    color: colors.ok,
    fontSize: 14,
    fontWeight: '700',
  },
  liveSub: {
    color: colors.ok,
    fontSize: 10,
    marginTop: 2,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  primary: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.brand,
  },
  primaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondary: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});