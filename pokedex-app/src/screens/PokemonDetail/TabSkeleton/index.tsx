import { StyleSheet, View } from 'react-native';
import Skeleton from '@/components/atoms/Skeleton';

/** Placeholder isi tab selama data detail dimuat (desain: Detail · Loading). */
export default function TabSkeleton() {
  return (
    <View style={styles.root} accessibilityLabel="Memuat">
      <View style={styles.block}>
        <Skeleton />
        <Skeleton />
        <Skeleton width="60%" />
      </View>
      <Skeleton height={68} radius={16} />
      <View style={styles.list}>
        <Skeleton width={80} height={14} />
        <Skeleton width={140} />
        <Skeleton width={180} />
        <Skeleton width={120} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 24,
  },
  block: {
    gap: 10,
  },
  list: {
    gap: 18,
  },
});
