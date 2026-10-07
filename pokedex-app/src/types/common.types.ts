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
