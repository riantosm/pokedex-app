import { StyleSheet, Text, type TextStyle, type ViewStyle } from 'react-native';
import PressableScale, {
  type PressableScaleProps,
} from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends PressableScaleProps {
  label: string;
  variant?: ButtonVariant;
}

const containerStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.brand },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
};

const labelStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: colors.white },
  secondary: { color: colors.ink },
};

/** Desain: `Button/Primary` & `Button/Secondary`. */
export default function Button({
  label,
  variant = 'primary',
  style,
  ...rest
}: ButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      style={[styles.base, containerStyles[variant], style]}
      {...rest}
    >
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
