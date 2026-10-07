import type {
  LocalizedEffect,
  LocalizedName,
  NamedAPIResource,
} from './common.types';

export interface ItemPrice {
  purchase: number | null;
  sell: number | null;
  currency: string;
  versionGroup: string;
}

export interface ItemFlavorText {
  text: string;
  language: NamedAPIResource;
}

/** `GET /item/{name}` — dipangkas. */
export interface Item {
  id: number;
  name: string;
  names: LocalizedName[];
  category: NamedAPIResource;
  attributes: NamedAPIResource[];
  fling_power: number | null;
  fling_effect: NamedAPIResource | null;
  effect_entries: LocalizedEffect[];
  flavor_text_entries: ItemFlavorText[];
  prices: ItemPrice[];
  heldBy: { id: number; name: string }[];
  sprite: string | null;
  firstGeneration: string | null;
}

/** `GET /item-pocket/{name}`. */
export interface ItemPocket {
  id: number;
  name: string;
  names: LocalizedName[];
  categories: string[];
}

/** `GET /item-category/{name}`. */
export interface ItemCategory {
  id: number;
  name: string;
  names: LocalizedName[];
  items: string[];
  pocket: string;
}

/** `GET /item-fling-effect/{name}`. */
export interface ItemFlingEffect {
  id: number;
  name: string;
  effect_entries: LocalizedEffect[];
  items: string[];
}

/** `GET /currency/{name}`. */
export interface Currency {
  id: number;
  name: string;
  names: LocalizedName[];
}
