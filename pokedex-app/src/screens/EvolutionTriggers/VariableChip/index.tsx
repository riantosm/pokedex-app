import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetEvolutionVariableQuery } from '@/services/api/reference.service';
import { colors } from '@/theme/colors';
import { pickName } from '@/utils/i18n';

/** Chip variabel tersembunyi: simbol (PV, EC) bila ada + nama. */
function VariableChip({ id, name }: { id: number; name: string }) {
  const lang = useDataLanguage();
  const { data } = useGetEvolutionVariableQuery(id);
  return (
    <View style={styles.chip}>
      {data?.symbol && (
        <View style={styles.sym}>
          <AppText variant="tab" color={colors.white}>
            {data.symbol}
          </AppText>
        </View>
      )}
      <AppText variant="label">{pickName(data?.names, lang, name)}</AppText>
    </View>
  );
}

export default memo(VariableChip);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: colors.bg,
  },
  sym: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: colors.ink,
  },
});
