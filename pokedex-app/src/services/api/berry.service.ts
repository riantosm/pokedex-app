import type {
  Berry,
  BerryFlavor,
  LocalizedName,
  NamedAPIResource,
} from '@/types';
import { supportedOnly } from '@/utils/i18n';
import { pokeApi } from './pokeApi';

const berryApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getBerry: build.query<Berry, string>({
      query: name => `/berry/${name}`,
    }),
    getBerryFlavor: build.query<BerryFlavor, string>({
      query: name => `/berry-flavor/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        contest_type: NamedAPIResource;
        berries: { potency: number; berry: NamedAPIResource }[];
      }): BerryFlavor => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        contest_type: res.contest_type,
        berries: res.berries.map(b => ({
          potency: b.potency,
          berry: b.berry.name,
        })),
      }),
    }),
    getBerryFirmness: build.query<
      { name: string; names: LocalizedName[] },
      string
    >({
      query: name => `/berry-firmness/${name}`,
      transformResponse: (res: { name: string; names: LocalizedName[] }) => ({
        name: res.name,
        names: supportedOnly(res.names),
      }),
    }),
  }),
});

export const {
  useGetBerryQuery,
  useGetBerryFlavorQuery,
  useGetBerryFirmnessQuery,
} = berryApi;
