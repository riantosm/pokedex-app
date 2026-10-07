import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import { WifiOff } from 'lucide-react-native';
import PokeballIcon from '@/components/atoms/PokeballIcon';
import EmptyState from '@/components/molecules/EmptyState';
import PokemonCardSkeleton from '@/components/molecules/PokemonCardSkeleton';
import SectionHeader from '@/components/molecules/SectionHeader';
import TypeChip from '@/components/molecules/TypeChip';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { ROUTES } from '@/navigation/paths';
import type { MainTabScreenProps } from '@/navigation/types';
import { useGetGenerationQuery } from '@/services/api/generation.service';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { useGetTypeQuery } from '@/services/api/type.service';
import { colors, typeColors } from '@/theme/colors';
import {
  POKEMON_TYPE_NAMES,
  type PokemonSummary,
  type PokemonTypeName,
} from '@/types';
import { formatCount, formatName } from '@/utils/format';
import { generationById } from '@/utils/generations';
import {
  DEFAULT_SORT,
  filterPokedex,
  type PokedexSort,
} from '@/utils/pokedexFilter';
import { idFromUrl } from '@/utils/pokemon';
import PokedexHeader from './PokedexHeader';
import PokemonGridItem from './PokemonGridItem';
import SortFilterSheet from './SortFilterSheet';

const PAGE_SIZE = 20;
const H_PADDING = 20;
const GAP = 12;
const SKELETON_ROWS = [0, 1, 2, 3];

export default function PokemonList({
  navigation,
}: MainTabScreenProps<typeof ROUTES.POKEDEX>) {
  useStatusBarStyle('light-content');
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP) / 2;
  const listRef = useRef<FlatList<PokemonSummary>>(null);
  const seenIds = useRef(new Set<number>());
  const bottomInset = useTabBarInset();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim());
  const [type, setType] = useState<PokemonTypeName | null>(null);
  const [generation, setGeneration] = useState<number | null>(null);
  const [sort, setSort] = useState<PokedexSort>(DEFAULT_SORT);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pages, setPages] = useState(1);

  const indexQuery = useGetPokemonIndexQuery();
  const typeQuery = useGetTypeQuery(type ?? skipToken);
  const generationQuery = useGetGenerationQuery(generation ?? skipToken);
  const { refreshing, refresh } = useRefresh([
    indexQuery.refetch,
    ...(type ? [typeQuery.refetch] : []),
    ...(generation ? [generationQuery.refetch] : []),
  ]);

  const typeIds = useMemo(
    () =>
      type && typeQuery.data
        ? new Set(typeQuery.data.pokemon.map(p => idFromUrl(p.pokemon.url)))
        : null,
    [type, typeQuery.data],
  );
  const generationIds = useMemo(
    () =>
      generation && generationQuery.data
        ? new Set(
            generationQuery.data.pokemon_species.map(s => idFromUrl(s.url)),
          )
        : null,
    [generation, generationQuery.data],
  );

  const results = useMemo(
    () =>
      indexQuery.data
        ? filterPokedex(indexQuery.data, {
            query: debouncedQuery,
            typeIds,
            generationIds,
            sort,
          })
        : [],
    [indexQuery.data, debouncedQuery, typeIds, generationIds, sort],
  );
  const visible = useMemo(
    () => results.slice(0, pages * PAGE_SIZE),
    [results, pages],
  );

  // Filter berubah → kembali ke halaman pertama & ke atas.
  useEffect(() => {
    setPages(1);
    seenIds.current.clear();
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [debouncedQuery, type, generation, sort]);

  const filterPending =
    (!!type && !typeQuery.data && !typeQuery.isError) ||
    (!!generation && !generationQuery.data && !generationQuery.isError);
  const filterError =
    (!!type && typeQuery.isError) || (!!generation && generationQuery.isError);
  const loading = (indexQuery.isLoading && !indexQuery.data) || filterPending;

  const openDetail = useCallback(
    (pokemon: PokemonSummary, types?: PokemonTypeName[]) =>
      navigation.navigate(ROUTES.POKEMON_DETAIL, {
        id: pokemon.id,
        name: pokemon.name,
        types,
      }),
    [navigation],
  );

  const renderItem: ListRenderItem<PokemonSummary> = useCallback(
    ({ item, index }) => (
      <PokemonGridItem
        pokemon={item}
        index={index}
        width={cardWidth}
        seenIds={seenIds.current}
        onPress={openDetail}
      />
    ),
    [cardWidth, openDetail],
  );

  const resetFilters = () => {
    setQuery('');
    setType(null);
    setGeneration(null);
    setSort(DEFAULT_SORT);
  };

  const sectionTitle = debouncedQuery
    ? `Hasil untuk “${debouncedQuery}”`
    : type
    ? `Tipe ${formatName(type)}`
    : 'Semua Pokémon';
  const generationLabel = generation
    ? `Gen ${generationById(generation)?.roman} · `
    : '';
  const sectionMeta = loading
    ? 'Memuat…'
    : `${generationLabel}${formatCount(results.length)} Pokémon`;

  const listHeader = (
    <View style={styles.listHeader}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsScroller}
        keyboardShouldPersistTaps="handled"
      >
        <TypeChip
          label="Semua"
          active={type === null}
          onPress={() => setType(null)}
        />
        {POKEMON_TYPE_NAMES.map(t => (
          <TypeChip
            key={t}
            label={formatName(t)}
            dotColor={typeColors[t]}
            active={type === t}
            onPress={() => setType(current => (current === t ? null : t))}
          />
        ))}
      </ScrollView>
      <SectionHeader title={sectionTitle} meta={sectionMeta} />
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.skeletonGrid}>
          {SKELETON_ROWS.map(r => (
            <View key={r} style={styles.skeletonRow}>
              <PokemonCardSkeleton />
              <PokemonCardSkeleton />
            </View>
          ))}
        </View>
      );
    }
    if (indexQuery.isError && !indexQuery.data) {
      return (
        <EmptyState
          style={styles.empty}
          icon={<WifiOff size={30} color={colors.ink3} />}
          title="Tidak bisa terhubung"
          body="Daftar Pokémon belum pernah dimuat dan perangkat sedang offline. Sambungkan internet lalu coba lagi."
          actionLabel="Coba lagi"
          actionVariant="primary"
          onAction={indexQuery.refetch}
        />
      );
    }
    if (filterError) {
      return (
        <EmptyState
          style={styles.empty}
          icon={<WifiOff size={30} color={colors.ink3} />}
          title="Filter gagal dimuat"
          body="Data tipe atau generasi belum tersimpan dan perangkat sedang offline."
          actionLabel="Coba lagi"
          actionVariant="primary"
          onAction={() => {
            if (typeQuery.isError) {
              typeQuery.refetch();
            }
            if (generationQuery.isError) {
              generationQuery.refetch();
            }
          }}
        />
      );
    }
    if (debouncedQuery) {
      return (
        <EmptyState
          style={styles.empty}
          icon={<PokeballIcon size={32} color={colors.ink3} />}
          title="Pokémon tidak ditemukan"
          body={`Tidak ada nama yang cocok dengan “${debouncedQuery}”. Periksa ejaannya, atau cari pakai nomor, misalnya 25.`}
          actionLabel="Hapus pencarian"
          onAction={() => setQuery('')}
        />
      );
    }
    return (
      <EmptyState
        style={styles.empty}
        icon={<PokeballIcon size={32} color={colors.ink3} />}
        title="Tidak ada yang cocok"
        body="Tidak ada Pokémon dengan kombinasi tipe dan generasi ini."
        actionLabel="Reset filter"
        onAction={resetFilters}
      />
    );
  };

  return (
    <View style={styles.root}>
      <PokedexHeader
        query={query}
        onChangeQuery={setQuery}
        onOpenSort={() => setSheetOpen(true)}
        sortActive={sort !== DEFAULT_SORT || generation !== null}
      />
      <FlatList
        ref={listRef}
        data={loading || filterError ? [] : visible}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={RowSeparator}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.brand]}
            tintColor={colors.brand}
          />
        }
        onEndReached={() => {
          if (visible.length < results.length) {
            setPages(p => p + 1);
          }
        }}
        onEndReachedThreshold={0.6}
        // Tuning grid bergambar: render sedikit per batch, lepas view di luar layar (Android).
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={60}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
      {indexQuery.data && (
        <SortFilterSheet
          visible={sheetOpen}
          onClose={() => setSheetOpen(false)}
          sort={sort}
          generation={generation}
          onApply={(nextSort, nextGeneration) => {
            setSort(nextSort);
            setGeneration(nextGeneration);
            setSheetOpen(false);
          }}
          index={indexQuery.data}
          query={debouncedQuery}
          typeIds={typeIds}
        />
      )}
    </View>
  );
}

function RowSeparator() {
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
  listHeader: {
    gap: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  chipsScroller: {
    marginHorizontal: -H_PADDING,
  },
  chips: {
    gap: 8,
    paddingHorizontal: H_PADDING,
  },
  row: {
    gap: GAP,
  },
  separator: {
    height: GAP,
  },
  skeletonGrid: {
    gap: GAP,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  empty: {
    paddingTop: 48,
  },
});
