import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  bottomInset?: boolean;
  edges?: readonly ('top' | 'bottom' | 'left' | 'right')[];
}

export default function Screen({
  children,
  scroll = true,
  bottomInset = false,
  edges,
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={edges ?? ['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, bottomInset && styles.inset]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, bottomInset && styles.inset]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  inset: {
    paddingBottom: 96,
  },
});
