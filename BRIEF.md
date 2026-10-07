# Brief — Mobile Pokédex

Take-home test Frontend / Mobile Developer: aplikasi mobile Pokédex yang mengambil data dari public API.

- **Tema desain terpilih:** Opsi A · Classic Red (`design/pokedex.pen`)
- **Sumber data:** [PokéAPI v2](https://pokeapi.co/docs/v2) — REST, gratis, tanpa API key
- **Bahasa UI:** Indonesia (nama Pokémon, tipe, dan istilah stat tetap bahasa Inggris seperti di game)

---

## 1. Tujuan

Pengguna bisa **menjelajah, mencari, dan mempelajari** Pokémon dari 1.025 Pokémon nasional dengan cepat, lalu menyimpan favoritnya. Penilai tes melihat: struktur kode, state management, penanganan loading/error/empty, performa list panjang, dan kualitas UI.

### Lingkup
- **Wajib (MVP):** daftar + infinite scroll, pencarian, filter tipe, halaman detail (about, stats, evolusi), favorit tersimpan lokal, semua state (loading, error, kosong).
- **Nilai tambah:** urutkan & filter generasi, halaman Tipe, kelemahan tipe, detail ability, cache offline, prev/next di detail.
- **Di luar lingkup:** login/akun, moves lengkap, lokasi encounter, perbandingan Pokémon, multi-bahasa.

---

## 2. Navigasi

```
Splash
└── Tab bar
    ├── Pokédex (Home) ──► Detail Pokémon ──► Sheet Ability
    │        └── Sheet Urutkan & Filter       └──► Detail Pokémon (dari evolusi / prev-next)
    ├── Tipe ──► Detail Tipe ──► Detail Pokémon
    ├── Favorit ──► Detail Pokémon
    └── Lainnya (tentang, sumber data, hapus cache)
```

---

## 3. Halaman & API

Base URL: `https://pokeapi.co/api/v2`

### 3.1 Splash
Logo + nama app. Sambil tampil, muat daftar index Pokémon (lihat 3.2) dari cache atau jaringan.

| Data | API |
|---|---|
| Index nama + id semua Pokémon | `GET /pokemon?limit=1025&offset=0` |

### 3.2 Home — Pokédex
Header merah, kolom cari, tombol urutkan, chip filter tipe, grid 2 kolom kartu Pokémon (warna kartu = tipe utama), infinite scroll 20 per halaman.

| Kebutuhan | API | Catatan |
|---|---|---|
| Daftar nama + id | `GET /pokemon?limit=1025` | Sekali panggil (±40 KB), cache. **Id diambil dari URL** (`.../pokemon/25/` → 25). Pakai `limit=1025` agar varian bentuk (id 10001+) tidak ikut. |
| Gambar kartu | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png` | Dibentuk dari id — tidak perlu panggil detail. |
| Tipe di kartu | `GET /pokemon-form/{id}` → `types[]` | Diambil per kartu saat tampil di layar (lazy), di-cache. Payload ±10× lebih kecil dari `/pokemon/{id}` (tanpa `moves`); id form default = id Pokémon untuk #1–#1025. |
| Filter tipe | `GET /type/{name}` → `pokemon[]` | Buang id > 1025. |
| Filter generasi | `GET /generation/{id}` → `pokemon_species[]` | 9 generasi. |
| Pencarian | — (lokal) | PokéAPI **tidak punya endpoint search**. Cari di index lokal berdasarkan nama (substring) atau nomor. |

**State:** loading (skeleton kartu), memuat halaman berikutnya (spinner di bawah), hasil cari kosong, error/offline + tombol coba lagi.

### 3.3 Sheet Urutkan & Filter
Bottom sheet: urutkan (nomor ↑/↓, nama A–Z/Z–A) dan pilih generasi (I–IX). Semua dikerjakan lokal di atas index + data `/generation`.

### 3.4 Detail Pokémon
Header berwarna tipe + artwork besar, nomor, nama, kategori (genus), chip tipe, tombol favorit, tombol prev/next. Isi dalam tab:

| Tab | Isi | API |
|---|---|---|
| **About** | Deskripsi Pokédex, tinggi, berat, abilities (tandai *hidden*), rasio gender, egg group, habitat, capture rate, generasi, label Legendary/Mythical | `GET /pokemon/{id}` + `GET /pokemon-species/{id}` |
| **Stats** | 6 stat (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) dalam bar + total | `GET /pokemon/{id}` → `stats[]` |
| **Evolusi** | Rantai evolusi + syarat (level, item, dll.), bisa ditap | `GET /evolution-chain/{id}` (URL dari `species.evolution_chain.url`) |
| **Kelemahan** | Tipe yang memberi damage ×2/×4, ×½/×¼, ×0 | `GET /type/{name}` → `damage_relations` (gabungkan untuk Pokémon dual-type) |

**Pengolahan data yang perlu diingat:**
- `height` dalam desimeter (÷10 → m), `weight` dalam hektogram (÷10 → kg).
- `flavor_text` berisi `\n` dan `\f` — bersihkan; pilih entri `language.name === "en"` terbaru.
- `genera` → ambil yang bahasa `en` (mis. "Mouse Pokémon").
- `gender_rate`: `-1` = tanpa gender, selain itu betina = `gender_rate / 8 × 100%`.
- Evolusi berbentuk pohon (`evolves_to[]` bisa bercabang, contoh Eevee) — render rekursif.

**State:** loading (skeleton), error, Pokémon tanpa evolusi.

### 3.5 Sheet Ability
Tap ability di tab About → bottom sheet berisi nama + efek singkat.

| Data | API |
|---|---|
| Efek ability | `GET /ability/{name}` → `effect_entries[]` (bahasa `en`, field `short_effect`) |

### 3.6 Tipe
Grid 18 tipe dengan warna masing-masing.

| Data | API |
|---|---|
| Daftar tipe | — (18 tipe tetap di app, `POKEMON_TYPE_NAMES`; `GET /type` berisi juga `unknown`, `stellar`, `shadow`) |

### 3.7 Detail Tipe
Header warna tipe, ringkasan efektivitas (kuat terhadap / lemah terhadap / kebal), lalu daftar Pokémon bertipe tersebut.

| Data | API |
|---|---|
| Efektivitas + daftar Pokémon | `GET /type/{name}` → `damage_relations`, `pokemon[]` |

### 3.8 Favorit
Grid Pokémon yang disimpan. Disimpan **lokal di perangkat** (id + nama + tipe) — tidak perlu API untuk menampilkan daftar. **State:** kosong (ajak ke Pokédex).

### 3.9 Lainnya
Tentang aplikasi, kredit sumber data (PokéAPI), versi app, tombol hapus cache.

---

## 4. Ringkasan endpoint

| Endpoint | Dipakai di |
|---|---|
| `GET /pokemon?limit=1025` | Splash, Home (index + search) |
| `GET /pokemon/{id}` | Detail (about, stats) |
| `GET /pokemon-form/{id}` | Kartu (tipe) |
| `GET /pokemon-species/{id}` | Detail (deskripsi, genus, gender, habitat, evolusi) |
| `GET /evolution-chain/{id}` | Detail — tab Evolusi |
| `GET /type/{name}` | Filter tipe, Detail Tipe, kelemahan |
| `GET /generation/{id}` | Filter generasi |
| `GET /ability/{name}` | Sheet Ability |
| Sprite `official-artwork/{id}.png` | Semua gambar Pokémon |

---

## 5. Aturan teknis dari PokéAPI

- **Tidak ada API key**, tidak ada rate limit keras — tapi fair-use policy **mewajibkan cache lokal**; pelanggaran bisa diblokir IP. Semua response di-cache (memori + disk).
- Request **tanpa header `User-Agent` ditolak (403)** oleh proteksi Cloudflare PokéAPI (ditemukan saat riset, 7 Okt 2026). `fetch` di React Native biasanya sudah mengirimnya, tapi pastikan di HTTP client / script testing.
- Data PokéAPI hampir statis → cache boleh lama (mis. 7 hari).
- Hindari N+1 berlebihan: tipe di kartu diambil lazy hanya untuk item yang tampil, dan dibatasi concurrency-nya.
- **GraphQL** PokéAPI (`graphql.pokeapi.co/v1beta2`) masih beta dan saat dicek (7 Okt 2026) mengembalikan error 522 — **jangan diandalkan**, pakai REST.
- Suara Pokémon (`cries`) berformat `.ogg` yang tidak didukung native di iOS — tidak dimasukkan ke MVP.

---

## 6. Prinsip desain (anti "AI slop")

Desain harus terasa dibuat untuk *produk ini*, bukan template generik:

1. **Warna punya arti.** Merah `#DC0A2D` hanya untuk brand & aksi utama; warna lain berasal dari 18 warna tipe Pokémon. Tidak ada gradient dekoratif, glow, atau glassmorphism tanpa fungsi.
2. **Data asli, bukan lorem ipsum.** Semua mock memakai Pokémon, angka stat, dan deskripsi asli dari API.
3. **Tidak ada elemen redundan.** Satu aksi = satu tempat (mis. favorit cukup di tab bar & detail, bukan juga di header Home). Tidak ada subjudul yang mengulang placeholder kolom cari.
4. **Tidak semua dibungkus kartu.** Kartu hanya untuk item Pokémon yang bisa ditap; info detail memakai daftar/baris biasa dengan hierarki tipografi.
5. **Sistem yang konsisten.** Grid 4 pt, radius terbatas (8 / 16 / 20), dua font (Poppins untuk judul, Inter untuk teks), ikon satu library (Lucide) + ikon pokéball custom.
6. **State lengkap ikut didesain:** loading, kosong, error, offline — bukan hanya happy path.
7. **Kontras terbaca.** Teks di atas warna tipe terang (Electric, Ice, Ground, dll.) memakai teks gelap, bukan putih.
8. **Detail khas Pokédex,** bukan hiasan generik: nomor `#025` dengan nol di depan, watermark pokéball halus di kartu, warna tipe resmi.

### Revisi yang akan dilakukan pada Home Opsi A
- Hapus subjudul header (mengulang placeholder cari) dan tombol favorit di header (duplikat tab Favorit).
- Rapikan posisi nomor `#004` yang terlalu dekat dengan nama panjang (Charmander, Jigglypuff).
- Tetapkan warna kartu ke 18 tipe secara sistematis (bukan dipilih per Pokémon).

---

## 7. Daftar layar yang akan didesain

| # | Layar | Varian / state |
|---|---|---|
| 1 | Splash | — |
| 2 | Home — Pokédex | default, loading (skeleton), hasil cari, cari kosong, error/offline |
| 3 | Sheet Urutkan & Filter | — |
| 4 | Detail Pokémon | About, Stats, Evolusi, Kelemahan, loading |
| 5 | Sheet Ability | — |
| 6 | Tipe | — |
| 7 | Detail Tipe | — |
| 8 | Favorit | berisi, kosong |
| 9 | Lainnya | — |

Ukuran layar: iPhone 390 × 844. Komponen dasar (kartu Pokémon, chip tipe, bar stat, tab bar, tombol) dibuat sebagai komponen reusable di pen.dev.

---

# Versi 2 — Semua resource PokéAPI

> Status: **desain selesai** di `design/pokedex.pen` (section 05–09). **Implementasi selesai** untuk semua
> layar (rilis v0.2.0).
> Gaya visual sama dengan v1 (Classic Red, komponen yang sama). Data di mockup diambil dari API asli.

## 8. Perubahan navigasi

- Tab **Tipe → Jelajah** (ikon kompas). Tetap 4 tab: Pokédex · Jelajah · Favorit · Lainnya.
- Halaman Tipe & Detail Tipe v1 sekarang dibuka dari tile **Tipe** di Jelajah (stack, dengan tombol kembali).
- Detail Pokémon punya 6 tab: **About · Stats · Moves · Evolusi · Lokasi · Lemah** (label "Kelemahan" dipendekkan
  agar 6 tab muat tanpa scroll).

```
Jelajah
├── Data utama: Tipe · Moves · Item · Berry
├── Dunia: Region & lokasi (+ Pal Park) · Game & generasi · Pokédex regional
├── Kelompok Pokémon: Egg group · Warna · Bentuk · Habitat · Gender · Growth rate
└── Referensi: Nature · Kontes · Pemicu evolusi · Metode encounter
Lainnya: + Bahasa data (sheet 14 bahasa) · + Versi data PokéAPI
```

## 9. Layar v2 & API

| # | Layar (frame di pen.dev) | API |
|---|---|---|
| 1 | **Jelajah** (hub) | jumlah dari `count` tiap resource list |
| 2 | **Lainnya v2** + **Sheet Bahasa data** | `language` (`official` → label "tidak resmi"), `meta` (tanggal deploy data) |
| 3 | **Detail v2 · About** — egg group / habitat / warna / bentuk / growth rate bisa ditap, nomor Pokédex regional | `pokemon-species` (`egg_groups`, `habitat`, `color`, `shape`, `growth_rate`, `pokedex_numbers`) |
| 4 | **Detail v2 · Moves** — pilih grup versi, segmen Level / TM / Telur / Tutor | `pokemon.moves[].version_group_details`, `move`, `move-learn-method`, `version-group`, `move-damage-class` |
| 5 | **Detail v2 · Lokasi** — per area & game: metode, level, peluang, kondisi | `/pokemon/{id}/encounters`, `location-area`, `version`, `encounter-method`, `encounter-condition(-value)` |
| 6 | **Sheet Stat** — nature naik/turun, move penaik stat, karakteristik IV | `stat`, `nature`, `characteristic` |
| 7 | **Moves · Daftar** — cari, Fisik/Khusus/Status, filter tipe | `move` (list + detail), `move-damage-class`, `type` |
| 8 | **Move · Detail** — power/akurasi/PP/prioritas, efek, target, TM per game, kontes, dipelajari oleh | `move`, `move-ailment`, `move-category`, `move-target`, `machine`, `contest-type`, `contest-effect`, `super-contest-effect` |
| 9 | **Item · Daftar** — per kantong, harga terbaru | `item`, `item-pocket`, `item-category` |
| 10 | **Item · Detail** — harga beli/jual per versi, atribut, fling, efek | `item`, `item-attribute`, `item-fling-effect`, `currency` |
| 11 | **Berry · Daftar** — filter rasa | `berry`, `berry-flavor`, `berry-firmness` |
| 12 | **Berry · Detail** — efek, 5 rasa ↔ kategori kontes, data tanam, Natural Gift | `berry`, `berry-flavor`, `berry-firmness`, `contest-type`, `item` |
| 13 | **Region · Daftar** + Pal Park | `region`, `pal-park-area` |
| 14 | **Region · Detail** — game, Pokédex, lokasi (kota/rute/lainnya) | `region`, `version-group`, `pokedex`, `location` |
| 15 | **Lokasi · Detail** — Pokémon per versi + peluang & level | `location`, `location-area`, `version`, `encounter-method` |
| 16 | **Game & Generasi** | `generation`, `version-group`, `version` |
| 17 | **Pokédex regional** — nomor regional + nasional | `pokedex` |
| 18 | **Kelompok Pokémon** — segmen Egg / Warna / Bentuk / Habitat / Gender | `egg-group`, `pokemon-color`, `pokemon-shape`, `pokemon-habitat`, `gender` |
| 19 | **Nature** — stat ▲▼, suka/benci rasa, Pokéathlon, gaya bertarung | `nature`, `stat`, `berry-flavor`, `pokeathlon-stat`, `move-battle-style` |
| 20 | **Growth rate** — EXP sampai level 100, rumus, grafik | `growth-rate` |
| 21 | **Kontes** | `contest-type`, `berry-flavor` |
| 22 | **Pemicu evolusi** + variabel tersembunyi | `evolution-trigger`, `evolution-variable` |
| 23 | **Metode encounter** + kondisi | `encounter-method`, `encounter-condition`, `encounter-condition-value` |
| 24 | **Kelompok Pokémon · Gender** — betina saja (37) / jantan saja (26) / tanpa gender (155) / campuran (807), sebaran rasio, Pokémon yang gendernya jadi syarat evolusi | `gender` (`pokemon_species_details`, `required_for_evolution`) |
| 25 | **Pal Park** — per area (Forest 93, Field 162, Mountain 140, Pond 44, Sea 54): skor Catching Show & peluang | `pal-park-area` |
| 26 | **Item · Detail (Flame Orb)** — Fling: power + efek (Burn), efek fling lain, Pokémon liar yang memegang | `item`, `item-fling-effect`, `item-category` |

## 10. Cakupan resource (51/51)

> Di desain 51/51. Di aplikasi **51/51** sejak v0.2.0.

| Grup | Resource | Dipakai di |
|---|---|---|
| Pokémon | `pokemon`, `pokemon-form`, `pokemon-species`, `ability`, `type`, `stat`, `characteristic`, `nature`, `pokeathlon-stat`, `egg-group`, `gender`, `growth-rate`, `pokemon-color`, `pokemon-shape`, `pokemon-habitat` | v1 + layar 3, 6, 18–20 |
| Evolusi | `evolution-chain`, `evolution-trigger`, `evolution-variable` | v1 tab Evolusi, layar 22 |
| Moves | `move`, `move-ailment`, `move-battle-style`, `move-category`, `move-damage-class`, `move-learn-method`, `move-target`, `machine` | layar 4, 7, 8, 19 |
| Kontes | `contest-type`, `contest-effect`, `super-contest-effect` | layar 8, 12, 21 |
| Item | `item`, `item-attribute`, `item-category`, `item-fling-effect`, `item-pocket`, `currency` | layar 9, 10 |
| Berry | `berry`, `berry-firmness`, `berry-flavor` | layar 11, 12, 19 |
| Lokasi | `region`, `location`, `location-area`, `pal-park-area`, `encounter-method`, `encounter-condition`, `encounter-condition-value` | layar 5, 13–15, 23 |
| Game | `generation`, `version`, `version-group`, `pokedex` | v1 filter generasi, layar 4, 14, 16, 17 |
| Utilitas | `language`, `meta` | layar 2 |

## 11. Temuan data yang mempengaruhi implementasi

- **`item.prices`** (bukan `cost`) — harga per grup versi + `currency`; banyak item tidak punya harga
  (mis. Poké Ball, Potion, Flame Orb). Kosong = *tidak ada data*, bukan *tidak dijual* — tampilkan "Tidak ada data harga".
- **Sprite item**: `sprites/items/dream-world/{name}.png` (±90 px) jauh lebih tajam dari default 30 px,
  tapi tidak tersedia untuk semua item → fallback ke sprite default.
- **Nama tampilan ≠ slug**: pakai `names[]` sesuai bahasa data (mis. egg group `ground` = "Field",
  `indeterminate` = "Amorphous", `slow-then-very-fast` = "Erratic").
- **PokéAPI tidak punya flag "kontak"** pada move — tidak ditampilkan.
- **Bahasa data**: 14 bahasa, tanpa Indonesia. Teks tanpa terjemahan → fallback Inggris. Font app di-subset
  ke Latin, jadi nama Jepang/Korea/Mandarin memakai font sistem (fallback otomatis OS).
- **Encounter** dikelompokkan per `location_area` lalu per versi; Pikachu: 40 area di 33 game.
- **Payload besar**: `move` list 937, `item` 2.223, `location` 1.104 → daftar memakai paginasi API
  (`limit/offset`) + cari di index nama (sama seperti Pokédex), detail dimuat lazy.
