import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Paginasi lokal: tampilkan `pageSize` item, tambah satu halaman tiap `loadMore`.
 * Kembali ke halaman pertama kalau `resetKey` berubah (mis. filter berubah).
 */
export function usePagedList<T>(
  items: readonly T[],
  pageSize = 20,
  resetKey?: unknown,
) {
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setPages(1);
  }, [resetKey]);

  const visible = useMemo(
    () => items.slice(0, pages * pageSize),
    [items, pages, pageSize],
  );
  const loadMore = useCallback(() => {
    if (visible.length < items.length) {
      setPages(p => p + 1);
    }
  }, [visible.length, items.length]);

  return { visible, loadMore };
}
