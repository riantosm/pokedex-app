import type {
  ApiMeta,
  ContestType,
  EncounterCondition,
  EvolutionTrigger,
  EvolutionVariable,
  Language,
  LocalizedDescription,
  LocalizedName,
  NamedAPIResource,
} from '@/types';
import { latestPerLanguage, supportedOnly } from '@/utils/i18n';
import { MAX_POKEMON_ID, idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

const referenceApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getContestType: build.query<ContestType, string>({
      query: name => `/contest-type/${name}`,
      transformResponse: (res: ContestType): ContestType => ({
        id: res.id,
        name: res.name,
        berry_flavor: res.berry_flavor,
        names: supportedOnly(res.names),
      }),
    }),
    getEvolutionTrigger: build.query<EvolutionTrigger, string>({
      query: name => `/evolution-trigger/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        pokemon_species: NamedAPIResource[];
      }): EvolutionTrigger => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        speciesIds: res.pokemon_species
          .map(s => idFromUrl(s.url))
          .filter(id => id <= MAX_POKEMON_ID),
      }),
    }),
    getEvolutionVariable: build.query<EvolutionVariable, number>({
      query: id => `/evolution-variable/${id}`,
      transformResponse: (res: {
        id: number;
        name: string;
        symbol: string | null;
        names: LocalizedName[];
        descriptions: LocalizedDescription[];
      }): EvolutionVariable => ({
        id: res.id,
        name: res.name,
        symbol: res.symbol,
        names: supportedOnly(res.names),
        descriptions: latestPerLanguage(res.descriptions),
      }),
    }),
    getEncounterCondition: build.query<EncounterCondition, string>({
      query: name => `/encounter-condition/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        values: NamedAPIResource[];
      }): EncounterCondition => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        values: res.values.map(v => v.name),
      }),
    }),
    getLanguage: build.query<Language, string>({
      query: name => `/language/${name}`,
      transformResponse: (res: Language): Language => ({
        id: res.id,
        name: res.name,
        official: res.official,
      }),
    }),
    /** Info rilis data PokéAPI (`deploy_date` = detik Unix). */
    getMeta: build.query<ApiMeta, void>({
      query: () => '/meta/',
    }),
  }),
});

export const {
  useGetContestTypeQuery,
  useGetEvolutionTriggerQuery,
  useGetEvolutionVariableQuery,
  useGetEncounterConditionQuery,
  useGetLanguageQuery,
  useGetMetaQuery,
} = referenceApi;
