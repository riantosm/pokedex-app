import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowDownUp } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import IconButton from '@/components/atoms/IconButton';
import PokeballIcon from '@/components/atoms/PokeballIcon';
import SearchField from '@/components/molecules/SearchField';
import { colors } from '@/theme/colors';

export interface PokedexHeaderProps {
  query: string;
  onChangeQuery: (text: string) => void;
  onOpenSort: () => void;
  /** Tampilkan titik di tombol urutkan kalau urutan/generasi bukan default. */
  sortActive: boolean;
}

export default function PokedexHeader({
  query,
  onChangeQuery,
  onOpenSort,
  sortActive,
}: PokedexHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.brand}>
        <PokeballIcon size={28} color={colors.white} strokeWidth={2.2} />
        <AppText
          variant="screenTitle"
          color={colors.white}
          accessibilityRole="header"
        >
          Pokédex
        </AppText>
      </View>
      <View style={styles.searchRow}>
        <SearchField
          value={query}
          onChangeText={onChangeQuery}
          onClear={() => onChangeQuery('')}
          placeholder="Cari nama atau nomor"
          accessibilityLabel="Cari Pokémon berdasarkan nama atau nomor"
          style={styles.search}
        />
        <IconButton
          shape="square"
          variant="surface"
          accessibilityLabel={
            sortActive
              ? 'Urutkan dan filter, sedang aktif'
              : 'Urutkan dan filter'
          }
          onPress={onOpenSort}
          icon={
            <>
              <ArrowDownUp size={20} color={colors.brand} />
              {sortActive && <View style={styles.dot} />}
            </>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: colors.brand,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  search: {
    flex: 1,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.surface,
    backgroundColor: colors.brand,
  },
});
