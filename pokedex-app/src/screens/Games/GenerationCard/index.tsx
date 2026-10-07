import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import Tag from '@/components/atoms/Tag';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetGenerationQuery } from '@/services/api/generation.service';
import { useGetRegionQuery } from '@/services/api/location.service';
import { colors } from '@/theme/colors';
import { formatCount } from '@/utils/format';
import { pickName } from '@/utils/i18n';
import { generationRoman, versionGroupLabel } from '@/utils/labels';

export interface GenerationCardProps {
  id: number;
  defaultOpen: boolean;
}

/** Kartu satu generasi: badge romawi, region, jumlah Pokémon & move baru, grup versi (bisa dilipat). */
function GenerationCard({ id, defaultOpen }: GenerationCardProps) {
  const lang = useDataLanguage();
  const [open, setOpen] = useState(defaultOpen);
  const { data } = useGetGenerationQuery(id);
  const region = useGetRegionQuery(data?.main_region.name ?? '', {
    skip: !data,
  });
  const roman = data ? generationRoman(data.name) : '';
  const Chevron = open ? ChevronUp : ChevronDown;

  return (
    <Animated.View layout={LinearTransition.duration(220)} style={styles.card}>
      <PressableScale
        scaleTo={0.99}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(o => !o)}
        style={styles.head}
      >
        <View style={styles.badge}>
          <AppText variant="calloutStrong" color={colors.brand}>
            {roman || '…'}
          </AppText>
        </View>
        <View style={styles.text}>
          {data ? (
            <>
              <AppText variant="bodyStrong" numberOfLines={1}>
                {`Generasi ${roman} · ${pickName(
                  region.data?.names,
                  lang,
                  data.main_region.name,
                )}`}
              </AppText>
              <AppText variant="caption" color={colors.ink3}>
                {`${formatCount(
                  data.pokemon_species.length,
                )} Pokémon baru · ${formatCount(data.movesCount)} move baru`}
              </AppText>
            </>
          ) : (
            <>
              <Skeleton width={160} height={16} />
              <Skeleton width={120} height={12} />
            </>
          )}
        </View>
        <Chevron size={18} color={colors.ink3} />
      </PressableScale>
      {open && data && (
        <Animated.View entering={FadeIn.duration(180)} style={styles.groups}>
          {data.version_groups.map(vg => (
            <Tag
              key={vg}
              label={versionGroupLabel(vg)}
              background={colors.bg}
              size="sm"
            />
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default memo(GenerationCard);

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
  },
  text: {
    flex: 1,
    gap: 3,
  },
  groups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingBottom: 4,
  },
});
