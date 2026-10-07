import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import { SearchX, WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Skeleton from '@/components/atoms/Skeleton';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import SearchField from '@/components/molecules/SearchField';
import TypeChip from '@/components/molecules/TypeChip';
import ScreenList from '@/components/organisms/ScreenList';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetItemPocketQuery } from '@/services/api/item.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import { formatCount } from '@/utils/format';
import {
  compareItemPockets,
  itemPocketLabel,
  sortItemCategories,
} from '@/utils/labels';
import { matchesQuery } from '@/utils/search';
import CategorySection from './CategorySection';
import ItemRow from './ItemRow';

type Row = { kind: 'category'; name: string } | { kind: 'item'; name: string };

export default function ItemList({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.ITEM_LIST>) {
  useStatusBarStyle('dark-content');
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query.trim());
  const [pocket, setPocket] = useState(route.params?.pocket ?? 'pokeballs');

  const index = useGetResourceIndexQuery('item');
  const pockets = useGetResourceIndexQuery('item-pocket');
  const pocketQuery = useGetItemPocketQuery(debounced ? skipToken : pocket);
  const { refreshing, refresh } = useRefresh([
    index.refetch,
    pockets.refetch,
    ...(!debounced ? [pocketQuery.refetch] : []),
  ]);

  const sortedPockets = useMemo(
    () =>
      [...(pockets.data ?? [])].sort((a, b) =>
        compareItemPockets(a.name, b.name),
      ),
    [pockets.data],
  );

  const searchResults = useMemo(
    () =>
      debounced && index.data
        ? index.data.filter(i => matchesQuery(i, debounced))
        : [],
    [index.data, debounced],
  );
  const { visible, loadMore } = usePagedList(searchResults, 20, debounced);

  const rows: Row[] = debounced
    ? visible.map(i => ({ kind: 'item' as const, name: i.name }))
    : sortItemCategories(pocket, pocketQuery.data?.categories ?? []).map(c => ({
        kind: 'category' as const,
        name: c,
      }));

  const openItem = useCallback(
    (name: string) => navigation.navigate(ROUTES.ITEM_DETAIL, { name }),
    [navigation],
  );

  const loading = debounced
    ? index.isLoading && !index.data
    : !pocketQuery.data && !pocketQuery.isError;
  const failed = debounced
    ? index.isError && !index.data
    : pocketQuery.isError && !pocketQuery.data;

  const header = (
    <View style={styles.header}>
      <ScreenHeader
        title="Item"
        subtitle={
          index.data
            ? `${formatCount(index.data.length)} item · ${
                pockets.data?.length ?? 8
              } kantong`
            : 'Memuat…'
        }
        onBack={navigation.goBack}
      />
      <SearchField
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
        placeholder="Cari item"
        accessibilityLabel="Cari item"
      />
      {!debounced && (
        <ChipScroller>
          {sortedPockets.map(p => (
            <TypeChip
              key={p.name}
              label={itemPocketLabel(p.name)}
              active={pocket === p.name}
              onPress={() => setPocket(p.name)}
            />
          ))}
        </ChipScroller>
      )}
      {debounced && (
        <AppText variant="label" color={colors.ink3}>
          {`${formatCount(searchResults.length)} HASIL`}
        </AppText>
      )}
    </View>
  );

  const empty = loading ? (
    <View style={styles.skeleton}>
      <Skeleton height={200} radius={16} />
      <Skeleton height={140} radius={16} />
    </View>
  ) : failed ? (
    <EmptyState
      icon={<WifiOff size={30} color={colors.ink3} />}
      title="Item gagal dimuat"
      body="Data belum tersimpan dan perangkat sedang offline. Sambungkan internet lalu coba lagi."
      actionLabel="Coba lagi"
      actionVariant="primary"
      onAction={refresh}
    />
  ) : (
    <EmptyState
      icon={<SearchX size={30} color={colors.ink3} />}
      title="Item tidak ditemukan"
      body={`Tidak ada item yang cocok dengan “${debounced}”.`}
      actionLabel="Hapus pencarian"
      onAction={() => setQuery('')}
    />
  );

  return (
    <ScreenList
      data={rows}
      keyExtractor={r => `${r.kind}:${r.name}`}
      renderItem={({ item, index: i }) =>
        item.kind === 'category' ? (
          <CategorySection category={item.name} onPressItem={openItem} />
        ) : (
          <View
            style={[
              styles.searchRow,
              i === 0 && styles.first,
              i === rows.length - 1 && styles.last,
            ]}
          >
            <ItemRow
              name={item.name}
              divider={i < rows.length - 1}
              onPress={openItem}
            />
          </View>
        )
      }
      header={header}
      empty={empty}
      refreshing={refreshing}
      onRefresh={refresh}
      onEndReached={debounced ? loadMore : undefined}
      gap={debounced ? 0 : 12}
      extraProps={{
        ListFooterComponent:
          !loading && !failed && rows.length > 0 ? (
            <AppText variant="caption" color={colors.ink3} style={styles.note}>
              Harga beli dari game terbaru yang menjualnya. Ketuk item untuk
              harga di game lain.
            </AppText>
          ) : undefined,
      }}
    />
  );
}

const styles = StyleSheet.create({
  note: {
    marginTop: 16,
  },
  header: {
    gap: 14,
  },
  skeleton: {
    gap: 12,
  },
  searchRow: {
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  first: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  last: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
