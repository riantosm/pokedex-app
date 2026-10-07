import type { NamedAPIResource } from './common.types';

export interface AbilityEffectEntry {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}

/** `GET /ability/{name}` — hanya field yang dipakai app. */
export interface Ability {
  id: number;
  name: string;
  generation: NamedAPIResource;
  effect_entries: AbilityEffectEntry[];
}
