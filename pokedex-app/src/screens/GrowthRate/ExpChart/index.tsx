import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';
import { formatCount } from '@/utils/format';

const CHART_HEIGHT = 118;
export const CHART_LEVELS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export interface ExpChartProps {
  levels: { level: number; experience: number }[];
  selected: number;
  onSelect: (level: number) => void;
}

/** Bar EXP tiap 10 level; tap bar untuk melihat angka EXP level itu. */
export default function ExpChart({
  levels,
  selected,
  onSelect,
}: ExpChartProps) {
  const expAt = (lv: number) =>
    levels.find(l => l.level === lv)?.experience ?? 0;
  const max = Math.max(1, ...CHART_LEVELS.map(expAt));

  return (
    <View style={styles.root}>
      <View style={styles.chart}>
        {CHART_LEVELS.map(lv => {
          const active = lv === selected;
          return (
            <PressableScale
              key={lv}
              scaleTo={0.94}
              accessibilityRole="button"
              accessibilityLabel={`Level ${lv}, ${formatCount(expAt(lv))} EXP`}
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(lv)}
              style={styles.col}
            >
              <View
                style={[
                  styles.bar,
                  active && styles.barActive,
                  { height: Math.max(3, (expAt(lv) / max) * CHART_HEIGHT) },
                ]}
              />
              <AppText
                variant="tab"
                color={active ? colors.ink : colors.ink3}
                align="center"
              >
                {String(lv)}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
      <View style={styles.highlight}>
        <AppText variant="captionStrong">{`Level ${selected}`}</AppText>
        <AppText variant="captionStrong" color={colors.brand}>
          {`${formatCount(expAt(selected))} EXP`}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 18,
  },
  chart: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  col: {
    flex: 1,
    gap: 4,
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#DC0A2D59',
  },
  barActive: {
    backgroundColor: colors.brand,
  },
  highlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
