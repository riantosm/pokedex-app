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
├── store/       index.ts (persist) · hooks.ts · slices/{favorites,settings,network}Slice.ts
├── theme/       colors.ts (token desain + warna tipe) · shadows.ts
├── types/       <domain>.types.ts + barrel index.ts
└── utils/       pokemon · format · typeEffectiveness · evolution · motion · i18n · labels ·
                 formula · regions · search · ability (+ __tests__)
```

### Route

| ROUTES | Jenis | Layar | Param |
|---|---|---|---|
| `SPLASH` | stack | `Splash` (muat index lalu `replace` ke tab) | — |
| `MAIN_TABS` | stack | `MainTabNavigator` | — |
| `POKEDEX` / `EXPLORE` / `FAVORITES` / `MORE` | tab | `PokemonList` / `Explore` / `FavoriteList` / `More` | — |
| `POKEMON_DETAIL` | stack | `PokemonDetail` (6 tab: About · Stats · Moves · Evolusi · Lokasi · Lemah) | `{ id, name, types? }` |
| `TYPES` / `TYPE_DETAIL` | stack | `TypeList` / `TypeDetail` | — / `{ name }` |
| `MOVE_LIST` / `MOVE_DETAIL` | stack | `MoveList` / `MoveDetail` | — / `{ name }` |
| `ITEM_LIST` / `ITEM_DETAIL` | stack | `ItemList` / `ItemDetail` | `{ pocket? }` / `{ name }` |
| `BERRY_LIST` / `BERRY_DETAIL` | stack | `BerryList` / `BerryDetail` | — / `{ name }` |
| `REGION_LIST` / `REGION_DETAIL` | stack | `RegionList` / `RegionDetail` | — / `{ name }` |
| `LOCATION_DETAIL` | stack | `LocationDetail` | `{ name }` (slug location) |
| `PAL_PARK` | stack | `PalPark` | `{ area? }` |
| `GAMES` / `POKEDEX_DETAIL` | stack | `Games` / `PokedexDetail` | — / `{ name? }` (default `paldea`) |
| `POKEMON_GROUP` | stack | `PokemonGroup` (segmen Egg/Warna/Bentuk/Habitat/Gender) | `{ kind?, name? }` |
| `POKEMON_COLLECTION` | stack | `PokemonCollection` (grid dari move / growth rate / pemicu evolusi) | `{ source, name, title }` |
| `NATURES` / `GROWTH_RATE` / `CONTESTS` | stack | `Natures` / `GrowthRate` / `Contests` | — / `{ name? }` / — |
| `EVOLUTION_TRIGGERS` / `ENCOUNTER_METHODS` | stack | `EvolutionTriggers` / `EncounterMethods` | — |

Pilihan di dalam layar (chip area, Pokédex, kelompok, growth rate) memakai `navigation.setParams`.
Sheet Urutkan & Filter, Ability, Stat, dan pemilih game = komponen (`BottomSheet`), bukan route.

### Data & API

- **RTK Query**: `pokeApi.ts` berisi `createApi` kosong; tiap domain mendaftarkan endpoint lewat
  `injectEndpoints` di `<domain>.service.ts`.
  - Penyimpangan dari konvensi: nama endpoint `<aksi><Resource>` **tanpa** akhiran `Api`
    (mis. `getPokemon`), supaya hook-nya `useGetPokemonQuery`, bukan `useGetPokemonApiQuery`.
- **`transformResponse` membuang field yang tidak dipakai** (mis. ratusan `moves` di `/pokemon/{id}`)
  karena cache RTK Query di-persist ke disk. Tipe di `types/` = subset field asli response.
- **Persist**: whitelist `favorites` + `settings` + `pokeApi` (cache 7 hari, dipulihkan via `extractRehydrationInfo`).
  **Ubah bentuk hasil `transformResponse` (field baru/dibuang) → naikkan `version` persist + tambah migrasi**
  di `store/index.ts` yang membuang cache `pokeApi` lama (favorit & pengaturan tetap). Tanpa itu, pengguna yang
  upgrade memakai data lama tanpa field baru (layar bisa error). Saat dev, hot-reload service tidak mengganti
  endpoint yang sudah terdaftar (`injectEndpoints` tanpa `overrideExisting`) — restart app setelah mengubah transform.
- **Daftar besar (v2)**: `resource.service.ts` → `getResourceIndex(resource)` (`limit=3000`, `{id,name}[]`) dan
  `getResourceCount`. Cari & paginasi lokal (`usePagedList`, `matchesQuery`), detail per baris lazy.
- **Bahasa data**: `transformResponse` menyimpan `names[]` lewat `supportedOnly` dan teks panjang lewat
  `latestPerLanguage` (satu entri terbaru per bahasa). Tampilkan dengan `pickName(names, lang, slug)` /
  `pickEntry(entries, lang)` + `useDataLanguage()` — **jangan** `entries[0]` / `.at(-1)` (urutan bahasa acak).
  Pemilih: `More/LanguageSheet` (14 bahasa, `setDataLanguage`, contoh nama + genus Pikachu; label "tidak resmi"
  dari `GET /language/{code}`.official). Default `en`. Ability: `abilityText()` (`utils/ability.ts`) — efek lengkap
  hanya ada en/de/fr, jadi jatuh ke teks game (`flavor_text_entries`) di bahasa itu, lalu efek Inggris + catatan.
- **Versi data PokéAPI**: `getMeta` (`/meta/`, `deploy_date` = detik Unix) → baris di Lainnya (`formatDate`).
- **Label game**: pakai `versionGroupLabel` / `versionLabel` dan urutkan dengan `compareVersions` /
  `compareVersionGroupsNewestFirst` (`utils/labels.ts`) — id PokéAPI tidak kronologis dan slug-nya tidak
  selalu tertebak (`brilliant-diamond-shining-pearl`, `the-isle-of-armor-sword`). Cek slug asli lewat API.
- **Lokasi semua area**: `getLocationAreas(areas.join(','))` (`queryFn`, paralel) untuk Detail Lokasi.
- **Pencarian, filter, urut = lokal** di atas index `GET /pokemon?limit=1025` (PokéAPI tidak punya search).
  Batas `MAX_POKEMON_ID = 1025` membuang varian bentuk (id 10001+).
- Gambar Pokémon: `artworkUrl(id)` — dibentuk dari id, tanpa panggil detail.
- **Nama Pokémon dari slug: `pokemonName(slug)`, bukan `formatName`** — index `/pokemon` memakai slug bentuk
  bawaan (`deoxys-normal`, `zygarde-50`) dan slug khusus (`nidoran-f` → Nidoran♀, `type-null` → Type: Null).
- **Field PokéAPI bisa `null`** walau jarang (berry Kee/Maranga/Hopo/Roseli tanpa firmness & data tanam,
  nature netral, `region.main_generation`, `pokedex.region`, `move.power/accuracy/meta`, `item.fling_*`).
  Tipe di `types/` harus ikut `| null` — crash "Cannot read property 'name' of null" berasal dari sini.
- **Tipe di kartu grid pakai `getPokemonTypes` (`/pokemon-form/{id}`, ±27 KB), bukan `getPokemon`
  (`/pokemon/{id}`, sampai ±300 KB)** — parse JSON besar di thread JS bikin scroll patah. Id form default
  = id Pokémon untuk 1–1025 (sudah dicek 50 sampel termasuk Unown, Wormadam, Arceus, Ogerpon).
  `usePokemonTypes` → `undefined` (memuat) / `null` (gagal, mis. offline) / array.
- **Offline**: `@react-native-community/netinfo` (dimuat aman lewat `services/network.ts` — APK tanpa modul
  native-nya tidak crash) disambungkan ke `setupListeners` RTK Query
  (`refetchOnReconnect`). `useIsOffline()` = NetInfo tidak terhubung / internet tak terjangkau **atau**
  `networkSlice.apiUnreachable` (request PokéAPI terakhir gagal tanpa response; reset saat ada request sukses).
  `organisms/OfflineBanner` global di `App.tsx`. Error UI hanya muncul kalau `isError && !data`
  (data cache tetap ditampilkan).
- `FastImage` di kartu/hero/evolusi/tile memakai `key` yang berubah saat data tiba → gambar yang gagal
  dimuat saat offline dicoba ulang otomatis.
- Grid: animasi muncul hanya sekali per id (`seenIds`), `removeClippedSubviews` di Android,
  batch render kecil (`initialNumToRender`/`maxToRenderPerBatch` 6, `windowSize` 5).
- PokéAPI menolak request **tanpa User-Agent** (403). Di RN sudah otomatis; ingat saat bikin script.
- Satuan PokéAPI: `height` desimeter, `weight` hektogram → pakai `formatHeight` / `formatWeight`.

### Desain → kode

- Semua warna dari `theme/colors.ts` (garis radio/kontrol nonaktif: `colors.control`).
  Latar kartu/hero per tipe: `typeCardColors[type]`, teks di atasnya: `typeOnColor(type)`
  (tipe terang pakai teks gelap — aturan kontras di BRIEF §6).
- Semua yang bisa di-tap pakai `atoms/PressableScale`. Preset animasi di `utils/motion.ts`.
- Semua teks pakai `atoms/AppText` dengan `variant` dari `theme/typography.ts`
  (Poppins untuk judul, Inter untuk teks). Ketebalan dipilih lewat `fontFamily`, **jangan `fontWeight`**
  (di Android custom font + fontWeight bisa jatuh ke font sistem).
- Font di `src/assets/fonts` (lisensi OFL ikut di sana), di-link dengan `npx react-native-asset`
  (config: `react-native.config.js`). Tambah font baru → jalankan ulang perintah itu lalu rebuild.
- Permukaan berwarna tipe (kartu, hero, tile) pakai `typePalette(type)`; saat tipe belum dimuat `neutralPalette`.

### Aturan layout & interaksi (wajib untuk layar baru)

- **Tab bar melayang** (absolute di atas konten). Layar tab wajib memberi `paddingBottom: useTabBarInset()`
  di konten scroll supaya item terakhir tidak tertutup. Tab bar disembunyikan saat keyboard tampil.
- Layar tab tanpa header tetap memasang `<StatusBarScrim />` supaya konten tidak terlihat di balik status bar.
- Warna ikon status bar per layar lewat `useStatusBarStyle()` (hero berwarna → ikuti `typePalette().text`).
- **Semua layar bisa pull-to-refresh**: `RefreshControl` + `useRefresh([...refetch])`.
- Layar daftar baru: `organisms/ScreenList` (FlatList + header + empty + refresh + inset + tuning yang sama
  dengan Pokédex). Layar stack lain: `ScrollView` + `ScreenHeader` + `StatusBarScrim`.
- `ChipScroller` sudah `flexGrow: 0` — aman di ScrollView yang konten-nya `flexGrow: 1`.
- Animasi: stack `slide_from_right`, tab `shift`, kartu grid `gridItemEntering(index)`, baris daftar
  `listItemEntering(index)`, isi tab `tabContentEntering`, hero parallax + `CollapsingTopBar` (semua di `utils/motion.ts`).

### Komponen

| Lapisan | Komponen |
|---|---|
| atoms | `AppText`, `Button`, `IconButton`, `PressableScale`, `PokeballIcon`, `Skeleton`, `StatusBarScrim`, `TypeBadge`, `Overline`, `ItemSprite`, `Tag`, `EncounterMethodIcon` |
| molecules | `PokemonCard`, `PokemonCardSkeleton`, `TypeChip`, `SearchField`, `StatRow`, `EmptyState`, `SectionHeader`, `UnderlineTabs`, `InfoRow`, `TypeEffectGroup`, `ScreenHeader`, `ListGroup`, `ListRow` (+`RowLead`), `Segmented`, `FactStrip`, `ChipScroller`, `InfoNote`, `LinkChip` |
| organisms | `TabBar`, `BottomSheet`, `CollapsingTopBar`, `OfflineBanner`, `ScreenList` |
| templates | — |

Lintas layar: `screens/shared/PokemonGridCell` (kartu grid + tipe lazy + animasi sekali per id).

Hooks: `useDataLanguage`, `useDebouncedValue`, `useGridWidth`, `useIsOffline`, `useKeyboardVisible`, `usePagedList`,
`usePokemonTypes` (tipe lazy per kartu), `useRefresh`, `useStatusBarStyle`, `useTabBarInset`.

### Ikon app

Pikachu (official artwork) di atas merah brand, dibuat dari `design/assets/25.png`:
Android `mipmap-*/ic_launcher{,_round,_foreground,_monochrome}.png` + adaptive icon
`mipmap-anydpi-v26/` (latar `@color/ic_launcher_background`, themed icon Android 13+);
iOS `Images.xcassets/AppIcon.appiconset` (tanpa alpha).

### Ukuran APK release (pola dari project SmartBattalion)

- `enableProguardInReleaseBuilds = true` → R8 + `shrinkResources`. Library baru yang memakai refleksi /
  dipanggil dari native → tambah keep rule di `android/app/proguard-rules.pro` (lihat README library-nya).
- `reactNativeArchitectures=armeabi-v7a,arm64-v8a` (tanpa x86 emulator), `useLegacyPackaging` (.so dikompres),
  `localeFilters ["en","in"]`.
- Font di `src/assets/fonts` sudah di-**subset** (Latin + simbol yang dipakai). Menambah teks dengan
  karakter non-Latin baru → cek glyph-nya masih ada (kalau tidak, sistem memakai font fallback).
  Salinan Android ada di `android/app/src/main/assets/fonts` — samakan setelah mengganti font.

### APK release di git

- `documentation/*-release.apk` **di-commit** (debug tetap di-ignore). Task gradle hanya menyimpan
  APK terbaru per varian; versi lama ada di riwayat git.
- `python3 documentation/regen-html.py` juga memperbarui tombol download di `../README.md`
  (blok `<!-- apk-download -->`) ke nama APK versi terbaru — jalankan setelah build release.

### Patch

- `patches/@d11+react-native-fast-image+8.13.0.patch`: tipe `ImageStyle` FastImage merujuk
  `FlexStyle`/`ShadowStyleIOS` yang sudah tidak diekspor RN 0.87 → diganti `ImageStyle` RN.
  Saat membuat patch, kecualikan artefak build: `--exclude '^android/build|/build/|package\.json$'`.

## Status

- [x] Init: navigasi, store, service, utils + test, theme, tab bar custom, layar placeholder.
- [x] Fondasi UI: font Poppins + Inter, tipografi, komponen dasar.
- [x] Semua layar: Pokédex, Detail Pokémon (+ sheet Ability), Tipe, Detail Tipe, Favorit, Lainnya.
- [x] Pull-to-refresh di semua layar, animasi transisi & scroll, tab bar melayang.
- [x] README (setup + keputusan teknis + screenshot + link desain pen.dev).
- [x] v2: tab Jelajah + 12 layar (Dunia, Kelompok & Referensi) + Moves/Item/Berry + Detail Pokémon v2.
- [x] v2: Lainnya — sheet Bahasa data (14 bahasa, `setDataLanguage`) + baris Versi data PokéAPI (`getMeta`).
- [x] v0.2.0: bump versi, migrasi cache persist v2, APK release.
- [ ] v2: uji mode offline layar v2 di device (adb wireless putus kalau Wi-Fi dimatikan — uji manual).

Setiap perubahan yang terlihat pengguna → tambah bullet di `documentation/CHANGELOG.md`
bagian `## Belum dirilis`. Update file ini saat ada layar, fitur, atau konvensi baru.
