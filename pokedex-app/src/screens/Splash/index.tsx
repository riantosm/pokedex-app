import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '@/components/atoms/AppText';
import PokeballIcon from '@/components/atoms/PokeballIcon';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

/**
 * Muat index 1.025 Pokémon (dari cache atau jaringan), lalu masuk ke tab utama.
 * Gagal pun tetap lanjut — Home yang menampilkan state offline/error.
 */
export default function Splash({
  navigation,
}: RootStackScreenProps<typeof ROUTES.SPLASH>) {
  const insets = useSafeAreaInsets();
  const { isSuccess, isError } = useGetPokemonIndexQuery();
  // Satu request tanpa info progres → bar maju pelan sampai 90%, penuh saat selesai.
  const progress = useSharedValue(0);
  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  useEffect(() => {
    progress.value = withTiming(0.9, {
      duration: 2400,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  useEffect(() => {
    if (isSuccess || isError) {
      progress.value = withTiming(1, { duration: 150 });
      navigation.replace(ROUTES.MAIN_TABS);
    }
  }, [isSuccess, isError, navigation, progress]);

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <PokeballIcon size={84} color={colors.white} strokeWidth={1.6} />
        <AppText variant="heroTitle" color={colors.white} style={styles.title}>
          Pokédex
        </AppText>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 48 }]}>
        <View style={styles.track}>
          <Animated.View style={[styles.bar, barStyle]} />
        </View>
        <AppText variant="caption" color={colors.white} style={styles.caption}>
          Memuat data 1.025 Pokémon…
        </AppText>
        <AppText variant="micro" color={colors.white} style={styles.credit}>
          Data dari PokéAPI
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand,
  },
  center: {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    gap: 12,
    alignItems: 'center',
    paddingHorizontal: 64,
  },
  track: {
    alignSelf: 'stretch',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.splashTrack,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
  },
  caption: {
    opacity: 0.8,
  },
  credit: {
    fontFamily: fonts.regular,
    opacity: 0.55,
  },
});
