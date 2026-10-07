import type { NamedAPIResource } from './common.types';

/** Satu entri index Pokédex, diturunkan dari `GET /pokemon?limit=1025`. */
export interface PokemonSummary {
  id: number;
  name: string;
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedAPIResource;
}

/**
 * `GET /pokemon-form/{id}` — hanya field yang dipakai. Untuk id 1–1025 form default ber-id sama
 * dengan Pokémon-nya, dan payload-nya ±10× lebih kecil dari `/pokemon/{id}` (tanpa `moves`).
 */
export interface PokemonForm {
  id: number;
  name: string;
  types: PokemonTypeSlot[];
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

/**
 * `GET /pokemon/{id}` — hanya field yang dipakai app.
 * `height` dalam desimeter, `weight` dalam hektogram.
 */
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  species: NamedAPIResource;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface Genus {
  genus: string;
  language: NamedAPIResource;
}

/**
 * `GET /pokemon-species/{id}` — hanya field yang dipakai app.
 * `gender_rate`: -1 = tanpa gender, selain itu peluang betina dalam per-delapan.
 */
export interface PokemonSpecies {
  id: number;
  name: string;
  gender_rate: number;
  capture_rate: number;
  is_legendary: boolean;
  is_mythical: boolean;
  habitat: NamedAPIResource | null;
  generation: NamedAPIResource;
  growth_rate: NamedAPIResource;
  egg_groups: NamedAPIResource[];
  evolution_chain: { url: string };
  flavor_text_entries: FlavorTextEntry[];
  genera: Genus[];
}
