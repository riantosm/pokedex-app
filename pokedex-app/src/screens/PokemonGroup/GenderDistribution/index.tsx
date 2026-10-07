import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import SectionHeader from '@/components/molecules/SectionHeader';
import { colors } from '@/theme/colors';
import { formatCount } from '@/utils/format';
import {
  genderBucket,
  genderRateLabel,
  type GenderBucket,
} from '@/utils/labels';

const GENDERLESS = '#B5B5BC';

export interface GenderDistributionProps {
  /** Jumlah spesies per `rate` (-1, 0..8). */
  counts: Map<number, number>;
  selected: GenderBucket;
}

/** Grafik sebaran rasio gender: bar sepanjang jumlah spesies, bagian pink = porsi betina. */
export default function GenderDistribution({
  counts,
  selected,
}: GenderDistributionProps) {
  const rates = [...counts.keys()].sort(
    (a, b) => (a < 0 ? 99 : a) - (b < 0 ? 99 : b),
  );
  const max = Math.max(1, ...counts.values());
  const total = [...counts.values()].reduce((a, b) => a + b, 0);

  return (
    <View style={styles.card}>
      <SectionHeader
        title="Sebaran rasio gender"
        meta={`${formatCount(total)} spesies`}
        variant="subheading"
      />
      {rates.map(rate => {
        const n = counts.get(rate) ?? 0;
        const active = genderBucket(rate) === selected;
        return (
          <View key={rate} style={styles.row}>
            <AppText
              variant={active ? 'label' : 'caption'}
              color={active ? colors.ink : colors.ink2}
              style={styles.label}
            >
              {genderRateLabel(rate)}
            </AppText>
            <View style={styles.track}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${Math.max(1.5, (n / max) * 100)}%`,
                    backgroundColor: rate < 0 ? GENDERLESS : colors.genderMale,
                  },
                ]}
              >
                {rate > 0 && (
                  <View
                    style={[styles.female, { width: `${(rate / 8) * 100}%` }]}
                  />
                )}
              </View>
            </View>
            <AppText variant="label" align="right" style={styles.count}>
              {formatCount(n)}
            </AppText>
          </View>
        );
      })}
      <View style={styles.keys}>
        {[
          ['Jantan', colors.genderMale],
          ['Betina', colors.genderFemale],
          ['Tanpa gender', GENDERLESS],
        ].map(([label, color]) => (
          <View key={label} style={styles.key}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <AppText variant="micro" color={colors.ink3}>
              {label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  row: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    width: 84,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1B1B1F0F',
  },
  bar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  female: {
    height: 8,
    backgroundColor: colors.genderFemale,
  },
  count: {
    width: 34,
  },
  keys: {
    flexDirection: 'row',
    gap: 14,
    paddingTop: 2,
  },
  key: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
