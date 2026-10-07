import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import { SearchX, WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import EmptyState from '@/components/molecules/EmptyState';
import ChipScroller from '@/components/molecules/ChipScroller';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import SearchField from '@/components/molecules/SearchField';
import Segmented from '@/components/molecules/Segmented';
import TypeChip from '@/components/molecules/TypeChip';
import ScreenList from '@/components/organisms/ScreenList';
import Skeleton from '@/components/atoms/Skeleton';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetMoveDamageClassQuery } from '@/services/api/move.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { useGetTypeQuery } from '@/services/api/type.service';
import { colors, typeColors } from '@/theme/colors';
import { POKEMON_TYPE_NAMES, type PokemonTypeName } from '@/types';
import { formatCount, formatName } from '@/utils/format';
import { matchesQuery } from '@/utils/search';
import MoveRow, { MOVE_COLUMNS } from './MoveRow';

type DamageFilter = 'all' | 'physical' | 'special' | 'status';
const CLASS_OPTIONS = [
  { key: 'all', label: 'Semua' },
  { key: 'physical', label: 'Fisik' },
  { key: 'special', label: 'Khusus' },
  { key: 'status', label: 'Status' },
] as const;

export default function MoveList({
  navigation,
}: RootStackScreenProps<typeof ROUTES.MOVE_LIST>) {
  useStatusBarStyle('dark-content');
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query.trim());
  const [damage, setDamage] = useState<DamageFilter>('all');
  const [type, setType] = useState<PokemonTypeName | null>(null);

  const index = useGetResourceIndexQuery('move');
  const classQuery = useGetMoveDamageClassQuery(
    damage === 'all' ? skipToken : damage,
  );
  const typeQuery = useGetTypeQuery(type ?? skipToken);
  const { refreshing, refresh } = useRefresh([
    index.refetch,
    ...(damage !== 'all' ? [classQuery.refetch] : []),
    ...(type ? [typeQuery.refetch] : []),
  ]);

  const results = useMemo(() => {
    if (!index.data) {
      return [];
    }
    const byClass =
      damage !== 'all' && classQuery.data
        ? new Set(classQuery.data.moves)
        : null;
    const byType =
      type && typeQuery.data ? new Set(typeQuery.data.moves) : null;
    return index.data.filter(
      m =>
        (!byClass || byClass.has(m.name)) &&
        (!byType || byType.has(m.name)) &&
        matchesQuery(m, debounced),
    );
  }, [index.data, damage, classQuery.data, type, typeQuery.data, debounced]);

  const { visible, loadMore } = usePagedList(
    results,
    20,
    `${debounced}|${damage}|${type}`,
  );
  const pending =
    (index.isLoading && !index.data) ||
    (damage !== 'all' && !classQuery.data && !classQuery.isError) ||
    (!!type && !typeQuery.data && !typeQuery.isError);
  const failed =
    (index.isError && !index.data) || classQuery.isError || typeQuery.isError;

  const openMove = useCallback(
    (name: string) => navigation.navigate(ROUTES.MOVE_DETAIL, { name }),
    [navigation],
  );

  const header = (
    <View style={styles.header}>
      <ScreenHeader
        title="Moves"
        subtitle={
          index.data ? `${formatCount(index.data.length)} move` : 'Memuat…'
        }
        onBack={navigation.goBack}
      />
      <SearchField
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
        placeholder="Cari move atau nomor"
        accessibilityLabel="Cari move"
      />
      <Segmented options={CLASS_OPTIONS} value={damage} onChange={setDamage} />
      <ChipScroller>
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
            onPress={() => setType(cur => (cur === t ? null : t))}
          />
        ))}
      </ChipScroller>
      <View style={styles.columns}>
        <AppText variant="label" color={colors.ink3} style={styles.flex}>
          {pending ? 'MEMUAT…' : `${formatCount(results.length)} MOVE`}
        </AppText>
        <AppText
          variant="label"
          color={colors.ink3}
          align="right"
          style={{ width: MOVE_COLUMNS.power }}
        >
          POW
        </AppText>
        <AppText
          variant="label"
          color={colors.ink3}
          align="right"
          style={{ width: MOVE_COLUMNS.accuracy }}
        >
          ACC
        </AppText>
        <AppText
          variant="label"
          color={colors.ink3}
          align="right"
          style={{ width: MOVE_COLUMNS.pp }}
        >
          PP
        </AppText>
      </View>
    </View>
  );

  const empty = pending ? (
    <View style={styles.skeleton}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <Skeleton key={i} height={52} radius={12} />
      ))}
    </View>
  ) : failed ? (
    <EmptyState
      icon={<WifiOff size={30} color={colors.ink3} />}
      title="Moves gagal dimuat"
      body="Data belum tersimpan dan perangkat sedang offline. Sambungkan internet lalu coba lagi."
      actionLabel="Coba lagi"
      actionVariant="primary"
      onAction={refresh}
    />
  ) : (
    <EmptyState
      icon={<SearchX size={30} color={colors.ink3} />}
      title="Move tidak ditemukan"
      body="Coba kata kunci lain atau hapus filter tipe & kategori."
      actionLabel="Reset filter"
      onAction={() => {
        setQuery('');
        setDamage('all');
        setType(null);
      }}
    />
  );

  return (
    <ScreenList
      data={pending || failed ? [] : visible}
      keyExtractor={m => m.name}
      renderItem={({ item, index: i }) => (
        <MoveRow
          name={item.name}
          first={i === 0}
          last={i === visible.length - 1}
          onPress={openMove}
        />
      )}
      header={header}
      empty={empty}
      refreshing={refreshing}
      onRefresh={refresh}
      onEndReached={loadMore}
      gap={0}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 14,
  },
  columns: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  flex: {
    flex: 1,
  },
  skeleton: {
    gap: 8,
  },
});
