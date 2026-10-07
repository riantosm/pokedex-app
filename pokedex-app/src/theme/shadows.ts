import type { ViewStyle } from 'react-native';
import { colors } from './colors';

/** Preset shadow — spread ke style, jangan tulis shadow inline. */
export const shadows = {
  tabBar: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
} satisfies Record<string, ViewStyle>;
