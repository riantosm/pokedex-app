import { StyleSheet, View, type ViewStyle } from 'react-native';
import AppText from '@/components/atoms/AppText';
import { colors } from '@/theme/colors';
import type { TypographyVariant } from '@/theme/typography';

export interface SectionHeaderProps {
  title: string;
  /** Teks kecil di kanan, mis. jumlah hasil. */
  meta?: string;
  variant?: Extract<TypographyVariant, 'heading' | 'subheading'>;
  style?: ViewStyle;
}

export default function SectionHeader({
  title,
  meta,
  variant = 'heading',
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <AppText
        variant={variant}
        accessibilityRole="header"
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </AppText>
      {meta && (
        <AppText variant="caption" color={colors.ink3}>
          {meta}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flexShrink: 1,
  },
});
