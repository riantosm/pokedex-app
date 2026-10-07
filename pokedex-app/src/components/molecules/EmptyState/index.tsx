import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import AppText from '@/components/atoms/AppText';
import Button, { type ButtonVariant } from '@/components/atoms/Button';
import { colors } from '@/theme/colors';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  body: string;
  actionLabel?: string;
  actionVariant?: ButtonVariant;
  onAction?: () => void;
  style?: ViewStyle;
}

/** State kosong / error: ikon dalam lingkaran, judul, penjelasan, satu aksi. */
export default function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  actionVariant = 'secondary',
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.text}>
        <AppText variant="heading" align="center">
          {title}
        </AppText>
        <AppText variant="callout" color={colors.ink2} align="center">
          {body}
        </AppText>
      </View>
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          variant={actionVariant}
          onPress={onAction}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skeleton,
  },
  text: {
    gap: 8,
    paddingTop: 20,
    paddingBottom: 24,
  },
});
