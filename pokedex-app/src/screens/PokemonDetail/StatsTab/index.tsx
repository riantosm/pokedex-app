import { StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import StatRow from '@/components/molecules/StatRow';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import type { Pokemon } from '@/types';

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export interface StatsTabProps {
  pokemon: Pokemon;
  color: string;
  /** Tap stat → sheet nature / move / karakteristik. */
  onStatPress: (name: string, label: string, value: number) => void;
}

export default function StatsTab({
  pokemon,
  color,
  onStatPress,
}: StatsTabProps) {
  const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <View style={styles.root}>
      <View style={styles.list}>
        {pokemon.stats.map(s => {
          const label = STAT_LABELS[s.stat.name] ?? s.stat.name;
          return (
            <PressableScale
              key={s.stat.name}
              scaleTo={0.98}
              accessibilityRole="button"
              accessibilityHint="Lihat nature, move, dan karakteristik stat ini"
              onPress={() => onStatPress(s.stat.name, label, s.base_stat)}
              style={styles.stat}
            >
              <View style={styles.flex}>
                <StatRow label={label} value={s.base_stat} color={color} />
              </View>
              <ChevronRight size={16} color={colors.ink3} />
            </PressableScale>
          );
        })}
      </View>
      <View style={styles.total}>
        <AppText variant="captionStrong" style={styles.totalLabel}>
          Total
        </AppText>
        <AppText
          variant="calloutStrong"
          align="right"
          style={styles.totalValue}
        >
          {total}
        </AppText>
      </View>
      <AppText variant="label" color={colors.ink3} style={styles.note}>
        Base stat dari PokéAPI. Panjang bar memakai skala 0–255, nilai tertinggi
        yang mungkin. Tap stat untuk nature, move, dan karakteristiknya.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
  },
  list: {
    gap: 14,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flex: {
    flex: 1,
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  totalLabel: {
    width: 64,
  },
  totalValue: {
    width: 30,
  },
  note: {
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
});
