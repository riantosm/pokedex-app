# Changelog — Pokédex

Semua perubahan penting dicatat di sini. Rilis terbaru di atas.

- **Baru**: fitur / layar / kemampuan yang sebelumnya tidak ada.
- **Ditingkatkan**: sesuatu yang sudah ada dibuat lebih baik (tampilan, performa, alur).
- **Perbaikan**: bug yang diperbaiki.

Kategori tanpa isi boleh dihilangkan.

---

## v0.2.0 (versionCode 2)

_7 Oktober 2026_

### Baru

- Tab Jelajah: move, item, berry, region & lokasi, Pal Park, game & generasi, Pokédex regional,
  kelompok Pokémon (egg group, warna, bentuk, habitat, gender), nature, growth rate, kontes,
  pemicu evolusi, dan metode encounter.
- Detail Pokémon: tab Moves (pilih game, Level / TM / Telur / Tutor) dan tab Lokasi (area per game,
  level, kondisi, peluang).
- Detail Pokémon: tap stat untuk melihat nature, move penaik, dan karakteristiknya.
- Detail Pokémon: egg group, habitat, warna, bentuk, dan growth rate bisa ditap; nomor di tiap
  Pokédex regional.
- Lainnya: pilih bahasa data (14 bahasa) untuk nama & deskripsi dari PokéAPI, lengkap dengan contoh.
- Lainnya: tanggal versi data PokéAPI.

### Ditingkatkan

- Halaman Tipe kini dibuka dari Jelajah.
- Data tersimpan dari versi lama diunduh ulang otomatis; favorit tetap.
- Splash dengan progress bar; tampilan Nature, Pokédex regional, Item, lokasi, dan metode encounter
  disamakan dengan desain.

### Perbaikan

- Deskripsi dan kategori Pokémon selalu tampil dalam bahasa yang benar.
- Nama dan efek ability mengikuti bahasa data, dengan keterangan bila belum diterjemahkan.
- Daftar Berry tidak lagi error karena data berry baru (Kee, Hopo, dll.) belum lengkap.
- Nama Pokémon seperti Deoxys, Nidoran♀, dan Type: Null tampil benar.
- Harga item memakai game terbaru; nama lokasi & atribut item tampil rapi.

## v0.1.0 (versionCode 1)

_7 Oktober 2026_

### Baru

- Pokédex: 1.025 Pokémon dalam grid berwarna sesuai tipe, dimuat bertahap saat digulir.
- Pokédex: cari nama atau nomor, filter tipe, urutkan, dan filter generasi I–IX.
- Pokédex: tampilan saat memuat, hasil kosong, dan offline dengan tombol coba lagi.
- Detail Pokémon: deskripsi, stat, rantai evolusi, kelemahan tipe, efek ability, dan
  tombol sebelum/berikutnya.
- Favorit: simpan Pokémon dengan ikon hati; tetap tersedia saat offline.
- Tipe: 18 tipe beserta kekuatan, kelemahan, dan daftar Pokémon-nya.
- Lainnya: ukuran data tersimpan, hapus cache, versi aplikasi, dan sumber data.
- Semua halaman bisa ditarik ke bawah untuk memuat ulang data.
- Animasi saat berpindah halaman, saat kartu muncul ketika digulir, dan efek parallax di detail.
- Tab bawah melayang dan otomatis tersembunyi saat keyboard muncul.
- Mode offline: penanda "Offline · menampilkan data tersimpan", data yang pernah dibuka tetap tampil,
  dan data dimuat ulang otomatis saat koneksi kembali.
- Ikon aplikasi Pikachu.

### Ditingkatkan

- Pokédex: scroll lebih mulus — data tipe di kartu ±10× lebih ringan dan render grid dioptimalkan.
- Ukuran APK lebih kecil tanpa mengurangi fitur.
- Tampilan memakai font Poppins (judul) dan Inter (teks) sesuai desain.

### Perbaikan

- Gambar Pokémon yang gagal dimuat saat offline kini muncul begitu datanya berhasil dimuat ulang.
- Penanda Offline juga muncul saat PokéAPI tidak bisa dihubungi (mis. Wi-Fi tanpa internet).
