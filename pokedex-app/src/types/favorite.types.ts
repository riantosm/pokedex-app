import type { PokemonTypeName } from './type.types';

/** Pokémon favorit yang disimpan lokal (cukup untuk menggambar kartu tanpa API). */
export interface FavoritePokemon {
  id: number;
  name: string;
  types: PokemonTypeName[];
}
