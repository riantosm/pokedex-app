import { StyleSheet, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import IconButton from '@/components/atoms/IconButton';
import { colors } from '@/theme/colors';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Tanpa `onBack` = layar tab (judul besar, tanpa tombol kembali). */
  onBack?: () => void;
}

/** Header layar stack/tab di atas latar `bg` (desain: Moves, Item, Region, Jelajah, …). */
export default function ScreenHeader({
  title,
  subtitle,
  onBack,
}: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      {onBack && (
        <IconButton
          variant="surface"
          accessibilityLabel="Kembali"
          onPress={onBack}
          icon={<ArrowLeft size={20} color={colors.ink} />}
        />
      )}
      <View style={styles.text}>
        <AppText
          variant={onBack ? 'heading' : 'screenTitle'}
          style={onBack && styles.stackTitle}
          accessibilityRole="header"
          numberOfLines={1}
        >
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" color={colors.ink3} numberOfLines={1}>
            {subtitle}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
  },
  stackTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
});
