import { useAppSelector } from '@/store/hooks';
import { selectDataLanguage } from '@/store/slices/settingsSlice';

/** Bahasa data PokéAPI yang dipilih pengguna (default `en`). */
export function useDataLanguage() {
  return useAppSelector(selectDataLanguage);
}
