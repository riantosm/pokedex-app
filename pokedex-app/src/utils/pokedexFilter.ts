import type { PokemonSummary } from '@/types';

export type PokedexSort =
  | 'number-asc'
  | 'number-desc'
  | 'name-asc'
  | 'name-desc';

export const DEFAULT_SORT: PokedexSort = 'number-asc';

export const SORT_OPTIONS: { value: PokedexSort; label: string }[] = [
  { value: 'number-asc', label: 'Nomor terkecil' },
  { value: 'number-desc', label: 'Nomor terbesar' },
  { value: 'name-asc', label: 'Nama A–Z' },
  { value: 'name-desc', label: 'Nama Z–A' },
];

export type ParsedQuery =
  | { kind: 'empty' }
  | { kind: 'number'; id: number }
  | { kind: 'name'; slug: string };

/**
 * Teks cari → bentuk yang bisa dicocokkan dengan slug PokéAPI.
 * `25`, `#025` → nomor. `Mr. Mime`, `flabébé`, `farfetch'd` → `mr-mime`, `flabebe`, `farfetchd`.
 */
export function parseQuery(raw: string): ParsedQuery {
  const text = raw.trim().toLowerCase();
  if (!text) {
    return { kind: 'empty' };
  }
  const numeric = text.match(/^#?0*(\d+)$/);
  if (numeric) {
    return { kind: 'number', id: Number(numeric[1]) };
  }
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s.]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug ? { kind: 'name', slug } : { kind: 'empty' };
}

export interface PokedexFilter {
  query?: string;
  /** Id yang lolos filter tipe; `null`/`undefined` = tanpa filter. */
  typeIds?: ReadonlySet<number> | null;
  /** Id yang lolos filter generasi; `null`/`undefined` = tanpa filter. */
  generationIds?: ReadonlySet<number> | null;
  sort?: PokedexSort;
}

const comparators: Record<
  PokedexSort,
  (a: PokemonSummary, b: PokemonSummary) => number
> = {
  'number-asc': (a, b) => a.id - b.id,
  'number-desc': (a, b) => b.id - a.id,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
};

/** Cari + filter + urut, semuanya lokal di atas index Pokédex. */
export function filterPokedex(
  index: readonly PokemonSummary[],
  { query = '', typeIds, generationIds, sort = DEFAULT_SORT }: PokedexFilter,
): PokemonSummary[] {
  const q = parseQuery(query);
  return index
    .filter(p => {
      if (typeIds && !typeIds.has(p.id)) {
        return false;
      }
      if (generationIds && !generationIds.has(p.id)) {
        return false;
      }
      if (q.kind === 'number') {
        return p.id === q.id;
      }
      if (q.kind === 'name') {
        return p.name.includes(q.slug);
      }
      return true;
    })
    .sort(comparators[sort]);
}
