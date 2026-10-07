import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BerryDetail from '@/screens/BerryDetail';
import BerryList from '@/screens/BerryList';
import Contests from '@/screens/Contests';
import EncounterMethods from '@/screens/EncounterMethods';
import EvolutionTriggers from '@/screens/EvolutionTriggers';
import Games from '@/screens/Games';
import GrowthRate from '@/screens/GrowthRate';
import ItemDetail from '@/screens/ItemDetail';
import ItemList from '@/screens/ItemList';
import LocationDetail from '@/screens/LocationDetail';
import MoveDetail from '@/screens/MoveDetail';
import MoveList from '@/screens/MoveList';
import Natures from '@/screens/Natures';
import PalPark from '@/screens/PalPark';
import PokedexDetail from '@/screens/PokedexDetail';
import PokemonCollection from '@/screens/PokemonCollection';
import PokemonDetail from '@/screens/PokemonDetail';
import PokemonGroup from '@/screens/PokemonGroup';
import RegionDetail from '@/screens/RegionDetail';
import RegionList from '@/screens/RegionList';
import Splash from '@/screens/Splash';
import TypeDetail from '@/screens/TypeDetail';
import TypeList from '@/screens/TypeList';
import MainTabNavigator from './MainTabNavigator';
import { ROUTES } from './paths';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SPLASH}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name={ROUTES.SPLASH}
        component={Splash}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name={ROUTES.MAIN_TABS}
        component={MainTabNavigator}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name={ROUTES.POKEMON_DETAIL} component={PokemonDetail} />
      <Stack.Screen name={ROUTES.TYPE_DETAIL} component={TypeDetail} />
      <Stack.Screen name={ROUTES.TYPES} component={TypeList} />
      <Stack.Screen name={ROUTES.MOVE_LIST} component={MoveList} />
      <Stack.Screen name={ROUTES.MOVE_DETAIL} component={MoveDetail} />
      <Stack.Screen name={ROUTES.ITEM_LIST} component={ItemList} />
      <Stack.Screen name={ROUTES.ITEM_DETAIL} component={ItemDetail} />
      <Stack.Screen name={ROUTES.BERRY_LIST} component={BerryList} />
      <Stack.Screen name={ROUTES.BERRY_DETAIL} component={BerryDetail} />
      <Stack.Screen name={ROUTES.REGION_LIST} component={RegionList} />
      <Stack.Screen name={ROUTES.REGION_DETAIL} component={RegionDetail} />
      <Stack.Screen name={ROUTES.LOCATION_DETAIL} component={LocationDetail} />
      <Stack.Screen name={ROUTES.PAL_PARK} component={PalPark} />
      <Stack.Screen name={ROUTES.GAMES} component={Games} />
      <Stack.Screen name={ROUTES.POKEDEX_DETAIL} component={PokedexDetail} />
      <Stack.Screen name={ROUTES.POKEMON_GROUP} component={PokemonGroup} />
      <Stack.Screen
        name={ROUTES.POKEMON_COLLECTION}
        component={PokemonCollection}
      />
      <Stack.Screen name={ROUTES.NATURES} component={Natures} />
      <Stack.Screen name={ROUTES.GROWTH_RATE} component={GrowthRate} />
      <Stack.Screen name={ROUTES.CONTESTS} component={Contests} />
      <Stack.Screen
        name={ROUTES.EVOLUTION_TRIGGERS}
        component={EvolutionTriggers}
      />
      <Stack.Screen
        name={ROUTES.ENCOUNTER_METHODS}
        component={EncounterMethods}
      />
    </Stack.Navigator>
  );
}
