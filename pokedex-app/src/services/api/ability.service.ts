import type { Ability } from '@/types';
import { latestPerLanguage, supportedOnly } from '@/utils/i18n';
import { pokeApi } from './pokeApi';

const abilityApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getAbility: build.query<Ability, string>({
      query: name => `/ability/${name}`,
      transformResponse: (res: Ability): Ability => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        generation: res.generation,
        // Efek lengkap hanya ada dalam en/de/fr; teks game (flavor) mengisi bahasa lainnya.
        effect_entries: latestPerLanguage(res.effect_entries),
        flavor_text_entries: latestPerLanguage(res.flavor_text_entries),
      }),
    }),
  }),
});

export const { useGetAbilityQuery } = abilityApi;
