/** Referensi ke resource lain di PokéAPI, mis. `{ name: 'fire', url: '.../type/10/' }`. */
export interface NamedAPIResource {
  name: string;
  url: string;
}

/** Response endpoint list berpaginasi, mis. `GET /pokemon?limit=20&offset=0`. */
export interface NamedAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

/** Nama terlokalisasi, mis. `names[]` di hampir semua resource. */
export interface LocalizedName {
  name: string;
  language: NamedAPIResource;
}

/** Deskripsi terlokalisasi (`descriptions[]`). */
export interface LocalizedDescription {
  description: string;
  language: NamedAPIResource;
}

/** Efek terlokalisasi (`effect_entries[]`). `short_effect` tidak selalu ada. */
export interface LocalizedEffect {
  effect: string;
  short_effect?: string;
  language: NamedAPIResource;
}

/** Referensi tanpa nama (mis. `contest_effect`, `characteristics[]`). */
export interface APIResource {
  url: string;
}
