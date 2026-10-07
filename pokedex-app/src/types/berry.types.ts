import type { LocalizedName, NamedAPIResource } from './common.types';

export const BERRY_FLAVORS = [
  'spicy',
  'dry',
  'sweet',
  'bitter',
  'sour',
] as const;
export type BerryFlavorName = (typeof BERRY_FLAVORS)[number];

/**
 * `GET /berry/{name}`. Berry generasi baru (Kee, Maranga, Hopo, Roseli) belum lengkap datanya —
 * field `null` di PokéAPI.
 */
export interface Berry {
  id: number;
  name: string;
  growth_time: number | null;
  max_harvest: number | null;
  natural_gift_power: number | null;
  size: number | null;
  smoothness: number | null;
  soil_dryness: number | null;
  firmness: NamedAPIResource | null;
  flavors: { potency: number; flavor: NamedAPIResource }[];
  item: NamedAPIResource;
  natural_gift_type: NamedAPIResource | null;
}

/** `GET /berry-flavor/{name}`. */
export interface BerryFlavor {
  id: number;
  name: string;
  names: LocalizedName[];
  contest_type: NamedAPIResource;
  berries: { potency: number; berry: string }[];
}
