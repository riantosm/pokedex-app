import { createApi } from '@reduxjs/toolkit/query/react';
import { REHYDRATE } from 'redux-persist';
import type { UnknownAction } from '@reduxjs/toolkit';
import { axiosBaseQuery } from './baseQuery';

/** Data PokéAPI hampir statis → cache 7 hari (fair-use policy PokéAPI mewajibkan cache). */
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

const isRehydrateAction = (
  action: UnknownAction,
): action is UnknownAction & {
  key: string;
  payload?: Record<string, unknown>;
} => action.type === REHYDRATE;

/**
 * API slice kosong. Setiap domain mendaftarkan endpoint-nya sendiri lewat
 * `pokeApi.injectEndpoints` di `<domain>.service.ts`.
 */
export const pokeApi = createApi({
  reducerPath: 'pokeApi',
  baseQuery: axiosBaseQuery(),
  keepUnusedDataFor: ONE_WEEK_IN_SECONDS,
  // Cache dipulihkan dari redux-persist supaya data yang pernah dibuka tetap ada saat offline.
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isRehydrateAction(action) && action.key === 'root') {
      return action.payload?.[reducerPath];
    }
  },
  endpoints: () => ({}),
});
