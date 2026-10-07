const decimalFormat = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});

/** `4` → `#004`. */
export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

/** Desimeter → `0,6 m`. */
export function formatHeight(decimeters: number): string {
  return `${decimalFormat.format(decimeters / 10)} m`;
}

/** Hektogram → `8,5 kg`. */
export function formatWeight(hectograms: number): string {
  return `${decimalFormat.format(hectograms / 10)} kg`;
}

/** Persen dengan koma desimal: `87.5` → `87,5%`. */
export function formatPercent(value: number): string {
  return `${decimalFormat.format(value)}%`;
}

/** `mr-mime` → `Mr Mime`, `solar-power` → `Solar Power`. */
export function formatName(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

/** Flavor text PokéAPI memuat `\n`, `\f`, dan soft hyphen dari teks game — rapikan jadi satu paragraf. */
export function cleanFlavorText(text: string): string {
  return text
    .replace(/­\n/g, '')
    .replace(/[\n\f\r]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
