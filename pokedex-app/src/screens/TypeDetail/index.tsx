import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import EmptyState from '@/components/molecules/EmptyState';
import PokemonCardSkeleton from '@/components/molecules/PokemonCardSkeleton';
import SectionHeader from '@/components/molecules/SectionHeader';
import TypeEffectGroup from '@/components/molecules/TypeEffectGroup';
import CollapsingTopBar, {
  TOP_BAR_HEIGHT,
} from '@/components/organisms/CollapsingTopBar';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetTypeQuery } from '@/services/api/type.service';
import { colors, typePalette } from '@/theme/colors';
import type {
  NamedAPIResource,
  PokemonSummary,
  PokemonTypeName,
} from '@/types';
import { formatCount, formatName } from '@/utils/format';
import { HERO_PARALLAX } from '@/utils/motion';
import { idFromUrl, isPokemonTypeName } from '@/utils/pokemon';
import TypePokemonItem from './TypePokemonItem';

const PAGE_SIZE = 20;
const H_PADDING = 20;
const GAP = 12;

const toTypes = (list: NamedAPIResource[]) =>
  list.map(t => t.name).filter(isPokemonTypeName);

export default function TypeDetail({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.TYPE_DETAIL>) {
  const { name } = route.params;
  const palette = typePalette(name);
  useStatusBarStyle(
    palette.text === colors.white ? 'light-content' : 'dark-content',
  );
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP) / 2;
  const [pages, setPages] = useState(1);
  const seenIds = useRef(new Set<number>());
  const scrollY = useSharedValue(0);

  const { data, isError, isLoading, refetch } = useGetTypeQuery(name);
  const { refreshing, refresh } = useRefresh([refetch]);

  const pokemon = useMemo<PokemonSummary[]>(
    () =>
      (data?.pokemon ?? [])
        .map(p => ({ id: idFromUrl(p.pokemon.url), name: p.pokemon.name }))
        .sort((a, b) => a.id - b.id),
    [data],
  );
  const visible = useMemo(
    () => pokemon.slice(0, pages * PAGE_SIZE),
    [pokemon, pages],
  );

  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });
  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 90], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-200, 0, 200],
          [-30, 0, 200 * HERO_PARALLAX],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const openPokemon = useCallback(
    (p: PokemonSummary, types?: PokemonTypeName[]) =>
      navigation.push(ROUTES.POKEMON_DETAIL, { id: p.id, name: p.name, types }),
    [navigation],
  );

  const relations = data?.damage_relations;

  const header = (
    <View>
      <View style={[styles.hero, { backgroundColor: palette.background }]}>
        <View
          style={[styles.overscroll, { backgroundColor: palette.background }]}
        />
        <View style={[styles.ring, { borderColor: palette.ring }]} />
        <Animated.View
          style={[
            styles.heroText,
            { paddingTop: insets.top + TOP_BAR_HEIGHT + 8 },
            titleStyle,
          ]}
        >
          <AppText
            variant="heroTitle"
            color={palette.text}
            accessibilityRole="header"
          >
            {formatName(name)}
          </AppText>
          <AppText variant="callout" color={palette.textMuted}>
            {data ? `${formatCount(pokemon.length)} Pokémon` : 'Memuat…'}
          </AppText>
        </Animated.View>
      </View>
      <View style={styles.body}>
        {isError && !data ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Tipe gagal dimuat"
            body="Data tipe ini belum tersimpan dan perangkat sedang offline."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
            style={styles.error}
          />
        ) : (
          <>
            <Group title="Saat menyerang">
              <TypeEffectGroup
                label="Super efektif ke"
                multiplier="×2"
                tone="good"
                types={relations ? toTypes(relations.double_damage_to) : []}
                emptyText={relations ? 'Tidak ada' : '…'}
              />
              <TypeEffectGroup
                label="Kurang efektif ke"
                multiplier="×½"
                tone="neutral"
                types={relations ? toTypes(relations.half_damage_to) : []}
                emptyText={relations ? 'Tidak ada' : '…'}
              />
              {relations && relations.no_damage_to.length > 0 && (
                <TypeEffectGroup
                  label="Tidak berpengaruh ke"
                  multiplier="×0"
                  tone="neutral"
                  types={toTypes(relations.no_damage_to)}
                />
              )}
            </Group>
            <Group title="Saat bertahan">
              <TypeEffectGroup
                label="Lemah dari"
                multiplier="×2"
                tone="bad"
                types={relations ? toTypes(relations.double_damage_from) : []}
                emptyText={relations ? 'Tidak ada' : '…'}
              />
              <TypeEffectGroup
                label="Tahan dari"
                multiplier="×½"
                tone="good"
                types={relations ? toTypes(relations.half_damage_from) : []}
                emptyText={relations ? 'Tidak ada' : '…'}
              />
              {relations && relations.no_damage_from.length > 0 && (
                <TypeEffectGroup
                  label="Kebal dari"
                  multiplier="×0"
                  tone="good"
                  types={toTypes(relations.no_damage_from)}
                />
              )}
            </Group>
            <SectionHeader
              variant="subheading"
              title={`Pokémon tipe ${formatName(name)}`}
              meta={data ? formatCount(pokemon.length) : undefined}
            />
            {isLoading && (
              <View style={styles.skeletonRow}>
                <PokemonCardSkeleton />
                <PokemonCardSkeleton />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <Animated.FlatList
        data={visible}
        keyExtractor={p => String(p.id)}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TypePokemonItem
            pokemon={item}
            index={index}
            width={cardWidth}
            seenIds={seenIds.current}
            onPress={openPokemon}
          />
        )}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onEndReached={() => {
          if (visible.length < pokemon.length) {
            setPages(p => p + 1);
          }
        }}
        onEndReachedThreshold={0.6}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={60}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.brand]}
            tintColor={palette.text}
            progressViewOffset={insets.top + TOP_BAR_HEIGHT}
          />
        }
      />
      <CollapsingTopBar
        title={formatName(name)}
        palette={palette}
        scrollY={scrollY}
        revealAt={110}
        onBack={navigation.goBack}
      />
    </View>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.group}>
      <AppText variant="subheading" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  hero: {
    paddingBottom: 56,
    overflow: 'hidden',
  },
  overscroll: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1000,
    height: 1000,
  },
  ring: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 36,
  },
  heroText: {
    gap: 2,
    paddingHorizontal: H_PADDING,
  },
  body: {
    marginTop: -28,
    gap: 28,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: H_PADDING,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
  },
  group: {
    gap: 14,
  },
  row: {
    gap: GAP,
    paddingHorizontal: H_PADDING,
  },
  separator: {
    height: GAP,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  error: {
    paddingTop: 24,
  },
});
