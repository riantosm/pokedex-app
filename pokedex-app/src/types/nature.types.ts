import type {
  APIResource,
  LocalizedDescription,
  LocalizedName,
  NamedAPIResource,
} from './common.types';

/** `GET /nature/{name}`. */
export interface Nature {
  id: number;
  name: string;
  names: LocalizedName[];
  increased_stat: NamedAPIResource | null;
  decreased_stat: NamedAPIResource | null;
  likes_flavor: NamedAPIResource | null;
  hates_flavor: NamedAPIResource | null;
  pokeathlon_stat_changes: {
    max_change: number;
    pokeathlon_stat: NamedAPIResource;
  }[];
  move_battle_style_preferences: {
    low_hp_preference: number;
    high_hp_preference: number;
    move_battle_style: NamedAPIResource;
  }[];
}

/** `GET /stat/{name}`. */
export interface Stat {
  id: number;
  name: string;
  names: LocalizedName[];
  affecting_moves: {
    increase: { change: number; move: NamedAPIResource }[];
    decrease: { change: number; move: NamedAPIResource }[];
  };
  affecting_natures: {
    increase: NamedAPIResource[];
    decrease: NamedAPIResource[];
  };
  characteristics: APIResource[];
}

/** `GET /characteristic/{id}`. */
export interface Characteristic {
  id: number;
  gene_modulo: number;
  possible_values: number[];
  descriptions: LocalizedDescription[];
}
