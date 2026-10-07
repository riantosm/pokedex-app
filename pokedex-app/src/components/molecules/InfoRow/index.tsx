import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export interface InfoRowProps {
  label: string;
  /** Teks biasa, atau node bebas (mis. bar gender). */
  value: ReactNode;
  divider?: boolean;
}

/** Baris label–nilai (desain: Data lainnya di tab About). */
export default function InfoRow({
  label,
  value,
  divider = true,
}: InfoRowProps) {
  return (
    <View style={[styles.row, divider && styles.divider]}>
      <AppText variant="callout" color={colors.ink3} style={styles.label}>
        {label}
      </AppText>
      <View style={styles.value}>
        {typeof value === 'string' || typeof value === 'number' ? (
          <AppText variant="callout" style={styles.valueText}>
            {value}
          </AppText>
        ) : (
          value
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  label: {
    width: 110,
  },
  value: {
    flex: 1,
  },
  valueText: {
    fontFamily: fonts.medium,
  },
});
