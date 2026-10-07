import type { NamedAPIResourceList } from '@/types';
import { idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

/** Resource PokéAPI yang daftarnya dipakai app (`GET /{resource}?limit=…`). */
export type ResourceName =
  | 'move'
  | 'item'
  | 'berry'
  | 'region'
  | 'pal-park-area'
  | 'generation'
  | 'pokedex'
  | 'egg-group'
  | 'pokemon-color'
  | 'pokemon-shape'
  | 'pokemon-habitat'
  | 'growth-rate'
  | 'nature'
  | 'item-pocket'
  | 'contest-type'
  | 'evolution-trigger'
  | 'evolution-variable'
  | 'encounter-method'
  | 'encounter-condition'
  | 'language'
  | 'location'
  | 'version'
  | 'version-group'
  | 'stat'
  | 'item-fling-effect';

export interface ResourceRef {
  id: number;
  name: string;
}

/** Cukup besar untuk resource terbesar (`item`: 2.223). */
const LIST_LIMIT = 3000;

const resourceApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    /**
     * Index nama + id untuk satu resource. Seperti index Pokédex: cari, filter, dan paginasi
     * berjalan lokal; detail tiap baris dimuat lazy saat tampil.
     */
    getResourceIndex: build.query<ResourceRef[], ResourceName>({
      query: resource => ({
        url: `/${resource}`,
        params: { limit: LIST_LIMIT },
      }),
      transformResponse: (res: NamedAPIResourceList) =>
        res.results.map(r => ({ id: idFromUrl(r.url), name: r.name })),
    }),
    /** Jumlah resource saja (`?limit=1`) — untuk angka di hub Jelajah tanpa mengunduh daftarnya. */
    getResourceCount: build.query<number, ResourceName>({
      query: resource => ({ url: `/${resource}`, params: { limit: 1 } }),
      transformResponse: (res: NamedAPIResourceList) => res.count,
    }),
  }),
});

export const { useGetResourceIndexQuery, useGetResourceCountQuery } =
  resourceApi;
