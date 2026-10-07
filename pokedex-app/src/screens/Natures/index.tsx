import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import EmptyState from '@/components/molecules/EmptyState';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import type { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import NatureRow, { NATURE_LIKE_WIDTH, NATURE_STAT_WIDTH } from './NatureRow';

export default function Natures({
  navigation,
}: RootStackScreenProps<typeof ROUTES.NATURES>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const { data, isError, refetch } = useGetResourceIndexQuery('nature');
  const { refreshing, refresh } = useRefresh([refetch]);
  const natures = data
    ? [...data].sort((a, b) => a.name.localeCompare(b.name))
    : [];

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
          title="Nature"
          subtitle={
            data ? `${data.length} nature · stat naik & turun 10%` : 'Memuat…'
          }
          onBack={navigation.goBack}
        />
        {isError && !data ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Nature gagal dimuat"
            body="Data belum tersimpan dan perangkat sedang offline."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
            style={styles.state}
          />
        ) : !data ? (
          <Skeleton height={520} radius={16} />
        ) : (
          <>
            <View style={styles.table}>
              <View style={styles.head}>
                <AppText
                  variant="micro"
                  color={colors.ink3}
                  style={styles.flex}
                >
                  NATURE
                </AppText>
                <AppText variant="micro" color={colors.ink3} style={styles.col}>
                  NAIK
                </AppText>
                <AppText variant="micro" color={colors.ink3} style={styles.col}>
                  TURUN
                </AppText>
                <AppText
                  variant="micro"
                  color={colors.ink3}
                  style={styles.likeCol}
                >
                  SUKA
                </AppText>
              </View>
              {natures.map((n, i) => (
                <NatureRow
                  key={n.name}
                  name={n.name}
                  divider={i < natures.length - 1}
                />
              ))}
            </View>
            <AppText variant="caption" color={colors.ink3}>
              Tap nature untuk rasa yang dibenci, Pokéathlon, dan gaya
              bertarung. Atk Attack, Def Defense, SpA Sp. Atk, SpD Sp. Def, Spe
              Speed.
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
  table: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  head: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  flex: {
    flex: 1,
  },
  col: {
    width: NATURE_STAT_WIDTH,
  },
  likeCol: {
    width: NATURE_LIKE_WIDTH,
  },
  state: {
    paddingVertical: 60,
  },
});
