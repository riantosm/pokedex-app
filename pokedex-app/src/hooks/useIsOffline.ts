import { useNetInfo } from '@react-native-community/netinfo';
import { useAppSelector } from '@/store/hooks';
import { selectApiUnreachable } from '@/store/slices/networkSlice';

/**
 * `true` kalau perangkat tidak terhubung, internet tidak terjangkau menurut sistem, **atau**
 * request PokéAPI terakhir gagal tanpa response (mis. Wi-Fi tanpa internet, DNS gagal).
 * `null` dari NetInfo (belum diketahui) dianggap online.
 */
export function useIsOffline(): boolean {
  const { isConnected, isInternetReachable } = useNetInfo();
  const apiUnreachable = useAppSelector(selectApiUnreachable);
  return (
    isConnected === false || isInternetReachable === false || apiUnreachable
  );
}
