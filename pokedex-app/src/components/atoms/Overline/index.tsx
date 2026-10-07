import { StyleSheet, type TextStyle } from 'react-native';
import AppText from '@/components/atoms/AppText';
import { colors } from '@/theme/colors';

export interface OverlineProps {
  children: string;
  style?: TextStyle;
}

/** Label kecil kapital di atas grup (mis. "DATA UTAMA"). */
export default function Overline({ children, style }: OverlineProps) {
  return (
    <AppText variant="label" color={colors.ink3} style={[styles.base, style]}>
      {children.toUpperCase()}
    </AppText>
  );
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0.8,
  },
});
