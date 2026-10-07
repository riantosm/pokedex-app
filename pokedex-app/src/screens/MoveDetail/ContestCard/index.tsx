import { StyleSheet, View } from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import { Heart } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import {
  useGetContestEffectQuery,
  useGetSuperContestEffectQuery,
} from '@/services/api/move.service';
import { useGetContestTypeQuery } from '@/services/api/reference.service';
import { colors } from '@/theme/colors';
import { pickEntry, pickName } from '@/utils/i18n';
import { CONTEST_COLORS } from '@/utils/labels';
import { cleanFlavorText } from '@/utils/format';

export interface ContestCardProps {
  contestType: string;
  contestEffectId: number | null;
  superContestEffectId: number | null;
}

const MAX_HEARTS = 8;

/** Data kontes move: kategori, appeal (hati), jam, efek + Super Contest. */
export default function ContestCard({
  contestType,
  contestEffectId,
  superContestEffectId,
}: ContestCardProps) {
  const lang = useDataLanguage();
  const type = useGetContestTypeQuery(contestType);
  const effect = useGetContestEffectQuery(contestEffectId ?? skipToken);
  const superEffect = useGetSuperContestEffectQuery(
    superContestEffectId ?? skipToken,
  );
  const color = CONTEST_COLORS[contestType] ?? colors.ink2;
  const appeal = effect.data?.appeal ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.type, { backgroundColor: color }]}>
          <AppText variant="label" color={colors.white}>
            {pickName(type.data?.names, lang, contestType)}
          </AppText>
        </View>
        {effect.data && (
          <>
            <View style={styles.hearts} accessibilityLabel={`Appeal ${appeal}`}>
              {Array.from({ length: MAX_HEARTS }, (_, i) => (
                <Heart
                  key={i}
                  size={13}
                  color={i < appeal ? color : '#D9D9E0'}
                  fill={i < appeal ? color : 'transparent'}
                />
              ))}
            </View>
            <AppText variant="caption" color={colors.ink3}>
              Jam {effect.data.jam}
            </AppText>
          </>
        )}
      </View>
      {effect.data && (
        <AppText variant="callout" color={colors.ink2}>
          {cleanFlavorText(
            pickEntry(effect.data.effect_entries, lang)?.effect ?? '',
          )}
        </AppText>
      )}
      {superEffect.data && (
        <AppText variant="caption" color={colors.ink3}>
          Super Contest · +{superEffect.data.appeal}:{' '}
          {cleanFlavorText(
            pickEntry(superEffect.data.flavor_text_entries, lang)
              ?.flavor_text ?? '',
          )}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.bg,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  type: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  hearts: {
    flexDirection: 'row',
    gap: 2,
  },
});
