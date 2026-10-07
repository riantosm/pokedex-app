import type { WithSpringConfig } from 'react-native-reanimated';

/** Skala saat elemen ditekan. */
export const PRESS_SCALE = 0.96;

/** Spring untuk efek tekan — cepat, tanpa memantul berlebihan. */
export const pressSpring: WithSpringConfig = {
  damping: 18,
  stiffness: 320,
  mass: 0.6,
};

/** Denyut skeleton: bolak-balik opacity 1 → 0,45. */
export const skeletonPulse = {
  minOpacity: 0.45,
  timing: { duration: 800 },
};

/** Durasi buka / tutup bottom sheet (ms). */
export const SHEET_OPEN_MS = 280;
export const SHEET_CLOSE_MS = 220;
