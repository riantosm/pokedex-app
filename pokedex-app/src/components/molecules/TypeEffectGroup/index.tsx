import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import TypeBadge from '@/components/atoms/TypeBadge';
import { colors } from '@/theme/colors';
import type { PokemonTypeName } from '@/types';

export type EffectTone = 'bad' | 'good' | 'neutral';

const toneColors: Record<EffectTone, string> = {
  bad: colors.danger,
  good: colors.success,
  neutral: colors.ink2,
};

export interface TypeEffectGroupProps {
  label: string;
  /** Mis. `×2`, `×½`, `×0`. */
  multiplier: string;
  tone: EffectTone;
  types: PokemonTypeName[];
  /** Teks saat `types` kosong. */
  emptyText?: string;
}

/** Satu baris efektivitas: pill pengali + label + badge tipe. */
export default function TypeEffectGroup({
  label,
  multiplier,
  tone,
  types,
  emptyText = 'Tidak ada',
}: TypeEffectGroupProps) {
  const color = toneColors[tone];

  return (
    <View style={styles.root}>
      <View style={styles.head}>
        <View style={[styles.multiplier, { backgroundColor: `${color}1A` }]}>
          <AppText variant="label" color={color}>
            {multiplier}
          </AppText>
        </View>
        <AppText variant="caption" color={colors.ink2}>
          {label}
        </AppText>
      </View>
      {types.length > 0 ? (
        <View style={styles.badges}>
          {types.map(t => (
            <TypeBadge key={t} type={t} />
          ))}
        </View>
      ) : (
        <AppText variant="callout" color={colors.ink3}>
          {emptyText}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 8,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  multiplier: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
