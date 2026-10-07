import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme/colors';

export interface PokeballIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Ikon pokéball garis (24×24), sama dengan komponen `Icon/Pokeball` di desain. */
export default function PokeballIcon({
  size = 24,
  color = colors.ink,
  strokeWidth = 2,
}: PokeballIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M2 12h7 M15 12h7 M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
