import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import StatRow from '@/components/molecules/StatRow';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import type { Pokemon } from '@/types';

const STAT_LABELS: Record<string, string> = {
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
}

export default function StatsTab({ pokemon, color }: StatsTabProps) {
  const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <View style={styles.root}>
      <View style={styles.list}>
        {pokemon.stats.map(s => (
          <StatRow
            key={s.stat.name}
            label={STAT_LABELS[s.stat.name] ?? s.stat.name}
            value={s.base_stat}
            color={color}
          />
        ))}
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
        yang mungkin.
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
