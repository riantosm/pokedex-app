import { ScrollView, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Droplet,
  Mountain,
  Sprout,
  Trees,
  Waves,
  WifiOff,
} from 'lucide-react-native';
import Overline from '@/components/atoms/Overline';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import ListGroup from '@/components/molecules/ListGroup';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import TypeChip from '@/components/molecules/TypeChip';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import {
  useGetResourceCountQuery,
  useGetResourceIndexQuery,
} from '@/services/api/resource.service';
import { colors } from '@/theme/colors';
import { formatCount, formatName } from '@/utils/format';
import RegionRow from './RegionRow';

const AREA_ICON: Record<string, typeof Trees> = {
  forest: Trees,
  field: Sprout,
  mountain: Mountain,
  pond: Droplet,
  sea: Waves,
};

export default function RegionList({
  navigation,
}: RootStackScreenProps<typeof ROUTES.REGION_LIST>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const regions = useGetResourceIndexQuery('region');
  const palPark = useGetResourceIndexQuery('pal-park-area');
  const locations = useGetResourceCountQuery('location');
  const { refreshing, refresh } = useRefresh([
    regions.refetch,
    palPark.refetch,
    locations.refetch,
  ]);

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
          title="Region & lokasi"
          subtitle={
            regions.data
              ? `${regions.data.length} region · ${
                  locations.data ? formatCount(locations.data) : '…'
                } lokasi`
              : 'Memuat…'
          }
          onBack={navigation.goBack}
        />
        {regions.isError && !regions.data ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Region gagal dimuat"
            body="Data belum tersimpan dan perangkat sedang offline."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
          />
        ) : !regions.data ? (
          <Skeleton height={420} radius={16} />
        ) : (
          <ListGroup>
            {regions.data.map((r, i) => (
              <RegionRow
                key={r.name}
                name={r.name}
                divider={i < regions.data!.length - 1}
                onPress={name =>
                  navigation.navigate(ROUTES.REGION_DETAIL, { name })
                }
              />
            ))}
          </ListGroup>
        )}
        {palPark.data && (
          <View style={styles.group}>
            <Overline>{`Pal Park · ${palPark.data.length} area`}</Overline>
            <ChipScroller>
              {palPark.data.map(a => {
                const Icon = AREA_ICON[a.name] ?? Trees;
                return (
                  <TypeChip
                    key={a.name}
                    label={formatName(a.name)}
                    onPress={() =>
                      navigation.navigate(ROUTES.PAL_PARK, { area: a.name })
                    }
                    icon={<Icon size={14} color={colors.ink2} />}
                  />
                );
              })}
            </ChipScroller>
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
    gap: 20,
    paddingHorizontal: 20,
  },
  group: {
    gap: 10,
  },
});
