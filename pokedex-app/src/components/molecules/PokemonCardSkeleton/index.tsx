import { StyleSheet, View, type ViewStyle } from 'react-native';
import Skeleton from '@/components/atoms/Skeleton';
import { POKEMON_CARD_HEIGHT } from '@/components/molecules/PokemonCard';
import { colors } from '@/theme/colors';

export interface PokemonCardSkeletonProps {
  style?: ViewStyle;
}

/** Placeholder seukuran `PokemonCard` selama daftar dimuat. */
export default function PokemonCardSkeleton({
  style,
}: PokemonCardSkeletonProps) {
  return (
    <View
      style={[styles.card, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Skeleton width={32} height={10} radius={5} />
      <Skeleton width={96} height={16} radius={8} />
      <Skeleton width={52} height={20} radius={10} />
      <Skeleton width={64} height={64} radius={32} style={styles.art} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: POKEMON_CARD_HEIGHT,
    padding: 14,
    gap: 8,
    borderRadius: 20,
    backgroundColor: colors.skeleton,
  },
  art: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },
});
