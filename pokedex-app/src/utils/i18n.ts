import type { NamedAPIResource } from '@/types';
import { formatName } from './format';

/** 14 bahasa data PokéAPI (`GET /language`). Tidak ada bahasa Indonesia. */
export const DATA_LANGUAGES = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'ja', native: '日本語', english: 'Japanese' },
  {
    code: 'ja-hrkt',
    native: 'にほんご (かな)',
    english: 'Japanese, hiragana & katakana',
  },
  { code: 'ja-roma', native: 'Nihongo (romaji)', english: 'Japanese romaji' },
  { code: 'ko', native: '한국어', english: 'Korean' },
  { code: 'zh-hans', native: '简体中文', english: 'Simplified Chinese' },
  { code: 'zh-hant', native: '繁體中文', english: 'Traditional Chinese' },
  { code: 'fr', native: 'Français', english: 'French' },
  { code: 'de', native: 'Deutsch', english: 'German' },
  { code: 'es', native: 'Español', english: 'Spanish' },
  {
    code: 'es-419',
    native: 'Español (Latinoamérica)',
    english: 'Latin American Spanish',
  },
  { code: 'it', native: 'Italiano', english: 'Italian' },
  { code: 'cs', native: 'Čeština', english: 'Czech' },
  {
    code: 'pt-br',
    native: 'Português (Brasil)',
    english: 'Brazilian Portuguese',
  },
] as const;

export type DataLanguage = (typeof DATA_LANGUAGES)[number]['code'];
export const DEFAULT_DATA_LANGUAGE: DataLanguage = 'en';
const FALLBACK = 'en';

type Localized = { language: NamedAPIResource };

/** Entri untuk bahasa `lang`, jatuh ke Inggris, lalu entri pertama. */
export function pickEntry<T extends Localized>(
  entries: readonly T[] | undefined,
  lang: string,
): T | undefined {
  if (!entries || entries.length === 0) {
    return undefined;
  }
  return (
    entries.find(e => e.language.name === lang) ??
    entries.find(e => e.language.name === FALLBACK) ??
    entries[0]
  );
}

/** Nama tampilan dari `names[]`; tanpa data → slug diformat (`solar-power` → `Solar Power`). */
export function pickName(
  names: readonly (Localized & { name: string })[] | undefined,
  lang: string,
  slug: string,
): string {
  return pickEntry(names, lang)?.name ?? formatName(slug);
}

/**
 * Sisakan satu entri (yang terakhir = game terbaru) per bahasa yang didukung app.
 * Dipakai di `transformResponse` supaya cache tidak menyimpan puluhan versi teks.
 */
export function latestPerLanguage<T extends Localized>(
  entries: readonly T[],
): T[] {
  const supported = new Set<string>(DATA_LANGUAGES.map(l => l.code));
  const latest = new Map<string, T>();
  for (const e of entries) {
    if (supported.has(e.language.name)) {
      latest.set(e.language.name, e);
    }
  }
  return [...latest.values()];
}

/** Buang nama di luar bahasa yang didukung. */
export function supportedOnly<T extends Localized>(entries: readonly T[]): T[] {
  const supported = new Set<string>(DATA_LANGUAGES.map(l => l.code));
  return entries.filter(e => supported.has(e.language.name));
}
