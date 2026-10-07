import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import PokemonCardSkeleton from '@/components/molecules/PokemonCardSkeleton';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import TypeChip from '@/components/molecules/TypeChip';
import ScreenList from '@/components/organisms/ScreenList';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGridWidth } from '@/hooks/useGridWidth';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetPokedexQuery } from '@/services/api/game.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import type { Pokedex, PokemonTypeName } from '@/types';
import { formatCount, formatDexNumber, formatName } from '@/utils/format';
import { pickName } from '@/utils/i18n';
import { versionGroupLabel } from '@/utils/labels';
import PokemonGridCell from '../shared/PokemonGridCell';

type Entry = Pokedex['entries'][number];

const DEFAULT_DEX = 'paldea';
const PAGE_SIZE = 24;

export default function PokedexDetail({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.POKEDEX_DETAIL>) {
  useStatusBarStyle('dark-content');
  const lang = useDataLanguage();
  const cardWidth = useGridWidth(2);
  const seenIds = useState(() => new Set<number>())[0];
  const name = route.params?.name ?? DEFAULT_DEX;
  const index = useGetResourceIndexQuery('pokedex');
  const { data: dex, isError, refetch } = useGetPokedexQuery(name);
  const { refreshing, refresh } = useRefresh([index.refetch, refetch]);
  const { visible, loadMore } = usePagedList(
    dex?.entries ?? [],
    PAGE_SIZE,
    name,
  );

  // Urutan PokéAPI diputar supaya Pokédex yang dibuka pertama ada di depan (desain: Paldea,
  // Kitakami, Blueberry, …, Kanto); Pokédex nasional di akhir. Tidak diurut ulang saat chip dipilih.
  const [first] = useState(name);
  const chips = useMemo(() => {
    const regional = (index.data?.map(d => d.name) ?? [first]).filter(
      d => d !== 'national',
    );
    const start = Math.max(0, regional.indexOf(first));
    const rotated = [...regional.slice(start), ...regional.slice(0, start)];
    return index.data?.some(d => d.name === 'national')
      ? [...rotated, 'national']
      : rotated;
  }, [index.data, first]);

  const openPokemon = useCallback(
    (id: number, pokemonName: string, types?: PokemonTypeName[]) =>
      navigation.push(ROUTES.POKEMON_DETAIL, { id, name: pokemonName, types }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index: i }: { item: Entry; index: number }) => (
      <PokemonGridCell
        id={item.id}
        name={item.name}
        index={i}
        width={cardWidth}
        seenIds={seenIds}
        onPress={openPokemon}
        numberLabel={
          name === 'national'
            ? undefined
            : `${formatDexNumber(item.number)} · Nas. ${formatDexNumber(
                item.id,
              )}`
        }
      />
    ),
    [cardWidth, seenIds, openPokemon, name],
  );

  const title = pickName(dex?.names, lang, name);
  const header = (
    <View style={styles.header}>
      <ScreenHeader
        title={`Pokédex ${title}`}
        subtitle={
          dex
            ? [
                `${formatCount(dex.entries.length)} Pokémon`,
                dex.version_groups.map(versionGroupLabel).join(', '),
              ]
                .filter(Boolean)
                .join(' · ')
            : 'Memuat…'
        }
        onBack={navigation.goBack}
      />
      <ChipScroller>
        {chips.map(d => (
          <TypeChip
            key={d}
            label={d === name ? title : formatName(d)}
            active={d === name}
            onPress={() => navigation.setParams({ name: d })}
          />
        ))}
      </ChipScroller>
    </View>
  );

  const empty =
    isError && !dex ? (
      <EmptyState
        icon={<WifiOff size={30} color={colors.ink3} />}
        title="Pokédex gagal dimuat"
        body="Pokédex ini belum pernah dibuka saat online. Sambungkan internet lalu coba lagi."
        actionLabel="Coba lagi"
        actionVariant="primary"
        onAction={refresh}
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
      data={dex ? visible : []}
      renderItem={renderItem}
      keyExtractor={item => `${name}-${item.number}`}
      header={header}
      empty={empty}
      refreshing={refreshing}
      onRefresh={refresh}
      onEndReached={loadMore}
      numColumns={2}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 16,
  },
  skeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
