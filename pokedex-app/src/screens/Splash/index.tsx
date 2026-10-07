import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PokeballIcon from '@/components/atoms/PokeballIcon';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { colors } from '@/theme/colors';

/**
 * Muat index 1.025 Pokémon (dari cache atau jaringan), lalu masuk ke tab utama.
 * Gagal pun tetap lanjut — Home yang menampilkan state offline/error.
 */
export default function Splash({
  navigation,
}: RootStackScreenProps<typeof ROUTES.SPLASH>) {
  const { isSuccess, isError } = useGetPokemonIndexQuery();

  useEffect(() => {
    if (isSuccess || isError) {
      navigation.replace(ROUTES.MAIN_TABS);
    }
  }, [isSuccess, isError, navigation]);

  return (
    <View style={styles.root}>
      <PokeballIcon size={84} color={colors.white} strokeWidth={1.6} />
      <Text style={styles.title}>Pokédex</Text>
      <Text style={styles.caption}>Memuat data 1.025 Pokémon…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  caption: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.8,
  },
});
