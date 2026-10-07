import { useEffect } from 'react';
import { type DimensionValue, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { skeletonPulse } from '@/utils/motion';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  color?: string;
  style?: ViewStyle;
}

/** Placeholder berdenyut selama data dimuat. */
export default function Skeleton({
  width = '100%',
  height = 12,
  radius = 6,
  color = colors.skeletonHighlight,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(skeletonPulse.minOpacity, skeletonPulse.timing),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: radius, backgroundColor: color },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
