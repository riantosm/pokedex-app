import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors } from '@/theme/colors';
import { typography, type TypographyVariant } from '@/theme/typography';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

/** Satu-satunya komponen teks — font & skala dari `theme/typography`. */
export default function AppText({
  variant = 'body',
  color = colors.ink,
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        typography[variant],
        { color },
        align && { textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
