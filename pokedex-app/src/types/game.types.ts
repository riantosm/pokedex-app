import type {
  LocalizedDescription,
  LocalizedName,
  NamedAPIResource,
} from './common.types';

/** `GET /version-group/{name}`. */
export interface VersionGroup {
  id: number;
  name: string;
  order: number;
  generation: NamedAPIResource;
  versions: string[];
  pokedexes: string[];
}

/** `GET /version/{name}`. */
/** `GET /pokedex/{name}` — entri dipadatkan. */
export interface Pokedex {
  id: number;
  name: string;
  is_main_series: boolean;
  names: LocalizedName[];
  descriptions: LocalizedDescription[];
  region: NamedAPIResource | null;
  version_groups: string[];
  entries: { number: number; id: number; name: string }[];
}
