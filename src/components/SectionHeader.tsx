import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel} →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  action: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '600',
  },
});
