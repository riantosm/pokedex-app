import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PokemonDetail from '@/screens/PokemonDetail';
import Splash from '@/screens/Splash';
import TypeDetail from '@/screens/TypeDetail';
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
    </Stack.Navigator>
  );
}
