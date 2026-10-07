import type { MigrationManifest, PersistedState } from 'redux-persist';

/**
 * Versi state yang di-persist. Naikkan setiap bentuk data hasil `transformResponse` berubah dan tambah
 * migrasinya di bawah.
 */
export const PERSIST_VERSION = 2;

/**
 * Migrasi state redux-persist. Cache PokéAPI versi lama dibuang (diunduh ulang saat dibuka);
 * favorit & pengaturan tetap.
 * - 2 (v0.2.0): species/ability menyimpan semua bahasa data + field baru (egg group, Pokédex regional, …).
 *
 * `cacheKey` = `pokeApi.reducerPath` (dioper supaya file ini bisa dites tanpa memuat service API).
 */
export function createMigrations(cacheKey: string): MigrationManifest {
  const dropApiCache = (state: PersistedState): PersistedState => {
    if (!state) {
      return state;
    }
    const next = { ...state } as NonNullable<PersistedState> &
      Record<string, unknown>;
    delete next[cacheKey];
    return next;
  };
  return { 2: dropApiCache };
}
