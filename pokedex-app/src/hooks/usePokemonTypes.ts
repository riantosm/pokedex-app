import { useGetPokemonTypesQuery } from '@/services/api/pokemon.service';
import type { PokemonTypeName } from '@/types';

/**
 * Tipe Pokémon untuk kartu (lazy, ter-cache).
 * `undefined` = masih dimuat, `null` = gagal dimuat (mis. offline & belum ada di cache).
 */
export function usePokemonTypes(
  id: number,
): PokemonTypeName[] | null | undefined {
  const { data, isError } = useGetPokemonTypesQuery(id);
  if (data) {
    return data;
  }
  return isError ? null : undefined;
}
