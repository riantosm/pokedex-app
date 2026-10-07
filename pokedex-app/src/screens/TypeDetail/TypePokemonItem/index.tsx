import { memo, useState } from 'react';
import Animated from 'react-native-reanimated';
import PokemonCard from '@/components/molecules/PokemonCard';
import { usePokemonTypes } from '@/hooks/usePokemonTypes';
import type { PokemonSummary, PokemonTypeName } from '@/types';
import { gridItemEntering } from '@/utils/motion';

export interface TypePokemonItemProps {
  pokemon: PokemonSummary;
  index: number;
  width: number;
  /** Id yang sudah pernah dianimasikan — kartu yang di-mount ulang saat scroll balik tidak dianimasikan lagi. */
  seenIds: Set<number>;
  onPress: (pokemon: PokemonSummary, types?: PokemonTypeName[]) => void;
}

/** Kartu Pokémon di Detail Tipe — tipe lengkap (bisa dual-type) dimuat lazy per kartu. */
function TypePokemonItem({
  pokemon,
  index,
  width,
  seenIds,
  onPress,
}: TypePokemonItemProps) {
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

export default memo(TypePokemonItem);
