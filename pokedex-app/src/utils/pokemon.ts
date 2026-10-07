import {
  POKEMON_TYPE_NAMES,
  type PokemonTypeName,
  type PokemonTypeSlot,
} from '@/types';

/** Jumlah Pokémon nasional. Id di atas ini adalah varian bentuk (mulai 10001). */
export const MAX_POKEMON_ID = 1025;

const ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/** `https://pokeapi.co/api/v2/pokemon/25/` → `25`. */
export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) {
    throw new Error(`URL PokéAPI tanpa id: ${url}`);
  }
  return Number(match[1]);
}

/** Artwork resmi dibentuk dari id, tanpa perlu memanggil detail. */
export function artworkUrl(id: number): string {
  return `${ARTWORK_BASE}/${id}.png`;
}

export function isPokemonTypeName(name: string): name is PokemonTypeName {
  return (POKEMON_TYPE_NAMES as readonly string[]).includes(name);
}

/** Tipe Pokémon terurut sesuai slot, hanya 18 tipe yang dikenal. */
export function typeNames(slots: PokemonTypeSlot[]): PokemonTypeName[] {
  return [...slots]
    .sort((a, b) => a.slot - b.slot)
    .map(s => s.type.name)
    .filter(isPokemonTypeName);
}

export interface GenderRatio {
  male: number;
  female: number;
}

/** `gender_rate` (-1 atau 0..8, per-delapan betina) → persentase; `null` kalau tanpa gender. */
export function genderRatio(genderRate: number): GenderRatio | null {
  if (genderRate < 0) {
    return null;
  }
  const female = (genderRate / 8) * 100;
  return { male: 100 - female, female };
}
