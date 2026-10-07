import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export interface ChipScrollerProps {
  children: ReactNode;
  /** Padding horizontal layar — scroller melebar sampai tepi layar. */
  inset?: number;
}

/** Deret chip yang bisa digeser horizontal sampai tepi layar. */
export default function ChipScroller({
  children,
  inset = 20,
}: ChipScrollerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={[styles.root, { marginHorizontal: -inset }]}
      contentContainerStyle={[styles.content, { paddingHorizontal: inset }]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Jangan ikut melebar di ScrollView vertikal yang konten-nya `flexGrow: 1`.
  root: {
    flexGrow: 0,
  },
  content: {
    gap: 8,
  },
});
