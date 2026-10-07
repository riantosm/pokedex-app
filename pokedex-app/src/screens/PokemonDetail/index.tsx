import PlaceholderLayout from '@/components/templates/PlaceholderLayout';
import type { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { formatDexNumber, formatName } from '@/utils/format';

export default function PokemonDetail({
  route,
}: RootStackScreenProps<typeof ROUTES.POKEMON_DETAIL>) {
  const { id, name } = route.params;

  return (
    <PlaceholderLayout
      title={`${formatName(name)} ${formatDexNumber(id)}`}
      description="Hero warna tipe + artwork, tab About, Stats, Evolusi, Kelemahan, favorit, prev/next."
    />
  );
}
