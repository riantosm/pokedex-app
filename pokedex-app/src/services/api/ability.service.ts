import type { Ability } from '@/types';
import { pokeApi } from './pokeApi';

const abilityApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getAbility: build.query<Ability, string>({
      query: name => `/ability/${name}`,
      transformResponse: (res: Ability): Ability => ({
        id: res.id,
        name: res.name,
        generation: res.generation,
        // Deskripsi ability di PokéAPI hanya lengkap dalam bahasa Inggris.
        effect_entries: res.effect_entries.filter(
          e => e.language.name === 'en',
        ),
      }),
    }),
  }),
});

export const { useGetAbilityQuery } = abilityApi;
