import type {
  LocalizedDescription,
  LocalizedName,
  NamedAPIResource,
  Pokedex,
  VersionGroup,
} from '@/types';
import { latestPerLanguage, supportedOnly } from '@/utils/i18n';
import { MAX_POKEMON_ID, idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

const gameApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getVersionGroup: build.query<VersionGroup, string>({
      query: name => `/version-group/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        order: number;
        generation: NamedAPIResource;
        versions: NamedAPIResource[];
        pokedexes: NamedAPIResource[];
      }): VersionGroup => ({
        id: res.id,
        name: res.name,
        order: res.order,
        generation: res.generation,
        versions: res.versions.map(v => v.name),
        pokedexes: res.pokedexes.map(p => p.name),
      }),
    }),
    /** Pokédex regional — entri dipadatkan jadi (nomor regional, id nasional, nama). */
    getPokedex: build.query<Pokedex, string>({
      query: name => `/pokedex/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        is_main_series: boolean;
        names: LocalizedName[];
        descriptions: LocalizedDescription[];
        region: NamedAPIResource | null;
        version_groups: NamedAPIResource[];
        pokemon_entries: {
          entry_number: number;
          pokemon_species: NamedAPIResource;
        }[];
      }): Pokedex => ({
        id: res.id,
        name: res.name,
        is_main_series: res.is_main_series,
        names: supportedOnly(res.names),
        descriptions: latestPerLanguage(res.descriptions),
        region: res.region,
        version_groups: res.version_groups.map(v => v.name),
        entries: res.pokemon_entries
          .map(e => ({
            number: e.entry_number,
            id: idFromUrl(e.pokemon_species.url),
            name: e.pokemon_species.name,
          }))
          .filter(e => e.id <= MAX_POKEMON_ID),
      }),
    }),
  }),
});

export const { useGetVersionGroupQuery, useGetPokedexQuery } = gameApi;
