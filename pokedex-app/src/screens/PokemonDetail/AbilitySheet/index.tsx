import { StyleSheet, View } from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Skeleton from '@/components/atoms/Skeleton';
import BottomSheet from '@/components/organisms/BottomSheet';
import { useGetAbilityQuery } from '@/services/api/ability.service';
import { colors } from '@/theme/colors';
import { cleanFlavorText, formatName } from '@/utils/format';
import { generationById } from '@/utils/generations';
import { idFromUrl } from '@/utils/pokemon';

/** Efek panjang di atas batas ini diganti `short_effect` supaya sheet tetap ringkas. */
const MAX_EFFECT_LENGTH = 320;

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
  const entry = data?.effect_entries[0];
  const effect = entry
    ? cleanFlavorText(
        entry.effect.length > MAX_EFFECT_LENGTH
          ? entry.short_effect
          : entry.effect,
      )
    : null;
  const generation = data
    ? generationById(idFromUrl(data.generation.url))
    : undefined;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.head}>
        <View style={styles.titleRow}>
          <AppText variant="heading" accessibilityRole="header">
            {ability ? formatName(ability.name) : ''}
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

      <AppText variant="label" color={colors.ink3}>
        Deskripsi ability dari PokéAPI hanya tersedia dalam bahasa Inggris.
      </AppText>
      <Button label="Tutup" variant="secondary" onPress={onClose} />
    </BottomSheet>
  );
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
