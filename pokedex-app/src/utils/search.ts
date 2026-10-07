import { parseQuery } from './pokedexFilter';

/** Cari di index resource `{id, name}` dengan aturan yang sama seperti Pokédex (nomor persis / slug). */
export function matchesQuery(
  item: { id: number; name: string },
  query: string,
): boolean {
  const q = parseQuery(query);
  if (q.kind === 'empty') {
    return true;
  }
  if (q.kind === 'number') {
    return item.id === q.id;
  }
  return item.name.includes(q.slug);
}

/** Ganti placeholder `$effect_chance` di teks efek PokéAPI. */
export function fillEffectChance(text: string, chance: number | null): string {
  return text.replace(
    /\$effect_chance/g,
    chance !== null ? String(chance) : '?',
  );
}
