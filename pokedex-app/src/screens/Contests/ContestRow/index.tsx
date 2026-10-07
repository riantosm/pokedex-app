import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import ItemSprite from '@/components/atoms/ItemSprite';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetBerryFlavorQuery } from '@/services/api/berry.service';
import { useGetContestTypeQuery } from '@/services/api/reference.service';
import { colors } from '@/theme/colors';
import { formatName } from '@/utils/format';
import { pickName } from '@/utils/i18n';
import { CONTEST_COLORS, flavorLabel } from '@/utils/labels';

/** Berry paling ikonik untuk tiap rasa (rasa utamanya = rasa kategori). */
const SAMPLE_BERRY: Record<string, string> = {
  cool: 'cheri',
  beauty: 'chesto',
  cute: 'pecha',
  smart: 'rawst',
  tough: 'aspear',
};
const BERRY_PREVIEW = 8;

export interface ContestRowProps {
  name: string;
  onBerry: (berry: string) => void;
}

/** Kategori kontes: warna · nama · rasa berry. Tap → berry dengan rasa itu (potensi tertinggi). */
function ContestRow({ name, onBerry }: ContestRowProps) {
  const lang = useDataLanguage();
  const [open, setOpen] = useState(false);
  const { data } = useGetContestTypeQuery(name);
  const flavor = useGetBerryFlavorQuery(data?.berry_flavor.name ?? '', {
    skip: !open || !data,
  });
  const color = CONTEST_COLORS[name] ?? colors.ink3;
  const berries = flavor.data
    ? [...flavor.data.berries]
        .sort((a, b) => b.potency - a.potency)
        .slice(0, BERRY_PREVIEW)
    : [];
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <Animated.View layout={LinearTransition.duration(220)} style={styles.card}>
      <PressableScale
        scaleTo={0.99}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(o => !o)}
        style={styles.row}
      >
        <View style={[styles.swatch, { backgroundColor: `${color}26` }]}>
          <View style={[styles.dot, { backgroundColor: color }]} />
        </View>
        <View style={styles.text}>
          <AppText variant="cardTitle">
            {pickName(data?.names, lang, name)}
          </AppText>
          <AppText variant="caption" color={colors.ink3}>
            {data ? `Rasa berry: ${flavorLabel(data.berry_flavor.name)}` : '…'}
          </AppText>
        </View>
        {SAMPLE_BERRY[name] && (
          <ItemSprite name={`${SAMPLE_BERRY[name]}-berry`} size={36} />
        )}
        <Chevron size={18} color={colors.ink3} />
      </PressableScale>
      {open && (
        <Animated.View entering={FadeIn.duration(180)} style={styles.more}>
          <AppText variant="caption" color={colors.ink3}>
            Berry dengan rasa ini, potensi tertinggi dulu
          </AppText>
          <View style={styles.berries}>
            {flavor.data
              ? berries.map(b => (
                  <PressableScale
                    key={b.berry}
                    accessibilityRole="button"
                    onPress={() => onBerry(b.berry)}
                    style={styles.berry}
                  >
                    <ItemSprite name={`${b.berry}-berry`} size={22} />
                    <AppText variant="label" color={colors.ink2}>
                      {formatName(b.berry)}
                    </AppText>
                    <AppText variant="micro" color={colors.ink3}>
                      {String(b.potency)}
                    </AppText>
                  </PressableScale>
                ))
              : [0, 1, 2].map(i => (
                  <Skeleton key={i} width={86} height={32} radius={16} />
                ))}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default memo(ContestRow);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  row: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  more: {
    gap: 10,
    paddingBottom: 16,
  },
  berries: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  berry: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 6,
    paddingRight: 10,
    borderRadius: 16,
    backgroundColor: colors.bg,
  },
});
