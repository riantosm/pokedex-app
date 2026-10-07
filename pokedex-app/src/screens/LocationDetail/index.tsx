import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPinOff, WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import EncounterMethodIcon from '@/components/atoms/EncounterMethodIcon';
import Overline from '@/components/atoms/Overline';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import ListGroup from '@/components/molecules/ListGroup';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import TypeChip from '@/components/molecules/TypeChip';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import {
  useGetLocationAreasQuery,
  useGetLocationQuery,
  useGetRegionQuery,
} from '@/services/api/location.service';
import { colors } from '@/theme/colors';
import type { LocationArea, PokemonTypeName } from '@/types';
import { pickName } from '@/utils/i18n';
import {
  VERSION_COLORS,
  compareVersions,
  encounterMethodLabel,
  generationRoman,
  versionLabel,
} from '@/utils/labels';
import { listItemEntering } from '@/utils/motion';
import EncounterRow from './EncounterRow';

interface MethodGroup {
  method: string;
  rows: {
    id: number;
    name: string;
    minLevel: number;
    maxLevel: number;
    chance: number;
  }[];
}

/** Encounter satu area di satu versi, dikelompokkan per metode, urut peluang terbesar. */
function groupByMethod(area: LocationArea, version: string): MethodGroup[] {
  const groups = new Map<string, MethodGroup['rows']>();
  for (const e of area.encounters) {
    const v = e.versions.find(x => x.version === version);
    if (!v) {
      continue;
    }
    for (const method of v.methods) {
      const rows = groups.get(method) ?? [];
      rows.push({
        id: e.id,
        name: e.name,
        minLevel: v.minLevel,
        maxLevel: v.maxLevel,
        chance: v.maxChance,
      });
      groups.set(method, rows);
    }
  }
  return [...groups.entries()].map(([method, rows]) => ({
    method,
    rows: rows.sort((a, b) => b.chance - a.chance || a.id - b.id),
  }));
}

export default function LocationDetail({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.LOCATION_DETAIL>) {
  const { name } = route.params;
  useStatusBarStyle('dark-content');
  const lang = useDataLanguage();
  const insets = useSafeAreaInsets();
  const location = useGetLocationQuery(name);
  const areaKey = location.data?.areas.join(',') ?? '';
  const areas = useGetLocationAreasQuery(areaKey, { skip: !areaKey });
  const region = useGetRegionQuery(location.data?.region?.name ?? '', {
    skip: !location.data?.region,
  });
  const { refreshing, refresh } = useRefresh([
    location.refetch,
    ...(areaKey ? [areas.refetch] : []),
  ]);
  const [picked, setPicked] = useState<string | null>(null);

  const versions = useMemo(() => {
    const seen = new Set<string>();
    areas.data?.forEach(a =>
      a.encounters.forEach(e => e.versions.forEach(v => seen.add(v.version))),
    );
    return [...seen].sort(compareVersions);
  }, [areas.data]);
  const version =
    picked && versions.includes(picked) ? picked : versions[0] ?? null;

  const sections = useMemo(
    () =>
      version && areas.data
        ? areas.data
            .map(area => ({ area, groups: groupByMethod(area, version) }))
            .filter(s => s.groups.length > 0)
        : [],
    [areas.data, version],
  );

  const openPokemon = useCallback(
    (id: number, pokemonName: string, types?: PokemonTypeName[]) =>
      navigation.push(ROUTES.POKEMON_DETAIL, { id, name: pokemonName, types }),
    [navigation],
  );

  const loc = location.data;
  const subtitle = loc
    ? [
        loc.region ? pickName(region.data?.names, lang, loc.region.name) : null,
        loc.generations.length
          ? `ada di Generasi ${loc.generations.map(generationRoman).join(', ')}`
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Memuat…';
  const failed =
    (location.isError && !loc) || (areas.isError && !areas.data && !!areaKey);
  const loading = !failed && (!loc || (!!areaKey && !areas.data));

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 4, paddingBottom: insets.bottom + 32 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.brand]}
            tintColor={colors.brand}
            progressViewOffset={insets.top}
          />
        }
      >
        <ScreenHeader
          title={pickName(loc?.names, lang, name)}
          subtitle={subtitle || undefined}
          onBack={navigation.goBack}
        />

        {failed ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Lokasi gagal dimuat"
            body="Lokasi ini belum pernah dibuka saat online. Sambungkan internet lalu coba lagi."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
            style={styles.state}
          />
        ) : loading ? (
          <View style={styles.section}>
            <Skeleton height={36} radius={18} width="70%" />
            <Skeleton height={64} radius={14} />
            <Skeleton height={300} radius={16} />
          </View>
        ) : sections.length === 0 ? (
          <EmptyState
            icon={<MapPinOff size={30} color={colors.ink3} />}
            title="Tidak ada Pokémon liar"
            body="PokéAPI tidak mencatat encounter di lokasi ini (mis. kota atau bangunan)."
            style={styles.state}
          />
        ) : (
          <>
            {versions.length > 1 && (
              <ChipScroller>
                {versions.map(v => (
                  <TypeChip
                    key={v}
                    label={versionLabel(v)}
                    dotColor={VERSION_COLORS[v] ?? colors.ink3}
                    active={v === version}
                    onPress={() => setPicked(v)}
                  />
                ))}
              </ChipScroller>
            )}
            {sections.map(({ area, groups }) => (
              <View key={area.name} style={styles.section}>
                {sections.length > 1 && (
                  <Overline>{pickName(area.names, lang, area.name)}</Overline>
                )}
                {groups.map(g => (
                  <View key={g.method} style={styles.section}>
                    <View style={styles.method}>
                      <EncounterMethodIcon method={g.method} />
                      <View style={styles.flex}>
                        <AppText variant="calloutStrong">
                          {encounterMethodLabel(g.method)}
                        </AppText>
                        <AppText variant="caption" color={colors.ink3}>
                          {`Metode encounter · ${
                            g.rows.length
                          } Pokémon di ${versionLabel(version!)}`}
                        </AppText>
                      </View>
                    </View>
                    <ListGroup>
                      {g.rows.map((r, i) => (
                        <Animated.View
                          key={`${version}-${r.id}`}
                          entering={listItemEntering(i)}
                        >
                          <EncounterRow
                            {...r}
                            divider={i < g.rows.length - 1}
                            onPress={openPokemon}
                          />
                        </Animated.View>
                      ))}
                    </ListGroup>
                  </View>
                ))}
              </View>
            ))}
            <AppText variant="caption" color={colors.ink3}>
              Peluang = kemungkinan muncul tiap encounter di versi yang dipilih.
            </AppText>
          </>
        )}
      </ScrollView>
      <StatusBarScrim />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    gap: 16,
    paddingHorizontal: 20,
  },
  section: {
    gap: 12,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
  },
  state: {
    paddingVertical: 60,
  },
});
