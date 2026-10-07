import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import PressableScale from '@/components/atoms/PressableScale';
import BottomSheet from '@/components/organisms/BottomSheet';
import { useGetGenerationQuery } from '@/services/api/generation.service';
import { colors } from '@/theme/colors';
import type { PokemonSummary } from '@/types';
import { formatCount } from '@/utils/format';
import { GENERATIONS } from '@/utils/generations';
import {
  DEFAULT_SORT,
  SORT_OPTIONS,
  filterPokedex,
  type PokedexSort,
} from '@/utils/pokedexFilter';
import { idFromUrl } from '@/utils/pokemon';

export interface SortFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  sort: PokedexSort;
  generation: number | null;
  onApply: (sort: PokedexSort, generation: number | null) => void;
  /** Untuk menghitung jumlah hasil di tombol "Tampilkan N". */
  index: readonly PokemonSummary[];
  query: string;
  typeIds: ReadonlySet<number> | null;
}

export default function SortFilterSheet({
  visible,
  onClose,
  sort,
  generation,
  onApply,
  index,
  query,
  typeIds,
}: SortFilterSheetProps) {
  const [draftSort, setDraftSort] = useState(sort);
  const [draftGeneration, setDraftGeneration] = useState(generation);

  // Setiap kali dibuka, mulai dari pilihan yang sedang berlaku.
  useEffect(() => {
    if (visible) {
      setDraftSort(sort);
      setDraftGeneration(generation);
    }
  }, [visible, sort, generation]);

  const { data: generationData } = useGetGenerationQuery(
    draftGeneration ?? skipToken,
  );
  const count = useMemo(() => {
    if (draftGeneration && !generationData) {
      return null;
    }
    const generationIds = generationData
      ? new Set(generationData.pokemon_species.map(s => idFromUrl(s.url)))
      : null;
    return filterPokedex(index, {
      query,
      typeIds,
      generationIds: draftGeneration ? generationIds : null,
    }).length;
  }, [draftGeneration, generationData, index, query, typeIds]);

  const rows = [GENERATIONS.slice(0, 4), GENERATIONS.slice(4)];

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Urutkan & filter">
      <View>
        <AppText variant="label" color={colors.ink3} style={styles.overline}>
          URUTKAN
        </AppText>
        {SORT_OPTIONS.map((option, i) => {
          const selected = option.value === draftSort;
          return (
            <PressableScale
              key={option.value}
              scaleTo={0.99}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setDraftSort(option.value)}
              style={[
                styles.option,
                i < SORT_OPTIONS.length - 1 && styles.optionDivider,
              ]}
            >
              <AppText variant={selected ? 'bodyStrong' : 'body'}>
                {option.label}
              </AppText>
              <View style={[styles.radio, selected && styles.radioOn]} />
            </PressableScale>
          );
        })}
      </View>

      <View style={styles.generation}>
        <AppText variant="label" color={colors.ink3} style={styles.overline}>
          GENERASI
        </AppText>
        {rows.map((row, r) => (
          <View key={r} style={styles.genRow}>
            {r === 0 && (
              <GenerationCell
                label="Semua"
                selected={draftGeneration === null}
                onPress={() => setDraftGeneration(null)}
              />
            )}
            {row.map(g => (
              <GenerationCell
                key={g.id}
                label={g.roman}
                region={g.region}
                selected={draftGeneration === g.id}
                onPress={() => setDraftGeneration(g.id)}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          label="Reset"
          variant="secondary"
          style={styles.action}
          onPress={() => {
            setDraftSort(DEFAULT_SORT);
            setDraftGeneration(null);
          }}
        />
        <Button
          label={
            count === null ? 'Terapkan' : `Tampilkan ${formatCount(count)}`
          }
          style={styles.action}
          onPress={() => onApply(draftSort, draftGeneration)}
        />
      </View>
    </BottomSheet>
  );
}

interface GenerationCellProps {
  label: string;
  region?: string;
  selected: boolean;
  onPress: () => void;
}

function GenerationCell({
  label,
  region,
  selected,
  onPress,
}: GenerationCellProps) {
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={
        region ? `Generasi ${label}, ${region}` : 'Semua generasi'
      }
      onPress={onPress}
      style={[styles.genCell, selected && styles.genCellOn]}
    >
      <AppText
        variant={region ? 'subheading' : 'captionStrong'}
        color={selected ? colors.brand : colors.ink}
      >
        {label}
      </AppText>
      {region && (
        <AppText variant="micro" color={colors.ink3}>
          {region}
        </AppText>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  overline: {
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  option: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.control,
  },
  radioOn: {
    borderWidth: 6,
    borderColor: colors.brand,
  },
  generation: {
    gap: 8,
  },
  genRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genCell: {
    flex: 1,
    height: 56,
    gap: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  genCellOn: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 4,
  },
  action: {
    flex: 1,
  },
});
