import { memo, useState } from 'react';
import Animated from 'react-native-reanimated';
import PokemonCard from '@/components/molecules/PokemonCard';
import { usePokemonTypes } from '@/hooks/usePokemonTypes';
import type { PokemonTypeName } from '@/types';
import { gridItemEntering } from '@/utils/motion';

export interface PokemonGridCellProps {
  id: number;
  name: string;
  index: number;
  width: number;
  /** Id yang sudah pernah dianimasikan — kartu yang di-mount ulang saat scroll balik tidak dianimasikan lagi. */
  seenIds: Set<number>;
  onPress: (id: number, name: string, types?: PokemonTypeName[]) => void;
  numberLabel?: string;
}

/**
 * Kartu Pokémon di grid mana pun (kelompok, Pokédex regional, koleksi). Tipe dimuat lazy & ringan
 * (`/pokemon-form`), animasi muncul sekali per id. Dipakai lintas layar → `screens/shared`.
 */
function PokemonGridCell({
  id,
  name,
  index,
  width,
  seenIds,
  onPress,
  numberLabel,
}: PokemonGridCellProps) {
  const types = usePokemonTypes(id);
  const [animate] = useState(() => {
    const first = !seenIds.has(id);
    seenIds.add(id);
    return first;
  });

  return (
    <Animated.View
      entering={animate ? gridItemEntering(index) : undefined}
      style={{ width }}
    >
      <PokemonCard
        id={id}
        name={name}
        types={types}
        numberLabel={numberLabel}
        onPress={() => onPress(id, name, types ?? undefined)}
      />
    </Animated.View>
  );
}

export default memo(PokemonGridCell);
