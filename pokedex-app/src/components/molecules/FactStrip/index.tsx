import { StyleSheet, View, type ViewStyle } from 'react-native';
import AppText from '@/components/atoms/AppText';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export interface FactStripProps {
  items: { value: string; label: string }[];
  /** Latar strip; default `bg` (dipakai di atas kartu putih). */
  background?: string;
  style?: ViewStyle;
}

/** Deret angka kunci dengan pemisah (desain: Facts — Tinggi/Berat/Generasi, Power/Akurasi/PP). */
export default function FactStrip({
  items,
  background = colors.bg,
  style,
}: FactStripProps) {
  return (
    <View style={[styles.root, { backgroundColor: background }, style]}>
      {items.map((it, i) => (
        <View
          key={it.label}
          style={[styles.cell, i < items.length - 1 && styles.divider]}
        >
          <AppText
            variant="subheading"
            align="center"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {it.value}
          </AppText>
          <AppText
            variant="label"
            color={colors.ink3}
            align="center"
            style={styles.label}
          >
            {it.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 16,
  },
  cell: {
    flex: 1,
    gap: 2,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  divider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.line,
  },
  label: {
    fontFamily: fonts.regular,
  },
});
