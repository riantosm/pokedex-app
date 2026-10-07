import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import BottomSheet from '@/components/organisms/BottomSheet';
import { colors } from '@/theme/colors';

export interface ClearCacheSheetProps {
  visible: boolean;
  size: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearCacheSheet({
  visible,
  size,
  onClose,
  onConfirm,
}: ClearCacheSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Hapus cache?">
      <AppText color={colors.ink2}>
        Data Pokémon yang tersimpan ({size}) akan dihapus dan diunduh ulang saat
        dibuka. Favorit tidak ikut terhapus.
      </AppText>
      <View style={styles.actions}>
        <Button
          label="Batal"
          variant="secondary"
          style={styles.action}
          onPress={onClose}
        />
        <Button
          label="Hapus"
          style={[styles.action, styles.danger]}
          onPress={onConfirm}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  action: {
    flex: 1,
  },
  danger: {
    backgroundColor: colors.danger,
  },
});
