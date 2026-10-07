import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import { colors } from '@/theme/colors';

export interface TagProps {
  label: string;
  /** `surface` di atas latar `bg` (Region Detail), `bg` di atas kartu putih (Game & generasi). */
  background?: string;
  size?: 'sm' | 'md';
  dotColor?: string;
}

/** Label statis berbentuk pil (nama game, grup versi). Bukan tombol — pakai `TypeChip` untuk filter. */
export default function Tag({
  label,
  background = colors.surface,
  size = 'md',
  dotColor,
}: TagProps) {
  return (
    <View
      style={[
        styles.base,
        size === 'md' ? styles.md : styles.sm,
        { backgroundColor: background },
      ]}
    >
      {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      <AppText variant="label" color={colors.ink2}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
  },
  md: {
    height: 32,
    paddingHorizontal: 12,
  },
  sm: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
