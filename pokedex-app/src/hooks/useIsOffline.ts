import { useNetInfo } from '@react-native-community/netinfo';

/**
 * `true` kalau perangkat tidak terhubung, atau terhubung tapi internet tidak terjangkau
 * (mis. Wi-Fi tanpa internet). `null` dari NetInfo (belum diketahui) dianggap online.
 */
export function useIsOffline(): boolean {
  const { isConnected, isInternetReachable } = useNetInfo();
  return isConnected === false || isInternetReachable === false;
}
