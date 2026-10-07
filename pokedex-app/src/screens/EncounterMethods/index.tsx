import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import EncounterMethodIcon from '@/components/atoms/EncounterMethodIcon';
import Overline from '@/components/atoms/Overline';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import Tag from '@/components/atoms/Tag';
import EmptyState from '@/components/molecules/EmptyState';
import ListGroup from '@/components/molecules/ListGroup';
import ListRow from '@/components/molecules/ListRow';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import type { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import { formatName } from '@/utils/format';
import { compareEncounterConditions } from '@/utils/labels';
import ConditionCard from './ConditionCard';

/** Metode utama yang paling sering ditemui; sisanya ditampilkan sebagai label. */
const MAIN_METHODS: { key: string; members: string[]; body: string }[] = [
  { key: 'walk', members: ['walk'], body: 'Berjalan di rumput tinggi' },
  {
    key: 'old-rod',
    members: ['old-rod', 'good-rod', 'super-rod'],
    body: 'Memancing di air',
  },
  { key: 'surf', members: ['surf'], body: 'Berselancar di atas air' },
  { key: 'rock-smash', members: ['rock-smash'], body: 'Memecahkan batu' },
  { key: 'headbutt', members: ['headbutt'], body: 'Menyundul pohon' },
  { key: 'gift', members: ['gift'], body: 'Diberikan oleh karakter' },
  {
    key: 'static',
    members: ['static'],
    body: 'Encounter tetap, mis. Pokémon legendaris',
  },
];

const ICON_ROW = (method: string) => (
  <View style={styles.lead}>
    <EncounterMethodIcon method={method} />
  </View>
);

export default function EncounterMethods({
  navigation,
}: RootStackScreenProps<typeof ROUTES.ENCOUNTER_METHODS>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const [showAll, setShowAll] = useState(false);
  const methods = useGetResourceIndexQuery('encounter-method');
  const conditions = useGetResourceIndexQuery('encounter-condition');
  const { refreshing, refresh } = useRefresh([
    methods.refetch,
    conditions.refetch,
  ]);

  const available = new Set(methods.data?.map(m => m.name));
  const main = MAIN_METHODS.filter(m => m.members.some(x => available.has(x)));
  const mainNames = new Set(main.flatMap(m => m.members));
  const rest = (methods.data ?? []).filter(m => !mainNames.has(m.name));

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
          title="Metode encounter"
          subtitle={
            methods.data
              ? `${methods.data.length} metode${
                  conditions.data ? ` · ${conditions.data.length} kondisi` : ''
                }`
              : 'Memuat…'
          }
          onBack={navigation.goBack}
        />

        {methods.isError && !methods.data ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Metode gagal dimuat"
            body="Data belum tersimpan dan perangkat sedang offline."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
            style={styles.state}
          />
        ) : !methods.data ? (
          <Skeleton height={420} radius={16} />
        ) : (
          <View style={styles.section}>
            <ListGroup title="Metode">
              {main.map((m, i) => (
                <ListRow
                  key={m.key}
                  title={m.members
                    .filter(x => available.has(x))
                    .map(formatName)
                    .join(' · ')}
                  subtitle={m.body}
                  divider={i < main.length - 1}
                  lead={ICON_ROW(m.key)}
                />
              ))}
            </ListGroup>
            {rest.length > 0 &&
              (showAll ? (
                <Animated.View
                  entering={FadeIn.duration(180)}
                  style={styles.rest}
                >
                  {rest.map(m => (
                    <Tag key={m.name} label={formatName(m.name)} size="sm" />
                  ))}
                </Animated.View>
              ) : (
                <AppText
                  variant="caption"
                  color={colors.brand}
                  accessibilityRole="button"
                  onPress={() => setShowAll(true)}
                >
                  {`+${rest.length} metode lain, mis. ${rest
                    .slice(0, 3)
                    .map(m => formatName(m.name))
                    .join(', ')} — tampilkan semua`}
                </AppText>
              ))}
          </View>
        )}

        {conditions.data && conditions.data.length > 0 && (
          <View style={styles.section}>
            <Overline>Kondisi</Overline>
            <View style={styles.card}>
              <AppText
                variant="caption"
                color={colors.ink2}
                style={styles.explain}
              >
                Syarat tambahan agar Pokémon muncul. Tampil sebagai label di tab
                Lokasi detail Pokémon.
              </AppText>
              <View style={styles.grid}>
                {[...conditions.data]
                  .sort((a, b) => compareEncounterConditions(a.name, b.name))
                  .map(c => (
                    <ConditionCard key={c.name} name={c.name} />
                  ))}
              </View>
            </View>
          </View>
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
    gap: 8,
  },
  lead: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  rest: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  explain: {
    lineHeight: 19,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  state: {
    paddingVertical: 60,
  },
});
