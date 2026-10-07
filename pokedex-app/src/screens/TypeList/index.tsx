import { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '@/components/atoms/AppText';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { ROUTES } from '@/navigation/paths';
import type { MainTabScreenProps } from '@/navigation/types';
import { typeApi } from '@/services/api/type.service';
import { useAppDispatch } from '@/store/hooks';
import { colors } from '@/theme/colors';
import { POKEMON_TYPE_NAMES, type PokemonTypeName } from '@/types';
import TypeTile from './TypeTile';

const H_PADDING = 20;
const GAP = 12;

export default function TypeList({
  navigation,
}: MainTabScreenProps<typeof ROUTES.TYPES>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const { width } = useWindowDimensions();
  const tileWidth = (width - H_PADDING * 2 - GAP) / 2;

  const dispatch = useAppDispatch();

  // Refresh = paksa ambil ulang 18 tipe (sumber jumlah Pokémon per tipe).
  const refetchTypes = useCallback(async () => {
    const requests = POKEMON_TYPE_NAMES.map(t =>
      dispatch(typeApi.endpoints.getType.initiate(t, { forceRefetch: true })),
    );
    await Promise.allSettled(requests);
    requests.forEach(r => r.unsubscribe());
  }, [dispatch]);
  const { refreshing, refresh } = useRefresh([refetchTypes]);

  const openType = useCallback(
    (type: PokemonTypeName) =>
      navigation.navigate(ROUTES.TYPE_DETAIL, { name: type }),
    [navigation],
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={POKEMON_TYPE_NAMES}
        keyExtractor={t => t}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TypeTile
            type={item}
            index={index}
            width={tileWidth}
            onPress={openType}
          />
        )}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="screenTitle" accessibilityRole="header">
              Tipe
            </AppText>
            <AppText variant="caption" color={colors.ink3}>
              18 tipe · ketuk untuk melihat kekuatan & kelemahannya
            </AppText>
          </View>
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
