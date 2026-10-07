import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink2,
  },
});
