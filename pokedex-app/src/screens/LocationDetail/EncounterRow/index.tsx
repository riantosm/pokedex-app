import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { usePokemonTypes } from '@/hooks/usePokemonTypes';
import { colors, typeColors } from '@/theme/colors';
import type { PokemonTypeName } from '@/types';
import { artworkUrl, pokemonName } from '@/utils/pokemon';

export interface EncounterRowProps {
  id: number;
  name: string;
  minLevel: number;
  maxLevel: number;
  chance: number;
  divider: boolean;
  onPress: (id: number, name: string, types?: PokemonTypeName[]) => void;
}

/** Baris encounter: artwork dalam lingkaran warna tipe · nama · level · bar peluang. */
function EncounterRow({
  id,
  name,
  minLevel,
  maxLevel,
  chance,
  divider,
  onPress,
}: EncounterRowProps) {
  const types = usePokemonTypes(id);
  const tint = types?.[0] ? typeColors[types[0]] : colors.ink3;
  const level =
    minLevel === maxLevel ? `Lv ${minLevel}` : `Lv ${minLevel}–${maxLevel}`;

  return (
    <PressableScale
      scaleTo={0.99}
      accessibilityRole="button"
      accessibilityLabel={`${pokemonName(name)}, ${level}, peluang ${chance}%`}
      onPress={() => onPress(id, name, types ?? undefined)}
      style={[styles.row, divider && styles.divider]}
    >
      <View style={[styles.art, { backgroundColor: `${tint}2E` }]}>
        <FastImage
          key={types ? 'ready' : 'pending'}
          source={{ uri: artworkUrl(id) }}
          style={styles.img}
        />
      </View>
      <View style={styles.text}>
        <View style={styles.top}>
          <AppText variant="bodyStrong" numberOfLines={1} style={styles.name}>
            {pokemonName(name)}
          </AppText>
          <AppText variant="caption" color={colors.ink3}>
            {level}
          </AppText>
        </View>
        <View style={styles.chance}>
          <View style={styles.track}>
            <View
              style={[
                styles.bar,
                {
                  width: `${Math.max(2, Math.min(100, chance))}%`,
                  backgroundColor: tint,
                },
              ]}
            />
          </View>
          <AppText variant="label" align="right" style={styles.pct}>
            {`${chance}%`}
          </AppText>
        </View>
      </View>
    </PressableScale>
  );
}

export default memo(EncounterRow);

const styles = StyleSheet.create({
  row: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  art: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 46,
    height: 46,
  },
  text: {
    flex: 1,
    gap: 6,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
  },
  chance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#1B1B1F0F',
  },
  bar: {
    height: 6,
    borderRadius: 3,
  },
  pct: {
    minWidth: 36,
  },
});
