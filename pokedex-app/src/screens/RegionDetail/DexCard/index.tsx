import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetPokedexQuery } from '@/services/api/game.service';
import { colors } from '@/theme/colors';
import { formatCount } from '@/utils/format';
import { pickName } from '@/utils/i18n';

export interface DexCardProps {
  name: string;
  onPress: (name: string) => void;
}

/** Kartu Pokédex regional: ikon · nama · jumlah entri. */
function DexCard({ name, onPress }: DexCardProps) {
  const lang = useDataLanguage();
  const { data } = useGetPokedexQuery(name);
  const title = pickName(data?.names, lang, name);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Pokédex ${title}`}
      onPress={() => onPress(name)}
      style={styles.card}
    >
      <BookOpen size={18} color={colors.brand} />
      <AppText variant="calloutStrong" numberOfLines={1} style={styles.name}>
        {title}
      </AppText>
      <AppText variant="caption" color={colors.ink3}>
        {data ? `${formatCount(data.entries.length)} Pokémon` : '…'}
      </AppText>
    </PressableScale>
  );
}

export default memo(DexCard);

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: 2,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  name: {
    marginTop: 6,
  },
});
