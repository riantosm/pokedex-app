import {
  cleanFlavorText,
  formatDate,
  formatDexNumber,
  formatHeight,
  formatName,
  formatPercent,
  formatWeight,
} from '../format';

describe('format', () => {
  it('nomor Pokédex 3 digit', () => {
    expect(formatDexNumber(4)).toBe('#004');
    expect(formatDexNumber(1025)).toBe('#1025');
  });

  it('tinggi & berat dari satuan PokéAPI', () => {
    expect(formatHeight(6)).toBe('0,6 m');
    expect(formatWeight(85)).toBe('8,5 kg');
    expect(formatWeight(1000)).toBe('100 kg');
  });

  it('persen dengan koma desimal', () => {
    expect(formatPercent(87.5)).toBe('87,5%');
  });

  it('slug jadi nama tampilan', () => {
    expect(formatName('solar-power')).toBe('Solar Power');
    expect(formatName('charmander')).toBe('Charmander');
  });

  it('bersihkan karakter kontrol di flavor text', () => {
    expect(
      cleanFlavorText(
        'Obviously prefers\nhot places. When\nit rains, steam\fis said to spout',
      ),
    ).toBe(
      'Obviously prefers hot places. When it rains, steam is said to spout',
    );
  });

  it('tanggal pendek bahasa Indonesia', () => {
    expect(formatDate(Date.UTC(2026, 9, 6, 12))).toBe('6 Okt 2026');
  });
});
