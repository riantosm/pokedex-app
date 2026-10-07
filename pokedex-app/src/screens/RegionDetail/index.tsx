import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from '@d11/react-native-fast-image';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Overline from '@/components/atoms/Overline';
import Skeleton from '@/components/atoms/Skeleton';
import Tag from '@/components/atoms/Tag';
import EmptyState from '@/components/molecules/EmptyState';
import FactStrip from '@/components/molecules/FactStrip';
import ListGroup from '@/components/molecules/ListGroup';
import Segmented from '@/components/molecules/Segmented';
import CollapsingTopBar, {
  TOP_BAR_HEIGHT,
} from '@/components/organisms/CollapsingTopBar';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetRegionQuery } from '@/services/api/location.service';
import { colors, type TypePalette } from '@/theme/colors';
import { pickName } from '@/utils/i18n';
import { generationRoman, versionGroupLabel } from '@/utils/labels';
import { artworkUrl } from '@/utils/pokemon';
import { REGION_ART, REGION_STARTERS, locationKind } from '@/utils/regions';
import DexCard from './DexCard';
import LocationRow from './LocationRow';

type Kind = 'city' | 'route' | 'other';

const HERO_PALETTE: TypePalette = {
  background: colors.ink,
  text: colors.white,
  textMuted: '#FFFFFFB3',
  pill: colors.glass,
  ring: '#FFFFFF14',
};

export default function RegionDetail({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.REGION_DETAIL>) {
  const { name } = route.params;
  useStatusBarStyle('light-content');
  const lang = useDataLanguage();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [kind, setKind] = useState<Kind>('city');
  const { data: region, isError, refetch } = useGetRegionQuery(name);
  const { refreshing, refresh } = useRefresh([refetch]);

  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  const grouped = useMemo(() => {
    const out: Record<Kind, string[]> = { city: [], route: [], other: [] };
    region?.locations.forEach(l => out[locationKind(l)].push(l));
    return out;
  }, [region]);

  const title = pickName(region?.names, lang, name);
  const starters = REGION_STARTERS[name];
  const art = starters ?? (REGION_ART[name] ? [REGION_ART[name]] : []);
  const options = (
    [
      { key: 'city', label: 'Kota' },
      { key: 'route', label: 'Rute' },
      { key: 'other', label: 'Lainnya' },
    ] as const
  ).map(o => ({
    ...o,
    count: grouped[o.key].length,
    disabled: grouped[o.key].length === 0,
  }));
  const activeKind =
    grouped[kind].length || !region
      ? kind
      : options.find(o => !o.disabled)?.key ?? kind;
  const rows = grouped[activeKind];
  const openLocation = useCallback(
    (location: string) =>
      navigation.push(ROUTES.LOCATION_DETAIL, { name: location }),
    [navigation],
  );

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.brand]}
            tintColor={colors.white}
            progressViewOffset={insets.top + TOP_BAR_HEIGHT}
          />
        }
      >
        <View
          style={[styles.hero, { paddingTop: insets.top + TOP_BAR_HEIGHT }]}
        >
          <View style={styles.overscroll} />
          <View style={styles.art} pointerEvents="none">
            {art.map((id, i) => (
              <FastImage
                key={id}
                source={{ uri: artworkUrl(id) }}
                style={[
                  styles.starter,
                  art.length === 3 && STARTER_POSITION[i],
                ]}
              />
            ))}
          </View>
          <AppText
            variant="heroTitle"
            color={colors.white}
            accessibilityRole="header"
            style={styles.title}
          >
            {title}
          </AppText>
          <AppText variant="caption" color={HERO_PALETTE.textMuted}>
            {region
              ? region.main_generation
                ? `Region utama Generasi ${generationRoman(
                    region.main_generation.name,
                  )}`
                : 'Region spin-off'
              : ' '}
          </AppText>
        </View>

        <View style={styles.body}>
          {isError && !region ? (
            <EmptyState
              icon={<WifiOff size={30} color={colors.ink3} />}
              title="Region gagal dimuat"
              body="Region ini belum pernah dibuka saat online. Sambungkan internet lalu coba lagi."
              actionLabel="Coba lagi"
              actionVariant="primary"
              onAction={refresh}
              style={styles.error}
            />
          ) : !region ? (
            <View style={styles.loading}>
              <Skeleton height={68} radius={16} />
              <Skeleton height={110} radius={16} />
              <Skeleton height={240} radius={16} />
            </View>
          ) : (
            <>
              <FactStrip
                background={colors.surface}
                items={[
                  { value: String(region.locations.length), label: 'Lokasi' },
                  {
                    value: String(region.version_groups.length),
                    label: 'Grup versi',
                  },
                  { value: String(region.pokedexes.length), label: 'Pokédex' },
                ]}
              />

              {region.version_groups.length > 0 && (
                <View style={styles.section}>
                  <Overline>Game</Overline>
                  <View style={styles.wrap}>
                    {region.version_groups.map(vg => (
                      <Tag key={vg} label={versionGroupLabel(vg)} />
                    ))}
                  </View>
                </View>
              )}

              {region.pokedexes.length > 0 && (
                <View style={styles.section}>
                  <Overline>Pokédex</Overline>
                  <View style={styles.wrap}>
                    {region.pokedexes.map(p => (
                      <DexCard
                        key={p}
                        name={p}
                        onPress={dex =>
                          navigation.push(ROUTES.POKEDEX_DETAIL, { name: dex })
                        }
                      />
                    ))}
                  </View>
                </View>
              )}

              {region.locations.length > 0 && (
                <View style={styles.section}>
                  <Overline>Lokasi</Overline>
                  <Segmented
                    options={options}
                    value={activeKind}
                    onChange={setKind}
                  />
                  <ListGroup>
                    {rows.map((l, i) => (
                      <LocationRow
                        key={l}
                        name={l}
                        region={name}
                        divider={i < rows.length - 1}
                        onPress={openLocation}
                      />
                    ))}
                  </ListGroup>
                </View>
              )}
            </>
          )}
        </View>
      </Animated.ScrollView>
      <CollapsingTopBar
        title={title}
        palette={HERO_PALETTE}
        scrollY={scrollY}
        revealAt={120}
        onBack={navigation.goBack}
      />
    </View>
  );
}

const STARTER_POSITION = [
  { width: 110, height: 110, right: 150, top: 26 },
  { width: 100, height: 100, right: 0, top: 30 },
  { width: 120, height: 120, right: 66, top: 0 },
] as const;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    minHeight: 230,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 48,
    backgroundColor: colors.ink,
  },
  overscroll: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1000,
    height: 1000,
    backgroundColor: colors.ink,
  },
  art: {
    position: 'absolute',
    right: 12,
    bottom: 40,
    width: 270,
    height: 150,
    alignItems: 'flex-end',
  },
  starter: {
    position: 'absolute',
    width: 130,
    height: 130,
    right: 0,
    top: 0,
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
  },
  body: {
    marginTop: -28,
    gap: 22,
    paddingTop: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.bg,
  },
  section: {
    gap: 10,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  loading: {
    gap: 16,
  },
  error: {
    paddingVertical: 40,
  },
});
