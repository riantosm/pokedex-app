import Button from '@/components/atoms/Button';
import PlaceholderLayout from '@/components/templates/PlaceholderLayout';
import { ROUTES } from '@/navigation/paths';
import type { MainTabScreenProps } from '@/navigation/types';

export default function TypeList({
  navigation,
}: MainTabScreenProps<typeof ROUTES.TYPES>) {
  return (
    <PlaceholderLayout
      title="Tipe"
      description="Grid 18 tipe dengan warna, jumlah Pokémon, dan artwork perwakilan."
    >
      <Button
        label="Buka tipe Fire"
        variant="secondary"
        onPress={() =>
          navigation.navigate(ROUTES.TYPE_DETAIL, { name: 'fire' })
        }
      />
    </PlaceholderLayout>
  );
}
