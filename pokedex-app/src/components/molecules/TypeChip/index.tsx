import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale, {
  type PressableScaleProps,
} from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';

export interface TypeChipProps extends Omit<PressableScaleProps, 'children'> {
  label: string;
  /** Ikon kecil di depan label (mis. area Pal Park). */
  icon?: ReactNode;
  /** Warna titik di depan label (warna tipe). Tanpa titik untuk chip "Semua". */
  dotColor?: string;
  active?: boolean;
}

/** Desain: `Chip/Filter` dan `Chip/Filter Active`. */
export default function TypeChip({
  label,
  dotColor,
  icon,
  active = false,
  style,
  ...rest
}: TypeChipProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.base, active ? styles.active : styles.inactive, style]}
      {...rest}
    >
      {icon}
      {dotColor && !active && (
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      )}
      <AppText
        variant={active ? 'captionStrong' : 'caption'}
        color={active ? colors.white : colors.ink2}
      >
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  active: {
    paddingHorizontal: 16,
    backgroundColor: colors.ink,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
