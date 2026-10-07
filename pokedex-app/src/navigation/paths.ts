/** Satu-satunya sumber nama route (stack + tab). Jangan tulis string route langsung di layar. */
export const ROUTES = {
  SPLASH: 'Splash',
  MAIN_TABS: 'MainTabs',
  POKEMON_DETAIL: 'PokemonDetail',
  TYPE_DETAIL: 'TypeDetail',

  // tab
  POKEDEX: 'Pokedex',
  EXPLORE: 'Explore',
  FAVORITES: 'Favorites',
  MORE: 'More',

  // stack — dibuka dari Jelajah (v2)
  TYPES: 'Types',
  MOVE_LIST: 'MoveList',
  MOVE_DETAIL: 'MoveDetail',
  ITEM_LIST: 'ItemList',
  ITEM_DETAIL: 'ItemDetail',
  BERRY_LIST: 'BerryList',
  BERRY_DETAIL: 'BerryDetail',
  REGION_LIST: 'RegionList',
  REGION_DETAIL: 'RegionDetail',
  LOCATION_DETAIL: 'LocationDetail',
  PAL_PARK: 'PalPark',
  GAMES: 'Games',
  POKEDEX_DETAIL: 'PokedexDetail',
  POKEMON_GROUP: 'PokemonGroup',
  POKEMON_COLLECTION: 'PokemonCollection',
  NATURES: 'Natures',
  GROWTH_RATE: 'GrowthRate',
  CONTESTS: 'Contests',
  EVOLUTION_TRIGGERS: 'EvolutionTriggers',
  ENCOUNTER_METHODS: 'EncounterMethods',
} as const;
