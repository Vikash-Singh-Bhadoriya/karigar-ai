import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow } from '@/constants/colors';

interface Props {
  icon: string;
  title: string;
  hindi: string;
  editLabel?: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export default function InfoCard({ icon, title, hindi, editLabel, onEdit, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.header}>
          <Text style={styles.icon}>{icon}</Text>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.hindi}>{hindi}</Text>
          </View>
        </View>
        {onEdit && editLabel && (
          <Pressable onPress={onEdit} style={({ pressed }) => [styles.edit, pressed && styles.pressed]}>
            <Text style={styles.editText}>{editLabel}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    ...shadow.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  hindi: {
    color: colors.inkMuted,
    fontSize: 12,
    marginTop: 1,
  },
  edit: {
    backgroundColor: 'rgba(224,123,30,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  editText: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '600',
  },
});
