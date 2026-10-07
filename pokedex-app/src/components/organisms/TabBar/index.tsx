import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';
import { fonts } from '@/theme/typography';

const ICON_SIZE = 22;
const BAR_HEIGHT = 62;
const BAR_GAP_TOP = 8;
const MIN_BOTTOM = 14;

/** Tinggi total area tab bar melayang (bar + jarak + inset bawah). */
export const tabBarOverlayHeight = (bottomInset: number) =>
  BAR_GAP_TOP + BAR_HEIGHT + Math.max(bottomInset, MIN_BOTTOM);

/**
 * Tab bar kapsul melayang di atas konten (desain: `Nav/Tab Bar`). Generik — ikon & label
 * diambil dari `options.tabBarIcon` / `options.tabBarLabel` tiap screen.
 * Konten layar memberi ruang bawah lewat `useTabBarInset()`.
 */
export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  // Sembunyikan saat mengetik supaya tidak naik menutupi konten di atas keyboard.
  const keyboardVisible = useKeyboardVisible();

  if (keyboardVisible) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM) },
      ]}
    >
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
              <AppText
                variant="tab"
                color={color}
                style={focused && styles.labelActive}
              >
                {label}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: BAR_GAP_TOP,
    paddingHorizontal: 16,
  },
  bar: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    padding: 6,
    borderRadius: 31,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.tabBar,
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
  labelActive: {
    fontFamily: fonts.semiBold,
  },
});
