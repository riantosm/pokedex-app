import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Overline from '@/components/atoms/Overline';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import TypeChip from '@/components/molecules/TypeChip';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetGrowthRateQuery } from '@/services/api/group.service';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import { formatCount } from '@/utils/format';
import { formatGrowthFormula } from '@/utils/formula';
import { growthRateLabel } from '@/utils/labels';
import { tabContentEntering } from '@/utils/motion';
import ExampleTile from './ExampleTile';
import ExpChart from './ExpChart';

const DEFAULT_RATE = 'medium-slow';
const EXAMPLES = 3;

export default function GrowthRate({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.GROWTH_RATE>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const name = route.params?.name ?? DEFAULT_RATE;
  const [level, setLevel] = useState(50);
  const rates = useGetResourceIndexQuery('growth-rate');
  const { data: rate, isError, refetch } = useGetGrowthRateQuery(name);
  const { data: index } = useGetPokemonIndexQuery();
  const { refreshing, refresh } = useRefresh([rates.refetch, refetch]);

  const openPokemon = useCallback(
    (id: number, pokemonName: string) =>
      navigation.push(ROUTES.POKEMON_DETAIL, { id, name: pokemonName }),
    [navigation],
  );

  const total = rate?.levels.find(l => l.level === 100)?.experience ?? 0;
  const examples = (rate?.speciesIds.slice(0, EXAMPLES) ?? []).map(id => ({
    id,
    name: index?.find(p => p.id === id)?.name ?? String(id),
  }));

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
          title="Growth rate"
          subtitle={
            rates.data
              ? `${rates.data.length} kurva EXP · level 1–100`
              : 'Memuat…'
          }
          onBack={navigation.goBack}
        />
        <ChipScroller>
          {(rates.data ?? [{ id: 0, name }]).map(r => (
            <TypeChip
              key={r.name}
              label={growthRateLabel(r.name)}
              active={r.name === name}
              onPress={() => navigation.setParams({ name: r.name })}
            />
          ))}
        </ChipScroller>

        {isError && !rate ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Growth rate gagal dimuat"
            body="Data belum tersimpan dan perangkat sedang offline."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
            style={styles.state}
          />
        ) : !rate ? (
          <Skeleton height={380} radius={24} />
        ) : (
          <Animated.View
            key={name}
            entering={tabContentEntering}
            style={styles.section}
          >
            <View style={styles.card}>
              <View style={styles.top}>
                <AppText variant="heroTitle" style={styles.total}>
                  {`${formatCount(total)} EXP`}
                </AppText>
                <AppText variant="caption" color={colors.ink3}>
                  {`untuk mencapai level 100 · dipakai ${formatCount(
                    rate.speciesIds.length,
                  )} Pokémon`}
                </AppText>
              </View>
              <View style={styles.formula}>
                {formatGrowthFormula(rate.formula).map(line => (
                  <View key={line.expression} style={styles.formulaLine}>
                    <AppText variant="caption">{`EXP = ${line.expression}`}</AppText>
                    {line.condition && (
                      <AppText variant="micro" color={colors.ink3}>
                        {line.condition}
                      </AppText>
                    )}
                  </View>
                ))}
              </View>
              <ExpChart
                levels={rate.levels}
                selected={level}
                onSelect={setLevel}
              />
            </View>

            {examples.length > 0 && (
              <View style={styles.section}>
                <Overline>Contoh Pokémon</Overline>
                <View style={styles.examples}>
                  {examples.map(p => (
                    <ExampleTile
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      onPress={openPokemon}
                    />
                  ))}
                </View>
                {rate.speciesIds.length > EXAMPLES && (
                  <Button
                    label={`Lihat ${formatCount(
                      rate.speciesIds.length,
                    )} Pokémon`}
                    variant="secondary"
                    onPress={() =>
                      navigation.push(ROUTES.POKEMON_COLLECTION, {
                        source: 'growth-rate',
                        name,
                        title: `Growth rate ${growthRateLabel(name)}`,
                      })
                    }
                  />
                )}
              </View>
            )}
          </Animated.View>
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
  card: {
    gap: 18,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  top: {
    gap: 4,
  },
  total: {
    fontSize: 26,
    lineHeight: 34,
  },
  formula: {
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.bg,
  },
  formulaLine: {
    gap: 2,
  },
  examples: {
    flexDirection: 'row',
    gap: 10,
  },
  state: {
    paddingVertical: 60,
  },
});
