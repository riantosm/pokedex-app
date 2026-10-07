import { artworkUrl, genderRatio, idFromUrl, typeNames } from '../pokemon';

describe('idFromUrl', () => {
  it('ambil id dari URL resource PokéAPI', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon-species/1025')).toBe(
      1025,
    );
  });

  it('lempar error kalau URL tidak memuat id', () => {
    expect(() => idFromUrl('https://pokeapi.co/api/v2/pokemon/')).toThrow();
  });
});

describe('artworkUrl', () => {
  it('bentuk URL official artwork dari id', () => {
    expect(artworkUrl(4)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    );
  });
});

describe('typeNames', () => {
  it('urutkan sesuai slot', () => {
    const res = (name: string) => ({ name, url: '' });
    expect(
      typeNames([
        { slot: 2, type: res('poison') },
        { slot: 1, type: res('grass') },
      ]),
    ).toEqual(['grass', 'poison']);
  });
});

describe('genderRatio', () => {
  it('Charmander (gender_rate 1) → 87,5% jantan', () => {
    expect(genderRatio(1)).toEqual({ male: 87.5, female: 12.5 });
  });

  it('tanpa gender (-1) → null', () => {
    expect(genderRatio(-1)).toBeNull();
  });
});
