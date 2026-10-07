import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ellipsis, Heart, Shapes } from 'lucide-react-native';
import PokeballIcon from '@/components/atoms/PokeballIcon';
import TabBar from '@/components/organisms/TabBar';
import FavoriteList from '@/screens/FavoriteList';
import More from '@/screens/More';
import PokemonList from '@/screens/PokemonList';
import TypeList from '@/screens/TypeList';
import { ROUTES } from './paths';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconProps = { color: string; size: number };

const renderTabBar = (props: Parameters<typeof TabBar>[0]) => (
  <TabBar {...props} />
);
const pokedexIcon = ({ color, size }: TabIconProps) => (
  <PokeballIcon size={size} color={color} />
);
const typesIcon = ({ color, size }: TabIconProps) => (
  <Shapes size={size} color={color} />
);
const favoritesIcon = ({ color, size }: TabIconProps) => (
  <Heart size={size} color={color} />
);
const moreIcon = ({ color, size }: TabIconProps) => (
  <Ellipsis size={size} color={color} />
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, animation: 'shift' }}
      tabBar={renderTabBar}
    >
      <Tab.Screen
        name={ROUTES.POKEDEX}
        component={PokemonList}
        options={{
          tabBarLabel: 'Pokédex',
          tabBarIcon: pokedexIcon,
        }}
      />
      <Tab.Screen
        name={ROUTES.TYPES}
        component={TypeList}
        options={{
          tabBarLabel: 'Tipe',
          tabBarIcon: typesIcon,
        }}
      />
      <Tab.Screen
        name={ROUTES.FAVORITES}
        component={FavoriteList}
        options={{
          tabBarLabel: 'Favorit',
          tabBarIcon: favoritesIcon,
        }}
      />
      <Tab.Screen
        name={ROUTES.MORE}
        component={More}
        options={{
          tabBarLabel: 'Lainnya',
          tabBarIcon: moreIcon,
        }}
      />
    </Tab.Navigator>
  );
}
