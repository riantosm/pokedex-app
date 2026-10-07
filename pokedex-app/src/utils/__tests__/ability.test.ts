import { abilityText } from '../ability';

const lang = (name: string) => ({ name, url: '' });
const effect = (text: string, l: string) => ({
  effect: text,
  short_effect: `short ${text}`,
  language: lang(l),
});
const flavor = (text: string, l: string) => ({
  flavor_text: text,
  language: lang(l),
});

describe('abilityText', () => {
  const ability = {
    effect_entries: [effect('Effet', 'fr'), effect('Effect', 'en')],
    flavor_text_entries: [flavor('Game\ntext', 'en'), flavor('ゲーム', 'ja')],
  };

  it('efek lengkap di bahasa data', () => {
    expect(abilityText(ability, 'fr')).toEqual({
      text: 'Effet',
      language: 'fr',
    });
  });

  it('teks game kalau efek tidak ada di bahasa itu', () => {
    expect(abilityText(ability, 'ja')).toEqual({
      text: 'ゲーム',
      language: 'ja',
    });
  });

  it('jatuh ke efek bahasa Inggris', () => {
    expect(abilityText(ability, 'ko')).toEqual({
      text: 'Effect',
      language: 'en',
    });
  });

  it('efek terlalu panjang → short_effect', () => {
    const long = 'x'.repeat(400);
    expect(
      abilityText(
        { effect_entries: [effect(long, 'en')], flavor_text_entries: [] },
        'en',
      )?.text,
    ).toBe(`short ${long}`);
  });

  it('cache lama tanpa flavor_text_entries tetap aman', () => {
    const old = { effect_entries: [] } as unknown as Parameters<
      typeof abilityText
    >[0];
    expect(abilityText(old, 'en')).toBeNull();
  });
});
