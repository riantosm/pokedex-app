import type { LocalizedDescription, LocalizedName } from './common.types';

/** Resource yang isinya daftar spesies (egg group, warna, bentuk, habitat). */
export const SPECIES_GROUP_KINDS = [
  'egg-group',
  'pokemon-color',
  'pokemon-shape',
  'pokemon-habitat',
] as const;
export type SpeciesGroupKind = (typeof SPECIES_GROUP_KINDS)[number];

export interface SpeciesGroup {
  id: number;
  name: string;
  names: LocalizedName[];
  speciesIds: number[];
}

/** `GET /gender/{female|male|genderless}`. */
export interface Gender {
  id: number;
  name: string;
  /** `rate` = peluang betina dalam per-delapan; -1 = tanpa gender. */
  species: { id: number; rate: number }[];
  requiredForEvolution: number[];
}

/** `GET /growth-rate/{name}`. */
export interface GrowthRate {
  id: number;
  name: string;
  formula: string;
  descriptions: LocalizedDescription[];
  levels: { level: number; experience: number }[];
  speciesIds: number[];
}
