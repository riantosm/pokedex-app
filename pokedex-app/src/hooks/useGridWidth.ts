import { useWindowDimensions } from 'react-native';
import { GRID_GAP, SCREEN_PADDING } from '@/components/organisms/ScreenList';

/** Lebar satu sel grid untuk `columns` kolom dengan padding layar & gap standar. */
export function useGridWidth(columns = 2): number {
  const { width } = useWindowDimensions();
  return (width - SCREEN_PADDING * 2 - GRID_GAP * (columns - 1)) / columns;
}
