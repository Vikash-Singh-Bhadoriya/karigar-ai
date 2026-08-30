import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { colors, radius, shadow } from '@/constants/colors';
import { LANGUAGES } from '@/constants/mockData';
import type { Language } from '@/types/product';
import {
  requestRecordingPermissions,
  enableRecordingMode,
  startRecording,
  stopRecording,
  transcribeAudio,
  useRecorder,
  toSpeechLocale,
} from '@/services/speech';

interface PickedPhoto {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
}

export default function AddProductScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLang, setSelectedLang] = useState<Language>('हिंदी');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [transcript, setTranscript] = useState('');
  const { recorder, state } = useRecorder();
  const photoTaken = photo !== null;

  const showRipple = state.isRecording && !isTranscribing;

  const rippleScale = useRef([
    new Animated.Value(0.4),
    new Animated.Value(0.4),
    new Animated.Value(0.4),
  ]).current;
  const rippleOpacity = useRef([
    new Animated.Value(0.6),
    new Animated.Value(0.6),
    new Animated.Value(0.6),
  ]).current;
  const rippleLoops = useRef<Animated.CompositeAnimation[]>([]);
  const micPulse = useRef(new Animated.Value(1)).current;
  const micPulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const busyPulse = useRef(new Animated.Value(1)).current;
  const busyPulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const stopAllAnimations = useCallback(() => {
    rippleLoops.current.forEach((loop) => {
      try {
        loop.stop();
      } catch {
        /* already stopped */
      }
    });
    rippleLoops.current = [];
    rippleScale.forEach((v) => v.stopAnimation());
    rippleOpacity.forEach((v) => v.stopAnimation());
    if (micPulseLoop.current) {
      try {
        micPulseLoop.current.stop();
      } catch {
        /* already stopped */
      }
      micPulseLoop.current = null;
    }
    micPulse.stopAnimation();
    if (busyPulseLoop.current) {
      try {
        busyPulseLoop.current.stop();
      } catch {
        /* already stopped */
      }
      busyPulseLoop.current = null;
    }
    busyPulse.stopAnimation();
  }, [rippleScale, rippleOpacity, micPulse, busyPulse]);

  useEffect(() => {
    if (showRipple) {
      rippleScale.forEach((scale, i) => {
        scale.setValue(0.4);
        rippleOpacity[i].setValue(0.6);
        const loop = Animated.loop(
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1,
              duration: 2200,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity[i], {
              toValue: 0,
              duration: 2200,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1, resetBeforeIteration: true }
        );
        loop.start();
        rippleLoops.current[i] = loop;
      });

      micPulse.setValue(0.96);
      micPulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, {
            toValue: 1.08,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(micPulse, {
            toValue: 0.96,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      micPulseLoop.current.start();
    } else if (isTranscribing) {
      busyPulse.setValue(0.95);
      busyPulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(busyPulse, {
            toValue: 1.12,
            duration: 650,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(busyPulse, {
            toValue: 0.95,
            duration: 650,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      busyPulseLoop.current.start();
    } else {
      stopAllAnimations();
    }

    return stopAllAnimations;
  }, [
    showRipple,
    isTranscribing,
    stopAllAnimations,
    rippleScale,
    rippleOpacity,
    micPulse,
    busyPulse,
  ]);

  useEffect(() => stopAllAnimations, [stopAllAnimations]);

  const handleMicPress = async () => {
    if (state.isRecording) {
      setVoiceError('');
      setIsTranscribing(true);
      try {
        const uri = await stopRecording(recorder);
        if (!uri) {
          throw new Error('Recording खत्म नहीं हो सका। फिर से कोशिश करें।');
        }
        const text = await transcribeAudio(uri, selectedLang);
        setTranscript((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
      } catch (err) {
        setVoiceError(
          err instanceof Error ? err.message : 'आवाज समझ नहीं आई। कृपया फिर से बोलें।'
        );
      } finally {
        setIsTranscribing(false);
      }
      return;
    }

    setVoiceError('');
    try {
      const perm = await requestRecordingPermissions();
      if (!perm.granted) {
        Alert.alert('अनुमति आवश्यक', 'स्पीच के लिए माइक्रोफ़ोन की अनुमति चाहिए।');
        return;
      }
      await enableRecordingMode();
      await startRecording(recorder);
    } catch {
      setVoiceError('रिकॉर्डिंग शुरू नहीं हो सकी। कृपया फिर से कोशिश करें।');
    }
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('अनुमति आवश्यक', 'फोटो चुनने के लिए गैलरी की अनुमति चाहिए।');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (result.canceled || !result.assets.length) return;
    const asset = result.assets[0];
    setPhoto({ uri: asset.uri, fileName: asset.fileName, mimeType: asset.mimeType });
  };

  const handleSubmit = () => {
    if (!photo) {
      Alert.alert('फोटो चुनें', 'पहले प्रोडक्ट की फोटो चुनें।');
      return;
    }
    if (!transcript.trim()) {
      Alert.alert('विवरण लिखें', 'प्रोडक्ट का विवरण लिखें, जैसे: "यह कॉटन बैग है, कीमत ₹600 रखना है"।');
      return;
    }
    router.push({
      pathname: '/processing',
      params: {
        imageUri: photo.uri,
        imageName: photo.fileName ?? '',
        imageType: photo.mimeType ?? '',
        transcript: transcript.trim(),
        language: selectedLang,
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="नया प्रोडक्ट"
        subtitle="Step 1 of 3"
        stepIndex={1}
        totalSteps={3}
        backTo="/(tabs)"
      />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo area */}
        <Pressable
          onPress={pickPhoto}
          style={({ pressed }) => [
            styles.photoArea,
            photoTaken && styles.photoTaken,
            pressed && styles.pressed,
          ]}
        >
          {photo ? (
            <View>
              <Image source={{ uri: photo.uri }} style={styles.photoImg} resizeMode="cover" />
              <View style={styles.photoOverlay}>
                <View style={styles.photoAddedChip}>
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                  <Text style={styles.photoAddedText}>फोटो जोड़ी गई</Text>
                </View>
              </View>
              <View style={styles.changeChip}>
                <Text style={styles.changeText}>बदलें ✏️</Text>
              </View>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <View style={styles.photoPlaceholderIcon}>
                <Text style={styles.photoPlaceholderEmoji}>📸</Text>
              </View>
              <Text style={styles.photoPlaceholderTitle}>प्रोडक्ट की फोटो लें</Text>
              <Text style={styles.photoPlaceholderSub}>या गैलरी से अपलोड करें</Text>
            </View>
          )}
        </Pressable>

        {/* Voice section */}
        <View style={styles.voiceCard}>
          <View style={styles.voiceHeader}>
            <View style={styles.voiceHeaderIcon}>
              <Text style={styles.voiceHeaderEmoji}>🎤</Text>
            </View>
            <View>
              <Text style={styles.voiceTitle}>बोलकर बताएं</Text>
              <Text style={styles.voiceSub}>अपने प्रोडक्ट के बारे में</Text>
            </View>
          </View>

          <View style={styles.micStage}>
            {rippleScale.map((scale, i) =>
              showRipple ? (
                <Animated.View
                  key={i}
                  pointerEvents="none"
                  style={[
                    styles.rippleRing,
                    {
                      transform: [{ scale: rippleScale[i] }],
                      opacity: rippleOpacity[i],
                    },
                  ]}
                />
              ) : null
            )}

            {isTranscribing ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.busyHalo,
                  {
                    opacity: busyPulse.interpolate({
                      inputRange: [0.95, 1.12],
                      outputRange: [0.9, 0.3],
                    }),
                    transform: [{ scale: busyPulse }],
                  },
                ]}
              />
            ) : null}

            <Animated.View
              style={{
                transform: [
                  {
                    scale: showRipple
                      ? micPulse
                      : isTranscribing
                        ? busyPulse
                        : 1,
                  },
                ],
              }}
            >
              <Pressable
                onPress={handleMicPress}
                disabled={isTranscribing}
                style={({ pressed }) => [
                  styles.micButton,
                  state.isRecording && styles.micButtonActive,
                  isTranscribing && styles.micButtonBusy,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.micIcon}>
                  {isTranscribing ? '•••' : state.isRecording ? '■' : '🎤'}
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          <Text style={[styles.micHint, state.isRecording && styles.micHintActive]}>
            {isTranscribing
              ? '✍️ समझ रहा है...'
              : state.isRecording
                ? '🔴 सुन रहा हूँ... फिर दबाकर रोकें'
                : 'बटन दबाकर बोलें'}
          </Text>

          {voiceError ? (
            <View style={styles.voiceError}>
              <Text style={styles.voiceErrorText}>⚠️ {voiceError}</Text>
              <Pressable onPress={handleMicPress} disabled={isTranscribing} style={({ pressed }) => [styles.retryBtn, pressed && styles.pressed]}>
                <Text style={styles.retryText}>🔁 फिर से बोलें</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.localeRow}>
            <Text style={styles.localeText}>🎙️ {toSpeechLocale(selectedLang)}</Text>
          </View>

          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>
              <Text style={styles.exampleBold}>उदाहरण: </Text>
              “यह हाथ से बना हुआ कॉटन बैग है, इसकी कीमत ₹600 रखना चाहता हूं।”
            </Text>
          </View>
        </View>

        {/* Description input */}
        <View style={styles.descCard}>
          <Text style={styles.descLabel}>प्रोडक्ट विवरण लिखें</Text>
          <Text style={styles.descSub}>लिखकर या बोलकर भरें — दोनों एक ही बॉक्स में आते हैं</Text>
          <TextInput
            style={styles.descInput}
            value={transcript}
            onChangeText={setTranscript}
            placeholder='जैसे: "यह हाथ से बना कॉटन बैग है, कीमत ₹600 रखना है"'
            placeholderTextColor={colors.inkMuted}
            multiline
            numberOfLines={3}
            maxLength={400}
          />
        </View>

        {/* Language selector */}
        <View style={styles.langSection}>
          <Text style={styles.langLabel}>भाषा चुनें</Text>
          <View style={styles.langRow}>
            {LANGUAGES.map((lang) => {
              const active = selectedLang === lang;
              return (
                <Pressable
                  key={lang}
                  onPress={() => setSelectedLang(lang)}
                  style={[styles.langChip, active && styles.langChipActive]}
                >
                  <Text style={[styles.langText, active && styles.langTextActive]}>{lang}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          icon="✨"
          label="AI से तैयार करें"
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
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.94,
  },
  photoArea: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  photoTaken: {
    borderStyle: 'solid',
    borderColor: colors.brand,
  },
  photoImg: {
    width: '100%',
    height: 210,
  },
  photoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(28,18,8,0.5)',
  },
  photoAddedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ok,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  photoAddedText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  changeChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  changeText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '600',
  },
  photoPlaceholder: {
    paddingVertical: 52,
    alignItems: 'center',
    gap: 4,
  },
  photoPlaceholderIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: 'rgba(224,123,30,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  photoPlaceholderEmoji: {
    fontSize: 30,
  },
  photoPlaceholderTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  photoPlaceholderSub: {
    color: colors.inkMuted,
    fontSize: 14,
    marginTop: 4,
  },
  voiceCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    marginTop: 20,
    ...shadow.card,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voiceHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(224,123,30,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceHeaderEmoji: {
    fontSize: 18,
  },
  voiceTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  voiceSub: {
    color: colors.inkMuted,
    fontSize: 12,
  },
  micStage: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  rippleRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.brand,
    backgroundColor: 'rgba(224,123,30,0.18)',
  },
  busyHalo: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.brand,
    backgroundColor: 'rgba(224,123,30,0.10)',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    fontSize: 30,
  },
  micHint: {
    color: colors.inkMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  micHintActive: {
    color: colors.earth,
    fontWeight: '600',
  },
  voiceError: {
    backgroundColor: colors.riskBg,
    borderRadius: radius.md,
    padding: 14,
    marginTop: 14,
    alignItems: 'center',
    gap: 10,
  },
  voiceErrorText: {
    color: colors.risk,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  retryBtn: {
    backgroundColor: colors.risk,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.sm,
  },
  retryText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  localeRow: {
    alignItems: 'center',
    marginTop: 12,
  },
  localeText: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  exampleBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 16,
    marginTop: 18,
  },
  exampleText: {
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  exampleBold: {
    color: colors.ink,
    fontWeight: '700',
  },
  descCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    marginTop: 20,
    ...shadow.card,
  },
  descLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  descSub: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  descInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    minHeight: 92,
    textAlignVertical: 'top',
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  langSection: {
    marginTop: 20,
  },
  langLabel: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langChip: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    ...shadow.brand,
  },
  langText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  langTextActive: {
    color: colors.white,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
});
