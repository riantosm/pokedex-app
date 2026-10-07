import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import PressableScale, {
  type PressableScaleProps,
} from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';

export type IconButtonVariant = 'glass' | 'surface';

export interface IconButtonProps extends PressableScaleProps {
  icon: ReactNode;
  /** Wajib — tombol ikon tidak punya teks yang bisa dibaca screen reader. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  /** `round` = lingkaran 40 (hero), `square` = 50 dengan radius 16 (sebelah kolom cari). */
  shape?: 'round' | 'square';
}

const variantStyles: Record<IconButtonVariant, ViewStyle> = {
  glass: { backgroundColor: colors.glass },
  surface: { backgroundColor: colors.surface },
};

const shapeStyles: Record<'round' | 'square', ViewStyle> = {
  round: { width: 40, height: 40, borderRadius: 20 },
  square: { width: 50, height: 50, borderRadius: 16 },
};

export default function IconButton({
  icon,
  variant = 'glass',
  shape = 'round',
  style,
  hitSlop = 8,
  ...rest
}: IconButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      hitSlop={hitSlop}
      style={[styles.base, variantStyles[variant], shapeStyles[shape], style]}
      {...rest}
    >
      {icon}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
