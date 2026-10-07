import type { PokemonSummary } from '@/types';
import { filterPokedex, parseQuery } from '../pokedexFilter';

const index: PokemonSummary[] = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 5, name: 'charmeleon' },
  { id: 6, name: 'charizard' },
  { id: 25, name: 'pikachu' },
  { id: 122, name: 'mr-mime' },
  { id: 250, name: 'ho-oh' },
  { id: 390, name: 'chimchar' },
  { id: 669, name: 'flabebe' },
];

const ids = (list: PokemonSummary[]) => list.map(p => p.id);

describe('parseQuery', () => {
  it('nomor dengan / tanpa # dan nol di depan', () => {
    expect(parseQuery('25')).toEqual({ kind: 'number', id: 25 });
    expect(parseQuery(' #025 ')).toEqual({ kind: 'number', id: 25 });
  });

  it('nama dinormalisasi ke slug PokéAPI', () => {
    expect(parseQuery('Mr. Mime')).toEqual({ kind: 'name', slug: 'mr-mime' });
    expect(parseQuery('Flabébé')).toEqual({ kind: 'name', slug: 'flabebe' });
    expect(parseQuery("Farfetch'd")).toEqual({
      kind: 'name',
      slug: 'farfetchd',
    });
  });

  it('kosong / hanya simbol', () => {
    expect(parseQuery('   ')).toEqual({ kind: 'empty' });
    expect(parseQuery('!!')).toEqual({ kind: 'empty' });
  });
});

describe('filterPokedex', () => {
  it('cari substring nama — "char" juga cocok dengan chimchar', () => {
    expect(ids(filterPokedex(index, { query: 'char' }))).toEqual([
      4, 5, 6, 390,
    ]);
  });

  it('cari nomor = cocok persis, bukan awalan', () => {
    expect(ids(filterPokedex(index, { query: '25' }))).toEqual([25]);
  });

  it('gabungan filter tipe + generasi + cari', () => {
    const fire = new Set([4, 5, 6, 390]);
    const gen1 = new Set([1, 4, 5, 6, 25, 122]);
    expect(
      ids(
        filterPokedex(index, {
          typeIds: fire,
          generationIds: gen1,
          query: 'char',
        }),
      ),
    ).toEqual([4, 5, 6]);
  });

  it('urutan nama & nomor', () => {
    const fire = new Set([4, 5, 6]);
    expect(
      ids(filterPokedex(index, { typeIds: fire, sort: 'name-asc' })),
    ).toEqual([6, 4, 5]);
    expect(
      ids(filterPokedex(index, { typeIds: fire, sort: 'number-desc' })),
    ).toEqual([6, 5, 4]);
  });

  it('tidak mengubah index asli', () => {
    const copy = [...index];
    filterPokedex(index, { sort: 'name-desc' });
    expect(index).toEqual(copy);
  });
});
