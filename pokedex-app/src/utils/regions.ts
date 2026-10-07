/** Starter (atau ikon) per region untuk artwork di daftar Region. */
export const REGION_ART: Record<string, number> = {
  kanto: 4,
  johto: 155,
  hoenn: 258,
  sinnoh: 387,
  unova: 495,
  kalos: 650,
  alola: 722,
  galar: 813,
  hisui: 899,
  paldea: 906,
  orre: 197,
};

/** Pembagian lokasi untuk segmen Kota / Rute / Lainnya. */
export function locationKind(name: string): 'city' | 'route' | 'other' {
  if (/-(city|town|island|village)$/.test(name)) {
    return 'city';
  }
  if (name.includes('route')) {
    return 'route';
  }
  return 'other';
}

/** Tiga starter per region untuk hero Region Detail (region tanpa starter → `REGION_ART`). */
export const REGION_STARTERS: Record<string, [number, number, number]> = {
  kanto: [1, 4, 7],
  johto: [152, 155, 158],
  hoenn: [252, 255, 258],
  sinnoh: [387, 390, 393],
  unova: [495, 498, 501],
  kalos: [650, 653, 656],
  alola: [722, 725, 728],
  galar: [810, 813, 816],
  hisui: [722, 155, 501],
  paldea: [906, 909, 912],
};

/** `kanto-route-1` → `route-1` (prefiks region dibuang supaya daftar ringkas). */
export function stripRegionPrefix(location: string, region: string): string {
  return location.startsWith(`${region}-`)
    ? location.slice(region.length + 1)
    : location;
}
