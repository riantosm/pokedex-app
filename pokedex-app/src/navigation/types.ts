import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PokemonTypeName, SpeciesGroupKind } from '@/types';
import type { ROUTES } from './paths';

export type MainTabParamList = {
  [ROUTES.POKEDEX]: undefined;
  [ROUTES.EXPLORE]: undefined;
  [ROUTES.FAVORITES]: undefined;
  [ROUTES.MORE]: undefined;
};

/** Jenis kelompok di layar Kelompok Pokémon (segmen). */
export type PokemonGroupKind = SpeciesGroupKind | 'gender';

/** Sumber daftar Pokémon generik (grid). */
export type PokemonCollectionSource =
  | 'move'
  | 'growth-rate'
  | 'evolution-trigger';

export type RootStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.MAIN_TABS]: NavigatorScreenParams<MainTabParamList> | undefined;
  /** `name` & `types` dikirim dari kartu supaya hero detail tampil sebelum data selesai dimuat. */
  [ROUTES.POKEMON_DETAIL]: {
    id: number;
    name: string;
    types?: PokemonTypeName[];
  };
  [ROUTES.TYPE_DETAIL]: { name: PokemonTypeName };
  [ROUTES.TYPES]: undefined;
  [ROUTES.MOVE_LIST]: undefined;
  [ROUTES.MOVE_DETAIL]: { name: string };
  [ROUTES.ITEM_LIST]: { pocket?: string } | undefined;
  [ROUTES.ITEM_DETAIL]: { name: string };
  [ROUTES.BERRY_LIST]: undefined;
  [ROUTES.BERRY_DETAIL]: { name: string };
  [ROUTES.REGION_LIST]: undefined;
  [ROUTES.REGION_DETAIL]: { name: string };
  [ROUTES.LOCATION_DETAIL]: { name: string };
  [ROUTES.PAL_PARK]: { area?: string } | undefined;
  [ROUTES.GAMES]: undefined;
  [ROUTES.POKEDEX_DETAIL]: { name?: string } | undefined;
  [ROUTES.POKEMON_GROUP]:
    | { kind?: PokemonGroupKind; name?: string }
    | undefined;
  [ROUTES.POKEMON_COLLECTION]: {
    source: PokemonCollectionSource;
    name: string;
    title: string;
  };
  [ROUTES.NATURES]: undefined;
  [ROUTES.GROWTH_RATE]: { name?: string } | undefined;
  [ROUTES.CONTESTS]: undefined;
  [ROUTES.EVOLUTION_TRIGGERS]: undefined;
  [ROUTES.ENCOUNTER_METHODS]: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<typeof ROUTES.MAIN_TABS>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
