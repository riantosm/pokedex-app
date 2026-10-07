import type {
  EvolutionChain,
  NamedAPIResource,
  NamedAPIResourceList,
  Pokemon,
  PokemonEncounterArea,
  PokemonForm,
  PokemonMoveEntry,
  PokemonMoveSet,
  PokemonSpecies,
  PokemonSummary,
  PokemonTypeName,
} from '@/types';
import { latestPerLanguage, supportedOnly } from '@/utils/i18n';
import { MAX_POKEMON_ID, idFromUrl, typeNames } from '@/utils/pokemon';
import { compareVersionGroupsNewestFirst } from '@/utils/labels';
import { pokeApi } from './pokeApi';

/** Bentuk mentah `moves[]` di `/pokemon/{id}` (hanya field yang dibaca). */
interface RawPokemonMoves {
  moves: {
    move: NamedAPIResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: NamedAPIResource;
      version_group: NamedAPIResource;
    }[];
  }[];
}

/** Bentuk mentah `/pokemon/{id}/encounters`. */
type RawEncounters = {
  location_area: NamedAPIResource;
  version_details: {
    version: NamedAPIResource;
    max_chance: number;
    encounter_details: {
      min_level: number;
      max_level: number;
      method: NamedAPIResource;
      condition_values: NamedAPIResource[];
    }[];
  }[];
}[];

export const pokemonApi = pokeApi.injectEndpoints({
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
    /**
     * Moves untuk tab Moves — endpoint sama dengan `getPokemon`, tapi hanya dimuat saat tab dibuka
     * dan disimpan padat: per grup versi → [move, metode, level].
     */
    getPokemonMoves: build.query<PokemonMoveSet, number>({
      query: id => `/pokemon/${id}`,
      transformResponse: (res: RawPokemonMoves): PokemonMoveSet => {
        const byVersionGroup: Record<string, PokemonMoveEntry[]> = {};
        const ids = new Map<string, number>();
        for (const m of res.moves) {
          for (const d of m.version_group_details) {
            const vg = d.version_group.name;
            ids.set(vg, idFromUrl(d.version_group.url));
            (byVersionGroup[vg] ??= []).push({
              move: m.move.name,
              method: d.move_learn_method.name,
              level: d.level_learned_at,
            });
          }
        }
        const versionGroups = [...ids.entries()]
          .map(([name, id]) => ({ name, id }))
          .sort((a, b) => compareVersionGroupsNewestFirst(a.name, b.name));
        return { versionGroups, byVersionGroup };
      },
    }),
    /** Lokasi encounter, dipadatkan per area → per versi (level min–maks, peluang maks). */
    getPokemonEncounters: build.query<PokemonEncounterArea[], number>({
      query: id => `/pokemon/${id}/encounters`,
      transformResponse: (res: RawEncounters): PokemonEncounterArea[] =>
        res.map(a => ({
          area: a.location_area.name,
          versions: a.version_details.map(v => ({
            version: v.version.name,
            maxChance: v.max_chance,
            minLevel: Math.min(...v.encounter_details.map(d => d.min_level)),
            maxLevel: Math.max(...v.encounter_details.map(d => d.max_level)),
            methods: [...new Set(v.encounter_details.map(d => d.method.name))],
            conditions: [
              ...new Set(
                v.encounter_details.flatMap(d =>
                  d.condition_values.map(c => c.name),
                ),
              ),
            ],
          })),
        })),
    }),
    /**
     * Tipe saja, untuk kartu di grid. Pakai `/pokemon-form/{id}` (±27 KB) alih-alih
     * `/pokemon/{id}` (sampai ±300 KB) — parse JSON besar di thread JS bikin scroll patah-patah.
     */
    getPokemonTypes: build.query<PokemonTypeName[], number>({
      query: id => `/pokemon-form/${id}`,
      transformResponse: (res: PokemonForm) => typeNames(res.types),
    }),
    getPokemonSpecies: build.query<PokemonSpecies, number | string>({
      query: idOrName => `/pokemon-species/${idOrName}`,
      transformResponse: (res: PokemonSpecies): PokemonSpecies => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        gender_rate: res.gender_rate,
        capture_rate: res.capture_rate,
        is_legendary: res.is_legendary,
        is_mythical: res.is_mythical,
        habitat: res.habitat,
        generation: res.generation,
        growth_rate: res.growth_rate,
        egg_groups: res.egg_groups,
        color: res.color,
        shape: res.shape,
        pokedex_numbers: res.pokedex_numbers,
        evolution_chain: res.evolution_chain,
        // Satu deskripsi (game terbaru) per bahasa — cukup untuk pengaturan bahasa data.
        flavor_text_entries: latestPerLanguage(res.flavor_text_entries),
        genera: supportedOnly(res.genera),
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
  useGetPokemonMovesQuery,
  useGetPokemonEncountersQuery,
  useGetPokemonTypesQuery,
  useGetPokemonSpeciesQuery,
  useGetEvolutionChainQuery,
} = pokemonApi;
