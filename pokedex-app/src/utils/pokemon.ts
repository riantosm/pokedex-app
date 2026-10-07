import {
  POKEMON_TYPE_NAMES,
  type PokemonTypeName,
  type PokemonTypeSlot,
} from '@/types';
import { formatName } from './format';

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

/** Nama resmi (Inggris) yang tidak bisa dibentuk dari slug. */
const SPECIAL_NAMES: Record<string, string> = {
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  'mr-mime': 'Mr. Mime',
  farfetchd: 'Farfetch’d',
  'ho-oh': 'Ho-Oh',
  'mime-jr': 'Mime Jr.',
  'porygon-z': 'Porygon-Z',
  flabebe: 'Flabébé',
  'type-null': 'Type: Null',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  sirfetchd: 'Sirfetch’d',
  'mr-rime': 'Mr. Rime',
  'wo-chien': 'Wo-Chien',
  'chien-pao': 'Chien-Pao',
  'ting-lu': 'Ting-Lu',
  'chi-yu': 'Chi-Yu',
};

/**
 * `GET /pokemon?limit=1025` memakai slug bentuk bawaan untuk Pokémon yang punya banyak bentuk
 * (`deoxys-normal`, `zygarde-50`, `maushold-family-of-four`) — nama tampilannya cukup nama spesies.
 */
const DEFAULT_FORM_SLUGS = new Set([
  'deoxys-normal',
  'wormadam-plant',
  'giratina-altered',
  'shaymin-land',
  'basculin-red-striped',
  'darmanitan-standard',
  'frillish-male',
  'jellicent-male',
  'tornadus-incarnate',
  'thundurus-incarnate',
  'landorus-incarnate',
  'keldeo-ordinary',
  'meloetta-aria',
  'pyroar-male',
  'meowstic-male',
  'aegislash-shield',
  'pumpkaboo-average',
  'gourgeist-average',
  'zygarde-50',
  'oricorio-baile',
  'lycanroc-midday',
  'wishiwashi-solo',
  'minior-red-meteor',
  'mimikyu-disguised',
  'toxtricity-amped',
  'eiscue-ice',
  'indeedee-male',
  'morpeko-full-belly',
  'urshifu-single-strike',
  'basculegion-male',
  'enamorus-incarnate',
  'oinkologne-male',
  'maushold-family-of-four',
  'squawkabilly-green-plumage',
  'palafin-zero',
  'tatsugiri-curly',
  'dudunsparce-two-segment',
]);

/**
 * Nama tampilan Pokémon dari slug `pokemon` / `pokemon-species` tanpa memanggil API:
 * `nidoran-f` → `Nidoran♀`, `deoxys-normal` → `Deoxys`, `iron-treads` → `Iron Treads`.
 * Nama dalam bahasa data lain butuh `species.names` (dipakai di halaman detail).
 */
export function pokemonName(slug: string): string {
  if (SPECIAL_NAMES[slug]) {
    return SPECIAL_NAMES[slug];
  }
  if (DEFAULT_FORM_SLUGS.has(slug)) {
    return formatName(slug.split('-')[0]);
  }
  return formatName(slug);
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
