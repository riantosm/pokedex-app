import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import PokemonCardSkeleton from '@/components/molecules/PokemonCardSkeleton';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import Segmented from '@/components/molecules/Segmented';
import TypeChip from '@/components/molecules/TypeChip';
import ScreenList from '@/components/organisms/ScreenList';
import { useGridWidth } from '@/hooks/useGridWidth';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type {
  PokemonGroupKind,
  RootStackScreenProps,
} from '@/navigation/types';
import {
  useGetGenderQuery,
  useGetSpeciesGroupQuery,
} from '@/services/api/group.service';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import type { PokemonTypeName, SpeciesGroupKind } from '@/types';
import { formatCount } from '@/utils/format';
import { genderBucket, type GenderBucket } from '@/utils/labels';
import PokemonGridCell from '../shared/PokemonGridCell';
import GenderDistribution from './GenderDistribution';
import GroupChip from './GroupChip';

type Entry = { id: number; name: string };

const PAGE_SIZE = 24;

const SEGMENTS: { key: PokemonGroupKind; label: string }[] = [
  { key: 'egg-group', label: 'Egg' },
  { key: 'pokemon-color', label: 'Warna' },
  { key: 'pokemon-shape', label: 'Bentuk' },
  { key: 'pokemon-habitat', label: 'Habitat' },
  { key: 'gender', label: 'Gender' },
];

const EXPLAIN: Record<SpeciesGroupKind, string> = {
  'egg-group': 'Pokémon dalam egg group yang sama bisa dikawinkan di Day Care.',
  'pokemon-color':
    'Warna utama tiap Pokémon menurut Pokédex — dipakai untuk mencari di Pokédex game.',
  'pokemon-shape':
    'Bentuk tubuh menurut Pokédex sejak Generasi IV (berkaki dua, bersayap, berekor, …).',
  'pokemon-habitat':
    'Habitat asal menurut Pokédex FireRed & LeafGreen — hanya Pokémon Generasi I–III.',
};

const GENDER_OPTIONS: { key: GenderBucket; label: string }[] = [
  { key: 'female-only', label: 'Betina saja' },
  { key: 'male-only', label: 'Jantan saja' },
  { key: 'genderless', label: 'Tanpa gender' },
  { key: 'mixed', label: 'Campuran' },
];

const GENDER_EXPLAIN: Record<GenderBucket, string> = {
  'female-only': 'Pokémon yang hanya punya betina.',
  'male-only': 'Pokémon yang hanya punya jantan.',
  genderless:
    'Pokémon tanpa gender — kebanyakan legendaris, Pokémon buatan, dan Pokémon mekanis.',
  mixed:
    'Pokémon dengan jantan dan betina. Rasionya berbeda-beda, lihat grafik di atas.',
};

const isGenderBucket = (v: string | undefined): v is GenderBucket =>
  GENDER_OPTIONS.some(o => o.key === v);

export default function PokemonGroup({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.POKEMON_GROUP>) {
  useStatusBarStyle('dark-content');
  const cardWidth = useGridWidth(2);
  const seenIds = useState(() => new Set<number>())[0];
  const kind = route.params?.kind ?? 'egg-group';
  const isGender = kind === 'gender';
  const groupKind: SpeciesGroupKind = isGender ? 'egg-group' : kind;

  const groups = useGetResourceIndexQuery(groupKind, { skip: isGender });
  const name = isGender
    ? isGenderBucket(route.params?.name)
      ? route.params.name
      : 'female-only'
    : route.params?.name ?? groups.data?.[0]?.name;
  const group = useGetSpeciesGroupQuery(
    { kind: groupKind, name: name ?? '' },
    { skip: isGender || !name },
  );
  const female = useGetGenderQuery('female', { skip: !isGender });
  const male = useGetGenderQuery('male', { skip: !isGender });
  const genderless = useGetGenderQuery('genderless', { skip: !isGender });
  const pokemonIndex = useGetPokemonIndexQuery();

  const { refreshing, refresh } = useRefresh(
    isGender
      ? [female.refetch, male.refetch, genderless.refetch]
      : [groups.refetch, ...(name ? [group.refetch] : [])],
  );

  // Semua spesies dengan rate-nya: female (rate 1–8) + male (rate 0) + genderless (-1).
  const genderRates = useMemo(() => {
    if (!female.data || !male.data || !genderless.data) {
      return null;
    }
    const byId = new Map<number, number>();
    for (const g of [female.data, male.data, genderless.data]) {
      g.species.forEach(s => byId.set(s.id, s.rate));
    }
    return byId;
  }, [female.data, male.data, genderless.data]);

  const genderCounts = useMemo(() => {
    const counts = new Map<number, number>();
    genderRates?.forEach(rate => counts.set(rate, (counts.get(rate) ?? 0) + 1));
    return counts;
  }, [genderRates]);

  const ids = useMemo(() => {
    if (isGender) {
      return genderRates
        ? [...genderRates.entries()]
            .filter(([, rate]) => genderBucket(rate) === name)
            .map(([id]) => id)
            .sort((a, b) => a - b)
        : null;
    }
    return group.data?.speciesIds ?? null;
  }, [isGender, genderRates, name, group.data]);

  const entries = useMemo<Entry[]>(() => {
    const names = new Map(pokemonIndex.data?.map(p => [p.id, p.name]));
    return (ids ?? []).map(id => ({ id, name: names.get(id) ?? String(id) }));
  }, [ids, pokemonIndex.data]);

  const { visible, loadMore } = usePagedList(
    entries,
    PAGE_SIZE,
    `${kind}/${name}`,
  );

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

  const genderBucketCounts = useMemo(() => {
    const out: Partial<Record<GenderBucket, number>> = {};
    genderRates?.forEach(rate => {
      const b = genderBucket(rate);
      out[b] = (out[b] ?? 0) + 1;
    });
    return out;
  }, [genderRates]);

  const explain = isGender
    ? `${GENDER_EXPLAIN[name as GenderBucket]}${
        name === 'female-only' && female.data?.requiredForEvolution.length
          ? ` ${female.data.requiredForEvolution.length} spesies hanya berevolusi kalau betina, mis. Combee → Vespiquen.`
          : ''
      }`
    : EXPLAIN[groupKind];

  const header = (
    <View style={styles.header}>
      <ScreenHeader
        title="Kelompok Pokémon"
        subtitle="Egg group, warna, bentuk, habitat, gender"
        onBack={navigation.goBack}
      />
      <Segmented
        options={SEGMENTS}
        value={kind}
        onChange={k => navigation.setParams({ kind: k, name: undefined })}
      />
      <ChipScroller>
        {isGender
          ? GENDER_OPTIONS.map(o => (
              <TypeChip
                key={o.key}
                label={
                  genderBucketCounts[o.key] !== undefined
                    ? `${o.label} · ${formatCount(genderBucketCounts[o.key]!)}`
                    : o.label
                }
                active={o.key === name}
                onPress={() => navigation.setParams({ name: o.key })}
              />
            ))
          : (groups.data ?? []).map(g => (
              <GroupChip
                key={g.name}
                kind={groupKind}
                name={g.name}
                active={g.name === name}
                onPress={n => navigation.setParams({ name: n })}
              />
            ))}
      </ChipScroller>
      <AppText variant="caption" color={colors.ink2} style={styles.explain}>
        {explain}
      </AppText>
      {isGender && genderRates && (
        <GenderDistribution
          counts={genderCounts}
          selected={name as GenderBucket}
        />
      )}
    </View>
  );

  const failed = isGender
    ? (female.isError && !female.data) ||
      (male.isError && !male.data) ||
      (genderless.isError && !genderless.data)
    : (groups.isError && !groups.data) || (group.isError && !group.data);

  const empty = failed ? (
    <EmptyState
      icon={<WifiOff size={30} color={colors.ink3} />}
      title="Kelompok gagal dimuat"
      body="Data belum tersimpan dan perangkat sedang offline."
      actionLabel="Coba lagi"
      actionVariant="primary"
      onAction={refresh}
    />
  ) : ids ? (
    <EmptyState
      icon={<WifiOff size={30} color={colors.ink3} />}
      title="Tidak ada Pokémon"
      body="Kelompok ini tidak berisi Pokémon."
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
      keyExtractor={item => `${kind}-${name}-${item.id}`}
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
  explain: {
    lineHeight: 19,
  },
  skeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
