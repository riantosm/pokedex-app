import PlaceholderLayout from '@/components/templates/PlaceholderLayout';
import { useAppSelector } from '@/store/hooks';
import { selectFavorites } from '@/store/slices/favoritesSlice';

export default function FavoriteList() {
  const favorites = useAppSelector(selectFavorites);

  return (
    <PlaceholderLayout
      title="Favorit"
      description={`Grid Pokémon tersimpan di perangkat (${favorites.length} saat ini) + state kosong.`}
    />
  );
}
