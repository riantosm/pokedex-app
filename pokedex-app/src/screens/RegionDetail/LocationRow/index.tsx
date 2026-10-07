import { memo } from 'react';
import { MapPin } from 'lucide-react-native';
import ListRow from '@/components/molecules/ListRow';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetLocationQuery } from '@/services/api/location.service';
import { colors } from '@/theme/colors';
import { formatName } from '@/utils/format';
import { pickEntry } from '@/utils/i18n';
import { stripRegionPrefix } from '@/utils/regions';

export interface LocationRowProps {
  name: string;
  region: string;
  divider: boolean;
  onPress: (name: string) => void;
}

/** Baris lokasi: nama resmi dari `GET /location/{name}` ("Mt. Moon"), slug selama memuat. */
function LocationRow({ name, region, divider, onPress }: LocationRowProps) {
  const lang = useDataLanguage();
  const { data } = useGetLocationQuery(name);

  return (
    <ListRow
      title={
        pickEntry(data?.names, lang)?.name ??
        formatName(stripRegionPrefix(name, region))
      }
      minHeight={50}
      divider={divider}
      lead={<MapPin size={16} color={colors.ink3} />}
      onPress={() => onPress(name)}
    />
  );
}

export default memo(LocationRow);
