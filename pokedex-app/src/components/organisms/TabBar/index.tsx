import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

const ICON_SIZE = 22;

/**
 * Tab bar kapsul melayang (desain: `Nav/Tab Bar`). Generik — ikon & label diambil dari
 * `options.tabBarIcon` / `options.tabBarLabel` tiap screen.
 */
export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? colors.brand : colors.ink3;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <PressableScale
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={onPress}
              style={[styles.item, focused && styles.itemActive]}
            >
              {options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}
              <Text
                style={[styles.label, focused && styles.labelActive, { color }]}
              >
                {label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.bg,
  },
  bar: {
    flexDirection: 'row',
    height: 62,
    padding: 6,
    borderRadius: 31,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    ...shadows.tabBar,
  },
  item: {
    flex: 1,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  itemActive: {
    backgroundColor: colors.brandSoft,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '600',
  },
});
