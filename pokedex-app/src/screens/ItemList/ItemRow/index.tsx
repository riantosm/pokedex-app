import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import ItemSprite from '@/components/atoms/ItemSprite';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetItemQuery } from '@/services/api/item.service';
import { colors } from '@/theme/colors';
import { cleanFlavorText, formatCount } from '@/utils/format';
import { pickEntry, pickName } from '@/utils/i18n';
import { compareVersionGroupsNewestFirst } from '@/utils/labels';

export interface ItemRowProps {
  name: string;
  divider: boolean;
  onPress: (name: string) => void;
}

/**
 * Harga beli dari game terbaru yang menjualnya. Urutan `prices` PokéAPI tidak kronologis
 * (grup Jepang lama ada di akhir) → urutkan dulu.
 */
export function latestPurchase(
  prices: { purchase: number | null; versionGroup: string }[],
): number | null {
  const newest = [...prices]
    .filter(p => p.purchase)
    .sort((a, b) =>
      compareVersionGroupsNewestFirst(a.versionGroup, b.versionGroup),
    )[0];
  return newest?.purchase ?? null;
}

/** Baris item: sprite · nama · efek singkat · harga beli terbaru. Detail dimuat lazy. */
function ItemRow({ name, divider, onPress }: ItemRowProps) {
  const lang = useDataLanguage();
  const { data } = useGetItemQuery(name);
  const effect = pickEntry(data?.effect_entries, lang);
  const price = data ? latestPurchase(data.prices) : null;

  return (
    <PressableScale
      scaleTo={0.99}
      accessibilityRole="button"
      onPress={() => onPress(name)}
      style={[styles.row, divider && styles.divider]}
    >
      <View style={styles.sprite}>
        <ItemSprite name={name} size={34} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {pickName(data?.names, lang, name)}
        </AppText>
        {data ? (
          <AppText variant="caption" color={colors.ink3} numberOfLines={1}>
            {effect
              ? cleanFlavorText(effect.short_effect ?? effect.effect)
              : '—'}
          </AppText>
        ) : (
          <Skeleton width={140} height={10} />
        )}
      </View>
      <AppText variant="captionStrong" color={price ? colors.ink : colors.ink3}>
        {price ? `₽${formatCount(price)}` : '—'}
      </AppText>
    </PressableScale>
  );
}

export default memo(ItemRow);

const styles = StyleSheet.create({
  row: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  sprite: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
