import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BookOpen,
  Bug,
  Clock,
  CloudRain,
  Gamepad2,
  Info,
  Leaf,
  Package,
  Radar,
  Radio,
} from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetEncounterConditionQuery } from '@/services/api/reference.service';
import { colors } from '@/theme/colors';
import { pickName } from '@/utils/i18n';
import { conditionLabel, encounterConditionName } from '@/utils/labels';

const ICON: Record<string, typeof Info> = {
  time: Clock,
  season: Leaf,
  radio: Radio,
  swarm: Bug,
  radar: Radar,
  slot2: Gamepad2,
  item: Package,
  'story-progress': BookOpen,
  weather: CloudRain,
};

/** Kartu satu kondisi encounter (Waktu, Musim, …) dengan nilainya. */
function ConditionCard({ name }: { name: string }) {
  const lang = useDataLanguage();
  const { data } = useGetEncounterConditionQuery(name);
  const Icon = ICON[name] ?? Info;
  const values = data?.values
    .map(conditionLabel)
    .filter((v): v is string => !!v);

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Icon size={14} color={colors.ink2} />
        <AppText variant="captionStrong" numberOfLines={1} style={styles.flex}>
          {encounterConditionName(name) ?? pickName(data?.names, lang, name)}
        </AppText>
      </View>
      <AppText variant="micro" color={colors.ink3} numberOfLines={3}>
        {values ? values.join(' · ') || '—' : '…'}
      </AppText>
    </View>
  );
}

export default memo(ConditionCard);

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.bg,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flex: {
    flex: 1,
  },
});
