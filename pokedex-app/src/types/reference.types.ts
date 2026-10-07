import type {
  LocalizedDescription,
  LocalizedName,
  NamedAPIResource,
} from './common.types';

/** `GET /contest-type/{name}` — `names[].color` = warna kategori. */
export interface ContestType {
  id: number;
  name: string;
  berry_flavor: NamedAPIResource;
  names: (LocalizedName & { color: string })[];
}

/** `GET /evolution-trigger/{name}`. */
export interface EvolutionTrigger {
  id: number;
  name: string;
  names: LocalizedName[];
  speciesIds: number[];
}

/** `GET /evolution-variable/{id}`. */
export interface EvolutionVariable {
  id: number;
  name: string;
  symbol: string | null;
  names: LocalizedName[];
  descriptions: LocalizedDescription[];
}

/** `GET /encounter-condition/{name}`. */
export interface EncounterCondition {
  id: number;
  name: string;
  names: LocalizedName[];
  values: string[];
}

/** `GET /language/{name}`. */
export interface Language {
  id: number;
  name: string;
  /** `false` = bukan bahasa resmi game Pokémon (mis. `cs`). */
  official: boolean;
}

/** `GET /meta` — info rilis data PokéAPI. */
export interface ApiMeta {
  deploy_date: string;
  hash: string;
  tag: string | null;
}
