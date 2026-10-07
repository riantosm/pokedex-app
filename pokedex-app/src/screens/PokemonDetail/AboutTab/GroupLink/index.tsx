import { memo } from 'react';
import LinkChip from '@/components/molecules/LinkChip';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetSpeciesGroupQuery } from '@/services/api/group.service';
import type { SpeciesGroupKind } from '@/types';
import { pickName } from '@/utils/i18n';
import { POKEMON_COLORS } from '@/utils/labels';

/** Link ke Kelompok Pokémon; nama kelompok mengikuti bahasa data. */
function GroupLink({
  kind,
  name,
  onPress,
}: {
  kind: SpeciesGroupKind;
  name: string;
  onPress: (kind: SpeciesGroupKind, name: string) => void;
}) {
  const lang = useDataLanguage();
  const { data } = useGetSpeciesGroupQuery({ kind, name });
  // Beberapa nama PokéAPI huruf kecil semua (habitat "forest").
  const label = pickName(data?.names, lang, name);
  return (
    <LinkChip
      label={label.charAt(0).toUpperCase() + label.slice(1)}
      dotColor={kind === 'pokemon-color' ? POKEMON_COLORS[name] : undefined}
      onPress={() => onPress(kind, name)}
    />
  );
}

export default memo(GroupLink);
