import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow } from '@/constants/colors';

interface Props {
  label: string;
  onPress: () => void;
  icon?: string;
  secondary?: boolean;
  large?: boolean;
  style?: object;
}

export default function PrimaryButton({
  label,
  onPress,
  icon,
  secondary = false,
  large = false,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        large && styles.large,
        secondary ? styles.secondary : styles.primary,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.label, secondary && styles.labelSecondary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: radius.md,
    gap: 8,
  },
  large: {
    height: 62,
  },
  primary: {
    backgroundColor: colors.brand,
    ...shadow.brand,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    fontSize: 22,
  },
  label: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  labelSecondary: {
    color: colors.ink,
  },
});
