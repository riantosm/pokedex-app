import { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Overline from '@/components/atoms/Overline';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import EmptyState from '@/components/molecules/EmptyState';
import ListGroup from '@/components/molecules/ListGroup';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import TriggerRow from './TriggerRow';
import VariableChip from './VariableChip';

export default function EvolutionTriggers({
  navigation,
}: RootStackScreenProps<typeof ROUTES.EVOLUTION_TRIGGERS>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const triggers = useGetResourceIndexQuery('evolution-trigger');
  const variables = useGetResourceIndexQuery('evolution-variable');
  const { data: index } = useGetPokemonIndexQuery();
  const { refreshing, refresh } = useRefresh([
    triggers.refetch,
    variables.refetch,
  ]);

  const names = useMemo(
    () => new Map(index?.map(p => [p.id, p.name])),
    [index],
  );
  const speciesName = useCallback(
    (id: number) => names.get(id) ?? String(id),
    [names],
  );
  const onPress = useCallback(
    (name: string, title: string, ids: number[]) =>
      ids.length === 1
        ? navigation.push(ROUTES.POKEMON_DETAIL, {
            id: ids[0],
            name: speciesName(ids[0]),
          })
        : navigation.push(ROUTES.POKEMON_COLLECTION, {
            source: 'evolution-trigger',
            name,
            title,
          }),
    [navigation, speciesName],
  );

  const list = triggers.data ?? [];

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
          title="Pemicu evolusi"
          subtitle={
            triggers.data
              ? `${triggers.data.length} pemicu${
                  variables.data
                    ? ` · ${variables.data.length} variabel tersembunyi`
                    : ''
                }`
              : 'Memuat…'
          }
          onBack={navigation.goBack}
        />
        {triggers.isError && !triggers.data ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Pemicu gagal dimuat"
            body="Data belum tersimpan dan perangkat sedang offline."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
            style={styles.state}
          />
        ) : !triggers.data ? (
          <Skeleton height={420} radius={16} />
        ) : (
          <ListGroup>
            {list.map((t, i) => (
              <TriggerRow
                key={t.name}
                name={t.name}
                divider={i < list.length - 1}
                onPress={onPress}
                speciesName={speciesName}
              />
            ))}
          </ListGroup>
        )}

        {variables.data && variables.data.length > 0 && (
          <View style={styles.section}>
            <Overline>Variabel tersembunyi</Overline>
            <View style={styles.card}>
              <AppText
                variant="caption"
                color={colors.ink2}
                style={styles.explain}
              >
                Nilai acak tersembunyi yang menentukan cabang evolusi — mis.
                Wurmple menjadi Silcoon atau Cascoon.
              </AppText>
              <View style={styles.chips}>
                {variables.data.map(v => (
                  <VariableChip key={v.id} id={v.id} name={v.name} />
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
    gap: 10,
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  state: {
    paddingVertical: 60,
  },
});
