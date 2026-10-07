import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import MainLayout from '@/components/templates/MainLayout';
import { colors } from '@/theme/colors';

export interface PlaceholderLayoutProps {
  title: string;
  /** Apa yang akan dibangun di layar ini (dari BRIEF.md). */
  description: string;
  children?: ReactNode;
}

/** Layar sementara selama UI belum diimplementasikan. Hapus setelah semua layar jadi. */
export default function PlaceholderLayout({
  title,
  description,
  children,
}: PlaceholderLayoutProps) {
  return (
    <MainLayout>
      <View style={styles.content}>
        <AppText variant="screenTitle">{title}</AppText>
        <AppText color={colors.ink2}>{description}</AppText>
        {children}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
