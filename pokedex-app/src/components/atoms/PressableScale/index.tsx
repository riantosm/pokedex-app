import { forwardRef, type ComponentRef } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PRESS_SCALE, pressSpring } from '@/utils/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Skala saat ditekan. Default `PRESS_SCALE`. */
  scaleTo?: number;
}

/** Primitive tunggal untuk semua elemen yang bisa di-tap. */
const PressableScale = forwardRef<
  ComponentRef<typeof Pressable>,
  PressableScaleProps
>(function PressableScaleImpl(
  { style, scaleTo = PRESS_SCALE, onPressIn, onPressOut, ...rest },
  ref,
) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      ref={ref}
      style={[style, animatedStyle]}
      onPressIn={e => {
        scale.value = withSpring(scaleTo, pressSpring);
        onPressIn?.(e);
      }}
      onPressOut={e => {
        scale.value = withSpring(1, pressSpring);
        onPressOut?.(e);
      }}
      {...rest}
    />
  );
});

export default PressableScale;
