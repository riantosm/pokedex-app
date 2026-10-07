import type { Characteristic, Nature, Stat } from '@/types';
import { latestPerLanguage, supportedOnly } from '@/utils/i18n';
import { pokeApi } from './pokeApi';

const natureApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getNature: build.query<Nature, string>({
      query: name => `/nature/${name}`,
      transformResponse: (res: Nature): Nature => ({
        ...res,
        names: supportedOnly(res.names),
      }),
    }),
    /** Stat: nature & move yang menaikkan/menurunkan + karakteristik (untuk sheet Stat). */
    getStat: build.query<Stat, string>({
      query: name => `/stat/${name}`,
      transformResponse: (res: Stat): Stat => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        affecting_moves: res.affecting_moves,
        affecting_natures: res.affecting_natures,
        characteristics: res.characteristics,
      }),
    }),
    getCharacteristic: build.query<Characteristic, number>({
      query: id => `/characteristic/${id}`,
      transformResponse: (res: Characteristic): Characteristic => ({
        id: res.id,
        gene_modulo: res.gene_modulo,
        possible_values: res.possible_values,
        descriptions: latestPerLanguage(res.descriptions),
      }),
    }),
  }),
});

export const { useGetNatureQuery, useGetStatQuery, useGetCharacteristicQuery } =
  natureApi;
