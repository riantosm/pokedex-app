import { useCallback, useRef, useState } from 'react';

/**
 * State untuk RefreshControl. `refresh` menjalankan semua refetch bersamaan dan
 * menunggu sampai selesai (berhasil atau gagal) sebelum indikator disembunyikan.
 * Daftar refetch boleh berubah antar render — selalu dipakai versi terbaru.
 */
export function useRefresh(refetchers: Array<() => unknown>) {
  const [refreshing, setRefreshing] = useState(false);
  const latest = useRef(refetchers);
  latest.current = refetchers;

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled(latest.current.map(fn => Promise.resolve(fn())));
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { refreshing, refresh };
}
