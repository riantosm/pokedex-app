import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from '@d11/react-native-fast-image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import IconButton from '@/components/atoms/IconButton';
import Skeleton from '@/components/atoms/Skeleton';
import TypeBadge from '@/components/atoms/TypeBadge';
import { TOP_BAR_HEIGHT } from '@/components/organisms/CollapsingTopBar';
import { colors, type TypePalette } from '@/theme/colors';
import type { PokemonTypeName } from '@/types';
import { formatDexNumber } from '@/utils/format';
import { HERO_PARALLAX } from '@/utils/motion';
import { artworkUrl, pokemonName } from '@/utils/pokemon';

const ART_AREA = 232;
const ART_SIZE = 210;

export interface DetailHeroProps {
  id: number;
  name: string;
  /** Nama sesuai bahasa data (dari species); tanpa ini → slug diformat. */
  title?: string;
  types?: PokemonTypeName[];
  genus?: string;
  /** `legendary` / `mythical` dari species. */
  badge?: 'Legendary' | 'Mythical';
  palette: TypePalette;
  scrollY: SharedValue<number>;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function DetailHero({
  id,
  name,
  title,
  types,
  genus,
  badge,
  palette,
  scrollY,
  onPrev,
  onNext,
}: DetailHeroProps) {
  const insets = useSafeAreaInsets();

  // Artwork bergerak lebih lambat dari scroll (parallax) & membesar saat ditarik ke bawah.
  const artStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-200, 0, 300],
          [-40, 0, 300 * HERO_PARALLAX],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [-200, 0],
          [1.18, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      scrollY.value,
      [0, 260],
      [1, 0.2],
      Extrapolation.CLAMP,
    ),
  }));

  const navColor = palette.text;

  return (
    <View style={{ backgroundColor: palette.background }}>
      {/* Perpanjang warna ke atas supaya overscroll iOS tidak memperlihatkan putih. */}
      <View
        style={[styles.overscroll, { backgroundColor: palette.background }]}
      />
      <View
        style={[styles.title, { paddingTop: insets.top + TOP_BAR_HEIGHT + 8 }]}
      >
        <View style={styles.nameRow}>
          <AppText
            variant="heroTitle"
            color={palette.text}
            numberOfLines={1}
            style={styles.name}
            accessibilityRole="header"
          >
            {title ?? pokemonName(name)}
          </AppText>
          <AppText variant="heading" color={palette.textMuted}>
            {formatDexNumber(id)}
          </AppText>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.badges}>
            {types && types[0] ? (
              types.map(t => (
                <TypeBadge
                  key={t}
                  type={t}
                  tone="onColor"
                  surfaceType={types[0]}
                />
              ))
            ) : (
              <Skeleton
                width={60}
                height={22}
                radius={11}
                color={palette.pill}
              />
            )}
            {badge && (
              <View style={[styles.special, { backgroundColor: palette.pill }]}>
                <Sparkles size={12} color={palette.text} />
                <AppText variant="micro" color={palette.text}>
                  {badge}
                </AppText>
              </View>
            )}
          </View>
          {genus ? (
            <AppText variant="caption" color={palette.textMuted}>
              {genus}
            </AppText>
          ) : (
            <Skeleton width={96} height={12} color={palette.pill} />
          )}
        </View>
      </View>

      <View style={styles.artArea}>
        <View style={[styles.ring, { borderColor: palette.ring }]} />
        <View style={styles.sheetTop} />
        <Animated.View style={[styles.art, artStyle]} pointerEvents="none">
          {/* Remount saat tipe tiba → artwork yang gagal dimuat saat offline dicoba ulang. */}
          <FastImage
            key={types ? 'ready' : 'pending'}
            source={{ uri: artworkUrl(id) }}
            style={styles.artImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Animated.View>
        {onPrev && (
          <IconButton
            accessibilityLabel="Pokémon sebelumnya"
            onPress={onPrev}
            style={[styles.nav, styles.prev]}
            icon={<ChevronLeft size={20} color={navColor} />}
          />
        )}
        {onNext && (
          <IconButton
            accessibilityLabel="Pokémon berikutnya"
            onPress={onNext}
            style={[styles.nav, styles.next]}
            icon={<ChevronRight size={20} color={navColor} />}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overscroll: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1000,
    height: 1000,
  },
  title: {
    gap: 6,
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  special: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  artArea: {
    height: ART_AREA,
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    top: -4,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 40,
  },
  sheetTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 36,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
  },
  art: {
    position: 'absolute',
    top: 4,
    width: ART_SIZE,
    height: ART_SIZE,
  },
  artImage: {
    width: ART_SIZE,
    height: ART_SIZE,
  },
  nav: {
    position: 'absolute',
    top: 84,
  },
  prev: {
    left: 20,
  },
  next: {
    right: 20,
  },
});
