import { StyleSheet, View } from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Skeleton from '@/components/atoms/Skeleton';
import BottomSheet from '@/components/organisms/BottomSheet';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetAbilityQuery } from '@/services/api/ability.service';
import { colors } from '@/theme/colors';
import { abilityText } from '@/utils/ability';
import { generationById } from '@/utils/generations';
import { DATA_LANGUAGES, pickName } from '@/utils/i18n';
import { idFromUrl } from '@/utils/pokemon';

export interface AbilitySheetProps {
  visible: boolean;
  onClose: () => void;
  /** Ability terakhir yang dipilih — tetap ada selama animasi tutup. */
  ability: { name: string; hidden: boolean } | null;
}

export default function AbilitySheet({
  visible,
  onClose,
  ability,
}: AbilitySheetProps) {
  const { data, isError, refetch } = useGetAbilityQuery(
    ability?.name ?? skipToken,
  );
  const lang = useDataLanguage();
  const description = data ? abilityText(data, lang) : null;
  const effect = description?.text ?? null;
  // Efek lengkap hanya ada dalam en/de/fr — beri tahu kalau teks jatuh ke bahasa lain.
  const fallbackNote =
    description && description.language !== lang
      ? `Deskripsi ability ini belum tersedia dalam ${languageLabel(
          lang,
        )} — ditampilkan dalam ${languageLabel(description.language)}.`
      : null;
  const generation = data
    ? generationById(idFromUrl(data.generation.url))
    : undefined;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.head}>
        <View style={styles.titleRow}>
          <AppText variant="heading" accessibilityRole="header">
            {ability ? pickName(data?.names, lang, ability.name) : ''}
          </AppText>
          {ability?.hidden && (
            <View style={styles.tag}>
              <AppText variant="micro" color={colors.ink2}>
                Hidden ability
              </AppText>
            </View>
          )}
        </View>
        {generation && (
          <AppText variant="caption" color={colors.ink3}>
            Pertama muncul di Generasi {generation.roman}
          </AppText>
        )}
      </View>

      {effect ? (
        <AppText color={colors.ink2} style={styles.effect}>
          {effect}
        </AppText>
      ) : isError ? (
        <View style={styles.error}>
          <AppText variant="callout" color={colors.ink2}>
            Efek ability gagal dimuat.
          </AppText>
          <Button label="Coba lagi" variant="secondary" onPress={refetch} />
        </View>
      ) : data ? (
        <AppText variant="callout" color={colors.ink3}>
          Belum ada deskripsi untuk ability ini.
        </AppText>
      ) : (
        <View style={styles.loading}>
          <Skeleton />
          <Skeleton />
          <Skeleton width="55%" />
        </View>
      )}

      {fallbackNote && (
        <AppText variant="label" color={colors.ink3}>
          {fallbackNote}
        </AppText>
      )}
      <Button label="Tutup" variant="secondary" onPress={onClose} />
    </BottomSheet>
  );
}

function languageLabel(code: string): string {
  return code === 'en'
    ? 'bahasa Inggris'
    : DATA_LANGUAGES.find(l => l.code === code)?.native ?? code;
}

const styles = StyleSheet.create({
  head: {
    gap: 6,
    paddingTop: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.bg,
  },
  effect: {
    lineHeight: 23,
  },
  error: {
    gap: 12,
  },
  loading: {
    gap: 10,
  },
});
