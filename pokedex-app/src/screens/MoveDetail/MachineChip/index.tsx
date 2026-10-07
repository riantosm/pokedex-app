import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import Skeleton from '@/components/atoms/Skeleton';
import { useGetMachineQuery } from '@/services/api/move.service';
import { colors } from '@/theme/colors';
import { versionGroupLabel } from '@/utils/labels';

export interface MachineChipProps {
  machineId: number;
  versionGroup: string;
}

/** Chip TM/HM per grup versi — nomor diambil dari `machine.item` (mis. `tm126` → TM126). */
export default function MachineChip({
  machineId,
  versionGroup,
}: MachineChipProps) {
  const { data } = useGetMachineQuery(machineId);

  return (
    <View style={styles.chip}>
      {data ? (
        <AppText variant="captionStrong">
          {data.item.name.toUpperCase()}
        </AppText>
      ) : (
        <Skeleton width={36} height={12} />
      )}
      <AppText variant="micro" color={colors.ink3}>
        {versionGroupLabel(versionGroup)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.bg,
  },
});
