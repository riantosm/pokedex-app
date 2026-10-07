import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wifi, WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import { tabBarOverlayHeight } from '@/components/organisms/TabBar';
import { useIsOffline } from '@/hooks/useIsOffline';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

const BACK_ONLINE_MS = 2500;

/**
 * Pill status koneksi, global di atas semua layar (di atas posisi tab bar).
 * Offline → tetap tampil. Kembali online → tampil sebentar lalu hilang.
 */
export default function OfflineBanner() {
  const offline = useIsOffline();
  const { bottom } = useSafeAreaInsets();
  const wasOffline = useRef(false);
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    if (offline) {
      wasOffline.current = true;
      setBackOnline(false);
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      setBackOnline(true);
      const timer = setTimeout(() => setBackOnline(false), BACK_ONLINE_MS);
      return () => clearTimeout(timer);
    }
  }, [offline]);

  if (!offline && !backOnline) {
    return null;
  }

  return (
    <Animated.View
      key={offline ? 'offline' : 'online'}
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        styles.pill,
        { bottom: tabBarOverlayHeight(bottom) + 8 },
        offline ? styles.offline : styles.online,
      ]}
    >
      {offline ? (
        <WifiOff size={16} color={colors.white} />
      ) : (
        <Wifi size={16} color={colors.white} />
      )}
      <AppText variant="captionStrong" color={colors.white}>
        {offline ? 'Offline · menampilkan data tersimpan' : 'Kembali online'}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    alignSelf: 'center',
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadows.tabBar,
  },
  offline: {
    backgroundColor: colors.ink,
  },
  online: {
    backgroundColor: colors.success,
  },
});
