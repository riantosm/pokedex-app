import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Elemen di kiri (ikon / sprite dalam kotak). */
  lead?: ReactNode;
  /** Elemen di kanan; default chevron kalau `onPress` ada. */
  trailing?: ReactNode;
  onPress?: () => void;
  divider?: boolean;
  minHeight?: number;
}

/** Baris daftar standar: lead · judul + subjudul · trailing. */
export default function ListRow({
  title,
  subtitle,
  lead,
  trailing,
  onPress,
  divider = true,
  minHeight = 60,
}: ListRowProps) {
  return (
    <PressableScale
      scaleTo={0.99}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      onPress={onPress}
      style={[styles.row, { minHeight }, divider && styles.divider]}
    >
      {lead}
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" color={colors.ink3} numberOfLines={2}>
            {subtitle}
          </AppText>
        )}
      </View>
      {trailing ?? (onPress && <ChevronRight size={18} color={colors.ink3} />)}
    </PressableScale>
  );
}

export function RowLead({ children }: { children: ReactNode }) {
  return <View style={styles.lead}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  lead: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
