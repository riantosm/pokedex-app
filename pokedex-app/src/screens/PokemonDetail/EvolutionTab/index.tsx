import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import FastImage from '@d11/react-native-fast-image';
import { ArrowDown, ChevronRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import TypeBadge from '@/components/atoms/TypeBadge';
import { usePokemonTypes } from '@/hooks/usePokemonTypes';
import { colors } from '@/theme/colors';
import type { EvolutionChain } from '@/types';
import {
  type EvolutionStep,
  evolutionTriggerLabel,
  flattenEvolutionChain,
} from '@/utils/evolution';
import { formatDexNumber, formatName } from '@/utils/format';
import { listItemEntering } from '@/utils/motion';
import { artworkUrl } from '@/utils/pokemon';

export interface EvolutionTabProps {
  chain: EvolutionChain;
  currentId: number;
  /** Warna sorotan Pokémon yang sedang dilihat. */
  accent: string;
  onSelect: (id: number, name: string) => void;
}

export default function EvolutionTab({
  chain,
  currentId,
  accent,
  onSelect,
}: EvolutionTabProps) {
  const steps = flattenEvolutionChain(chain.chain);

  return (
    <View>
      {steps.map((step, i) => {
        const prev = steps[i - 1];
        // Cabang (mis. Eevee): saudara dengan stage sama ditandai "atau".
        const sibling = prev && prev.stage === step.stage;
        return (
          <Animated.View key={step.id} entering={listItemEntering(i)}>
            {step.detail && (
              <View style={styles.connector}>
                <View style={styles.line} />
                <View style={styles.trigger}>
                  <ArrowDown size={12} color={colors.ink2} />
                  <AppText variant="label" color={colors.ink2}>
                    {sibling ? 'atau · ' : ''}
                    {evolutionTriggerLabel(step.detail)}
                  </AppText>
                </View>
              </View>
            )}
            <EvolutionRow
              step={step}
              current={step.id === currentId}
              accent={accent}
              onPress={() => onSelect(step.id, step.name)}
            />
          </Animated.View>
        );
      })}
      {steps.length === 1 && (
        <AppText variant="callout" color={colors.ink3} style={styles.single}>
          Pokémon ini tidak berevolusi.
        </AppText>
      )}
    </View>
  );
}

interface EvolutionRowProps {
  step: EvolutionStep;
  current: boolean;
  accent: string;
  onPress: () => void;
}

function EvolutionRow({ step, current, accent, onPress }: EvolutionRowProps) {
  const types = usePokemonTypes(step.id);

  return (
    <PressableScale
      scaleTo={0.98}
      disabled={current}
      accessibilityRole="button"
      accessibilityState={{ selected: current }}
      accessibilityLabel={`${formatName(step.name)}${
        current ? ', sedang dilihat' : ''
      }`}
      onPress={onPress}
      style={[
        styles.row,
        current && {
          backgroundColor: `${accent}14`,
          borderColor: `${accent}59`,
        },
      ]}
    >
      <View style={[styles.thumb, current && styles.thumbCurrent]}>
        <FastImage
          key={types ? 'ready' : 'pending'}
          source={{ uri: artworkUrl(step.id) }}
          style={styles.thumbImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={styles.info}>
        <AppText variant="label" color={colors.ink3}>
          {formatDexNumber(step.id)}
        </AppText>
        <AppText variant="subheading">{formatName(step.name)}</AppText>
        <View style={styles.types}>
          {types ? (
            types.map(t => <TypeBadge key={t} type={t} />)
          ) : types === undefined ? (
            <Skeleton width={56} height={28} radius={14} />
          ) : null}
        </View>
      </View>
      {current ? (
        <AppText variant="label" color={colors.ink2}>
          Dilihat
        </AppText>
      ) : (
        <ChevronRight size={18} color={colors.ink3} />
      )}
    </PressableScale>
  );
}

const THUMB = 76;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.transparent,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  thumbCurrent: {
    backgroundColor: colors.surface,
  },
  thumbImage: {
    width: 64,
    height: 64,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  types: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 2,
  },
  connector: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingLeft: 12 + THUMB / 2 - 1,
  },
  line: {
    width: 2,
    alignSelf: 'stretch',
    backgroundColor: colors.line,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.bg,
  },
  single: {
    paddingTop: 16,
  },
});
