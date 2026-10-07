# CLAUDE.md — Pokédex (PokedexApp)

Take-home test Frontend / Mobile Developer: aplikasi Pokédex React Native CLI + TypeScript
yang mengambil data dari [PokéAPI v2](https://pokeapi.co/docs/v2).

- **Brief produk** (layar, API per layar, prinsip desain): `../BRIEF.md`
- **Desain**: `../design/pokedex.pen` (pen.dev) — Opsi A · Classic Red. Artwork mockup di `../design/assets/`.
- **Konvensi kode**: `PROJECT_CONVENTIONS.md` (wajib diikuti; ringkasan di bawah).

## Batasan (WAJIB)

Kecuali user menyuruhnya secara eksplisit di chat (izin per perintah, bukan izin umum):

- ❌ Build apa pun: `npm run android/ios`, `npx react-native run-*`, `./gradlew assemble*`,
  `npm run android-d` / `android-r`, `xcodebuild`.
- ❌ Menjalankan emulator / simulator atau install ke device.
- ❌ Menjalankan Metro: `npm start`, `npx react-native start`.
- ❌ `pod install`.
- ❌ `git commit` / `git push`.

Boleh tanpa izin: membuat/mengedit file, `npm install`, `npm run typecheck`, `npm run lint`, `npm test`.

## Commands

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm test               # jest (unit test utils)
python3 documentation/regen-html.py   # render CHANGELOG.md → changelog.html
```

User sendiri yang menjalankan: `cd ios && bundle exec pod install`, `npm start`,
`npm run android`, `npm run ios`, `npm run android-d` / `android-r` (APK otomatis disalin ke `documentation/`).

## Stack

RN 0.87 (New Architecture) · React 19 · TypeScript 6 · React Navigation 7 (native-stack + bottom-tabs,
tab bar custom) · Redux Toolkit 2 + **RTK Query** (axios baseQuery) · redux-persist + AsyncStorage v3 ·
react-native-config · Reanimated 4 (+ worklets) + moti · @d11/react-native-fast-image ·
lucide-react-native + react-native-svg.

## Arsitektur

```
src/
├── components/{atoms,molecules,organisms,templates}/<Nama>/index.tsx   # generik, tanpa fetch
├── navigation/  paths.ts (ROUTES) · types.ts · RootNavigator · MainTabNavigator
├── screens/<Nama>/index.tsx                                           # satu folder per route
├── services/api/ axiosInstance · baseQuery · pokeApi (createApi) · <domain>.service.ts
├── store/       index.ts (persist) · hooks.ts · slices/favoritesSlice.ts
├── theme/       colors.ts (token desain + warna tipe) · shadows.ts
├── types/       <domain>.types.ts + barrel index.ts
└── utils/       pokemon · format · typeEffectiveness · evolution · motion (+ __tests__)
```

### Route

| ROUTES | Jenis | Layar | Param |
|---|---|---|---|
| `SPLASH` | stack | `Splash` (muat index lalu `replace` ke tab) | — |
| `MAIN_TABS` | stack | `MainTabNavigator` | — |
| `POKEDEX` / `TYPES` / `FAVORITES` / `MORE` | tab | `PokemonList` / `TypeList` / `FavoriteList` / `More` | — |
| `POKEMON_DETAIL` | stack | `PokemonDetail` | `{ id, name, types? }` |
| `TYPE_DETAIL` | stack | `TypeDetail` | `{ name }` |

Sheet Urutkan & Filter dan sheet Ability = komponen `organisms/`, bukan route.

### Data & API

- **RTK Query**: `pokeApi.ts` berisi `createApi` kosong; tiap domain mendaftarkan endpoint lewat
  `injectEndpoints` di `<domain>.service.ts`.
  - Penyimpangan dari konvensi: nama endpoint `<aksi><Resource>` **tanpa** akhiran `Api`
    (mis. `getPokemon`), supaya hook-nya `useGetPokemonQuery`, bukan `useGetPokemonApiQuery`.
- **`transformResponse` membuang field yang tidak dipakai** (mis. ratusan `moves` di `/pokemon/{id}`)
  karena cache RTK Query di-persist ke disk. Tipe di `types/` = subset field asli response.
- **Persist**: whitelist `favorites` + `pokeApi` (cache 7 hari, dipulihkan via `extractRehydrationInfo`).
- **Pencarian, filter, urut = lokal** di atas index `GET /pokemon?limit=1025` (PokéAPI tidak punya search).
  Batas `MAX_POKEMON_ID = 1025` membuang varian bentuk (id 10001+).
- Gambar Pokémon: `artworkUrl(id)` — dibentuk dari id, tanpa panggil detail.
- PokéAPI menolak request **tanpa User-Agent** (403). Di RN sudah otomatis; ingat saat bikin script.
- Satuan PokéAPI: `height` desimeter, `weight` hektogram → pakai `formatHeight` / `formatWeight`.

### Desain → kode

- Semua warna dari `theme/colors.ts`. Latar kartu/hero per tipe: `typeCardColors[type]`,
  teks di atasnya: `typeOnColor(type)` (tipe terang pakai teks gelap — aturan kontras di BRIEF §6).
- Semua yang bisa di-tap pakai `atoms/PressableScale`. Preset animasi di `utils/motion.ts`.
- Font desain: **Poppins** (judul) + **Inter** (teks) — **belum dipasang** (perlu aset font native).

## Status

- [x] Init: navigasi, store, service, utils + test, theme, tab bar custom, layar placeholder.
- [ ] Pasang font Poppins + Inter.
- [ ] Implementasi UI per layar sesuai desain (lalu hapus `templates/PlaceholderLayout`).

Setiap perubahan yang terlihat pengguna → tambah bullet di `documentation/CHANGELOG.md`
bagian `## Belum dirilis`. Update file ini saat ada layar, fitur, atau konvensi baru.
