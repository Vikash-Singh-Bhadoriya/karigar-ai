import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import ProcessingStep from '@/components/ProcessingStep';
import { colors, radius, shadow } from '@/constants/colors';
import { PROCESSING_STEPS } from '@/constants/mockData';
import { analyzeProduct } from '@/services/api';
import { useProductAnalysis } from '@/context/ProductAnalysisContext';

type ApiState = 'loading' | 'done' | 'error';

export default function ProcessingScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    imageUri?: string;
    imageName?: string;
    imageType?: string;
    transcript?: string;
    language?: string;
  }>();
  const { setProduct } = useProductAnalysis();

  const imageUri = params.imageUri != null ? String(params.imageUri) : '';
  const imageName = params.imageName != null ? String(params.imageName) : undefined;
  const imageType = params.imageType != null ? String(params.imageType) : undefined;
  const transcript = String(params.transcript ?? '');
  const language = String(params.language ?? 'हिंदी');

  const [done, setDone] = useState(0);
  const [apiState, setApiState] = useState<ApiState>('loading');
  const [apiError, setApiError] = useState('');
  const progress = useRef(new Animated.Value(0)).current;

  const total = PROCESSING_STEPS.length;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    PROCESSING_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setDone(i + 1), (i + 1) * 950));
    });
    Animated.timing(progress, {
      toValue: 1,
      duration: total * 950,
      useNativeDriver: false,
    }).start();
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [progress, total]);

  const runAnalysis = useCallback(async () => {
    setApiState('loading');
    setApiError('');
    if (!imageUri || !transcript.trim()) {
      setApiError('प्रोडक्ट का विवरण गायब है। वापस जाकर फोटो और विवरण दोबारा भेजें।');
      setApiState('error');
      return;
    }
    try {
      const result = await analyzeProduct({
        image: { uri: imageUri, fileName: imageName, mimeType: imageType },
        transcript: transcript.trim(),
        language,
      });
      console.log('[FLOW DEBUG] 1. API response received -> product:', result.product?.name ?? 'undefined', '| price:', result.product?.price ?? null, '| ready:', result.ready);
      const product = result.product;
      console.log('[FLOW DEBUG] 2. product passed into setProduct ->', product?.name ?? 'undefined');
      setProduct(product, imageUri);
      setApiState('done');
    } catch (err) {
      console.log('[FLOW DEBUG] 1b. API FAILED ->', err instanceof Error ? err.message : err);
      setApiError(err instanceof Error ? err.message : 'कुछ गलत हो गया। कृपया फिर कोशिश करें।');
      setApiState('error');
    }
  }, [imageUri, imageName, imageType, transcript, language, setProduct]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const complete = done >= total;

  useEffect(() => {
    if (complete && apiState === 'done') {
      const t = setTimeout(() => router.replace('/product-studio'), 600);
      return () => clearTimeout(t);
    }
  }, [complete, apiState]);

  const pct = Math.round((done / total) * 100);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header} />

      <View style={styles.content}>
        {/* Product image with overlay */}
        <View style={styles.imageCard}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}
          <View style={styles.imageOverlay} />

          <View style={styles.aiBadge}>
            <Text style={styles.aiSparkle}>✨</Text>
            <Text style={styles.aiBadgeText}>AI Processing</Text>
          </View>

          <View style={styles.imageBottom}>
            <Text style={styles.imageBottomTitle}>आपका प्रोडक्ट तैयार हो रहा है...</Text>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressPct}>{pct}% complete</Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {PROCESSING_STEPS.map((step, i) => {
            const state =
              i < done ? 'done' : i === done ? 'active' : ('pending' as const);
            return <ProcessingStep key={i} step={step} state={state} />;
          })}
        </View>

        {/* Footer sparkle */}
        <View style={styles.footerSparkle}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.footerText}>KarigarAI आपकी मदद कर रहा है</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>
      </View>

      {apiState === 'error' ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.errorCard}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorTitle}>प्रोडक्ट तैयार नहीं हो सका</Text>
            <Text style={styles.errorText}>{apiError}</Text>
            <PrimaryButton icon="🔁" label="फिर कोशिश करें" large onPress={runAnalysis} />
            <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>← वापस जाएं</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        complete && apiState === 'done' && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <PrimaryButton
              icon="👁️"
              label="प्रोडक्ट देखें"
              large
              onPress={() => router.replace('/product-studio')}
            />
          </View>
        )
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
    height: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 18,
  },
  imageCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  image: {
    width: '100%',
    height: 220,
  },
  imagePlaceholder: {
    backgroundColor: colors.surface,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28,18,8,0.45)',
  },
  aiBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.md,
  },
  aiSparkle: {
    fontSize: 16,
  },
  aiBadgeText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  imageBottom: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  imageBottomTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brand,
  },
  progressPct: {
    color: colors.white55,
    fontSize: 12,
    marginTop: 6,
  },
  steps: {
    gap: 10,
  },
  footerSparkle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sparkle: {
    fontSize: 20,
  },
  footerText: {
    color: colors.inkMuted,
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
  errorCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    gap: 12,
    alignItems: 'center',
    ...shadow.card,
  },
  errorEmoji: {
    fontSize: 28,
  },
  errorTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: colors.inkMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backBtnPressed: {
    opacity: 0.6,
  },
  backBtnText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
});