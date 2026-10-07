import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

export interface SegmentOption<T extends string> {
  key: T;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface SegmentedProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (key: T) => void;
}

/** Segmented control (desain: Fisik/Khusus/Status, Level/TM/Telur/Tutor, Kota/Rute/Lainnya). */
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  return (
    <View style={styles.root} accessibilityRole="tablist">
      {options.map(o => {
        const selected = o.key === value;
        return (
          <PressableScale
            key={o.key}
            scaleTo={0.98}
            disabled={o.disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: o.disabled }}
            onPress={() => onChange(o.key)}
            style={[styles.item, selected && styles.selected]}
          >
            <AppText
              variant={selected ? 'captionStrong' : 'caption'}
              color={
                o.disabled ? '#B5B5BC' : selected ? colors.ink : colors.ink2
              }
              numberOfLines={1}
            >
              {o.label}
            </AppText>
            {o.count !== undefined && (
              <AppText
                variant="micro"
                color={o.disabled ? colors.control : colors.ink3}
              >
                {o.count}
              </AppText>
            )}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: 3,
    gap: 2,
    borderRadius: 12,
    backgroundColor: colors.skeleton,
  },
  item: {
    flex: 1,
    height: 34,
    borderRadius: 9,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
});
