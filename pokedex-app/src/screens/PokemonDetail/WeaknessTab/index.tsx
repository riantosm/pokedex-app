import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import TypeEffectGroup from '@/components/molecules/TypeEffectGroup';
import { colors } from '@/theme/colors';
import type { TypeRelations } from '@/types';
import { defensiveEffectiveness } from '@/utils/typeEffectiveness';
import { pokemonName } from '@/utils/pokemon';

export interface WeaknessTabProps {
  name: string;
  /** `damage_relations` tiap tipe Pokémon ini. */
  relations: TypeRelations[];
}

export default function WeaknessTab({ name, relations }: WeaknessTabProps) {
  const e = defensiveEffectiveness(relations);
  const pick = (list: typeof e.weak, m: number) =>
    list.filter(x => x.multiplier === m).map(x => x.type);
  const quadWeak = pick(e.weak, 4);
  const quadResist = pick(e.resist, 0.25);

  return (
    <View style={styles.root}>
      <AppText variant="callout" color={colors.ink2}>
        Seberapa efektif serangan setiap tipe terhadap {pokemonName(name)}.
      </AppText>
      <Section title="Lemah terhadap">
        {quadWeak.length > 0 && (
          <TypeEffectGroup
            label="Sangat efektif"
            multiplier="×4"
            tone="bad"
            types={quadWeak}
          />
        )}
        <TypeEffectGroup
          label="Super efektif"
          multiplier="×2"
          tone="bad"
          types={pick(e.weak, 2)}
        />
      </Section>
      <Section title="Tahan terhadap">
        <TypeEffectGroup
          label="Kurang efektif"
          multiplier="×½"
          tone="good"
          types={pick(e.resist, 0.5)}
        />
        {quadResist.length > 0 && (
          <TypeEffectGroup
            label="Sangat tidak efektif"
            multiplier="×¼"
            tone="good"
            types={quadResist}
          />
        )}
      </Section>
      <Section title="Kebal terhadap">
        <TypeEffectGroup
          label="Tidak berpengaruh"
          multiplier="×0"
          tone="neutral"
          types={e.immune}
        />
      </Section>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <AppText variant="subheading" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 24,
  },
  section: {
    gap: 14,
  },
});
