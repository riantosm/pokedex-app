import { memo } from 'react';
import { Droplet, Mountain, Sprout, Trees, Waves } from 'lucide-react-native';
import TypeChip from '@/components/molecules/TypeChip';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetPalParkAreaQuery } from '@/services/api/location.service';
import { colors } from '@/theme/colors';
import { pickName } from '@/utils/i18n';

export const AREA_ICON: Record<string, typeof Trees> = {
  forest: Trees,
  field: Sprout,
  mountain: Mountain,
  pond: Droplet,
  sea: Waves,
};

/** Chip area Pal Park dengan jumlah Pokémon. */
function AreaChip({
  name,
  active,
  onPress,
}: {
  name: string;
  active: boolean;
  onPress: (name: string) => void;
}) {
  const lang = useDataLanguage();
  const { data } = useGetPalParkAreaQuery(name);
  const Icon = AREA_ICON[name] ?? Trees;
  const label = pickName(data?.names, lang, name);

  return (
    <TypeChip
      label={data ? `${label} · ${data.encounters.length}` : label}
      active={active}
      onPress={() => onPress(name)}
      icon={<Icon size={14} color={active ? colors.white : colors.ink2} />}
    />
  );
}

export default memo(AreaChip);
