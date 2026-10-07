import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetItemAttributeQuery } from '@/services/api/item.service';
import { colors } from '@/theme/colors';
import { pickName } from '@/utils/i18n';

/** Chip atribut item — nama dari `GET /item-attribute/{name}`. */
export default function AttributeChip({ name }: { name: string }) {
  const lang = useDataLanguage();
  const { data } = useGetItemAttributeQuery(name);

  return (
    <View style={styles.chip}>
      <Check size={13} color={colors.success} />
      <AppText variant="label">
        {/* Nama Inggris dari PokéAPI memakai garis bawah ("Usable_in_battle"). */}
        {pickName(data?.names, lang, name).replace(/_/g, ' ')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.bg,
  },
});
