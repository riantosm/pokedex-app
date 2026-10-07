import { StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import InfoRow from '@/components/molecules/InfoRow';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import type { Pokemon, PokemonSpecies } from '@/types';
import {
  cleanFlavorText,
  formatHeight,
  formatName,
  formatPercent,
  formatWeight,
} from '@/utils/format';
import { generationById } from '@/utils/generations';
import { genderRatio, idFromUrl } from '@/utils/pokemon';

export interface AboutTabProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  onAbilityPress: (name: string, hidden: boolean) => void;
}

export default function AboutTab({
  pokemon,
  species,
  onAbilityPress,
}: AboutTabProps) {
  // Entri bahasa Inggris terakhir = dari game terbaru.
  const flavor = species.flavor_text_entries.at(-1)?.flavor_text;
  const generation = generationById(idFromUrl(species.generation.url));
  const gender = genderRatio(species.gender_rate);
  const abilities = [...pokemon.abilities].sort((a, b) => a.slot - b.slot);

  return (
    <View style={styles.root}>
      {flavor && (
        <AppText color={colors.ink2} style={styles.flavor}>
          {cleanFlavorText(flavor)}
        </AppText>
      )}

      <View style={styles.facts}>
        <Fact label="Tinggi" value={formatHeight(pokemon.height)} divider />
        <Fact label="Berat" value={formatWeight(pokemon.weight)} divider />
        <Fact
          label="Generasi"
          value={
            generation ? `${generation.roman} · ${generation.region}` : '—'
          }
        />
      </View>

      <View>
        <AppText variant="subheading" accessibilityRole="header">
          Ability
        </AppText>
        {abilities.map((a, i) => (
          <PressableScale
            key={a.ability.name}
            scaleTo={0.98}
            accessibilityRole="button"
            accessibilityHint="Lihat efek ability"
            onPress={() => onAbilityPress(a.ability.name, a.is_hidden)}
            style={[styles.ability, i < abilities.length - 1 && styles.divider]}
          >
            <View style={styles.abilityName}>
              <AppText variant="bodyStrong">
                {formatName(a.ability.name)}
              </AppText>
              {a.is_hidden && (
                <View style={styles.hiddenTag}>
                  <AppText variant="micro" color={colors.ink2}>
                    Hidden
                  </AppText>
                </View>
              )}
            </View>
            <ChevronRight size={18} color={colors.ink3} />
          </PressableScale>
        ))}
      </View>

      <View>
        <AppText variant="subheading" accessibilityRole="header">
          Data lainnya
        </AppText>
        <InfoRow
          label="Gender"
          value={
            gender ? (
              <View style={styles.gender}>
                <View style={styles.genderBar}>
                  <View style={[styles.male, { flex: gender.male }]} />
                  <View style={[styles.female, { flex: gender.female }]} />
                </View>
                <View style={styles.genderLabels}>
                  <AppText variant="label" color={colors.genderMaleText}>
                    ♂ {formatPercent(gender.male)}
                  </AppText>
                  <AppText variant="label" color={colors.genderFemaleText}>
                    ♀ {formatPercent(gender.female)}
                  </AppText>
                </View>
              </View>
            ) : (
              'Tanpa gender'
            )
          }
        />
        <InfoRow
          label="Egg group"
          value={
            species.egg_groups.map(g => formatName(g.name)).join(', ') || '—'
          }
        />
        <InfoRow
          label="Habitat"
          value={species.habitat ? formatName(species.habitat.name) : '—'}
        />
        <InfoRow label="Capture rate" value={String(species.capture_rate)} />
        <InfoRow
          label="Growth rate"
          value={formatName(species.growth_rate.name)}
          divider={false}
        />
      </View>
    </View>
  );
}

function Fact({
  label,
  value,
  divider,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <View style={[styles.fact, divider && styles.factDivider]}>
      <AppText variant="subheading">{value}</AppText>
      <AppText variant="label" color={colors.ink3} style={styles.factLabel}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 24,
  },
  flavor: {
    lineHeight: 23,
  },
  facts: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.bg,
  },
  fact: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  factDivider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.line,
  },
  factLabel: {
    fontFamily: fonts.regular,
  },
  ability: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  abilityName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hiddenTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.bg,
  },
  gender: {
    gap: 6,
  },
  genderBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  male: {
    backgroundColor: colors.genderMale,
  },
  female: {
    backgroundColor: colors.genderFemale,
  },
  genderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
