import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PokemonTypeName } from '@/types';
import type { ROUTES } from './paths';

export type MainTabParamList = {
  [ROUTES.POKEDEX]: undefined;
  [ROUTES.TYPES]: undefined;
  [ROUTES.FAVORITES]: undefined;
  [ROUTES.MORE]: undefined;
};

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
