import { useCallback } from 'react';
import {
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import EmptyState from '@/components/molecules/EmptyState';
import PokemonCard from '@/components/molecules/PokemonCard';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { ROUTES } from '@/navigation/paths';
import type { MainTabScreenProps } from '@/navigation/types';
import { pokemonApi } from '@/services/api/pokemon.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectFavorites, syncFavorites } from '@/store/slices/favoritesSlice';
import { colors } from '@/theme/colors';
import type { FavoritePokemon } from '@/types';
import { formatCount } from '@/utils/format';
import { gridItemEntering } from '@/utils/motion';
import { typeNames } from '@/utils/pokemon';

const H_PADDING = 20;
const GAP = 12;

export default function FavoriteList({
  navigation,
}: MainTabScreenProps<typeof ROUTES.FAVORITES>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP) / 2;
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);

  // Refresh = ambil ulang data tiap favorit, lalu perbarui nama/tipe yang tersimpan.
  const resync = useCallback(async () => {
    const requests = favorites.map(f =>
      dispatch(
        pokemonApi.endpoints.getPokemon.initiate(f.id, { forceRefetch: true }),
      ),
    );
    const results = await Promise.allSettled(requests.map(r => r.unwrap()));
    requests.forEach(r => r.unsubscribe());
    const fresh = results.flatMap(r =>
      r.status === 'fulfilled'
        ? [
            {
              id: r.value.id,
              name: r.value.name,
              types: typeNames(r.value.types),
            },
          ]
        : [],
    );
    dispatch(syncFavorites(fresh));
  }, [dispatch, favorites]);
  const { refreshing, refresh } = useRefresh([resync]);

  const open = (p: FavoritePokemon) =>
    navigation.navigate(ROUTES.POKEMON_DETAIL, {
      id: p.id,
      name: p.name,
      types: p.types,
    });

  return (
    <View style={styles.root}>
      <Animated.FlatList
        data={favorites}
        keyExtractor={p => String(p.id)}
        numColumns={2}
        itemLayoutAnimation={LinearTransition.duration(240)}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={gridItemEntering(index)}
            exiting={FadeOut.duration(180)}
            style={{ width: cardWidth }}
          >
            <PokemonCard
              id={item.id}
              name={item.name}
              types={item.types}
              onPress={() => open(item)}
            />
          </Animated.View>
        )}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="screenTitle" accessibilityRole="header">
              Favorit
            </AppText>
            {favorites.length > 0 && (
              <AppText variant="caption" color={colors.ink3}>
                {formatCount(favorites.length)} Pokémon tersimpan di perangkat
                ini
              </AppText>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Heart size={30} color={colors.ink3} />}
            title="Belum ada favorit"
            body="Ketuk ikon hati di halaman detail Pokémon untuk menyimpannya di sini. Favorit tetap ada meski sedang offline."
            actionLabel="Jelajahi Pokédex"
            actionVariant="primary"
            onAction={() => navigation.navigate(ROUTES.POKEDEX)}
          />
        }
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: bottomInset },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.brand]}
            tintColor={colors.brand}
            progressViewOffset={insets.top}
          />
        }
      />
      <StatusBarScrim />
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: H_PADDING,
  },
  header: {
    gap: 4,
    paddingBottom: 20,
  },
  row: {
    gap: GAP,
  },
  separator: {
    height: GAP,
  },
});
