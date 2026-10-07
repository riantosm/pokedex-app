import { StyleSheet, View, type ViewStyle } from 'react-native';
import AppText from '@/components/atoms/AppText';
import { colors, typePalette } from '@/theme/colors';
import type { PokemonTypeName } from '@/types';
import { formatName } from '@/utils/format';

export type TypeBadgeTone = 'solid' | 'onColor';

export interface TypeBadgeProps {
  type: PokemonTypeName;
  /**
   * `solid` = warna tipe (di atas latar putih).
   * `onColor` = transparan, untuk di atas kartu/hero yang sudah berwarna tipe.
   */
  tone?: TypeBadgeTone;
  /** Hanya untuk `onColor`: tipe latar di bawahnya, penentu warna teks. */
  surfaceType?: PokemonTypeName;
  style?: ViewStyle;
}

/** Desain: `Badge/Type` (solid) dan pill di `Card/Pokemon` (onColor). */
export default function TypeBadge({
  type,
  tone = 'solid',
  surfaceType,
  style,
}: TypeBadgeProps) {
  const surface = typePalette(tone === 'solid' ? type : surfaceType ?? type);
  const background = tone === 'solid' ? surface.background : surface.pill;

  return (
    <View
      style={[
        styles.base,
        tone === 'onColor' && styles.compact,
        { backgroundColor: background },
        style,
      ]}
    >
      <AppText
        variant={tone === 'solid' ? 'label' : 'micro'}
        color={surface.text}
      >
        {formatName(type)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 999,
    justifyContent: 'center',
    backgroundColor: colors.skeleton,
  },
  compact: {
    height: 22,
    paddingHorizontal: 10,
  },
});
