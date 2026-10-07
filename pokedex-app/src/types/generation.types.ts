import type { LocalizedName, NamedAPIResource } from './common.types';

/** `GET /generation/{id}` — hanya field yang dipakai app. */
export interface Generation {
  id: number;
  name: string;
  names: LocalizedName[];
  main_region: NamedAPIResource;
  pokemon_species: NamedAPIResource[];
  version_groups: string[];
  movesCount: number;
}
