import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Skeleton from '@/components/atoms/Skeleton';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import InfoNote from '@/components/molecules/InfoNote';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import ScreenList from '@/components/organisms/ScreenList';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetPalParkAreaQuery } from '@/services/api/location.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import type { PalParkArea } from '@/types';
import AreaChip from './AreaChip';
import PalParkRow, { PAL_COLUMNS } from './PalParkRow';

type Entry = PalParkArea['encounters'][number];

const PAGE_SIZE = 20;

export default function PalPark({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.PAL_PARK>) {
  useStatusBarStyle('dark-content');
  const areas = useGetResourceIndexQuery('pal-park-area');
  const area = route.params?.area ?? areas.data?.[0]?.name ?? 'forest';
  const detail = useGetPalParkAreaQuery(area);
  const { refreshing, refresh } = useRefresh([areas.refetch, detail.refetch]);
  const entries = detail.data?.encounters ?? [];
  const { visible, loadMore } = usePagedList(entries, PAGE_SIZE, area);

  const openPokemon = useCallback(
    (id: number, name: string) =>
      navigation.push(ROUTES.POKEMON_DETAIL, { id, name }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Entry; index: number }) => (
      <PalParkRow
        {...item}
        last={index === visible.length - 1}
        onPress={openPokemon}
      />
    ),
    [visible.length, openPokemon],
  );

  const header = (
    <View style={styles.header}>
      <ScreenHeader
        title="Pal Park"
        subtitle={`Diamond, Pearl & Platinum · ${areas.data?.length ?? 5} area`}
        onBack={navigation.goBack}
      />
      <ChipScroller>
        {(areas.data ?? []).map(a => (
          <AreaChip
            key={a.name}
            name={a.name}
            active={a.name === area}
            onPress={n => navigation.setParams({ area: n })}
          />
        ))}
      </ChipScroller>
      <InfoNote>
        Pokémon yang dipindah dari game Generasi III muncul di area sesuai
        habitatnya. Skor dihitung untuk Catching Show — makin langka, makin
        tinggi.
      </InfoNote>
      {entries.length > 0 && (
        <View style={[styles.tableHead, styles.attach]}>
          <AppText variant="micro" color={colors.ink3} style={styles.flex}>
            POKÉMON
          </AppText>
          <AppText
            variant="micro"
            color={colors.ink3}
            align="center"
            style={{ width: PAL_COLUMNS.score }}
          >
            SKOR
          </AppText>
          <AppText
            variant="micro"
            color={colors.ink3}
            align="right"
            style={{ width: PAL_COLUMNS.rate }}
          >
            PELUANG
          </AppText>
        </View>
      )}
    </View>
  );

  const empty =
    detail.isError && !detail.data ? (
      <EmptyState
        icon={<WifiOff size={30} color={colors.ink3} />}
        title="Area gagal dimuat"
        body="Data belum tersimpan dan perangkat sedang offline."
        actionLabel="Coba lagi"
        actionVariant="primary"
        onAction={refresh}
      />
    ) : (
      <Skeleton height={420} radius={16} />
    );

  return (
    <ScreenList
      data={visible}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      header={header}
      empty={empty}
      refreshing={refreshing}
      onRefresh={refresh}
      onEndReached={loadMore}
      gap={0}
      extraProps={{
        ListHeaderComponentStyle: styles.listHeader,
        ListFooterComponent:
          entries.length > 0 ? (
            <AppText
              variant="caption"
              color={colors.ink3}
              align="center"
              style={styles.footer}
            >
              {`Menampilkan ${visible.length} dari ${entries.length} · urut nomor Pokédex`}
            </AppText>
          ) : undefined,
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 16,
    paddingBottom: 16,
  },
  listHeader: {
    paddingBottom: 0,
  },
  tableHead: {
    height: 36,
    paddingHorizontal: 14,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.surface,
  },
  attach: {
    marginBottom: -16,
  },
  flex: {
    flex: 1,
  },
  footer: {
    paddingTop: 16,
  },
});
