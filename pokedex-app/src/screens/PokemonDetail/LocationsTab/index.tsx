import { memo, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  ChevronDown,
  ChevronRight,
  Gamepad2,
  MapPin,
} from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import EncounterMethodIcon from '@/components/atoms/EncounterMethodIcon';
import PressableScale from '@/components/atoms/PressableScale';
import ListRow from '@/components/molecules/ListRow';
import BottomSheet from '@/components/organisms/BottomSheet';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import {
  useGetLocationAreaQuery,
  useGetLocationQuery,
  useGetRegionQuery,
} from '@/services/api/location.service';
import { colors } from '@/theme/colors';
import type { PokemonEncounterArea } from '@/types';
import { formatName } from '@/utils/format';
import { pickName } from '@/utils/i18n';
import {
  VERSION_COLORS,
  compareVersions,
  conditionLabel,
  encounterMethodLabel,
  versionLabel,
} from '@/utils/labels';

const AREA_PAGE = 6;

interface Row {
  versions: string[];
  methods: string[];
  minLevel: number;
  maxLevel: number;
  chance: number;
  conditions: string[];
}

/** Versi dengan detail encounter sama digabung jadi satu baris (mis. Red + Blue). */
function groupRows(area: PokemonEncounterArea, version: string | null): Row[] {
  const rows = new Map<string, Row>();
  for (const v of area.versions) {
    if (version && v.version !== version) {
      continue;
    }
    const conditions = v.conditions
      .map(conditionLabel)
      .filter((c): c is string => !!c);
    const key = [
      v.methods.join(','),
      v.minLevel,
      v.maxLevel,
      v.maxChance,
      conditions.join(','),
    ].join('|');
    const row = rows.get(key);
    if (row) {
      row.versions.push(v.version);
    } else {
      rows.set(key, {
        versions: [v.version],
        methods: v.methods,
        minLevel: v.minLevel,
        maxLevel: v.maxLevel,
        chance: v.maxChance,
        conditions,
      });
    }
  }
  return [...rows.values()]
    .map(r => ({ ...r, versions: r.versions.sort(compareVersions) }))
    .sort((a, b) => compareVersions(a.versions[0], b.versions[0]));
}

const AreaHead = memo(function AreaHeadInner({
  area,
  onPress,
}: {
  area: string;
  onPress: (location: string) => void;
}) {
  const lang = useDataLanguage();
  const { data } = useGetLocationAreaQuery(area);
  const location = useGetLocationQuery(data?.location.name ?? '', {
    skip: !data,
  });
  const region = useGetRegionQuery(location.data?.region?.name ?? '', {
    skip: !location.data?.region,
  });
  const fallback = area.replace(/-area$/, '');
  const title = data
    ? pickName(data.names, lang, '') ||
      pickName(location.data?.names, lang, fallback)
    : formatName(fallback);

  return (
    <PressableScale
      scaleTo={0.99}
      disabled={!data}
      accessibilityRole="link"
      onPress={() => data && onPress(data.location.name)}
      style={styles.areaHead}
    >
      <MapPin size={16} color={colors.brand} />
      <AppText variant="subheading" numberOfLines={1} style={styles.shrink}>
        {title}
      </AppText>
      {location.data?.region && (
        <AppText variant="caption" color={colors.ink3}>
          {pickName(region.data?.names, lang, location.data.region.name)}
        </AppText>
      )}
      <View style={styles.flex} />
      <ChevronRight size={16} color={colors.ink3} />
    </PressableScale>
  );
});

function GameTag({ version }: { version: string }) {
  const color = VERSION_COLORS[version] ?? colors.ink3;
  return (
    <View style={[styles.game, { backgroundColor: `${color}26` }]}>
      <View style={[styles.gameDot, { backgroundColor: color }]} />
      <AppText variant="micro" color={colors.ink2}>
        {versionLabel(version)}
      </AppText>
    </View>
  );
}

export interface LocationsTabProps {
  areas: PokemonEncounterArea[];
  onLocationPress: (location: string) => void;
}

/** Lokasi liar per area: game, metode, level, kondisi, dan peluang. */
export default function LocationsTab({
  areas,
  onLocationPress,
}: LocationsTabProps) {
  const { height } = useWindowDimensions();
  const [version, setVersion] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [limit, setLimit] = useState(AREA_PAGE);

  const versions = useMemo(() => {
    const all = new Set<string>();
    areas.forEach(a => a.versions.forEach(v => all.add(v.version)));
    return [...all].sort(compareVersions);
  }, [areas]);

  const sections = useMemo(
    () =>
      areas
        .map(a => ({ area: a.area, rows: groupRows(a, version) }))
        .filter(s => s.rows.length > 0)
        // Urutan PokéAPI acak antar region — urutkan dari game tertua (Kanto/Red dulu).
        .sort((a, b) =>
          compareVersions(a.rows[0].versions[0], b.rows[0].versions[0]),
        ),
    [areas, version],
  );
  const visible = sections.slice(0, limit);

  if (areas.length === 0) {
    return (
      <AppText color={colors.ink3} style={styles.empty}>
        Pokémon ini tidak ditemukan di alam liar — biasanya didapat dari
        evolusi, telur, hadiah, atau event.
      </AppText>
    );
  }

  return (
    <View style={styles.root}>
      <PressableScale
        scaleTo={0.99}
        accessibilityRole="button"
        accessibilityLabel="Pilih game"
        onPress={() => setPickerOpen(true)}
        style={styles.picker}
      >
        <Gamepad2 size={18} color={colors.ink2} />
        <AppText variant="calloutStrong" style={styles.flex} numberOfLines={1}>
          {version ? versionLabel(version) : 'Semua game'}
        </AppText>
        <AppText variant="caption" color={colors.ink3}>
          {`${sections.length} area · ${version ? 1 : versions.length} game`}
        </AppText>
        <ChevronDown size={18} color={colors.ink3} />
      </PressableScale>

      {visible.map(s => (
        <View key={s.area} style={styles.area}>
          <AreaHead area={s.area} onPress={onLocationPress} />
          <View style={styles.rows}>
            {s.rows.map((r, i) => (
              <View
                key={`${r.versions.join()}-${i}`}
                style={[styles.row, i < s.rows.length - 1 && styles.divider]}
              >
                <View style={styles.left}>
                  <View style={styles.games}>
                    {r.versions.map(v => (
                      <GameTag key={v} version={v} />
                    ))}
                  </View>
                  <View style={styles.meta}>
                    <EncounterMethodIcon method={r.methods[0]} size={14} />
                    <AppText variant="caption" color={colors.ink2}>
                      {`${r.methods.map(encounterMethodLabel).join(' / ')} · ${
                        r.minLevel === r.maxLevel
                          ? `Lv ${r.minLevel}`
                          : `Lv ${r.minLevel}–${r.maxLevel}`
                      }`}
                    </AppText>
                    {r.conditions.map(c => (
                      <View key={c} style={styles.cond}>
                        <AppText variant="micro" color={colors.ink2}>
                          {c}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.chance}>
                  <AppText variant="subheading">{`${r.chance}%`}</AppText>
                  <AppText variant="tab" color={colors.ink3}>
                    peluang
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}

      {sections.length > visible.length && (
        <Button
          label={`Tampilkan ${sections.length - visible.length} area lain`}
          variant="secondary"
          onPress={() => setLimit(l => l + AREA_PAGE * 2)}
        />
      )}

      <BottomSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Pilih game"
      >
        <ScrollView style={{ maxHeight: height * 0.6 }}>
          {[null, ...versions].map((v, i) => (
            <ListRow
              key={v ?? 'all'}
              title={v ? versionLabel(v) : 'Semua game'}
              minHeight={52}
              divider={i < versions.length}
              lead={
                v ? (
                  <View
                    style={[
                      styles.gameDot,
                      styles.pickerDot,
                      { backgroundColor: VERSION_COLORS[v] ?? colors.ink3 },
                    ]}
                  />
                ) : undefined
              }
              trailing={
                v === version ? (
                  <AppText variant="captionStrong" color={colors.brand}>
                    Dipilih
                  </AppText>
                ) : (
                  <View />
                )
              }
              onPress={() => {
                setVersion(v);
                setLimit(AREA_PAGE);
                setPickerOpen(false);
              }}
            />
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 20,
  },
  empty: {
    lineHeight: 22,
  },
  picker: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  shrink: {
    flexShrink: 1,
  },
  area: {
    gap: 8,
  },
  areaHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rows: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 14,
    backgroundColor: colors.bg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  left: {
    flex: 1,
    gap: 6,
  },
  games: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  game: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gameDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pickerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  cond: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 5,
    backgroundColor: colors.surface,
  },
  chance: {
    alignItems: 'flex-end',
  },
});
