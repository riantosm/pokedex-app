import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export interface MainLayoutProps {
  children: ReactNode;
  /** Default hanya `top` — tab bar sudah menangani inset bawah. */
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}

/** Kerangka layar standar: safe area + latar `bg`. */
export default function MainLayout({
  children,
  edges = ['top'],
  style,
}: MainLayoutProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
