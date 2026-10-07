import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import ItemSprite from '@/components/atoms/ItemSprite';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetBerryQuery } from '@/services/api/berry.service';
import { useGetItemQuery } from '@/services/api/item.service';
import { colors } from '@/theme/colors';
import { formatName } from '@/utils/format';
import { pickName } from '@/utils/i18n';
import { FLAVOR_COLORS } from '@/utils/labels';
import Animated from 'react-native-reanimated';
import { gridItemEntering } from '@/utils/motion';

export interface BerryTileProps {
  name: string;
  index: number;
  width: number;
  onPress: (name: string) => void;
}

/** Tile berry: sprite · nama · kekerasan · titik rasa. */
function BerryTile({ name, index, width, onPress }: BerryTileProps) {
  const lang = useDataLanguage();
  const { data } = useGetBerryQuery(name);
  const item = useGetItemQuery(`${name}-berry`);

  return (
    <Animated.View entering={gridItemEntering(index)} style={{ width }}>
      <PressableScale
        accessibilityRole="button"
        onPress={() => onPress(name)}
        style={styles.tile}
      >
        <ItemSprite name={`${name}-berry`} size={56} />
        <AppText variant="calloutStrong" numberOfLines={1}>
          {pickName(item.data?.names, lang, `${name}-berry`).replace(
            / Berry$/,
            '',
          )}
        </AppText>
        {data ? (
          <>
            <AppText variant="micro" color={colors.ink3}>
              {data.firmness ? formatName(data.firmness.name) : '—'}
            </AppText>
            <View style={styles.dots}>
              {data.flavors
                .filter(f => f.potency > 0)
                .map(f => (
                  <View
                    key={f.flavor.name}
                    style={[
                      styles.dot,
                      { backgroundColor: FLAVOR_COLORS[f.flavor.name] },
                    ]}
                  />
                ))}
            </View>
          </>
        ) : (
          <Skeleton width={50} height={10} />
        )}
      </PressableScale>
    </Animated.View>
  );
}

export default memo(BerryTile);

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    minHeight: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
