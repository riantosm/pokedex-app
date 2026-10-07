import {
  Fish,
  Footprints,
  Gift,
  Hammer,
  MapPin,
  Star,
  TreeDeciduous,
  Waves,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { encounterMethodIcon } from '@/utils/labels';

const ICONS = {
  footprints: Footprints,
  fish: Fish,
  waves: Waves,
  gift: Gift,
  hammer: Hammer,
  tree: TreeDeciduous,
  star: Star,
  'map-pin': MapPin,
} as const;

export interface EncounterMethodIconProps {
  method: string;
  size?: number;
  color?: string;
}

/** Ikon metode encounter (jalan, pancing, selancar, hadiah, batu, pohon, tetap, lainnya). */
export default function EncounterMethodIcon({
  method,
  size = 18,
  color = colors.ink2,
}: EncounterMethodIconProps) {
  const Icon =
    ICONS[encounterMethodIcon(method) as keyof typeof ICONS] ?? MapPin;
  return <Icon size={size} color={color} />;
}
