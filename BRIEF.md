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
| Daftar tipe | `GET /type` (buang `unknown`, `stellar`, `shadow`) |

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
| `GET /type` | Halaman Tipe |
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
