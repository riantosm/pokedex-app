import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import type { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGetResourceCountQuery } from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import { listItemEntering } from '@/utils/motion';
import GenerationCard from './GenerationCard';

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
/** Generasi terbaru dibuka default; sisanya dilipat supaya halaman tidak terlalu panjang. */
const OPEN_BY_DEFAULT = new Set([1, 9]);

export default function Games({
  navigation,
}: RootStackScreenProps<typeof ROUTES.GAMES>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const generations = useGetResourceCountQuery('generation');
  const groups = useGetResourceCountQuery('version-group');
  const versions = useGetResourceCountQuery('version');
  const { refreshing, refresh } = useRefresh([
    generations.refetch,
    groups.refetch,
    versions.refetch,
  ]);

  const subtitle =
    generations.data && groups.data && versions.data
      ? `${generations.data} generasi · ${groups.data} grup versi · ${versions.data} versi`
      : 'Memuat…';

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
          title="Game & generasi"
          subtitle={subtitle}
          onBack={navigation.goBack}
        />
        {GENERATIONS.map((id, i) => (
          <Animated.View key={id} entering={listItemEntering(i)}>
            <GenerationCard id={id} defaultOpen={OPEN_BY_DEFAULT.has(id)} />
          </Animated.View>
        ))}
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
    gap: 12,
    paddingHorizontal: 20,
  },
});
