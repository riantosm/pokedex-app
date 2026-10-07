import type { ReactElement } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  type FlatListProps,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { colors } from '@/theme/colors';

export const SCREEN_PADDING = 20;
export const GRID_GAP = 12;

export interface ScreenListProps<T> {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  /** Header (judul, kontrol) — ikut tergulir. */
  header: ReactElement;
  /** Ditampilkan kalau `data` kosong (loading / kosong / error). */
  empty?: ReactElement;
  refreshing: boolean;
  onRefresh: () => void;
  numColumns?: 1 | 2 | 3;
  onEndReached?: () => void;
  /** `tab` = ruang untuk tab bar melayang; `stack` = safe area bawah saja. */
  inset?: 'tab' | 'stack';
  /** Jarak antar item (baris & kolom): 12 untuk grid, 0 untuk daftar yang sudah punya pemisah. */
  gap?: 0 | typeof GRID_GAP;
  extraProps?: Partial<FlatListProps<T>>;
}

/**
 * Kerangka layar daftar: latar `bg`, latar status bar, pull-to-refresh, inset bawah, dan
 * tuning FlatList yang sama dengan Pokédex (batch kecil, `removeClippedSubviews` di Android).
 */
export default function ScreenList<T>({
  data,
  renderItem,
  keyExtractor,
  header,
  empty,
  refreshing,
  onRefresh,
  numColumns = 1,
  onEndReached,
  inset = 'stack',
  gap = GRID_GAP,
  extraProps,
}: ScreenListProps<T>) {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const bottom = inset === 'tab' ? tabInset : insets.bottom + 32;

  return (
    <View style={styles.root}>
      <FlatList
        data={data}
        key={numColumns}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
        ItemSeparatorComponent={gap ? GridSeparator : undefined}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={styles.header}
        ListEmptyComponent={empty}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 4, paddingBottom: bottom },
        ]}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={60}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.brand]}
            tintColor={colors.brand}
            progressViewOffset={insets.top}
          />
        }
        {...extraProps}
      />
      <StatusBarScrim />
    </View>
  );
}

function GridSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    height: GRID_GAP,
  },
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_PADDING,
  },
  header: {
    paddingBottom: 16,
  },
});
