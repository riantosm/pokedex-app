import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Overline from '@/components/atoms/Overline';
import { colors } from '@/theme/colors';

export interface ListGroupProps {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
}

/** Grup baris dalam kartu putih membulat, dengan overline opsional. */
export default function ListGroup({ title, children, style }: ListGroupProps) {
  return (
    <View style={[styles.root, style]}>
      {title && <Overline>{title}</Overline>}
      <View style={styles.box}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 8,
  },
  box: {
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
});
