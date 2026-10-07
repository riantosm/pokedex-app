import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import EmptyState from '@/components/molecules/EmptyState';
import PokemonCardSkeleton from '@/components/molecules/PokemonCardSkeleton';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import ScreenList from '@/components/organisms/ScreenList';
import { useGridWidth } from '@/hooks/useGridWidth';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetGrowthRateQuery } from '@/services/api/group.service';
import { useGetMoveQuery } from '@/services/api/move.service';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { useGetEvolutionTriggerQuery } from '@/services/api/reference.service';
import { colors } from '@/theme/colors';
import type { PokemonTypeName } from '@/types';
import { formatCount } from '@/utils/format';
import PokemonGridCell from '../shared/PokemonGridCell';

type Entry = { id: number; name: string };

const PAGE_SIZE = 24;

const SUBTITLE = {
  move: 'bisa mempelajari move ini',
  'growth-rate': 'memakai growth rate ini',
  'evolution-trigger': 'berevolusi dengan cara ini',
} as const;

/** Grid Pokémon dari sumber lain: pembelajar move, growth rate, atau pemicu evolusi. */
export default function PokemonCollection({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.POKEMON_COLLECTION>) {
  const { source, name, title } = route.params;
  useStatusBarStyle('dark-content');
  const cardWidth = useGridWidth(2);
  const seenIds = useState(() => new Set<number>())[0];

  const move = useGetMoveQuery(name, { skip: source !== 'move' });
  const growth = useGetGrowthRateQuery(name, {
    skip: source !== 'growth-rate',
  });
  const trigger = useGetEvolutionTriggerQuery(name, {
    skip: source !== 'evolution-trigger',
  });
  const query =
    source === 'move' ? move : source === 'growth-rate' ? growth : trigger;
  const pokemonIndex = useGetPokemonIndexQuery();
  const { refreshing, refresh } = useRefresh([query.refetch]);

  const ids: number[] | null =
    source === 'move'
      ? move.data?.learnedBy ?? null
      : source === 'growth-rate'
      ? growth.data?.speciesIds ?? null
      : trigger.data?.speciesIds ?? null;

  const entries = useMemo<Entry[]>(() => {
    const names = new Map(pokemonIndex.data?.map(p => [p.id, p.name]));
    return [...(ids ?? [])]
      .sort((a, b) => a - b)
      .map(id => ({ id, name: names.get(id) ?? String(id) }));
  }, [ids, pokemonIndex.data]);
  const { visible, loadMore } = usePagedList(entries, PAGE_SIZE);

  const openPokemon = useCallback(
    (id: number, pokemonName: string, types?: PokemonTypeName[]) =>
      navigation.push(ROUTES.POKEMON_DETAIL, { id, name: pokemonName, types }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Entry; index: number }) => (
      <PokemonGridCell
        id={item.id}
        name={item.name}
        index={index}
        width={cardWidth}
        seenIds={seenIds}
        onPress={openPokemon}
      />
    ),
    [cardWidth, seenIds, openPokemon],
  );

  const empty =
    query.isError && !ids ? (
      <EmptyState
        icon={<WifiOff size={30} color={colors.ink3} />}
        title="Daftar gagal dimuat"
        body="Data belum tersimpan dan perangkat sedang offline."
        actionLabel="Coba lagi"
        actionVariant="primary"
        onAction={refresh}
      />
    ) : ids ? (
      <EmptyState
        icon={<WifiOff size={30} color={colors.ink3} />}
        title="Tidak ada Pokémon"
        body="PokéAPI tidak mencatat Pokémon untuk data ini."
      />
    ) : (
      <View style={styles.skeleton}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={{ width: cardWidth }}>
            <PokemonCardSkeleton />
          </View>
        ))}
      </View>
    );

  return (
    <ScreenList
      data={visible}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      header={
        <ScreenHeader
          title={title}
          subtitle={
            ids
              ? `${formatCount(ids.length)} Pokémon ${SUBTITLE[source]}`
              : 'Memuat…'
          }
          onBack={navigation.goBack}
        />
      }
      empty={empty}
      refreshing={refreshing}
      onRefresh={refresh}
      onEndReached={loadMore}
      numColumns={2}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
