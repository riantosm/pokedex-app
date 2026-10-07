import type {
  NamedAPIResourceList,
  PokemonTypeDetail,
  PokemonTypeName,
} from '@/types';
import { MAX_POKEMON_ID, idFromUrl, isPokemonTypeName } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

export const typeApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    /** 18 tipe game utama (`unknown`, `stellar`, `shadow` dibuang). */
    getTypes: build.query<PokemonTypeName[], void>({
      query: () => '/type',
      transformResponse: (res: NamedAPIResourceList) =>
        res.results.map(r => r.name).filter(isPokemonTypeName),
    }),
    getType: build.query<PokemonTypeDetail, PokemonTypeName>({
      query: name => `/type/${name}`,
      transformResponse: (res: PokemonTypeDetail): PokemonTypeDetail => ({
        id: res.id,
        name: res.name,
        damage_relations: res.damage_relations,
        // Buang varian bentuk (id > 1025) supaya konsisten dengan index Pokédex.
        pokemon: res.pokemon.filter(
          p => idFromUrl(p.pokemon.url) <= MAX_POKEMON_ID,
        ),
      }),
    }),
  }),
});

export const { useGetTypesQuery, useGetTypeQuery } = typeApi;
