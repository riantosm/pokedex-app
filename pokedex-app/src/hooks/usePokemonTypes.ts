import { useGetPokemonQuery } from '@/services/api/pokemon.service';
import type { PokemonTypeName } from '@/types';
import { typeNames } from '@/utils/pokemon';

/** Tipe Pokémon (lazy, ter-cache). `undefined` selama belum dimuat. */
export function usePokemonTypes(id: number): PokemonTypeName[] | undefined {
  const { data } = useGetPokemonQuery(id);
  return data ? typeNames(data.types) : undefined;
}
