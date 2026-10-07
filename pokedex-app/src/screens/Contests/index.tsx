import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import EmptyState from '@/components/molecules/EmptyState';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import { listItemEntering } from '@/utils/motion';
import ContestRow from './ContestRow';

export default function Contests({
  navigation,
}: RootStackScreenProps<typeof ROUTES.CONTESTS>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const { data, isError, refetch } = useGetResourceIndexQuery('contest-type');
  const { refreshing, refresh } = useRefresh([refetch]);

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
          title="Kontes"
          subtitle={
            data ? `${data.length} kategori · dari Ruby & Sapphire` : 'Memuat…'
          }
          onBack={navigation.goBack}
        />
        <AppText variant="caption" color={colors.ink2} style={styles.explain}>
          Tiap move punya kategori kontes. Berry dengan rasa yang cocok
          menaikkan kondisi kategori itu.
        </AppText>
        {isError && !data ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Kontes gagal dimuat"
            body="Data belum tersimpan dan perangkat sedang offline."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
            style={styles.state}
          />
        ) : !data ? (
          <Skeleton height={380} radius={16} />
        ) : (
          <View style={styles.list}>
            {data.map((c, i) => (
              <Animated.View key={c.name} entering={listItemEntering(i)}>
                <ContestRow
                  name={c.name}
                  onBerry={berry =>
                    navigation.push(ROUTES.BERRY_DETAIL, { name: berry })
                  }
                />
              </Animated.View>
            ))}
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
  explain: {
    lineHeight: 19,
  },
  list: {
    gap: 10,
  },
  state: {
    paddingVertical: 60,
  },
});
