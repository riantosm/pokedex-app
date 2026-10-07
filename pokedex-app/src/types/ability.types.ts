import type { LocalizedName, NamedAPIResource } from './common.types';

export interface AbilityEffectEntry {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}

export interface AbilityFlavorText {
  flavor_text: string;
  language: NamedAPIResource;
}

/** `GET /ability/{name}` — hanya field yang dipakai app. */
export interface Ability {
  id: number;
  name: string;
  names: LocalizedName[];
  generation: NamedAPIResource;
  effect_entries: AbilityEffectEntry[];
  /** Teks singkat dari game — tersedia di lebih banyak bahasa daripada `effect_entries`. */
  flavor_text_entries: AbilityFlavorText[];
}
