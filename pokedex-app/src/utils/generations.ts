/** 9 generasi game utama + region utamanya (`main_region` di `GET /generation/{id}`). */
export const GENERATIONS = [
  { id: 1, roman: 'I', region: 'Kanto' },
  { id: 2, roman: 'II', region: 'Johto' },
  { id: 3, roman: 'III', region: 'Hoenn' },
  { id: 4, roman: 'IV', region: 'Sinnoh' },
  { id: 5, roman: 'V', region: 'Unova' },
  { id: 6, roman: 'VI', region: 'Kalos' },
  { id: 7, roman: 'VII', region: 'Alola' },
  { id: 8, roman: 'VIII', region: 'Galar' },
  { id: 9, roman: 'IX', region: 'Paldea' },
] as const;

export type GenerationId = (typeof GENERATIONS)[number]['id'];

export function generationById(id: number) {
  return GENERATIONS.find(g => g.id === id);
}
