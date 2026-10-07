import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import AppText from '@/components/atoms/AppText';
import PressableScale, {
  type PressableScaleProps,
} from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import TypeBadge from '@/components/atoms/TypeBadge';
import { neutralPalette, typePalette } from '@/theme/colors';
import type { PokemonTypeName } from '@/types';
import { formatDexNumber } from '@/utils/format';
import { artworkUrl, pokemonName } from '@/utils/pokemon';

export const POKEMON_CARD_HEIGHT = 132;

export interface PokemonCardProps
  extends Omit<PressableScaleProps, 'children' | 'id'> {
  id: number;
  name: string;
  /**
   * `undefined` = tipe sedang dimuat → kartu netral + skeleton pill.
   * `null` = tipe tidak tersedia (offline) → kartu netral tanpa skeleton.
   */
  types?: PokemonTypeName[] | null;
  /** Ganti label nomor, mis. Pokédex regional `#001 · Nas. #906`. Default nomor nasional. */
  numberLabel?: string;
}

/** Desain: `Card/Pokemon`. Warna kartu mengikuti tipe pertama. */
function PokemonCard({
  id,
  name,
  types,
  numberLabel,
  style,
  ...rest
}: PokemonCardProps) {
  const primary = types?.[0];
  const palette = primary ? typePalette(primary) : neutralPalette;
  const displayName = pokemonName(name);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, nomor ${id}${
        types ? `, tipe ${types.join(' dan ')}` : ''
      }`}
      style={[styles.card, { backgroundColor: palette.background }, style]}
      {...rest}
    >
      <View style={[styles.ring, { borderColor: palette.ring }]} />
      <View style={styles.artwork} pointerEvents="none">
        {/* Remount saat tipe tiba → gambar yang gagal dimuat saat offline dicoba ulang. */}
        <FastImage
          key={types ? 'ready' : 'pending'}
          source={{ uri: artworkUrl(id) }}
          style={styles.fill}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <AppText variant="label" color={palette.textMuted} numberOfLines={1}>
        {numberLabel ?? formatDexNumber(id)}
      </AppText>
      <AppText variant="cardTitle" color={palette.text} numberOfLines={1}>
        {displayName}
      </AppText>
      <View style={styles.types}>
        {types && primary ? (
          types.map(t => (
            <TypeBadge key={t} type={t} tone="onColor" surfaceType={primary} />
          ))
        ) : types === undefined ? (
          <Skeleton width={52} height={22} radius={11} />
        ) : null}
      </View>
    </PressableScale>
  );
}

export default memo(PokemonCard);

const RING = 104;
const ART = 84;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: POKEMON_CARD_HEIGHT,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    right: -28,
    bottom: -28,
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 20,
  },
  artwork: {
    position: 'absolute',
    right: 6,
    bottom: 2,
    width: ART,
    height: ART,
  },
  fill: {
    width: ART,
    height: ART,
  },
  types: {
    gap: 5,
    paddingTop: 4,
    alignItems: 'flex-start',
  },
});
