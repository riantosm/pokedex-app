import type { Ability } from '@/types';
import { cleanFlavorText } from './format';

/** Efek panjang di atas batas ini diganti `short_effect` supaya sheet tetap ringkas. */
const MAX_EFFECT_LENGTH = 320;

export interface AbilityText {
  text: string;
  /** Bahasa teks yang akhirnya dipakai — bisa beda dari `lang` (fallback). */
  language: string;
}

/**
 * Deskripsi ability untuk bahasa `lang`: efek lengkap (hanya en/de/fr) → teks game di bahasa itu →
 * efek bahasa Inggris → teks apa saja yang ada.
 */
export function abilityText(
  ability: Pick<Ability, 'effect_entries' | 'flavor_text_entries'>,
  lang: string,
): AbilityText | null {
  const effects = ability.effect_entries;
  // Cache lama (sebelum v0.2.0) belum menyimpan `flavor_text_entries`.
  const flavors = ability.flavor_text_entries ?? [];

  const effect = (e: (typeof effects)[number]): AbilityText => ({
    text: cleanFlavorText(
      e.effect.length > MAX_EFFECT_LENGTH ? e.short_effect : e.effect,
    ),
    language: e.language.name,
  });
  const flavor = (f: (typeof flavors)[number]): AbilityText => ({
    text: cleanFlavorText(f.flavor_text),
    language: f.language.name,
  });

  const effectIn = (l: string) => effects.find(e => e.language.name === l);
  const flavorIn = (l: string) => flavors.find(f => f.language.name === l);

  const inLang = effectIn(lang);
  if (inLang) {
    return effect(inLang);
  }
  const flavorInLang = flavorIn(lang);
  if (flavorInLang) {
    return flavor(flavorInLang);
  }
  const english = effectIn('en');
  if (english) {
    return effect(english);
  }
  const englishFlavor = flavorIn('en');
  if (englishFlavor) {
    return flavor(englishFlavor);
  }
  if (effects[0]) {
    return effect(effects[0]);
  }
  return flavors[0] ? flavor(flavors[0]) : null;
}
