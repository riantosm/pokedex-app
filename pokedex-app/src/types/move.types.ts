import type {
  LocalizedEffect,
  LocalizedName,
  NamedAPIResource,
} from './common.types';

export interface MoveFlavorText {
  flavor_text: string;
  language: NamedAPIResource;
}

export interface MoveMachineRef {
  /** Id resource `machine` (dari URL). */
  machineId: number;
  versionGroup: string;
}

/** `GET /move/{name}` — dipangkas: `learned_by_pokemon` jadi daftar id. */
export interface Move {
  id: number;
  name: string;
  names: LocalizedName[];
  accuracy: number | null;
  power: number | null;
  pp: number | null;
  priority: number;
  effect_chance: number | null;
  type: NamedAPIResource;
  damage_class: NamedAPIResource;
  target: NamedAPIResource;
  generation: NamedAPIResource;
  meta: {
    ailment: NamedAPIResource;
    category: NamedAPIResource;
    ailment_chance: number;
  } | null;
  effect_entries: LocalizedEffect[];
  flavor_text_entries: MoveFlavorText[];
  machines: MoveMachineRef[];
  contest_type: NamedAPIResource | null;
  contestEffectId: number | null;
  superContestEffectId: number | null;
  learnedBy: number[];
}

/** `GET /machine/{id}`. */
export interface Machine {
  id: number;
  item: NamedAPIResource;
  version_group: NamedAPIResource;
  move: NamedAPIResource;
}

/** `GET /contest-effect/{id}`. */
export interface ContestEffect {
  id: number;
  appeal: number;
  jam: number;
  effect_entries: LocalizedEffect[];
}

/** `GET /super-contest-effect/{id}`. */
export interface SuperContestEffect {
  id: number;
  appeal: number;
  flavor_text_entries: MoveFlavorText[];
}

/** Resource yang hanya dipakai sebagai daftar nama move (damage class, dll.). */
export interface MoveGroup {
  id: number;
  name: string;
  names: LocalizedName[];
  moves: string[];
}

/** Satu baris move yang dipelajari Pokémon di satu grup versi. */
export interface PokemonMoveEntry {
  move: string;
  method: string;
  level: number;
}

/** Hasil `/pokemon/{id}` → moves, dikelompokkan per grup versi. */
export interface PokemonMoveSet {
  /** Grup versi terurut dari yang terbaru. */
  versionGroups: { name: string; id: number }[];
  byVersionGroup: Record<string, PokemonMoveEntry[]>;
}
