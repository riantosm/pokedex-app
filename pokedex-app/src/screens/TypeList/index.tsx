import { useCallback } from 'react';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import ScreenList from '@/components/organisms/ScreenList';
import { useGridWidth } from '@/hooks/useGridWidth';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { typeApi } from '@/services/api/type.service';
import { useAppDispatch } from '@/store/hooks';
import { POKEMON_TYPE_NAMES, type PokemonTypeName } from '@/types';
import TypeTile from './TypeTile';

/** Daftar 18 tipe — dibuka dari tile Tipe di Jelajah (v2: bukan tab lagi). */
export default function TypeList({
  navigation,
}: RootStackScreenProps<typeof ROUTES.TYPES>) {
  useStatusBarStyle('dark-content');
  const tileWidth = useGridWidth(2);
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
    <ScreenList
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
      header={
        <ScreenHeader
          title="Tipe"
          subtitle="18 tipe · ketuk untuk melihat kekuatan & kelemahannya"
          onBack={navigation.goBack}
        />
      }
      refreshing={refreshing}
      onRefresh={refresh}
    />
  );
}
