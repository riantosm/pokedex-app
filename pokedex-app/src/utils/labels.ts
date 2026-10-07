import { formatName } from './format';

/** Label UI (bahasa Indonesia) untuk nilai PokéAPI yang sering tampil. Nilai lain → `formatName`. */
const DAMAGE_CLASS: Record<string, string> = {
  physical: 'Fisik',
  special: 'Khusus',
  status: 'Status',
};

const LEARN_METHOD: Record<string, string> = {
  'level-up': 'Level',
  machine: 'TM',
  egg: 'Telur',
  tutor: 'Tutor',
};

const ITEM_POCKET: Record<string, string> = {
  pokeballs: 'Poké Ball',
  medicine: 'Obat',
  machines: 'TM & HM',
  berries: 'Berry',
  battle: 'Battle',
  misc: 'Lain-lain',
  key: 'Kunci',
  mail: 'Surat',
};

/** Urutan chip kantong sesuai desain (id PokéAPI dimulai dari `misc`). */
const ITEM_POCKET_ORDER = [
  'pokeballs',
  'medicine',
  'machines',
  'berries',
  'battle',
  'misc',
  'key',
  'mail',
];

/** Kategori yang paling sering dicari tampil lebih dulu; sisanya urutan PokéAPI. */
const ITEM_CATEGORY_FIRST: Record<string, string[]> = {
  pokeballs: ['standard-balls', 'special-balls'],
  medicine: ['healing', 'status-cures', 'revival', 'pp-recovery'],
};

const FLAVOR: Record<string, string> = {
  spicy: 'Pedas',
  dry: 'Kering',
  sweet: 'Manis',
  bitter: 'Pahit',
  sour: 'Asam',
};

const ENCOUNTER_METHOD: Record<string, string> = {
  walk: 'Jalan di rumput',
  surf: 'Selancar',
  'old-rod': 'Old Rod',
  'good-rod': 'Good Rod',
  'super-rod': 'Super Rod',
  'rock-smash': 'Rock Smash',
  headbutt: 'Headbutt',
  gift: 'Hadiah',
  'gift-egg': 'Telur hadiah',
  static: 'Tetap',
};

const CONDITION_VALUE: Record<string, string> = {
  'time-morning': 'Pagi',
  'time-day': 'Siang',
  'time-night': 'Malam',
  'time-minute-00-to-19': 'Menit 00–19',
  'time-minute-20-to-39': 'Menit 20–39',
  'time-minute-40-to-59': 'Menit 40–59',
  'time-04-00-to-19-59': '04.00–19.59',
  'time-20-00-to-21-59': '20.00–21.59',
  'time-21-00-to-03-59': '21.00–03.59',
  'season-spring': 'Semi',
  'season-summer': 'Panas',
  'season-autumn': 'Gugur',
  'season-winter': 'Dingin',
  'weekday-sunday': 'Minggu',
  'weekday-monday': 'Senin',
  'weekday-tuesday': 'Selasa',
  'weekday-wednesday': 'Rabu',
  'weekday-thursday': 'Kamis',
  'weekday-friday': 'Jumat',
  'weekday-saturday': 'Sabtu',
  'swarm-yes': 'Kawanan muncul',
  'radar-on': 'Poké Radar aktif',
  'radio-hoenn': 'Hoenn Sound',
  'radio-sinnoh': 'Sinnoh Sound',
  'bug-catching-contest-yes': 'Saat kontes',
  'backlot-mentioned': 'Sudah diceritakan',
};

/** Nama kondisi encounter (UI bahasa Indonesia, mengikuti desain). Kondisi lain → nama PokéAPI. */
const CONDITION_NAME: Record<string, string> = {
  time: 'Waktu',
  season: 'Musim',
  weekday: 'Hari',
  weather: 'Cuaca',
  radio: 'Radio',
  swarm: 'Swarm',
  radar: 'Poké Radar',
  slot2: 'Game Gen 3 di slot 2',
  starter: 'Starter pilihan',
  'tv-option': 'Pilihan berita TV',
  'story-progress': 'Progres cerita',
  other: 'Lain-lain',
  item: 'Item dibawa',
  'first-party-pokemon': 'Pokémon pertama',
  'special-encounter': 'Encounter khusus',
  trade: 'Tukar dengan NPC',
  coins: 'Tukar koin',
  'friend-safari-slot': 'Slot Friend Safari',
  'great-marsh-daily-slot': 'Slot Great Marsh',
  'honey-tree-group': 'Grup pohon madu',
  'headbutt-tree': 'Pohon Headbutt',
  backlot: 'Cerita Mr. Backlot',
  'bug-catching-contest': 'Kontes serangga',
  'save-data': 'Data game lain',
  'alolan-diglett-found': 'Alolan Diglett',
  'johto-safari-blocks': 'Blok Safari Johto',
  'max-den-rarity': 'Kelangkaan Max Raid',
  'max-den-rating': 'Bintang Max Raid',
  'berry-tree-type': 'Jenis pohon berry',
  'trash-can-type': 'Jenis tempat sampah',
};

/** Kondisi utama tampil lebih dulu (desain: Waktu, Musim, Radio, Swarm). */
const CONDITION_ORDER = [
  'time',
  'season',
  'radio',
  'swarm',
  'weekday',
  'weather',
  'radar',
  'slot2',
];

/** Prefiks slug nilai (`slot2-ruby`, `johto-safari-blocks-…`), terpanjang dulu supaya tidak terpotong sebagian. */
const CONDITION_PREFIXES = Object.keys(CONDITION_NAME).sort(
  (a, b) => b.length - a.length,
);

/** `move.meta.category` — slug di `/move/{id}` memakai `+` (`damage+ailment`), di list memakai `-`. */
const MOVE_CATEGORY: Record<string, string> = {
  damage: 'Damage',
  ailment: 'Status',
  'net-good-stats': 'Ubah stat',
  heal: 'Pulihkan HP',
  'damage-ailment': 'Damage + status',
  swagger: 'Bingung + naikkan stat lawan',
  'damage-lower': 'Damage + turunkan stat',
  'damage-raise': 'Damage + naikkan stat',
  'damage-heal': 'Damage + pulihkan HP',
  ohko: 'KO sekali serang',
  'whole-field-effect': 'Efek seluruh arena',
  'field-effect': 'Efek sisi arena',
  'force-switch': 'Paksa tukar',
  unique: 'Unik',
};

const pick = (map: Record<string, string>) => (value: string) =>
  map[value] ?? formatName(value);

export const damageClassLabel = pick(DAMAGE_CLASS);
export const learnMethodLabel = pick(LEARN_METHOD);
export const itemPocketLabel = pick(ITEM_POCKET);
export const flavorLabel = pick(FLAVOR);
export const encounterMethodLabel = pick(ENCOUNTER_METHOD);
export const moveCategoryLabel = (value: string) =>
  pick(MOVE_CATEGORY)(value.replace(/\+/g, '-'));

export function compareItemPockets(a: string, b: string): number {
  const rank = (p: string) => {
    const i = ITEM_POCKET_ORDER.indexOf(p);
    return i === -1 ? ITEM_POCKET_ORDER.length : i;
  };
  return rank(a) - rank(b);
}

export function sortItemCategories(
  pocket: string,
  categories: readonly string[],
): string[] {
  const first = ITEM_CATEGORY_FIRST[pocket] ?? [];
  const rank = (c: string) => {
    const i = first.indexOf(c);
    return i === -1 ? first.length : i;
  };
  // Array.prototype.sort stabil → kategori lain tetap urutan PokéAPI.
  return [...categories].sort((a, b) => rank(a) - rank(b));
}

/**
 * Kondisi encounter. Nilai "tanpa syarat" (`*-none`, `*-off`, `*-no`, `*-not-mentioned`) → null
 * supaya tidak ditampilkan sebagai label.
 */
export function conditionLabel(value: string): string | null {
  if (/-(none|off|no|not-mentioned|inactive)$/.test(value)) {
    return null;
  }
  if (CONDITION_VALUE[value]) {
    return CONDITION_VALUE[value];
  }
  const prefix = CONDITION_PREFIXES.find(p => value.startsWith(`${p}-`));
  return formatName(prefix ? value.slice(prefix.length + 1) : value);
}

export function encounterConditionName(name: string): string | undefined {
  return CONDITION_NAME[name];
}

export function compareEncounterConditions(a: string, b: string): number {
  const rank = (c: string) => {
    const i = CONDITION_ORDER.indexOf(c);
    return i === -1 ? CONDITION_ORDER.length : i;
  };
  return rank(a) - rank(b);
}

/** Ikon Lucide per metode encounter (fallback: map-pin). */
export function encounterMethodIcon(method: string): string {
  if (method === 'walk' || method.endsWith('grass')) {
    return 'footprints';
  }
  if (method.includes('rod')) {
    return 'fish';
  }
  if (method.includes('surf')) {
    return 'waves';
  }
  if (method.startsWith('gift')) {
    return 'gift';
  }
  if (method === 'rock-smash') {
    return 'hammer';
  }
  if (method.startsWith('headbutt')) {
    return 'tree';
  }
  if (method === 'static') {
    return 'star';
  }
  return 'map-pin';
}

/** `generation-iv` → `IV`. */
export function generationRoman(slug: string): string {
  return slug.replace('generation-', '').toUpperCase();
}

/** Warna kategori kontes (`contest-type.names[].color` berupa kata, mis. "Red"). */
export const CONTEST_COLORS: Record<string, string> = {
  cool: '#E3350D',
  beauty: '#30A7D7',
  cute: '#F06EAA',
  smart: '#4DAD5B',
  tough: '#E0B000',
};

export const FLAVOR_COLORS: Record<string, string> = {
  spicy: '#E3350D',
  dry: '#30A7D7',
  sweet: '#F06EAA',
  bitter: '#4DAD5B',
  sour: '#E0B000',
};

const VERSION_GROUP: Record<string, string> = {
  'red-blue': 'Red & Blue',
  'gold-silver': 'Gold & Silver',
  'ruby-sapphire': 'Ruby & Sapphire',
  'firered-leafgreen': 'FireRed & LeafGreen',
  xd: 'XD',
  'diamond-pearl': 'Diamond & Pearl',
  'heartgold-soulsilver': 'HG & SS',
  'black-white': 'Black & White',
  'black-2-white-2': 'Black 2 & White 2',
  'x-y': 'X & Y',
  'omega-ruby-alpha-sapphire': 'OR & AS',
  'sun-moon': 'Sun & Moon',
  'ultra-sun-ultra-moon': 'Ultra Sun & Moon',
  'lets-go-pikachu-lets-go-eevee': "Let's Go",
  'sword-shield': 'Sword & Shield',
  'the-isle-of-armor': 'Isle of Armor',
  'the-crown-tundra': 'Crown Tundra',
  'brilliant-diamond-shining-pearl': 'BD & SP',
  'legends-arceus': 'Legends: Arceus',
  'scarlet-violet': 'Scarlet & Violet',
  'the-teal-mask': 'Teal Mask',
  'the-indigo-disk': 'Indigo Disk',
  'red-green-japan': 'Red & Green (JP)',
  'blue-japan': 'Blue (JP)',
  'legends-za': 'Legends: Z-A',
};

const VERSION: Record<string, string> = {
  firered: 'FireRed',
  leafgreen: 'LeafGreen',
  heartgold: 'HeartGold',
  soulsilver: 'SoulSilver',
  xd: 'XD',
  x: 'X',
  y: 'Y',
  'lets-go-pikachu': "Let's Go Pikachu",
  'lets-go-eevee': "Let's Go Eevee",
  'the-isle-of-armor-sword': 'Isle of Armor (Sword)',
  'the-isle-of-armor-shield': 'Isle of Armor (Shield)',
  'the-crown-tundra-sword': 'Crown Tundra (Sword)',
  'the-crown-tundra-shield': 'Crown Tundra (Shield)',
  'legends-arceus': 'Legends: Arceus',
  'the-teal-mask-scarlet': 'Teal Mask (Scarlet)',
  'the-teal-mask-violet': 'Teal Mask (Violet)',
  'the-indigo-disk-scarlet': 'Indigo Disk (Scarlet)',
  'the-indigo-disk-violet': 'Indigo Disk (Violet)',
  'red-japan': 'Red (JP)',
  'green-japan': 'Green (JP)',
  'blue-japan': 'Blue (JP)',
  'legends-za': 'Legends: Z-A',
};

/** Nama pendek grup versi (desain: chip "Red & Blue", "BD & SP"). */
export const versionGroupLabel = pick(VERSION_GROUP);
/** Nama versi game (`firered` → FireRed). */
export const versionLabel = pick(VERSION);

/** Warna titik chip versi — mengikuti warna sampul game. Versi lain → abu-abu. */
export const VERSION_COLORS: Record<string, string> = {
  red: '#E3350D',
  blue: '#3B6FD8',
  yellow: '#E8B800',
  gold: '#C9A227',
  silver: '#A7A9AC',
  crystal: '#5FB8D8',
  ruby: '#C0143C',
  sapphire: '#2A55C4',
  emerald: '#1E9E5A',
  firered: '#F05A28',
  leafgreen: '#5DBB46',
  diamond: '#7B9FD8',
  pearl: '#E19CC0',
  platinum: '#8E8E96',
  heartgold: '#D4A017',
  soulsilver: '#9DA3AE',
  black: '#3A3A40',
  white: '#C9C9CF',
  'black-2': '#3A3A40',
  'white-2': '#C9C9CF',
  x: '#3D6CC8',
  y: '#D23B4F',
  'omega-ruby': '#C0143C',
  'alpha-sapphire': '#2A55C4',
  sun: '#F29D1F',
  moon: '#6C5BC8',
  'ultra-sun': '#F2781F',
  'ultra-moon': '#5B4BB8',
  'lets-go-pikachu': '#E8B800',
  'lets-go-eevee': '#A0703C',
  colosseum: '#7B6A9E',
  xd: '#5A4E7A',
  sword: '#3B8ED8',
  shield: '#D8344F',
  'brilliant-diamond': '#5B8CE0',
  'shining-pearl': '#E68DB7',
  scarlet: '#E3350D',
  violet: '#8A45C8',
};

/** Label rasio gender dari `rate` (per-delapan betina; -1 = tanpa gender). */
export function genderRateLabel(rate: number): string {
  if (rate < 0) {
    return 'Tanpa gender';
  }
  if (rate === 0) {
    return 'Jantan saja';
  }
  if (rate === 8) {
    return 'Betina saja';
  }
  if (rate === 4) {
    return '50 : 50';
  }
  const pct = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
  return rate < 4
    ? `♂ ${pct.format(((8 - rate) / 8) * 100)}%`
    : `♀ ${pct.format((rate / 8) * 100)}%`;
}

export type GenderBucket = 'female-only' | 'male-only' | 'genderless' | 'mixed';

/** Kelompok gender untuk chip di layar Kelompok Pokémon. */
export function genderBucket(rate: number): GenderBucket {
  if (rate < 0) {
    return 'genderless';
  }
  if (rate === 0) {
    return 'male-only';
  }
  return rate === 8 ? 'female-only' : 'mixed';
}

const STAT_SHORT: Record<string, string> = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe',
};

/** Singkatan stat untuk pill nature (`special-attack` → SpA). */
export const statShortLabel = pick(STAT_SHORT);

/** Urutan rilis versi game — chip versi diurut kronologis (versi lama dulu). */
const VERSION_ORDER = [
  'red',
  'blue',
  'red-japan',
  'green-japan',
  'blue-japan',
  'yellow',
  'gold',
  'silver',
  'crystal',
  'ruby',
  'sapphire',
  'emerald',
  'firered',
  'leafgreen',
  'colosseum',
  'xd',
  'diamond',
  'pearl',
  'platinum',
  'heartgold',
  'soulsilver',
  'black',
  'white',
  'black-2',
  'white-2',
  'x',
  'y',
  'omega-ruby',
  'alpha-sapphire',
  'sun',
  'moon',
  'ultra-sun',
  'ultra-moon',
  'lets-go-pikachu',
  'lets-go-eevee',
  'sword',
  'shield',
  'the-isle-of-armor-sword',
  'the-isle-of-armor-shield',
  'the-crown-tundra-sword',
  'the-crown-tundra-shield',
  'brilliant-diamond',
  'shining-pearl',
  'legends-arceus',
  'scarlet',
  'violet',
  'the-teal-mask-scarlet',
  'the-teal-mask-violet',
  'the-indigo-disk-scarlet',
  'the-indigo-disk-violet',
  'legends-za',
  'mega-dimension',
  'champions',
];

/** Pembanding untuk `sort` — versi yang tidak dikenal di akhir. */
export function compareVersions(a: string, b: string): number {
  const rank = (v: string) => {
    const i = VERSION_ORDER.indexOf(v);
    return i < 0 ? VERSION_ORDER.length : i;
  };
  return rank(a) - rank(b);
}

/** Warna titik untuk `pokemon-color` (chip Warna & link di About). */
export const POKEMON_COLORS: Record<string, string> = {
  black: '#3A3A40',
  blue: '#5B8DEF',
  brown: '#A0703C',
  gray: '#9A9AA3',
  green: '#5DA333',
  pink: '#F2A3C4',
  purple: '#8A45C8',
  red: '#E3350D',
  white: '#D9D9DF',
  yellow: '#F7D02C',
};

const GROWTH_RATE: Record<string, string> = {
  'slow-then-very-fast': 'Erratic',
  'fast-then-very-slow': 'Fluctuating',
};

/** Nama kurva EXP — dua slug deskriptif PokéAPI memakai nama umumnya. */
export const growthRateLabel = pick(GROWTH_RATE);

/** Urutan rilis grup versi (id PokéAPI tidak kronologis — grup Jepang ditambahkan belakangan). */
const VERSION_GROUP_ORDER = [
  'red-green-japan',
  'blue-japan',
  'red-blue',
  'yellow',
  'gold-silver',
  'crystal',
  'ruby-sapphire',
  'emerald',
  'firered-leafgreen',
  'colosseum',
  'xd',
  'diamond-pearl',
  'platinum',
  'heartgold-soulsilver',
  'black-white',
  'black-2-white-2',
  'x-y',
  'omega-ruby-alpha-sapphire',
  'sun-moon',
  'ultra-sun-ultra-moon',
  'lets-go-pikachu-lets-go-eevee',
  'sword-shield',
  'the-isle-of-armor',
  'the-crown-tundra',
  'brilliant-diamond-shining-pearl',
  'legends-arceus',
  'scarlet-violet',
  'the-teal-mask',
  'the-indigo-disk',
  'legends-za',
  'mega-dimension',
  'champions',
];

/** Pembanding grup versi: terbaru dulu; grup tak dikenal di paling depan (biasanya rilis terbaru). */
export function compareVersionGroupsNewestFirst(a: string, b: string): number {
  const rank = (v: string) => {
    const i = VERSION_GROUP_ORDER.indexOf(v);
    return i < 0 ? VERSION_GROUP_ORDER.length : i;
  };
  return rank(b) - rank(a);
}
