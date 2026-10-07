import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { useGetLanguageQuery } from '@/services/api/reference.service';
import { colors } from '@/theme/colors';
import { DATA_LANGUAGES, type DataLanguage } from '@/utils/i18n';

export interface LanguageRowProps {
  language: (typeof DATA_LANGUAGES)[number];
  current: DataLanguage;
  divider: boolean;
  onPress: (language: DataLanguage) => void;
}

/** Satu bahasa: nama asli + nama Inggris, ditandai "tidak resmi" kalau `GET /language/{code}` bilang begitu. */
function LanguageRow({
  language,
  current,
  divider,
  onPress,
}: LanguageRowProps) {
  const { data } = useGetLanguageQuery(language.code);
  const selected = language.code === current;

  // Nama Inggris dari DATA_LANGUAGES, bukan `names` API: terjemahannya tidak lengkap per bahasa
  // (subjudul jadi campur bahasa) dan penulisannya tidak rapi ("Brazilian portuguese").
  const subtitle = [
    language.code === 'en' ? 'Bawaan · fallback' : language.english,
    data?.official === false ? 'tidak resmi' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <PressableScale
      scaleTo={0.99}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${language.native}, ${subtitle}`}
      onPress={() => onPress(language.code)}
      style={[styles.row, divider && styles.divider]}
    >
      <View style={styles.text}>
        <AppText variant={selected ? 'bodyStrong' : 'body'}>
          {language.native}
        </AppText>
        <AppText
          variant="caption"
          color={colors.ink3}
          style={styles.subtitle}
          numberOfLines={1}
        >
          {subtitle}
        </AppText>
      </View>
      <View style={[styles.radio, selected && styles.radioOn]} />
    </PressableScale>
  );
}

export default memo(LanguageRow);

const styles = StyleSheet.create({
  row: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    flexShrink: 1,
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
});
