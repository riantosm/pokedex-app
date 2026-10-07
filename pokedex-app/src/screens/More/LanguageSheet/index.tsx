import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from '@d11/react-native-fast-image';
import AppText from '@/components/atoms/AppText';
import Skeleton from '@/components/atoms/Skeleton';
import BottomSheet from '@/components/organisms/BottomSheet';
import { useGetPokemonSpeciesQuery } from '@/services/api/pokemon.service';
import { colors } from '@/theme/colors';
import {
  DATA_LANGUAGES,
  pickEntry,
  pickName,
  type DataLanguage,
} from '@/utils/i18n';
import { artworkUrl } from '@/utils/pokemon';
import LanguageRow from './LanguageRow';

/** Pikachu jadi contoh: nama & kategorinya tersedia di semua 14 bahasa. */
const PREVIEW_ID = 25;
/** Tinggi kira-kira handle + judul + contoh + padding sheet — sisanya untuk daftar bahasa. */
const SHEET_CHROME = 230;

export interface LanguageSheetProps {
  visible: boolean;
  value: DataLanguage;
  onChange: (language: DataLanguage) => void;
  onClose: () => void;
}

export default function LanguageSheet({
  visible,
  value,
  onChange,
  onClose,
}: LanguageSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { data: species } = useGetPokemonSpeciesQuery(PREVIEW_ID);

  const genus = pickEntry(species?.genera, value)?.genus;
  const preview = species
    ? [pickName(species.names, value, species.name), genus]
        .filter(Boolean)
        .join(' · ')
    : null;

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Bahasa data">
      <View style={styles.preview}>
        <FastImage
          key={species ? 'ready' : 'pending'}
          source={{ uri: artworkUrl(PREVIEW_ID) }}
          style={styles.art}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.previewText}>
          <AppText variant="micro" color={colors.ink3}>
            CONTOH
          </AppText>
          {preview ? (
            <AppText variant="subheading" numberOfLines={1}>
              {preview}
            </AppText>
          ) : (
            <Skeleton width={180} height={16} />
          )}
        </View>
      </View>

      <ScrollView
        style={{
          maxHeight: height - insets.top - insets.bottom - SHEET_CHROME,
        }}
        showsVerticalScrollIndicator={false}
      >
        {DATA_LANGUAGES.map((l, i) => (
          <LanguageRow
            key={l.code}
            language={l}
            current={value}
            divider={i < DATA_LANGUAGES.length - 1}
            onPress={onChange}
          />
        ))}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.bg,
  },
  art: {
    width: 44,
    height: 44,
  },
  previewText: {
    flex: 1,
    gap: 2,
  },
});
