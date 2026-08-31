import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { colors, radius } from '@/constants/colors';

interface Props {
  title: string;
  subtitle?: string;
  /** Safe fallback route when there is no navigation history (e.g. deep link). */
  backTo?: string;
  stepIndex?: number;
  totalSteps?: number;
}

export default function ScreenHeader({ title, subtitle, backTo, stepIndex, totalSteps }: Props) {
  const navigation = useNavigation();
  const showSteps = stepIndex !== undefined && totalSteps !== undefined;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (backTo) {
      router.replace(backTo as never);
    }
  };

  return (
    <View style={styles.header}>
      <Pressable
        onPress={handleBack}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        hitSlop={8}
      >
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <View style={styles.titles}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {showSteps && (
        <View style={styles.steps}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[styles.step, i < (stepIndex ?? 1) && styles.stepDone]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  pressed: {
    opacity: 0.7,
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
  steps: {
    flexDirection: 'row',
    gap: 6,
  },
  step: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  stepDone: {
    width: 26,
    backgroundColor: colors.brand,
  },
});
