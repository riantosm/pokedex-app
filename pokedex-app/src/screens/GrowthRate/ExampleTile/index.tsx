import { memo } from 'react';
import { StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';
import { artworkUrl, pokemonName } from '@/utils/pokemon';

/** Tile kecil Pokémon contoh (artwork + nama). */
function ExampleTile({
  id,
  name,
  onPress,
}: {
  id: number;
  name: string;
  onPress: (id: number, name: string) => void;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={pokemonName(name)}
      onPress={() => onPress(id, name)}
      style={styles.tile}
    >
      <FastImage source={{ uri: artworkUrl(id) }} style={styles.img} />
      <AppText variant="label" numberOfLines={1}>
        {pokemonName(name)}
      </AppText>
    </PressableScale>
  );
}

export default memo(ExampleTile);

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  img: {
    width: 56,
    height: 56,
  },
});
