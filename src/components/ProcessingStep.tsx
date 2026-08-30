import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/constants/colors';

export interface ProcessingStepData {
  icon: string;
  hindi: string;
  en: string;
}

interface Props {
  step: ProcessingStepData;
  state: 'done' | 'active' | 'pending';
}

export default function ProcessingStep({ step, state }: Props) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'done') {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 120,
      }).start();
    }
  }, [state, scale]);

  const isDone = state === 'done';
  const isActive = state === 'active';

  return (
    <View
      style={[
        styles.row,
        isDone && styles.doneRow,
        isActive && styles.activeRow,
        !isDone && !isActive && styles.pendingRow,
      ]}
    >
      <View style={[styles.iconBox, isDone && styles.iconBoxDone, isActive && styles.iconBoxActive]}>
        {isDone ? (
          <Animated.Text
            style={[styles.check, { transform: [{ scale }] }]}
          >
            ✓
          </Animated.Text>
        ) : (
          <Text style={styles.iconEmoji}>{step.icon}</Text>
        )}
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.hindi, isDone && styles.textDone, isActive && styles.textActive]}>
          {step.hindi}
        </Text>
        <Text style={styles.en}>{step.en}</Text>
      </View>
      {isDone && <View style={styles.doneBadge}><Text style={styles.doneBadgeText}>✓</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: radius.md,
  },
  doneRow: {
    backgroundColor: colors.okBg,
    borderWidth: 1,
    borderColor: 'rgba(42,125,82,0.18)',
  },
  activeRow: {
    backgroundColor: colors.warnBg,
  },
  pendingRow: {
    backgroundColor: colors.card,
    opacity: 0.45,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  iconBoxDone: {
    backgroundColor: colors.ok,
  },
  iconBoxActive: {
    backgroundColor: 'rgba(196,154,10,0.2)',
  },
  check: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  iconEmoji: {
    fontSize: 18,
  },
  textWrap: {
    flex: 1,
  },
  hindi: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  textDone: {
    color: colors.ok,
  },
  textActive: {
    color: colors.ink,
  },
  en: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 2,
  },
  doneBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ok,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
