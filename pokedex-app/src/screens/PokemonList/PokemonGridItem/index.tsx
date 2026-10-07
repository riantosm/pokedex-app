import { memo, useState } from 'react';
import Animated from 'react-native-reanimated';
import PokemonCard from '@/components/molecules/PokemonCard';
import { usePokemonTypes } from '@/hooks/usePokemonTypes';
import type { PokemonSummary, PokemonTypeName } from '@/types';
import { gridItemEntering } from '@/utils/motion';

export interface PokemonGridItemProps {
  pokemon: PokemonSummary;
  index: number;
  width: number;
  /** Id yang sudah pernah dianimasikan — kartu yang di-mount ulang saat scroll balik tidak dianimasikan lagi. */
  seenIds: Set<number>;
  onPress: (pokemon: PokemonSummary, types?: PokemonTypeName[]) => void;
}

/**
 * Kartu di grid. Tipe diambil lazy per kartu yang ter-render (FlatList hanya me-mount
 * item di sekitar viewport); hasilnya di-cache RTK Query. Muncul dengan animasi saat di-scroll.
 */
function PokemonGridItem({
  pokemon,
  index,
  width,
  seenIds,
  onPress,
}: PokemonGridItemProps) {
  const types = usePokemonTypes(pokemon.id);
  const [animate] = useState(() => {
    const first = !seenIds.has(pokemon.id);
    seenIds.add(pokemon.id);
    return first;
  });

  return (
    <Animated.View
      entering={animate ? gridItemEntering(index) : undefined}
      style={{ width }}
    >
      <PokemonCard
        id={pokemon.id}
        name={pokemon.name}
        types={types}
        onPress={() => onPress(pokemon, types ?? undefined)}
      />
    </Animated.View>
  );
}

export default memo(PokemonGridItem);
