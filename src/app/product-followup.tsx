import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, radius, shadow } from '@/constants/colors';
import { useProductAnalysis } from '@/context/ProductAnalysisContext';
import { submitProductFollowUp, ApiError } from '@/services/api';
import type { Language } from '@/types/product';
import {
  requestRecordingPermissions,
  enableRecordingMode,
  startRecording,
  stopRecording,
  transcribeAudio,
  useRecorder,
} from '@/services/speech';

const MAX_QUESTIONS = 2;

type Role = 'ai' | 'user';

interface Message {
  id: number;
  role: Role;
  text: string;
}

let msgId = 0;

export default function ProductFollowUpScreen() {
  const insets = useSafeAreaInsets();
  const {
    currentProduct,
    missingFields,
    followUpQuestion,
    updateProduct,
    setMissingFieldState,
    clearProduct,
  } = useProductAnalysis();
  const { recorder, state } = useRecorder();

  const [messages, setMessages] = useState<Message[]>([]);
  const [answerText, setAnswerText] = useState('');
  const [askedCount, setAskedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const busyPulse = useRef(new Animated.Value(1)).current;
  const busyLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!currentProduct) {
      router.replace('/add-product');
      return;
    }
    if (followUpQuestion) {
      setMessages([{ id: ++msgId, role: 'ai', text: followUpQuestion }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopBusy = useCallback(() => {
    if (busyLoop.current) {
      try {
        busyLoop.current.stop();
      } catch {
        /* already stopped */
      }
      busyLoop.current = null;
    }
    busyPulse.stopAnimation();
    busyPulse.setValue(1);
  }, [busyPulse]);

  useEffect(() => stopBusy, [stopBusy]);

  useEffect(() => {
    if (isSubmitting) {
      busyPulse.setValue(0.92);
      busyLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(busyPulse, {
            toValue: 1.1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(busyPulse, {
            toValue: 0.92,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      busyLoop.current.start();
    } else {
      stopBusy();
    }
  }, [isSubmitting, stopBusy, busyPulse]);

  const friendlyError = (err: unknown): string => {
    if (err instanceof ApiError) {
      if (err.status === 429 || err.status === 503) {
        return 'सर्वर थोड़ा व्यस्त है। कुछ सेकंड बाद फिर से कोशिश करें।';
      }
      return err.message || 'कुछ गलत हो गया। कृपया फिर कोशिश करें।';
    }
    return 'कुछ गलत हो गया। कृपया फिर कोशिश करें।';
  };

  const handleVoice = async () => {
    if (state.isRecording) {
      setError('');
      setIsTranscribing(true);
      try {
        const uri = await stopRecording(recorder);
        if (!uri) throw new Error('रिकॉर्डिंग खत्म नहीं हो सकी।');
        const text = await transcribeAudio(
          uri,
          (currentProduct?.language as Language | undefined) ?? 'हिंदी'
        );
        setAnswerText((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
      } catch (e) {
        setError(friendlyError(e));
      } finally {
        setIsTranscribing(false);
      }
      return;
    }
    setError('');
    try {
      const perm = await requestRecordingPermissions();
      if (!perm.granted) {
        Alert.alert('अनुमति आवश्यक', 'स्पीच के लिए माइक्रोफ़ोन की अनुमति चाहिए।');
        return;
      }
      await enableRecordingMode();
      await startRecording(recorder);
    } catch {
      setError('रिकॉर्डिंग शुरू नहीं हो सकी। कृपया फिर से कोशिश करें।');
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // prevent duplicate requests
    const answer = answerText.trim();
    if (!answer) {
      setError('कृपया पहले जवाब लिखें या बोलें।');
      return;
    }
    if (!currentProduct) return;

    setIsSubmitting(true);
    setError('');
    setMessages((prev) => [...prev, { id: ++msgId, role: 'user', text: answer }]);
    setAnswerText('');
    try {
      const result = await submitProductFollowUp({
        product: currentProduct,
        missingFields,
        answer,
        language: currentProduct.language ?? 'हिंदी',
        questionCount: askedCount,
      });

      updateProduct(result.product);
      setMissingFieldState(result.missingFields, result.followUpQuestion ?? null);

      if (result.ready || askedCount + 1 >= MAX_QUESTIONS) {
        router.replace('/product-studio');
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: ++msgId, role: 'ai', text: result.followUpQuestion ?? 'और बताइए? 😊' },
      ]);
      setAskedCount((c) => c + 1);
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1)); // remove the optimistic user bubble on failure
      setAnswerText(answer);
      setError(friendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBack = () => {
    clearProduct();
    router.replace('/add-product');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]} hitSlop={8}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <View style={styles.titles}>
          <Text style={styles.title}>KarigarAI</Text>
          <Text style={styles.subtitle}>बस थोड़ी सी जानकारी और ✨</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Conversation */}
        <View style={styles.chat}>
          {messages.map((m) =>
            m.role === 'ai' ? (
              <View key={m.id} style={styles.aiRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>🤖</Text>
                </View>
                <View style={[styles.bubble, styles.aiBubble]}>
                  <Text style={styles.bubbleName}>KarigarAI</Text>
                  <Text style={styles.aiBubbleText}>{m.text}</Text>
                </View>
              </View>
            ) : (
              <View key={m.id} style={styles.userRow}>
                <View style={[styles.bubble, styles.userBubble]}>
                  <Text style={styles.userBubbleText}>{m.text}</Text>
                </View>
              </View>
            )
          )}

          {isSubmitting ? (
            <View style={styles.aiRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>🤖</Text>
              </View>
              <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
                <Animated.Text
                  style={[styles.typingText, { transform: [{ scale: busyPulse }] }]}
                >
                  समझ रहा हूँ…
                </Animated.Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Voice */}
        <View style={styles.voiceCard}>
          <Pressable
            onPress={handleVoice}
            disabled={isSubmitting || isTranscribing}
            style={({ pressed }) => [
              styles.micButton,
              state.isRecording && styles.micButtonActive,
              isTranscribing && styles.micButtonBusy,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.micIcon}>
              {isTranscribing ? '…' : state.isRecording ? '■' : '🎤'}
            </Text>
          </Pressable>
          <Text style={[styles.micHint, state.isRecording && styles.micHintActive]}>
            {isTranscribing
              ? '✍️ समझ रहा है...'
              : state.isRecording
                ? '🔴 सुन रहा हूँ... फिर दबाकर रोकें'
                : 'जवाब बोलकर भी दे सकते हैं'}
          </Text>
        </View>

        {/* Answer input */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>आपका जवाब</Text>
          <TextInput
            style={styles.input}
            value={answerText}
            onChangeText={setAnswerText}
            editable={!isSubmitting}
            placeholder="यहाँ जवाब लिखें..."
            placeholderTextColor={colors.inkMuted}
            multiline
            numberOfLines={3}
            maxLength={300}
          />
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          icon={isSubmitting ? '⏳' : '→'}
          label={isSubmitting ? 'समझ रहा हूँ...' : 'आगे बढ़ें'}
          large
          onPress={handleSubmit}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: colors.inkMuted,
    fontSize: 30,
    lineHeight: 32,
    marginTop: -2,
  },
  titles: {
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 1,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  chat: {
    gap: 12,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  aiBubble: {
    backgroundColor: colors.card,
    ...shadow.card,
  },
  aiBubbleText: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleName: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: colors.brand,
  },
  userBubbleText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  typingBubble: {
    minWidth: 120,
  },
  typingText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  voiceCard: {
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingVertical: 18,
    gap: 10,
    ...shadow.card,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.brand,
  },
  micButtonActive: {
    backgroundColor: colors.earth,
  },
  micButtonBusy: {
    backgroundColor: colors.inkMuted,
  },
  micIcon: {
    fontSize: 26,
  },
  micHint: {
    color: colors.inkMuted,
    fontSize: 13,
  },
  micHintActive: {
    color: colors.earth,
    fontWeight: '600',
  },
  inputCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    marginTop: 16,
    ...shadow.card,
  },
  inputLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    minHeight: 88,
    textAlignVertical: 'top',
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  errorCard: {
    backgroundColor: colors.riskBg,
    borderRadius: radius.md,
    padding: 14,
    marginTop: 14,
  },
  errorText: {
    color: colors.risk,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
});
