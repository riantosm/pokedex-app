import type { NamedAPIResource } from './common.types';

/** Syarat evolusi — hanya field yang ditampilkan app. */
export interface EvolutionDetail {
  trigger: NamedAPIResource;
  min_level: number | null;
  item: NamedAPIResource | null;
  held_item: NamedAPIResource | null;
  min_happiness: number | null;
  time_of_day: string;
}

/** Simpul pohon evolusi; `evolves_to` bisa bercabang (mis. Eevee). */
export interface ChainLink {
  is_baby: boolean;
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

/** `GET /evolution-chain/{id}`. */
export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}
