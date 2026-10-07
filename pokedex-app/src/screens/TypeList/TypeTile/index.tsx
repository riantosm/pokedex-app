import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import FastImage from '@d11/react-native-fast-image';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import { useGetTypeQuery } from '@/services/api/type.service';
import { typePalette } from '@/theme/colors';
import type { PokemonTypeName } from '@/types';
import { formatCount, formatName } from '@/utils/format';
import { gridItemEntering } from '@/utils/motion';
import { artworkUrl } from '@/utils/pokemon';
import { TYPE_REPRESENTATIVE } from '@/utils/types';

export interface TypeTileProps {
  type: PokemonTypeName;
  index: number;
  width: number;
  onPress: (type: PokemonTypeName) => void;
}

/** Tile tipe (desain: halaman Tipe). Jumlah Pokémon dari `GET /type/{name}`, lazy & ter-cache. */
function TypeTile({ type, index, width, onPress }: TypeTileProps) {
  const palette = typePalette(type);
  const { data, isError } = useGetTypeQuery(type);

  return (
    <Animated.View entering={gridItemEntering(index)} style={{ width }}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Tipe ${formatName(type)}${
          data ? `, ${data.pokemon.length} Pokémon` : ''
        }`}
        onPress={() => onPress(type)}
        style={[styles.tile, { backgroundColor: palette.background }]}
      >
        <View style={styles.art} pointerEvents="none">
          <FastImage
            key={data ? 'ready' : 'pending'}
            source={{ uri: artworkUrl(TYPE_REPRESENTATIVE[type]) }}
            style={styles.artImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <AppText variant="cardTitle" color={palette.text}>
          {formatName(type)}
        </AppText>
        {data ? (
          <AppText variant="label" color={palette.textMuted}>
            {formatCount(data.pokemon.length)} Pokémon
          </AppText>
        ) : isError ? null : (
          <Skeleton width={64} height={12} color={palette.pill} />
        )}
      </PressableScale>
    </Animated.View>
  );
}

export default memo(TypeTile);

const ART = 86;

const styles = StyleSheet.create({
  tile: {
    height: 84,
    paddingHorizontal: 16,
    gap: 2,
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  art: {
    position: 'absolute',
    right: -4,
    top: 6,
    width: ART,
    height: ART,
  },
  artImage: {
    width: ART,
    height: ART,
  },
});
