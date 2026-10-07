import { StyleSheet, Text } from 'react-native';
import Button from '@/components/atoms/Button';
import PlaceholderLayout from '@/components/templates/PlaceholderLayout';
import { ROUTES } from '@/navigation/paths';
import type { MainTabScreenProps } from '@/navigation/types';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { colors } from '@/theme/colors';

export default function PokemonList({
  navigation,
}: MainTabScreenProps<typeof ROUTES.POKEDEX>) {
  const { data, isLoading, isError } = useGetPokemonIndexQuery();

  const status = isLoading
    ? 'Memuat index…'
    : isError
    ? 'Gagal memuat index Pokémon.'
    : `${data?.length ?? 0} Pokémon di index.`;

  return (
    <PlaceholderLayout
      title="Pokédex"
      description="Header merah, cari, urutkan, chip filter tipe, grid 2 kolom + infinite scroll."
    >
      <Text style={styles.status}>{status}</Text>
      <Button
        label="Buka Charmander"
        variant="secondary"
        onPress={() =>
          navigation.navigate(ROUTES.POKEMON_DETAIL, {
            id: 4,
            name: 'charmander',
            types: ['fire'],
          })
        }
      />
    </PlaceholderLayout>
  );
}

const styles = StyleSheet.create({
  status: {
    fontSize: 14,
    color: colors.ink3,
  },
});
