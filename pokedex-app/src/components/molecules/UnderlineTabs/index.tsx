import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';

export interface UnderlineTabsProps<T extends string> {
  tabs: readonly { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
  /** Warna garis bawah tab aktif (warna tipe). */
  accent: string;
}

/** Tab teks dengan garis bawah (desain: Tabs di Detail Pokémon). */
export default function UnderlineTabs<T extends string>({
  tabs,
  active,
  onChange,
  accent,
}: UnderlineTabsProps<T>) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {tabs.map(tab => {
        const selected = tab.key === active;
        return (
          <PressableScale
            key={tab.key}
            scaleTo={0.98}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.key)}
            style={[
              styles.tab,
              { borderBottomColor: selected ? accent : colors.transparent },
            ]}
          >
            <AppText
              variant={selected ? 'calloutStrong' : 'callout'}
              color={selected ? colors.ink : colors.ink3}
              numberOfLines={1}
            >
              {tab.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  tab: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
  },
});
