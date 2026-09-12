import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

interface AudioHelpButtonProps {
  /** The translation key or raw text to read aloud */
  helpTextKeyOrRaw: string;
  /** Optional custom button label (e.g. "सुनें" / "Listen") */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export default function AudioHelpButton({
  helpTextKeyOrRaw,
  label,
  size = 'md',
}: AudioHelpButtonProps) {
  const { speakHelp } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = async () => {
    setIsPlaying(true);
    try {
      await speakHelp(helpTextKeyOrRaw);
    } finally {
      // Re-enable after short buffer
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        isSmall && styles.buttonSm,
        isLarge && styles.buttonLg,
        pressed && styles.buttonPressed,
        isPlaying && styles.buttonPlaying,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Audio Guidance"
    >
      <View style={styles.content}>
        {isPlaying ? (
          <ActivityIndicator size="small" color={colors.brand} />
        ) : (
          <Text style={[styles.speakerIcon, isSmall && styles.iconSm, isLarge && styles.iconLg]}>
            🔊
          </Text>
        )}
        {label ? (
          <Text style={[styles.labelText, isSmall && styles.labelSm, isLarge && styles.labelLg]}>
            {label}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonSm: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 14,
  },
  buttonLg: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  buttonPlaying: {
    borderColor: colors.brand,
    backgroundColor: colors.cream,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  speakerIcon: {
    fontSize: 16,
  },
  iconSm: {
    fontSize: 13,
  },
  iconLg: {
    fontSize: 20,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkLight,
  },
  labelSm: {
    fontSize: 10,
  },
  labelLg: {
    fontSize: 14,
  },
});
