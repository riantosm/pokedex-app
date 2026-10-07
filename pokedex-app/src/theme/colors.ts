import type { PokemonTypeName } from '@/types';

/** Design token dari design/pokedex.pen (Opsi A · Classic Red). Jangan pakai hex inline di komponen. */
export const colors = {
  brand: '#DC0A2D',
  brandSoft: '#DC0A2D14',
  ink: '#1B1B1F',
  ink2: '#55555F',
  ink3: '#8A8A94',
  bg: '#F4F4F6',
  bgTranslucent: '#F4F4F6',
  surface: '#FFFFFF',
  /** Tab bar melayang — sedikit tembus supaya konten di belakangnya terasa. */
  tabBar: '#FFFFFFF5',
  line: '#E6E6EC',
  white: '#FFFFFF',
  transparent: 'transparent',
  scrim: '#1B1B1F73',
  skeleton: '#E9E9EE',
  skeletonHighlight: '#DCDCE3',
  danger: '#C42B1C',
  success: '#1F7A3D',
  genderMale: '#5B8DEF',
  genderFemale: '#F2A3C4',
  genderMaleText: '#3A6FD8',
  genderFemaleText: '#C2477D',
  glass: '#FFFFFF2E',
} as const;

/** Warna resmi tipe — untuk titik, bar stat, dan aksen kecil. */
export const typeColors: Record<PokemonTypeName, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

/**
 * Latar kartu / hero per tipe. Warna resmi digelapkan seperlunya supaya teks putih
 * mencapai kontras ≥ 3:1; tipe terang (lihat `typeOnColor`) tetap memakai teks gelap.
 */
export const typeCardColors: Record<PokemonTypeName, string> = {
  normal: '#979663',
  fire: '#EC7014',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#5DA333',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#9E81F2',
  psychic: '#F95587',
  bug: '#8A9A16',
  rock: '#A69331',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D176A3',
};

const LIGHT_TYPES: readonly PokemonTypeName[] = [
  'electric',
  'ice',
  'ground',
  'steel',
];

/** Warna teks di atas `typeCardColors[type]`. */
export const typeOnColor = (type: PokemonTypeName): string =>
  LIGHT_TYPES.includes(type) ? colors.ink : colors.white;

export interface TypePalette {
  /** Latar kartu / hero. */
  background: string;
  /** Teks utama (nama). */
  text: string;
  /** Teks sekunder (nomor, jumlah). */
  textMuted: string;
  /** Latar pill tipe di atas `background`. */
  pill: string;
  /** Watermark cincin pokéball. */
  ring: string;
}

const ON_DARK = {
  textMuted: '#FFFFFFB3',
  pill: '#FFFFFF33',
  ring: '#FFFFFF2E',
};
const ON_LIGHT = {
  textMuted: '#1B1B1F99',
  pill: '#1B1B1F14',
  ring: '#FFFFFF59',
};

/** Semua warna turunan untuk permukaan bertipe (kartu, hero, tile tipe). */
export function typePalette(type: PokemonTypeName): TypePalette {
  const light = LIGHT_TYPES.includes(type);
  return {
    background: typeCardColors[type],
    text: light ? colors.ink : colors.white,
    ...(light ? ON_LIGHT : ON_DARK),
  };
}

/** Palet kartu saat tipe belum diketahui (data detail masih dimuat). */
export const neutralPalette: TypePalette = {
  background: colors.skeleton,
  text: colors.ink,
  textMuted: colors.ink3,
  pill: colors.skeletonHighlight,
  ring: '#FFFFFF80',
};
