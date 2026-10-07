import type { NamedAPIResource } from './common.types';

/** 18 tipe yang dipakai di game utama (`unknown`, `stellar`, `shadow` dibuang). */
export const POKEMON_TYPE_NAMES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
] as const;

export type PokemonTypeName = (typeof POKEMON_TYPE_NAMES)[number];

/** `damage_relations` dari `GET /type/{name}`. */
export interface TypeRelations {
  no_damage_to: NamedAPIResource[];
  half_damage_to: NamedAPIResource[];
  double_damage_to: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  double_damage_from: NamedAPIResource[];
}

export interface TypePokemon {
  slot: number;
  pokemon: NamedAPIResource;
}

/** `GET /type/{name}` — hanya field yang dipakai app. */
export interface PokemonTypeDetail {
  id: number;
  name: string;
  damage_relations: TypeRelations;
  pokemon: TypePokemon[];
}
