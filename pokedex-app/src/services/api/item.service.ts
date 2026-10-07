import type {
  Currency,
  Item,
  ItemCategory,
  ItemFlavorText,
  ItemFlingEffect,
  ItemPocket,
  LocalizedEffect,
  LocalizedName,
  NamedAPIResource,
} from '@/types';
import { latestPerLanguage, supportedOnly } from '@/utils/i18n';
import { idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

interface RawItem {
  id: number;
  name: string;
  names: LocalizedName[];
  category: NamedAPIResource;
  attributes: NamedAPIResource[];
  fling_power: number | null;
  fling_effect: NamedAPIResource | null;
  effect_entries: LocalizedEffect[];
  flavor_text_entries: ItemFlavorText[];
  prices?: {
    purchase_price: number | null;
    sell_price: number | null;
    currency: NamedAPIResource;
    version_group: NamedAPIResource;
  }[];
  held_by_pokemon: { pokemon: NamedAPIResource }[];
  sprites: { default: string | null };
  game_indices: { generation: NamedAPIResource }[];
}

export const itemApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    getItem: build.query<Item, string>({
      query: name => `/item/${name}`,
      transformResponse: (res: RawItem): Item => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        category: res.category,
        attributes: res.attributes,
        fling_power: res.fling_power,
        fling_effect: res.fling_effect,
        effect_entries: latestPerLanguage(res.effect_entries),
        flavor_text_entries: latestPerLanguage(res.flavor_text_entries),
        // `prices` (bukan `cost`): per grup versi; banyak item tanpa data harga.
        prices: (res.prices ?? []).map(p => ({
          purchase: p.purchase_price,
          sell: p.sell_price,
          currency: p.currency.name,
          versionGroup: p.version_group.name,
        })),
        heldBy: res.held_by_pokemon.map(h => ({
          id: idFromUrl(h.pokemon.url),
          name: h.pokemon.name,
        })),
        sprite: res.sprites.default,
        firstGeneration: res.game_indices[0]?.generation.name ?? null,
      }),
    }),
    getItemPocket: build.query<ItemPocket, string>({
      query: name => `/item-pocket/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        categories: NamedAPIResource[];
      }): ItemPocket => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        categories: res.categories.map(c => c.name),
      }),
    }),
    getItemCategory: build.query<ItemCategory, string>({
      query: name => `/item-category/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        names: LocalizedName[];
        items: NamedAPIResource[];
        pocket: NamedAPIResource;
      }): ItemCategory => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        items: res.items.map(i => i.name),
        pocket: res.pocket.name,
      }),
    }),
    getItemFlingEffect: build.query<ItemFlingEffect, string>({
      query: name => `/item-fling-effect/${name}`,
      transformResponse: (res: {
        id: number;
        name: string;
        effect_entries: LocalizedEffect[];
        items: NamedAPIResource[];
      }): ItemFlingEffect => ({
        id: res.id,
        name: res.name,
        effect_entries: latestPerLanguage(res.effect_entries),
        items: res.items.map(i => i.name),
      }),
    }),
    getItemAttribute: build.query<
      { name: string; names: LocalizedName[] },
      string
    >({
      query: name => `/item-attribute/${name}`,
      transformResponse: (res: { name: string; names: LocalizedName[] }) => ({
        name: res.name,
        names: supportedOnly(res.names),
      }),
    }),
    getCurrency: build.query<Currency, string>({
      query: name => `/currency/${name}`,
      transformResponse: (res: Currency): Currency => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
      }),
    }),
  }),
});

export const {
  useGetItemQuery,
  useGetItemPocketQuery,
  useGetItemCategoryQuery,
  useGetItemFlingEffectQuery,
  useGetItemAttributeQuery,
  useGetCurrencyQuery,
} = itemApi;
