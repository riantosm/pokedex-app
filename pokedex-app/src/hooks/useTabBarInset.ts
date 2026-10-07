import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarOverlayHeight } from '@/components/organisms/TabBar';

/** Padding bawah konten layar tab supaya item terakhir tidak tertutup tab bar melayang. */
export function useTabBarInset(extra = 16): number {
  const { bottom } = useSafeAreaInsets();
  return tabBarOverlayHeight(bottom) + extra;
}
