import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
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
      <AppText variant="heroTitle" color={colors.white} style={styles.title}>
        Pokédex
      </AppText>
      <AppText variant="caption" color={colors.white} style={styles.caption}>
        Memuat data 1.025 Pokémon…
      </AppText>
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
    lineHeight: 44,
  },
  caption: {
    opacity: 0.8,
  },
});
