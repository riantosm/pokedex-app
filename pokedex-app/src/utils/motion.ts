import {
  Easing,
  FadeIn,
  FadeInDown,
  type WithSpringConfig,
} from 'react-native-reanimated';

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

/**
 * Kartu grid muncul saat di-scroll: naik sedikit + fade. Kolom kanan tertunda 60 ms
 * supaya satu baris terasa "mengalir", bukan muncul bersamaan.
 */
export const gridItemEntering = (index: number) =>
  FadeInDown.duration(320)
    .delay((index % 2) * 60)
    .easing(Easing.out(Easing.cubic))
    .withInitialValues({ transform: [{ translateY: 16 }] });

/** Baris daftar (evolusi, info) muncul berurutan. */
export const listItemEntering = (index: number) =>
  FadeInDown.duration(300)
    .delay(Math.min(index, 8) * 50)
    .easing(Easing.out(Easing.cubic))
    .withInitialValues({ transform: [{ translateY: 12 }] });

/** Isi tab berganti. */
export const tabContentEntering = FadeIn.duration(220);

/** Seberapa jauh artwork hero bergerak relatif terhadap scroll (parallax). */
export const HERO_PARALLAX = 0.35;
