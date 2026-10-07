import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Skeleton from '@/components/atoms/Skeleton';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import SearchField from '@/components/molecules/SearchField';
import TypeChip from '@/components/molecules/TypeChip';
import ScreenList from '@/components/organisms/ScreenList';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useGridWidth } from '@/hooks/useGridWidth';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetBerryFlavorQuery } from '@/services/api/berry.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import { BERRY_FLAVORS, type BerryFlavorName } from '@/types';
import { formatCount } from '@/utils/format';
import { FLAVOR_COLORS, flavorLabel } from '@/utils/labels';
import { matchesQuery } from '@/utils/search';
import BerryTile from './BerryTile';

export default function BerryList({
  navigation,
}: RootStackScreenProps<typeof ROUTES.BERRY_LIST>) {
  useStatusBarStyle('dark-content');
  const width = useGridWidth(3);
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query.trim());
  const [flavor, setFlavor] = useState<BerryFlavorName | null>(null);

  const index = useGetResourceIndexQuery('berry');
  const flavorQuery = useGetBerryFlavorQuery(flavor ?? skipToken);
  const { refreshing, refresh } = useRefresh([
    index.refetch,
    ...(flavor ? [flavorQuery.refetch] : []),
  ]);

  const results = useMemo(() => {
    if (!index.data) {
      return [];
    }
    const withFlavor =
      flavor && flavorQuery.data
        ? new Set(
            flavorQuery.data.berries
              .filter(b => b.potency > 0)
              .map(b => b.berry),
          )
        : null;
    return index.data.filter(
      b =>
        (!withFlavor || withFlavor.has(b.name)) && matchesQuery(b, debounced),
    );
  }, [index.data, flavor, flavorQuery.data, debounced]);

  const openBerry = useCallback(
    (name: string) => navigation.navigate(ROUTES.BERRY_DETAIL, { name }),
    [navigation],
  );
  const loading =
    (index.isLoading && !index.data) ||
    (!!flavor && !flavorQuery.data && !flavorQuery.isError);
  const failed = (index.isError && !index.data) || flavorQuery.isError;

  return (
    <ScreenList
      data={loading || failed ? [] : results}
      keyExtractor={b => b.name}
      numColumns={3}
      renderItem={({ item, index: i }) => (
        <BerryTile
          name={item.name}
          index={i}
          width={width}
          onPress={openBerry}
        />
      )}
      header={
        <View style={styles.header}>
          <ScreenHeader
            title="Berry"
            subtitle={
              index.data ? `${formatCount(index.data.length)} berry` : 'Memuat…'
            }
            onBack={navigation.goBack}
          />
          <SearchField
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            placeholder="Cari berry"
            accessibilityLabel="Cari berry"
          />
          <ChipScroller>
            <TypeChip
              label="Semua"
              active={flavor === null}
              onPress={() => setFlavor(null)}
            />
            {BERRY_FLAVORS.map(f => (
              <TypeChip
                key={f}
                label={flavorLabel(f)}
                dotColor={FLAVOR_COLORS[f]}
                active={flavor === f}
                onPress={() => setFlavor(cur => (cur === f ? null : f))}
              />
            ))}
          </ChipScroller>
        </View>
      }
      empty={
        loading ? (
          <View style={styles.skeleton}>
            {[0, 1].map(i => (
              <View key={i} style={styles.skeletonRow}>
                {[0, 1, 2].map(j => (
                  <Skeleton key={j} width={width} height={130} radius={18} />
                ))}
              </View>
            ))}
          </View>
        ) : failed ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Berry gagal dimuat"
            body="Data belum tersimpan dan perangkat sedang offline. Sambungkan internet lalu coba lagi."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
          />
        ) : (
          <AppText variant="callout" color={colors.ink3} align="center">
            Tidak ada berry yang cocok.
          </AppText>
        )
      }
      refreshing={refreshing}
      onRefresh={refresh}
      extraProps={{
        ListFooterComponent:
          !loading && !failed && results.length > 0 ? (
            <AppText
              variant="caption"
              color={colors.ink3}
              style={styles.legend}
            >
              Titik = rasa: merah pedas, biru kering, pink manis, hijau pahit,
              kuning asam.
            </AppText>
          ) : undefined,
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 14,
  },
  skeleton: {
    gap: 12,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legend: {
    marginTop: 16,
  },
});
