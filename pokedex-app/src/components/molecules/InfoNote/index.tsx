import { StyleSheet, View } from 'react-native';
import { Info } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import { colors } from '@/theme/colors';

export interface InfoNoteProps {
  children: string;
}

/** Kotak penjelasan singkat dengan ikon info. */
export default function InfoNote({ children }: InfoNoteProps) {
  return (
    <View style={styles.root}>
      <Info size={18} color={colors.ink2} />
      <AppText variant="caption" color={colors.ink2} style={styles.text}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  text: {
    flex: 1,
    lineHeight: 19,
  },
});
