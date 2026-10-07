import type {
  EvolutionChain,
  NamedAPIResourceList,
  Pokemon,
  PokemonSpecies,
  PokemonSummary,
} from '@/types';
import { MAX_POKEMON_ID, idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

const pokemonApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    /** Index 1.025 Pokémon nasional — dasar pencarian, filter, dan urut (semua lokal). */
    getPokemonIndex: build.query<PokemonSummary[], void>({
      query: () => ({
        url: '/pokemon',
        params: { limit: MAX_POKEMON_ID, offset: 0 },
      }),
      transformResponse: (res: NamedAPIResourceList) =>
        res.results.map(r => ({ id: idFromUrl(r.url), name: r.name })),
    }),
    getPokemon: build.query<Pokemon, number | string>({
      query: idOrName => `/pokemon/${idOrName}`,
      // Response asli memuat ratusan `moves` & `game_indices` — buang supaya cache tetap kecil.
      transformResponse: (res: Pokemon): Pokemon => ({
        id: res.id,
        name: res.name,
        height: res.height,
        weight: res.weight,
        types: res.types,
        stats: res.stats,
        abilities: res.abilities,
        species: res.species,
      }),
    }),
    getPokemonSpecies: build.query<PokemonSpecies, number | string>({
      query: idOrName => `/pokemon-species/${idOrName}`,
      transformResponse: (res: PokemonSpecies): PokemonSpecies => ({
        id: res.id,
        name: res.name,
        gender_rate: res.gender_rate,
        capture_rate: res.capture_rate,
        is_legendary: res.is_legendary,
        is_mythical: res.is_mythical,
        habitat: res.habitat,
        generation: res.generation,
        growth_rate: res.growth_rate,
        egg_groups: res.egg_groups,
        evolution_chain: res.evolution_chain,
        flavor_text_entries: res.flavor_text_entries.filter(
          e => e.language.name === 'en',
        ),
        genera: res.genera.filter(g => g.language.name === 'en'),
      }),
    }),
    getEvolutionChain: build.query<EvolutionChain, number>({
      query: id => `/evolution-chain/${id}`,
    }),
  }),
});

export const {
  useGetPokemonIndexQuery,
  useGetPokemonQuery,
  useGetPokemonSpeciesQuery,
  useGetEvolutionChainQuery,
} = pokemonApi;
