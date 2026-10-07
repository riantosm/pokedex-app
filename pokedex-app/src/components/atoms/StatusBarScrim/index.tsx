import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export interface StatusBarScrimProps {
  color?: string;
}

/**
 * Latar di belakang status bar untuk layar tanpa header tetap — konten yang di-scroll
 * tidak lagi terlihat di balik ikon jam/baterai (Android edge-to-edge & iOS).
 */
export default function StatusBarScrim({
  color = colors.bgTranslucent,
}: StatusBarScrimProps) {
  const { top } = useSafeAreaInsets();
  return (
    <View
      pointerEvents="none"
      style={[styles.scrim, { height: top, backgroundColor: color }]}
    />
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});
