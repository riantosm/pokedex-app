import { memo } from 'react';
import Animated from 'react-native-reanimated';
import PokemonCard from '@/components/molecules/PokemonCard';
import { usePokemonTypes } from '@/hooks/usePokemonTypes';
import type { PokemonSummary, PokemonTypeName } from '@/types';
import { gridItemEntering } from '@/utils/motion';

export interface TypePokemonItemProps {
  pokemon: PokemonSummary;
  index: number;
  width: number;
  onPress: (pokemon: PokemonSummary, types?: PokemonTypeName[]) => void;
}

/** Kartu Pokémon di Detail Tipe — tipe lengkap (bisa dual-type) dimuat lazy per kartu. */
function TypePokemonItem({
  pokemon,
  index,
  width,
  onPress,
}: TypePokemonItemProps) {
  const types = usePokemonTypes(pokemon.id);

  return (
    <Animated.View entering={gridItemEntering(index)} style={{ width }}>
      <PokemonCard
        id={pokemon.id}
        name={pokemon.name}
        types={types}
        onPress={() => onPress(pokemon, types)}
      />
    </Animated.View>
  );
}

export default memo(TypePokemonItem);
