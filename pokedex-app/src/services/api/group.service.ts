import type {
  Gender,
  GrowthRate,
  LocalizedDescription,
  LocalizedName,
  NamedAPIResource,
  SpeciesGroup,
  SpeciesGroupKind,
} from '@/types';
import { latestPerLanguage, supportedOnly } from '@/utils/i18n';
import { MAX_POKEMON_ID, idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

const speciesIds = (list: NamedAPIResource[]) =>
  list
    .map(s => idFromUrl(s.url))
    .filter(id => id <= MAX_POKEMON_ID)
    .sort((a, b) => a - b);

const groupApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    /** Egg group, warna, bentuk, habitat — semuanya berisi daftar spesies. */
    getSpeciesGroup: build.query<
      SpeciesGroup,
      { kind: SpeciesGroupKind; name: string }
    >({
      query: ({ kind, name }) => `/${kind}/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        pokemon_species: NamedAPIResource[];
      }): SpeciesGroup => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        speciesIds: speciesIds(res.pokemon_species),
      }),
    }),
    getGender: build.query<Gender, 'female' | 'male' | 'genderless'>({
      query: name => `/gender/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        pokemon_species_details: {
          rate: number;
          pokemon_species: NamedAPIResource;
        }[];
        required_for_evolution: NamedAPIResource[];
      }): Gender => ({
        id: res.id,
        name: res.name,
        species: res.pokemon_species_details
          .map(d => ({ id: idFromUrl(d.pokemon_species.url), rate: d.rate }))
          .filter(d => d.id <= MAX_POKEMON_ID),
        requiredForEvolution: speciesIds(res.required_for_evolution),
      }),
    }),
    getGrowthRate: build.query<GrowthRate, string>({
      query: name => `/growth-rate/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        formula: string;
        descriptions: LocalizedDescription[];
        levels: { level: number; experience: number }[];
        pokemon_species: NamedAPIResource[];
      }): GrowthRate => ({
        id: res.id,
        name: res.name,
        formula: res.formula,
        descriptions: latestPerLanguage(res.descriptions),
        levels: res.levels,
        speciesIds: speciesIds(res.pokemon_species),
      }),
    }),
  }),
});

export const {
  useGetSpeciesGroupQuery,
  useGetGenderQuery,
  useGetGrowthRateQuery,
} = groupApi;
