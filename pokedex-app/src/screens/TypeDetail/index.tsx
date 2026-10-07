import PlaceholderLayout from '@/components/templates/PlaceholderLayout';
import type { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import { formatName } from '@/utils/format';

export default function TypeDetail({
  route,
}: RootStackScreenProps<typeof ROUTES.TYPE_DETAIL>) {
  return (
    <PlaceholderLayout
      title={formatName(route.params.name)}
      description="Efektivitas saat menyerang & bertahan, lalu daftar Pokémon bertipe ini."
    />
  );
}
