import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ArrowLeftRight,
  Castle,
  Coins,
  Copy,
  FlaskConical,
  HeartCrack,
  RotateCw,
  Sparkles,
  Swords,
  TrendingUp,
  Zap,
} from 'lucide-react-native';
import ListRow from '@/components/molecules/ListRow';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetEvolutionTriggerQuery } from '@/services/api/reference.service';
import { colors } from '@/theme/colors';
import { formatCount } from '@/utils/format';
import { pickName } from '@/utils/i18n';
import { pokemonName } from '@/utils/pokemon';

const ICON: Record<string, typeof Sparkles> = {
  'level-up': TrendingUp,
  trade: ArrowLeftRight,
  'use-item': FlaskConical,
  shed: Copy,
  spin: RotateCw,
  'tower-of-darkness': Castle,
  'tower-of-waters': Castle,
  'three-critical-hits': Swords,
  'take-damage': HeartCrack,
  'recoil-damage': HeartCrack,
  'agile-style-move': Zap,
  'strong-style-move': Zap,
  'gimmighoul-coins': Coins,
};

export interface TriggerRowProps {
  name: string;
  divider: boolean;
  /** Dipanggil dengan nama, judul lokal, dan id spesies pemicu. */
  onPress: (name: string, title: string, speciesIds: number[]) => void;
  speciesName: (id: number) => string;
}

/** Baris pemicu evolusi: ikon · nama · jumlah Pokémon (atau nama Pokémon kalau cuma satu). */
function TriggerRow({ name, divider, onPress, speciesName }: TriggerRowProps) {
  const lang = useDataLanguage();
  const { data } = useGetEvolutionTriggerQuery(name);
  const Icon = ICON[name] ?? Sparkles;
  const title = pickName(data?.names, lang, name);
  const ids = data?.speciesIds ?? [];
  const subtitle = !data
    ? '…'
    : ids.length === 1
    ? pokemonName(speciesName(ids[0]))
    : `${formatCount(ids.length)} Pokémon`;

  return (
    <ListRow
      title={title}
      subtitle={subtitle}
      divider={divider}
      onPress={data && ids.length ? () => onPress(name, title, ids) : undefined}
      lead={
        <View style={styles.lead}>
          <Icon size={18} color={colors.ink2} />
        </View>
      }
    />
  );
}

export default memo(TriggerRow);

const styles = StyleSheet.create({
  lead: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
