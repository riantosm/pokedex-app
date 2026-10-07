import { forwardRef, type ComponentRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { CircleX, Search } from 'lucide-react-native';
import PressableScale from '@/components/atoms/PressableScale';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export interface SearchFieldProps extends Omit<TextInputProps, 'style'> {
  onClear?: () => void;
  style?: ViewStyle;
}

/** Desain: `Field/Search`. Tombol hapus muncul kalau ada teks. */
const SearchField = forwardRef<
  ComponentRef<typeof TextInput>,
  SearchFieldProps
>(function SearchFieldImpl({ value, onClear, style, ...rest }, ref) {
  return (
    <View style={[styles.base, style]}>
      <Search size={18} color={colors.ink3} />
      <TextInput
        ref={ref}
        value={value}
        style={styles.input}
        placeholderTextColor={colors.ink3}
        selectionColor={colors.brand}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        {...rest}
      />
      {!!value && onClear && (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Hapus pencarian"
          hitSlop={10}
          onPress={onClear}
        >
          <CircleX size={18} color={colors.ink3} />
        </PressableScale>
      )}
    </View>
  );
});

export default SearchField;

const styles = StyleSheet.create({
  base: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
  },
  input: {
    ...typography.body,
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    color: colors.ink,
  },
});
