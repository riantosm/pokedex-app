import { StyleSheet, View } from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import AppText from '@/components/atoms/AppText';
import ItemSprite from '@/components/atoms/ItemSprite';
import Overline from '@/components/atoms/Overline';
import PressableScale from '@/components/atoms/PressableScale';
import SectionHeader from '@/components/molecules/SectionHeader';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetItemFlingEffectQuery } from '@/services/api/item.service';
import { useGetResourceIndexQuery } from '@/services/api/resource.service';
import { colors, typePalette } from '@/theme/colors';
import { formatName } from '@/utils/format';
import { pickEntry, pickName } from '@/utils/i18n';
import { useGetItemQuery } from '@/services/api/item.service';

export interface FlingSectionProps {
  power: number | null;
  effect: string | null;
  onPressItem: (name: string) => void;
}

/** Fling: power + efek item ini, lalu contoh efek fling lain (`GET /item-fling-effect`). */
export default function FlingSection({
  power,
  effect,
  onPressItem,
}: FlingSectionProps) {
  const lang = useDataLanguage();
  const current = useGetItemFlingEffectQuery(effect ?? skipToken);
  const all = useGetResourceIndexQuery('item-fling-effect');
  const others = (all.data ?? []).filter(e => e.name !== effect).slice(0, 4);
  const text = pickEntry(current.data?.effect_entries, lang)?.effect;
  const accent = typePalette('fire').background;

  return (
    <View style={styles.root}>
      <SectionHeader
        title="Fling"
        meta="saat dilempar dengan move Fling"
        variant="subheading"
      />
      <View
        style={[
          styles.card,
          { backgroundColor: `${accent}14`, borderColor: `${accent}40` },
        ]}
      >
        <View style={styles.power}>
          <AppText variant="heading">{power ?? '—'}</AppText>
          <AppText variant="label" color={colors.ink3}>
            Power
          </AppText>
        </View>
        <View style={[styles.divider, { backgroundColor: `${accent}40` }]} />
        <View style={styles.effect}>
          {effect ? (
            <>
              <View style={[styles.tag, { backgroundColor: accent }]}>
                <AppText variant="micro" color={colors.white}>
                  {formatName(effect)}
                </AppText>
              </View>
              <AppText variant="bodyMedium">{text ?? '…'}</AppText>
            </>
          ) : (
            <AppText variant="callout" color={colors.ink2}>
              Tanpa efek tambahan
            </AppText>
          )}
        </View>
      </View>
      {others.length > 0 && (
        <View style={styles.others}>
          <Overline>Efek fling lain</Overline>
          <View style={styles.list}>
            {others.map((e, i) => (
              <OtherEffect
                key={e.name}
                name={e.name}
                divider={i < others.length - 1}
                lang={lang}
                onPressItem={onPressItem}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function OtherEffect({
  name,
  divider,
  lang,
  onPressItem,
}: {
  name: string;
  divider: boolean;
  lang: string;
  onPressItem: (name: string) => void;
}) {
  const { data } = useGetItemFlingEffectQuery(name);
  const firstItem = data?.items[0];
  const item = useGetItemQuery(firstItem ?? skipToken);

  return (
    <PressableScale
      scaleTo={0.99}
      disabled={!firstItem}
      onPress={() => firstItem && onPressItem(firstItem)}
      style={[styles.row, divider && styles.rowDivider]}
    >
      {firstItem ? (
        <ItemSprite name={firstItem} size={28} />
      ) : (
        <View style={styles.spritePlaceholder} />
      )}
      <AppText variant="calloutStrong" style={styles.flex} numberOfLines={1}>
        {firstItem ? pickName(item.data?.names, lang, firstItem) : '…'}
      </AppText>
      <AppText variant="caption" color={colors.ink3}>
        {formatName(name)}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  power: {
    width: 64,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
  },
  effect: {
    flex: 1,
    gap: 4,
    alignItems: 'flex-start',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  others: {
    gap: 8,
  },
  list: {
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.bg,
  },
  row: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  spritePlaceholder: {
    width: 28,
    height: 28,
  },
  flex: {
    flex: 1,
  },
});
