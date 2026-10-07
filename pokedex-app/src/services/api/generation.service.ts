import type { Generation, LocalizedName, NamedAPIResource } from '@/types';
import { supportedOnly } from '@/utils/i18n';
import { pokeApi } from './pokeApi';

interface RawGeneration {
  id: number;
  name: string;
  names: LocalizedName[];
  main_region: NamedAPIResource;
  pokemon_species: NamedAPIResource[];
  version_groups: NamedAPIResource[];
  moves: NamedAPIResource[];
}

const generationApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    /** `id` 1–9. Dipakai filter generasi di Pokédex & halaman Game & generasi. */
    getGeneration: build.query<Generation, number>({
      query: id => `/generation/${id}`,
      transformResponse: (res: RawGeneration): Generation => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        main_region: res.main_region,
        pokemon_species: res.pokemon_species,
        version_groups: res.version_groups.map(v => v.name),
        movesCount: res.moves.length,
      }),
    }),
  }),
});

export const { useGetGenerationQuery } = generationApi;
