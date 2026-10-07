import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import { colors } from '@/theme/colors';

/** Base stat tertinggi yang mungkin di game — skala bar 0–255. */
export const MAX_BASE_STAT = 255;

export interface StatRowProps {
  label: string;
  value: number;
  color: string;
  max?: number;
}

/** Desain: `Row/Stat`. */
export default function StatRow({
  label,
  value,
  color,
  max = MAX_BASE_STAT,
}: StatRowProps) {
  const ratio = Math.min(value / max, 1);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${label} ${value}`}
    >
      <AppText variant="caption" color={colors.ink3} style={styles.label}>
        {label}
      </AppText>
      <AppText variant="calloutStrong" align="right" style={styles.value}>
        {value}
      </AppText>
      <View style={styles.track}>
        <View
          style={[
            styles.bar,
            { width: `${ratio * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    width: 64,
  },
  value: {
    width: 30,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#1B1B1F0F',
  },
  bar: {
    height: 6,
    borderRadius: 3,
  },
});
