import type { LocalizedName, NamedAPIResource } from './common.types';

/** `GET /region/{name}`. */
export interface Region {
  id: number;
  name: string;
  names: LocalizedName[];
  main_generation: NamedAPIResource | null;
  locations: string[];
  pokedexes: string[];
  version_groups: string[];
}

/** `GET /location/{name}`. */
export interface Location {
  id: number;
  name: string;
  names: LocalizedName[];
  region: NamedAPIResource | null;
  areas: string[];
  generations: string[];
}

export interface AreaEncounterVersion {
  version: string;
  maxChance: number;
  minLevel: number;
  maxLevel: number;
  methods: string[];
}

/** `GET /location-area/{name}` — encounter dipadatkan per versi. */
export interface LocationArea {
  id: number;
  name: string;
  names: LocalizedName[];
  location: NamedAPIResource;
  encounters: { id: number; name: string; versions: AreaEncounterVersion[] }[];
}

/** `GET /pal-park-area/{name}`. */
export interface PalParkArea {
  id: number;
  name: string;
  names: LocalizedName[];
  encounters: { id: number; name: string; baseScore: number; rate: number }[];
}

/** Satu versi di `/pokemon/{id}/encounters`, detail dipadatkan. */
export interface PokemonEncounterVersion {
  version: string;
  maxChance: number;
  minLevel: number;
  maxLevel: number;
  methods: string[];
  conditions: string[];
}

export interface PokemonEncounterArea {
  area: string;
  versions: PokemonEncounterVersion[];
}
