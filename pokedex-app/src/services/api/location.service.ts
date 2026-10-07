import type {
  LocalizedName,
  Location,
  LocationArea,
  NamedAPIResource,
  PalParkArea,
  Region,
} from '@/types';
import { supportedOnly } from '@/utils/i18n';
import { MAX_POKEMON_ID, idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

interface RawArea {
  id: number;
  name: string;
  names: LocalizedName[];
  location: NamedAPIResource;
  pokemon_encounters: {
    pokemon: NamedAPIResource;
    version_details: {
      version: NamedAPIResource;
      max_chance: number;
      encounter_details: {
        min_level: number;
        max_level: number;
        method: NamedAPIResource;
      }[];
    }[];
  }[];
}

function toLocationArea(res: RawArea): LocationArea {
  return {
    id: res.id,
    name: res.name,
    names: supportedOnly(res.names),
    location: res.location,
    encounters: res.pokemon_encounters
      .map(e => ({
        id: idFromUrl(e.pokemon.url),
        name: e.pokemon.name,
        versions: e.version_details.map(v => ({
          version: v.version.name,
          maxChance: v.max_chance,
          minLevel: Math.min(...v.encounter_details.map(d => d.min_level)),
          maxLevel: Math.max(...v.encounter_details.map(d => d.max_level)),
          methods: [...new Set(v.encounter_details.map(d => d.method.name))],
        })),
      }))
      .filter(e => e.id <= MAX_POKEMON_ID),
  };
}

const locationApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getRegion: build.query<Region, string>({
      query: name => `/region/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        main_generation: NamedAPIResource | null;
        locations: NamedAPIResource[];
        pokedexes: NamedAPIResource[];
        version_groups: NamedAPIResource[];
      }): Region => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        main_generation: res.main_generation,
        locations: res.locations.map(l => l.name),
        pokedexes: res.pokedexes.map(p => p.name),
        version_groups: res.version_groups.map(v => v.name),
      }),
    }),
    getLocation: build.query<Location, string>({
      query: name => `/location/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        region: NamedAPIResource | null;
        areas: NamedAPIResource[];
        game_indices: { generation: NamedAPIResource }[];
      }): Location => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        region: res.region,
        areas: res.areas.map(a => a.name),
        generations: res.game_indices.map(g => g.generation.name),
      }),
    }),
    /** Encounter per area dipadatkan per versi (level min–maks, peluang maks, metode). */
    getLocationArea: build.query<LocationArea, string>({
      query: name => `/location-area/${name}`,
      transformResponse: toLocationArea,
    }),
    /**
     * Semua area satu lokasi sekaligus (arg = nama area dipisah koma) — Detail Lokasi butuh
     * gabungan versi dari semua area untuk chip versi.
     */
    getLocationAreas: build.query<LocationArea[], string>({
      async queryFn(names, _api, _extra, baseQuery) {
        const results = await Promise.all(
          names
            .split(',')
            .filter(Boolean)
            .map(name => baseQuery(`/location-area/${name}`)),
        );
        const failed = results.find(r => r.error);
        if (failed?.error) {
          return { error: failed.error };
        }
        return { data: results.map(r => toLocationArea(r.data as RawArea)) };
      },
    }),
    getPalParkArea: build.query<PalParkArea, string>({
      query: name => `/pal-park-area/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        pokemon_encounters: {
          base_score: number;
          rate: number;
          pokemon_species: NamedAPIResource;
        }[];
      }): PalParkArea => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        encounters: res.pokemon_encounters
          .map(e => ({
            id: idFromUrl(e.pokemon_species.url),
            name: e.pokemon_species.name,
            baseScore: e.base_score,
            rate: e.rate,
          }))
          .sort((a, b) => a.id - b.id),
      }),
    }),
  }),
});

export const {
  useGetRegionQuery,
  useGetLocationQuery,
  useGetLocationAreaQuery,
  useGetLocationAreasQuery,
  useGetPalParkAreaQuery,
} = locationApi;
