import { useEffect, useState } from 'react';
import type {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';

type NetInfoModule = typeof import('@react-native-community/netinfo').default;

/**
 * NetInfo dimuat dengan aman. Kalau modul native belum ada di build (mis. APK lama sebelum
 * NetInfo dipasang), `import` biasa melempar error saat modul dievaluasi dan seluruh app gagal
 * start. Di sini kegagalan itu ditangkap: deteksi offline jatuh ke sinyal kegagalan request
 * PokéAPI (`networkSlice`) saja.
 */
let netInfo: NetInfoModule | null = null;
try {
  netInfo = require('@react-native-community/netinfo').default as NetInfoModule;
} catch (error) {
  console.warn(
    '[network] NetInfo tidak tersedia di build ini — rebuild app.',
    error,
  );
}

export interface ConnectionState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}

const UNKNOWN: ConnectionState = {
  isConnected: null,
  isInternetReachable: null,
};

/** Langganan perubahan koneksi; tanpa NetInfo → no-op. */
export function addConnectionListener(
  listener: (state: ConnectionState) => void,
): NetInfoSubscription {
  if (!netInfo) {
    return () => {};
  }
  return netInfo.addEventListener((s: NetInfoState) =>
    listener({
      isConnected: s.isConnected,
      isInternetReachable: s.isInternetReachable,
    }),
  );
}

/** Status koneksi terkini (`null` = belum diketahui / NetInfo tidak tersedia). */
export function useConnectionState(): ConnectionState {
  const [state, setState] = useState<ConnectionState>(UNKNOWN);
  useEffect(() => addConnectionListener(setState), []);
  return state;
}
