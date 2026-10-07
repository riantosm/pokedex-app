import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import ChipScroller from '@/components/molecules/ChipScroller';
import InfoRow from '@/components/molecules/InfoRow';
import LinkChip from '@/components/molecules/LinkChip';
import SectionHeader from '@/components/molecules/SectionHeader';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { ROUTES } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import type { Pokemon, PokemonSpecies, SpeciesGroupKind } from '@/types';
import {
  cleanFlavorText,
  formatDexNumber,
  formatHeight,
  formatName,
  formatPercent,
  formatWeight,
} from '@/utils/format';
import { generationById } from '@/utils/generations';
import { pickEntry } from '@/utils/i18n';
import { growthRateLabel } from '@/utils/labels';
import { genderRatio, idFromUrl } from '@/utils/pokemon';
import AbilityName from './AbilityName';
import GroupLink from './GroupLink';

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
  const lang = useDataLanguage();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const openGroup = (kind: SpeciesGroupKind, name: string) =>
    navigation.push(ROUTES.POKEMON_GROUP, { kind, name });
  // Satu entri per bahasa (game terbaru) — pilih sesuai bahasa data.
  const flavor = pickEntry(species.flavor_text_entries, lang)?.flavor_text;
  const regionalDex = species.pokedex_numbers.filter(
    p => p.pokedex.name !== 'national',
  );
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
              <AbilityName name={a.ability.name} />
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
            species.egg_groups.length ? (
              <View style={styles.links}>
                {species.egg_groups.map(g => (
                  <GroupLink
                    key={g.name}
                    kind="egg-group"
                    name={g.name}
                    onPress={openGroup}
                  />
                ))}
              </View>
            ) : (
              '—'
            )
          }
        />
        <InfoRow
          label="Habitat"
          value={
            species.habitat ? (
              <View style={styles.links}>
                <GroupLink
                  kind="pokemon-habitat"
                  name={species.habitat.name}
                  onPress={openGroup}
                />
              </View>
            ) : (
              '—'
            )
          }
        />
        <InfoRow
          label="Warna & bentuk"
          value={
            <View style={styles.links}>
              <GroupLink
                kind="pokemon-color"
                name={species.color.name}
                onPress={openGroup}
              />
              {species.shape && (
                <GroupLink
                  kind="pokemon-shape"
                  name={species.shape.name}
                  onPress={openGroup}
                />
              )}
            </View>
          }
        />
        <InfoRow label="Capture rate" value={String(species.capture_rate)} />
        <InfoRow
          label="Growth rate"
          divider={false}
          value={
            <View style={styles.links}>
              <LinkChip
                label={growthRateLabel(species.growth_rate.name)}
                onPress={() =>
                  navigation.push(ROUTES.GROWTH_RATE, {
                    name: species.growth_rate.name,
                  })
                }
              />
            </View>
          }
        />
      </View>

      {regionalDex.length > 0 && (
        <View style={styles.dex}>
          <SectionHeader
            title="Pokédex regional"
            meta={`${regionalDex.length} Pokédex`}
            variant="subheading"
          />
          <ChipScroller>
            {regionalDex.map(p => (
              <Pressable
                key={p.pokedex.name}
                accessibilityRole="link"
                accessibilityLabel={`Nomor ${
                  p.entry_number
                } di Pokédex ${formatName(p.pokedex.name)}`}
                onPress={() =>
                  navigation.push(ROUTES.POKEDEX_DETAIL, {
                    name: p.pokedex.name,
                  })
                }
                style={styles.dexChip}
              >
                <AppText variant="calloutStrong">
                  {formatDexNumber(p.entry_number)}
                </AppText>
                <AppText variant="micro" color={colors.ink3}>
                  {formatName(p.pokedex.name)}
                </AppText>
              </Pressable>
            ))}
          </ChipScroller>
        </View>
      )}
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
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dex: {
    gap: 12,
  },
  dexChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.bg,
  },
});
