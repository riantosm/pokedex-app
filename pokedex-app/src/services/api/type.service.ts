import type {
  NamedAPIResource,
  PokemonTypeDetail,
  PokemonTypeName,
} from '@/types';
import { MAX_POKEMON_ID, idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

export const typeApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getType: build.query<PokemonTypeDetail, PokemonTypeName>({
      query: name => `/type/${name}`,
      transformResponse: (
        res: Omit<PokemonTypeDetail, 'moves'> & { moves: NamedAPIResource[] },
      ): PokemonTypeDetail => ({
        id: res.id,
        name: res.name,
        damage_relations: res.damage_relations,
        // Buang varian bentuk (id > 1025) supaya konsisten dengan index Pokédex.
        pokemon: res.pokemon.filter(
          p => idFromUrl(p.pokemon.url) <= MAX_POKEMON_ID,
        ),
        moves: res.moves.map(m => m.name),
      }),
    }),
  }),
});

export const { useGetTypeQuery } = typeApi;
