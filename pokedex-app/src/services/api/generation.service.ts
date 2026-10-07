import type { Generation } from '@/types';
import { pokeApi } from './pokeApi';

const generationApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    /** `id` 1–9. Dipakai filter generasi di Pokédex. */
    getGeneration: build.query<Generation, number>({
      query: id => `/generation/${id}`,
      transformResponse: (res: Generation): Generation => ({
        id: res.id,
        name: res.name,
        main_region: res.main_region,
        pokemon_species: res.pokemon_species,
      }),
    }),
  }),
});

export const { useGetGenerationQuery } = generationApi;
