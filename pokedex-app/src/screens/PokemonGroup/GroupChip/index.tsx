import { memo } from 'react';
import TypeChip from '@/components/molecules/TypeChip';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetSpeciesGroupQuery } from '@/services/api/group.service';
import type { SpeciesGroupKind } from '@/types';
import { pickName } from '@/utils/i18n';
import { POKEMON_COLORS } from '@/utils/labels';

/** Chip satu kelompok (egg group / warna / bentuk / habitat) + jumlah spesies. */
function GroupChip({
  kind,
  name,
  active,
  onPress,
}: {
  kind: SpeciesGroupKind;
  name: string;
  active: boolean;
  onPress: (name: string) => void;
}) {
  const lang = useDataLanguage();
  const { data } = useGetSpeciesGroupQuery({ kind, name });
  const label = pickName(data?.names, lang, name);
  return (
    <TypeChip
      label={data ? `${label} · ${data.speciesIds.length}` : label}
      active={active}
      dotColor={kind === 'pokemon-color' ? POKEMON_COLORS[name] : undefined}
      onPress={() => onPress(name)}
    />
  );
}

export default memo(GroupChip);
