import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { colors, radius, shadow } from '@/constants/colors';
import { CURRENT_PRODUCT, IMAGES, LANGUAGES } from '@/constants/mockData';
import type { Language } from '@/types/product';

export default function AddProductScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLang, setSelectedLang] = useState<Language>('हिंदी');
  const [isRecording, setIsRecording] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

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
          onPress={() => setPhotoTaken((v) => !v)}
          style={({ pressed }) => [
            styles.photoArea,
            photoTaken && styles.photoTaken,
            pressed && styles.pressed,
          ]}
        >
          {photoTaken ? (
            <View>
              <Image source={{ uri: CURRENT_PRODUCT.img }} style={styles.photoImg} resizeMode="cover" />
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

          <View style={styles.micWrap}>
            <Pressable
              onPress={() => setIsRecording((v) => !v)}
              style={({ pressed }) => [
                styles.micButton,
                isRecording && styles.micButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.micIcon}>{isRecording ? '⏹' : '🎤'}</Text>
            </Pressable>
          </View>

          <Text style={[styles.micHint, isRecording && styles.micHintActive]}>
            {isRecording ? '🔴 सुन रहा है...' : 'बटन दबाकर बोलें'}
          </Text>

          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>
              <Text style={styles.exampleBold}>उदाहरण: </Text>
              "यह हाथ से बना हुआ कॉटन बैग है, इसकी कीमत ₹600 रखना चाहता हूं।"
            </Text>
          </View>
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
          onPress={() => router.push('/processing')}
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
  micWrap: {
    alignItems: 'center',
    paddingVertical: 22,
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
