import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';
import { formatDexNumber } from '@/utils/format';
import { artworkUrl, pokemonName } from '@/utils/pokemon';

/** Skor Catching Show yang dianggap langka (pill merah). */
const RARE_SCORE = 80;

export const PAL_COLUMNS = { score: 44, rate: 48 } as const;

export interface PalParkRowProps {
  id: number;
  name: string;
  baseScore: number;
  rate: number;
  last: boolean;
  onPress: (id: number, name: string) => void;
}

function PalParkRow({
  id,
  name,
  baseScore,
  rate,
  last,
  onPress,
}: PalParkRowProps) {
  const rare = baseScore >= RARE_SCORE;
  return (
    <View style={[styles.card, last && styles.last]}>
      <PressableScale
        scaleTo={0.99}
        accessibilityRole="button"
        accessibilityLabel={`${pokemonName(
          name,
        )}, skor ${baseScore}, peluang ${rate}%`}
        onPress={() => onPress(id, name)}
        style={[styles.row, !last && styles.divider]}
      >
        <View style={styles.art}>
          <FastImage source={{ uri: artworkUrl(id) }} style={styles.img} />
        </View>
        <View style={styles.text}>
          <AppText variant="calloutStrong" numberOfLines={1}>
            {pokemonName(name)}
          </AppText>
          <AppText variant="micro" color={colors.ink3}>
            {formatDexNumber(id)}
          </AppText>
        </View>
        <View style={styles.score}>
          <View style={[styles.pill, rare && styles.pillRare]}>
            <AppText
              variant="captionStrong"
              color={rare ? colors.brand : colors.ink}
            >
              {String(baseScore)}
            </AppText>
          </View>
        </View>
        <AppText
          variant="caption"
          color={colors.ink2}
          align="right"
          style={styles.rate}
        >
          {`${rate}%`}
        </AppText>
      </PressableScale>
    </View>
  );
}

export default memo(PalParkRow);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  last: {
    paddingBottom: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  art: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  img: {
    width: 36,
    height: 36,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  score: {
    width: PAL_COLUMNS.score,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: colors.bg,
  },
  pillRare: {
    backgroundColor: colors.brandSoft,
  },
  rate: {
    width: PAL_COLUMNS.rate,
  },
});
