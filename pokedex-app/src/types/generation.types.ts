import type { NamedAPIResource } from './common.types';

/** `GET /generation/{id}` — hanya field yang dipakai app. */
export interface Generation {
  id: number;
  name: string;
  main_region: NamedAPIResource;
  pokemon_species: NamedAPIResource[];
}
