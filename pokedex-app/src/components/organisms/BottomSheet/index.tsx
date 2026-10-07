import { useEffect, useState, type ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { X } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';
import { SHEET_CLOSE_MS, SHEET_OPEN_MS } from '@/utils/motion';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/**
 * Sheet dari bawah dengan scrim. Tap scrim / tombol X / tombol back Android = tutup.
 * Tetap ter-mount selama animasi tutup berjalan.
 */
export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [sheetHeight, setSheetHeight] = useState(600);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: SHEET_OPEN_MS,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = withTiming(
        0,
        { duration: SHEET_CLOSE_MS, easing: Easing.in(Easing.cubic) },
        finished => {
          if (finished) {
            scheduleOnRN(setMounted, false);
          }
        },
      );
    }
  }, [visible, progress]);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [sheetHeight, 0]) },
    ],
  }));

  const onLayout = (e: LayoutChangeEvent) =>
    setSheetHeight(e.nativeEvent.layout.height);

  return (
    <Modal
      visible={mounted}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.scrim, scrimStyle]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Tutup"
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        onLayout={onLayout}
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + 24 },
          sheetStyle,
        ]}
        accessibilityViewIsModal
      >
        <View style={styles.handle} />
        {title && (
          <View style={styles.head}>
            <AppText variant="heading" accessibilityRole="header">
              {title}
            </AppText>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Tutup"
              hitSlop={12}
              onPress={onClose}
            >
              <X size={22} color={colors.ink2} />
            </PressableScale>
          </View>
        )}
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    backgroundColor: colors.scrim,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D9D9E0',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
