import type { TextStyle } from 'react-native';

/**
 * Nama font = nama PostScript (sama dengan nama file di src/assets/fonts).
 * Selalu pilih ketebalan lewat `fontFamily`, jangan `fontWeight` — di Android
 * kombinasi custom font + fontWeight bisa jatuh ke font sistem.
 */
export const fonts = {
  displaySemiBold: 'Poppins-SemiBold',
  displayBold: 'Poppins-Bold',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

/** Skala teks dari desain. Nama = peran, bukan ukuran. */
export const typography = {
  /** Judul layar tab (Pokédex, Tipe, Favorit, Lainnya). */
  screenTitle: { fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 36 },
  /** Nama Pokémon / tipe di hero detail. */
  heroTitle: { fontFamily: fonts.displayBold, fontSize: 30, lineHeight: 38 },
  /** Judul bagian (Semua Pokémon, Ability, Lemah terhadap). */
  heading: { fontFamily: fonts.displayBold, fontSize: 18, lineHeight: 26 },
  subheading: { fontFamily: fonts.displayBold, fontSize: 16, lineHeight: 24 },
  /** Nama di kartu Pokémon. */
  cardTitle: { fontFamily: fonts.displayBold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semiBold, fontSize: 15, lineHeight: 22 },
  callout: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  calloutStrong: { fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  captionStrong: { fontFamily: fonts.semiBold, fontSize: 13, lineHeight: 18 },
  /** Label kecil: nomor kartu, badge tipe, overline. */
  label: { fontFamily: fonts.semiBold, fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: fonts.semiBold, fontSize: 11, lineHeight: 14 },
  tab: { fontFamily: fonts.medium, fontSize: 10, lineHeight: 13 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
