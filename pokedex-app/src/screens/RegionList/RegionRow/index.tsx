import { memo } from 'react';
import { StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import ListRow, { RowLead } from '@/components/molecules/ListRow';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetRegionQuery } from '@/services/api/location.service';
import { pickName } from '@/utils/i18n';
import { generationRoman } from '@/utils/labels';
import { artworkUrl } from '@/utils/pokemon';
import { REGION_ART } from '@/utils/regions';

function RegionRow({
  name,
  divider,
  onPress,
}: {
  name: string;
  divider: boolean;
  onPress: (n: string) => void;
}) {
  const lang = useDataLanguage();
  const { data } = useGetRegionQuery(name);
  const art = REGION_ART[name];
  const sub = data
    ? [
        data.main_generation
          ? `Generasi ${generationRoman(data.main_generation.name)}`
          : 'Spin-off',
        `${data.locations.length} lokasi`,
        data.pokedexes.length ? `${data.pokedexes.length} Pokédex` : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : '…';

  return (
    <ListRow
      title={pickName(data?.names, lang, name)}
      subtitle={sub}
      divider={divider}
      onPress={() => onPress(name)}
      lead={
        <RowLead>
          {art ? (
            <FastImage source={{ uri: artworkUrl(art) }} style={styles.art} />
          ) : null}
        </RowLead>
      }
    />
  );
}

export default memo(RegionRow);

const styles = StyleSheet.create({
  art: {
    width: 36,
    height: 36,
  },
});
