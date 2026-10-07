import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import IconButton from '@/components/atoms/IconButton';
import type { TypePalette } from '@/theme/colors';

export const TOP_BAR_HEIGHT = 56;

export interface CollapsingTopBarProps {
  title: string;
  palette: TypePalette;
  scrollY: SharedValue<number>;
  /** Latar & judul mulai muncul setelah scroll melewati nilai ini. */
  revealAt: number;
  onBack: () => void;
  /** Aksi di kanan (mis. tombol favorit). */
  right?: ReactNode;
}

/** Bar atas melayang di atas hero berwarna: tombol selalu terlihat, latar + judul muncul saat di-scroll. */
export default function CollapsingTopBar({
  title,
  palette,
  scrollY,
  revealAt,
  onBack,
  right,
}: CollapsingTopBarProps) {
  const insets = useSafeAreaInsets();

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [revealAt - 60, revealAt],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [revealAt - 20, revealAt + 20],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [revealAt - 20, revealAt + 20],
          [8, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View
      style={[styles.root, { paddingTop: insets.top }]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: palette.background },
          backgroundStyle,
        ]}
      />
      <View style={styles.row} pointerEvents="box-none">
        <IconButton
          accessibilityLabel="Kembali"
          onPress={onBack}
          icon={<ArrowLeft size={20} color={palette.text} />}
        />
        <Animated.View style={[styles.title, titleStyle]} pointerEvents="none">
          <AppText variant="subheading" color={palette.text} numberOfLines={1}>
            {title}
          </AppText>
        </Animated.View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  row: {
    height: TOP_BAR_HEIGHT,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
