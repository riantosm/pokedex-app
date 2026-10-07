import { StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';

export interface LinkChipProps {
  label: string;
  onPress: () => void;
  dotColor?: string;
}

/** Pil kecil yang membuka halaman lain (desain: link egg group / habitat / growth rate di About). */
export default function LinkChip({ label, onPress, dotColor }: LinkChipProps) {
  return (
    <PressableScale
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.chip}
    >
      {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      <AppText variant="captionStrong">{label}</AppText>
      <ChevronRight size={14} color={colors.ink3} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: colors.bg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
