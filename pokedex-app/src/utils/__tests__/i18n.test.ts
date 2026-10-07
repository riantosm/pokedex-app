import { latestPerLanguage, pickEntry, pickName } from '../i18n';

const lang = (name: string) => ({ name, url: '' });

describe('i18n', () => {
  const names = [
    { name: 'ピカチュウ', language: lang('ja') },
    { name: 'Pikachu', language: lang('en') },
  ];

  it('pilih bahasa data, fallback Inggris, lalu slug', () => {
    expect(pickName(names, 'ja', 'pikachu')).toBe('ピカチュウ');
    expect(pickName(names, 'ko', 'pikachu')).toBe('Pikachu');
    expect(pickName([], 'ja', 'solar-power')).toBe('Solar Power');
  });

  it('pickEntry tanpa data → undefined', () => {
    expect(pickEntry(undefined, 'en')).toBeUndefined();
  });

  it('latestPerLanguage menyisakan entri terakhir per bahasa yang didukung', () => {
    const entries = [
      { text: 'old', language: lang('en') },
      { text: 'new', language: lang('en') },
      { text: 'roh', language: lang('roomaji') },
      { text: 'fr', language: lang('fr') },
    ];
    expect(
      latestPerLanguage(entries)
        .map(e => e.text)
        .sort(),
    ).toEqual(['fr', 'new']);
  });
});
