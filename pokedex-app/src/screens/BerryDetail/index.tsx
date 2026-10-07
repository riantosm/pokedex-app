import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import ItemSprite from '@/components/atoms/ItemSprite';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import TypeBadge from '@/components/atoms/TypeBadge';
import EmptyState from '@/components/molecules/EmptyState';
import FactStrip from '@/components/molecules/FactStrip';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import SectionHeader from '@/components/molecules/SectionHeader';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import type { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import {
  useGetBerryFirmnessQuery,
  useGetBerryQuery,
} from '@/services/api/berry.service';
import { useGetItemQuery } from '@/services/api/item.service';
import { colors } from '@/theme/colors';
import { BERRY_FLAVORS } from '@/types';
import { cleanFlavorText } from '@/utils/format';
import { pickEntry, pickName } from '@/utils/i18n';
import { FLAVOR_COLORS, flavorLabel } from '@/utils/labels';
import { isPokemonTypeName } from '@/utils/pokemon';

/** Skala bar rasa — potensi tertinggi di data berry adalah 40. */
const MAX_POTENCY = 40;
const CONTEST_OF_FLAVOR: Record<string, string> = {
  spicy: 'Cool',
  dry: 'Beauty',
  sweet: 'Cute',
  bitter: 'Smart',
  sour: 'Tough',
};

export default function BerryDetail({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.BERRY_DETAIL>) {
  const { name } = route.params;
  useStatusBarStyle('dark-content');
  const lang = useDataLanguage();
  const insets = useSafeAreaInsets();
  const { data: berry, isError, refetch } = useGetBerryQuery(name);
  const item = useGetItemQuery(`${name}-berry`);
  const firmness = useGetBerryFirmnessQuery(berry?.firmness?.name ?? '', {
    skip: !berry?.firmness,
  });
  const { refreshing, refresh } = useRefresh([refetch, item.refetch]);

  const effect = pickEntry(item.data?.effect_entries, lang);
  const giftType =
    berry?.natural_gift_type && isPokemonTypeName(berry.natural_gift_type.name)
      ? berry.natural_gift_type.name
      : null;

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
        <ScreenHeader title="" onBack={navigation.goBack} />
        <View style={styles.hero}>
          <View style={styles.circle}>
            <ItemSprite name={`${name}-berry`} size={96} />
          </View>
          <AppText
            variant="heroTitle"
            align="center"
            accessibilityRole="header"
          >
            {pickName(item.data?.names, lang, `${name}-berry`)}
          </AppText>
          {berry && (
            <View style={styles.pills}>
              {[
                `#${berry.id}`,
                berry.firmness &&
                  pickName(firmness.data?.names, lang, berry.firmness.name),
              ]
                .filter((l): l is string => !!l)
                .map(l => (
                  <View key={l} style={styles.pill}>
                    <AppText variant="label" color={colors.ink2}>
                      {l}
                    </AppText>
                  </View>
                ))}
            </View>
          )}
        </View>

        {isError && !berry ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Berry gagal dimuat"
            body="Berry ini belum pernah dibuka saat online. Sambungkan internet lalu coba lagi."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
          />
        ) : !berry ? (
          <Skeleton height={320} radius={24} />
        ) : (
          <View style={styles.card}>
            {effect && (
              <View style={styles.section}>
                <SectionHeader
                  title="Efek saat dipegang"
                  variant="subheading"
                />
                <AppText color={colors.ink2} style={styles.text}>
                  {cleanFlavorText(
                    (effect.short_effect ?? effect.effect).replace(
                      /^Held:\s*/,
                      '',
                    ),
                  )}
                </AppText>
              </View>
            )}

            <View style={styles.section}>
              <SectionHeader
                title="Rasa"
                meta={
                  berry.smoothness === null
                    ? undefined
                    : `Kehalusan ${berry.smoothness}`
                }
                variant="subheading"
              />
              {BERRY_FLAVORS.map(f => {
                const potency =
                  berry.flavors.find(x => x.flavor.name === f)?.potency ?? 0;
                return (
                  <View key={f} style={styles.flavorRow}>
                    <AppText
                      variant="caption"
                      color={colors.ink2}
                      style={styles.flavorName}
                    >
                      {flavorLabel(f)}
                    </AppText>
                    <View style={styles.track}>
                      <View
                        style={[
                          styles.bar,
                          {
                            width: `${(potency / MAX_POTENCY) * 100}%`,
                            backgroundColor: FLAVOR_COLORS[f],
                          },
                        ]}
                      />
                    </View>
                    <AppText
                      variant="captionStrong"
                      align="right"
                      color={potency ? colors.ink : colors.ink3}
                      style={styles.value}
                    >
                      {potency}
                    </AppText>
                    <AppText
                      variant="micro"
                      color={colors.ink3}
                      align="right"
                      style={styles.contest}
                    >
                      {CONTEST_OF_FLAVOR[f]}
                    </AppText>
                  </View>
                );
              })}
              <AppText variant="caption" color={colors.ink3}>
                Tiap rasa terkait satu kategori kontes (kolom kanan). Skala bar
                0–40.
              </AppText>
            </View>

            <View style={styles.section}>
              <SectionHeader title="Menanam" variant="subheading" />
              <FactStrip
                items={[
                  {
                    value: orDash(berry.growth_time, ' jam'),
                    label: 'Per tahap',
                  },
                  { value: orDash(berry.max_harvest), label: 'Panen maks' },
                  { value: orDash(berry.size, ' mm'), label: 'Ukuran' },
                  { value: orDash(berry.soil_dryness), label: 'Kering tanah' },
                ]}
              />
            </View>

            <View style={styles.gift}>
              <AppText
                variant="callout"
                color={colors.ink3}
                style={styles.flex}
              >
                Natural Gift
              </AppText>
              {giftType && (
                <TypeBadge type={giftType} style={styles.giftBadge} />
              )}
              <AppText variant="calloutStrong">
                {berry.natural_gift_power === null
                  ? '—'
                  : `Power ${berry.natural_gift_power}`}
              </AppText>
            </View>
          </View>
        )}
      </ScrollView>
      <StatusBarScrim />
    </View>
  );
}

/** Berry generasi baru belum punya data tanam di PokéAPI (`null`). */
function orDash(value: number | null, unit = ''): string {
  return value === null ? '—' : `${value}${unit}`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    gap: 16,
    paddingHorizontal: 20,
  },
  hero: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 8,
  },
  circle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  pills: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 13,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  card: {
    gap: 22,
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  section: {
    gap: 12,
  },
  text: {
    lineHeight: 23,
  },
  flavorRow: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flavorName: {
    width: 52,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#1B1B1F0F',
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
  value: {
    width: 22,
  },
  contest: {
    width: 44,
  },
  gift: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  giftBadge: {
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
  },
});
