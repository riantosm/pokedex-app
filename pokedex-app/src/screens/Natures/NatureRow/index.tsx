import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetNatureQuery } from '@/services/api/nature.service';
import { colors } from '@/theme/colors';
import { formatName } from '@/utils/format';
import { pickName } from '@/utils/i18n';
import { flavorLabel, statShortLabel } from '@/utils/labels';

export const NATURE_STAT_WIDTH = 58;
export const NATURE_LIKE_WIDTH = 48;

const STYLE_LABEL: Record<string, string> = {
  attack: 'Attack',
  defense: 'Defense',
  support: 'Support',
};

function StatPill({ stat, up }: { stat: string; up: boolean }) {
  const color = up ? colors.success : colors.danger;
  return (
    <View style={styles.stat}>
      <View style={[styles.pill, { backgroundColor: `${color}1A` }]}>
        <AppText variant="micro" color={color}>
          {`${up ? '▲' : '▼'} ${statShortLabel(stat)}`}
        </AppText>
      </View>
    </View>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <AppText variant="caption" color={colors.ink3} style={styles.key}>
        {label}
      </AppText>
      <AppText variant="caption" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

/** Baris nature: nama · stat naik · stat turun · rasa disukai. Tap → benci rasa, Pokéathlon, gaya bertarung. */
function NatureRow({ name, divider }: { name: string; divider: boolean }) {
  const lang = useDataLanguage();
  const [open, setOpen] = useState(false);
  const { data } = useGetNatureQuery(name);
  const neutral =
    data &&
    (!data.increased_stat ||
      data.increased_stat.name === data.decreased_stat?.name);

  const style = data?.move_battle_style_preferences.reduce<
    (typeof data.move_battle_style_preferences)[number] | null
  >(
    (best, s) =>
      !best || s.low_hp_preference > best.low_hp_preference ? s : best,
    null,
  );
  const athlon = data?.pokeathlon_stat_changes
    .map(
      c =>
        `${formatName(c.pokeathlon_stat.name)} ${
          c.max_change > 0 ? '▲' : '▼'
        }${Math.abs(c.max_change)}`,
    )
    .join(' · ');

  return (
    <Animated.View
      layout={LinearTransition.duration(200)}
      style={divider && styles.divider}
    >
      <PressableScale
        scaleTo={0.99}
        disabled={!data}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(o => !o)}
        style={styles.row}
      >
        <AppText variant="calloutStrong" style={styles.name} numberOfLines={1}>
          {pickName(data?.names, lang, name)}
        </AppText>
        {!data ? (
          <Skeleton width={120} height={18} />
        ) : neutral ? (
          <AppText variant="caption" color={colors.ink3} style={styles.neutral}>
            Netral — tanpa efek
          </AppText>
        ) : (
          <>
            <StatPill stat={data.increased_stat!.name} up />
            <StatPill stat={data.decreased_stat!.name} up={false} />
          </>
        )}
        <AppText
          variant="caption"
          color={colors.ink2}
          style={styles.like}
          numberOfLines={1}
        >
          {data?.likes_flavor ? flavorLabel(data.likes_flavor.name) : ''}
        </AppText>
      </PressableScale>
      {open && data && (
        <Animated.View entering={FadeIn.duration(180)} style={styles.more}>
          {data.hates_flavor && (
            <Line
              label="Benci rasa"
              value={flavorLabel(data.hates_flavor.name)}
            />
          )}
          {!!athlon && <Line label="Pokéathlon" value={athlon} />}
          {style && (
            <Line
              label="Gaya bertarung"
              value={`${
                STYLE_LABEL[style.move_battle_style.name] ??
                formatName(style.move_battle_style.name)
              } ${style.low_hp_preference}% saat HP rendah, ${
                style.high_hp_preference
              }% saat HP tinggi`}
            />
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default memo(NatureRow);

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  row: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
  },
  stat: {
    width: NATURE_STAT_WIDTH,
    alignItems: 'flex-start',
  },
  pill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  neutral: {
    width: NATURE_STAT_WIDTH * 2 + 8,
  },
  like: {
    width: NATURE_LIKE_WIDTH,
  },
  more: {
    gap: 10,
    paddingTop: 2,
    paddingBottom: 14,
  },
  line: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    width: 104,
  },
  value: {
    flex: 1,
  },
});
