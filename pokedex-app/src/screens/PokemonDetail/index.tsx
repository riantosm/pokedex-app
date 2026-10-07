import { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { skipToken } from '@reduxjs/toolkit/query';
import { Heart, WifiOff } from 'lucide-react-native';
import IconButton from '@/components/atoms/IconButton';
import EmptyState from '@/components/molecules/EmptyState';
import UnderlineTabs from '@/components/molecules/UnderlineTabs';
import CollapsingTopBar from '@/components/organisms/CollapsingTopBar';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import {
  useGetEvolutionChainQuery,
  useGetPokemonEncountersQuery,
  useGetPokemonIndexQuery,
  useGetPokemonMovesQuery,
  useGetPokemonQuery,
  useGetPokemonSpeciesQuery,
} from '@/services/api/pokemon.service';
import { useGetTypeQuery } from '@/services/api/type.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectIsFavorite,
  toggleFavorite,
} from '@/store/slices/favoritesSlice';
import {
  colors,
  neutralPalette,
  typeColors,
  typePalette,
} from '@/theme/colors';
import { pickEntry, pickName } from '@/utils/i18n';
import { tabContentEntering } from '@/utils/motion';
import { MAX_POKEMON_ID, idFromUrl, typeNames } from '@/utils/pokemon';
import AboutTab from './AboutTab';
import AbilitySheet from './AbilitySheet';
import DetailHero from './DetailHero';
import EvolutionTab from './EvolutionTab';
import LocationsTab from './LocationsTab';
import MovesTab from './MovesTab';
import StatSheet from './StatSheet';
import StatsTab from './StatsTab';
import TabSkeleton from './TabSkeleton';
import WeaknessTab from './WeaknessTab';

const TABS = [
  { key: 'about', label: 'About' },
  { key: 'stats', label: 'Stats' },
  { key: 'moves', label: 'Moves' },
  { key: 'evolution', label: 'Evolusi' },
  { key: 'locations', label: 'Lokasi' },
  { key: 'weakness', label: 'Lemah' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

/** Scroll (px) saat judul di top bar mulai muncul — kira-kira saat nama di hero tertutup. */
const TOP_BAR_REVEAL = 120;

export default function PokemonDetail({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.POKEMON_DETAIL>) {
  const { id, name } = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollY = useSharedValue(0);
  const [tab, setTab] = useState<TabKey>('about');
  const [ability, setAbility] = useState<{
    name: string;
    hidden: boolean;
  } | null>(null);
  const [abilityOpen, setAbilityOpen] = useState(false);
  const [stat, setStat] = useState<{
    name: string;
    label: string;
    value: number;
  } | null>(null);
  const [statOpen, setStatOpen] = useState(false);
  const lang = useDataLanguage();

  const pokemonQuery = useGetPokemonQuery(id);
  const speciesQuery = useGetPokemonSpeciesQuery(id);
  const evolutionId = speciesQuery.data
    ? idFromUrl(speciesQuery.data.evolution_chain.url)
    : null;
  const evolutionQuery = useGetEvolutionChainQuery(evolutionId ?? skipToken);
  const { data: index } = useGetPokemonIndexQuery();
  // Moves & lokasi dimuat hanya saat tab-nya dibuka (`/pokemon/{id}` dengan semua move cukup besar).
  const movesQuery = useGetPokemonMovesQuery(id, { skip: tab !== 'moves' });
  const encountersQuery = useGetPokemonEncountersQuery(id, {
    skip: tab !== 'locations',
  });

  // Tipe dari data detail; sebelum dimuat pakai tipe yang dikirim kartu.
  const types = pokemonQuery.data
    ? typeNames(pokemonQuery.data.types)
    : route.params.types;
  const primary = types?.[0];
  const palette = primary ? typePalette(primary) : neutralPalette;
  const accent = primary ? typeColors[primary] : colors.brand;
  useStatusBarStyle(
    palette.text === colors.white ? 'light-content' : 'dark-content',
  );

  const firstType = useGetTypeQuery(types?.[0] ?? skipToken);
  const secondType = useGetTypeQuery(types?.[1] ?? skipToken);

  const isFavorite = useAppSelector(selectIsFavorite(id));
  const { refreshing, refresh } = useRefresh([
    pokemonQuery.refetch,
    speciesQuery.refetch,
    ...(evolutionId ? [evolutionQuery.refetch] : []),
    ...(types?.[0] ? [firstType.refetch] : []),
    ...(types?.[1] ? [secondType.refetch] : []),
    ...(tab === 'moves' ? [movesQuery.refetch] : []),
    ...(tab === 'locations' ? [encountersQuery.refetch] : []),
  ]);

  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  // Pindah Pokémon (prev/next/evolusi) → kembali ke atas.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [id]);

  const goTo = (nextId: number, nextName?: string) => {
    const resolvedName = nextName ?? index?.find(p => p.id === nextId)?.name;
    if (resolvedName) {
      navigation.setParams({
        id: nextId,
        name: resolvedName,
        types: undefined,
      });
    }
  };

  const relations = useMemo(() => {
    if (!types || !firstType.data || (types[1] && !secondType.data)) {
      return null;
    }
    return [firstType.data, secondType.data]
      .filter(t => t !== undefined)
      .map(t => t.damage_relations);
  }, [types, firstType.data, secondType.data]);

  const species = speciesQuery.data;
  const pokemon = pokemonQuery.data;
  const genus = pickEntry(species?.genera, lang)?.genus;
  const title = pickName(species?.names, lang, name);
  const badge = species?.is_legendary
    ? 'Legendary'
    : species?.is_mythical
    ? 'Mythical'
    : undefined;
  const failed =
    (pokemonQuery.isError && !pokemon) || (speciesQuery.isError && !species);

  const renderTab = () => {
    if (failed) {
      return (
        <EmptyState
          icon={<WifiOff size={30} color={colors.ink3} />}
          title="Detail gagal dimuat"
          body="Pokémon ini belum pernah dibuka saat online. Sambungkan internet lalu coba lagi."
          actionLabel="Coba lagi"
          actionVariant="primary"
          onAction={refresh}
          style={styles.error}
        />
      );
    }
    switch (tab) {
      case 'about':
        return pokemon && species ? (
          <AboutTab
            pokemon={pokemon}
            species={species}
            onAbilityPress={(abilityName, hidden) => {
              setAbility({ name: abilityName, hidden });
              setAbilityOpen(true);
            }}
          />
        ) : (
          <TabSkeleton />
        );
      case 'stats':
        return pokemon ? (
          <StatsTab
            pokemon={pokemon}
            color={accent}
            onStatPress={(statName, label, value) => {
              setStat({ name: statName, label, value });
              setStatOpen(true);
            }}
          />
        ) : (
          <TabSkeleton />
        );
      case 'evolution':
        return evolutionQuery.data ? (
          <EvolutionTab
            chain={evolutionQuery.data}
            currentId={id}
            accent={accent}
            onSelect={goTo}
          />
        ) : (
          <TabSkeleton />
        );
      case 'moves':
        return movesQuery.data ? (
          <MovesTab
            moves={movesQuery.data}
            onMovePress={move =>
              navigation.push(ROUTES.MOVE_DETAIL, { name: move })
            }
          />
        ) : movesQuery.isError ? (
          <TabError onRetry={movesQuery.refetch} />
        ) : (
          <TabSkeleton />
        );
      case 'locations':
        return encountersQuery.data ? (
          <LocationsTab
            areas={encountersQuery.data}
            onLocationPress={location =>
              navigation.push(ROUTES.LOCATION_DETAIL, { name: location })
            }
          />
        ) : encountersQuery.isError ? (
          <TabError onRetry={encountersQuery.refetch} />
        ) : (
          <TabSkeleton />
        );
      case 'weakness':
        return relations ? (
          <WeaknessTab name={name} relations={relations} />
        ) : (
          <TabSkeleton />
        );
    }
  };

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.brand]}
            tintColor={palette.text}
            progressViewOffset={insets.top + 56}
          />
        }
      >
        <DetailHero
          id={id}
          name={name}
          title={species ? title : undefined}
          types={types}
          genus={genus}
          badge={badge}
          palette={palette}
          scrollY={scrollY}
          onPrev={id > 1 ? () => goTo(id - 1) : undefined}
          onNext={id < MAX_POKEMON_ID ? () => goTo(id + 1) : undefined}
        />
        <View style={styles.body}>
          <UnderlineTabs
            tabs={TABS}
            active={tab}
            onChange={setTab}
            accent={accent}
          />
          <Animated.View key={`${id}-${tab}`} entering={tabContentEntering}>
            {renderTab()}
          </Animated.View>
        </View>
      </Animated.ScrollView>

      <CollapsingTopBar
        title={title}
        palette={palette}
        scrollY={scrollY}
        revealAt={TOP_BAR_REVEAL}
        onBack={navigation.goBack}
        right={
          <IconButton
            accessibilityLabel={
              isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'
            }
            accessibilityState={{ selected: isFavorite, disabled: !types }}
            disabled={!types}
            onPress={() =>
              types && dispatch(toggleFavorite({ id, name, types }))
            }
            icon={
              <Heart
                size={20}
                color={palette.text}
                fill={isFavorite ? palette.text : 'transparent'}
              />
            }
          />
        }
      />

      <AbilitySheet
        visible={abilityOpen}
        ability={ability}
        onClose={() => setAbilityOpen(false)}
      />
      <StatSheet
        visible={statOpen}
        stat={stat}
        pokemonName={title}
        onClose={() => setStatOpen(false)}
        onMovePress={move => {
          setStatOpen(false);
          navigation.push(ROUTES.MOVE_DETAIL, { name: move });
        }}
        onNaturesPress={() => {
          setStatOpen(false);
          navigation.push(ROUTES.NATURES);
        }}
      />
    </View>
  );
}

function TabError({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={<WifiOff size={30} color={colors.ink3} />}
      title="Data gagal dimuat"
      body="Tab ini belum pernah dibuka saat online. Sambungkan internet lalu coba lagi."
      actionLabel="Coba lagi"
      actionVariant="primary"
      onAction={onRetry}
      style={styles.error}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  body: {
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    minHeight: 480,
  },
  error: {
    paddingTop: 24,
  },
});
