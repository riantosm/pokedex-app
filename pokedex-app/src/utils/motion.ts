import type { WithSpringConfig } from 'react-native-reanimated';

/** Skala saat elemen ditekan. */
export const PRESS_SCALE = 0.96;

/** Spring untuk efek tekan — cepat, tanpa memantul berlebihan. */
export const pressSpring: WithSpringConfig = {
  damping: 18,
  stiffness: 320,
  mass: 0.6,
};
