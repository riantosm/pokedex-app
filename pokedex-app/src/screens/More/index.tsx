import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  Code,
  Database,
  DatabaseZap,
  HardDrive,
  Info,
  Languages,
  Trash2,
} from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import PressableScale from '@/components/atoms/PressableScale';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { pokeApi } from '@/services/api/pokeApi';
import { pokemonApi } from '@/services/api/pokemon.service';
import { useGetMetaQuery } from '@/services/api/reference.service';
import { persistor } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { setDataLanguage } from '@/store/slices/settingsSlice';
import { colors } from '@/theme/colors';
import { APP_VERSION, POKEAPI_URL, SOURCE_URL } from '@/utils/appInfo';
import { formatBytes, formatDate } from '@/utils/format';
import { DATA_LANGUAGES } from '@/utils/i18n';
import { listItemEntering } from '@/utils/motion';
import ClearCacheSheet from './ClearCacheSheet';
import LanguageSheet from './LanguageSheet';

/** Key redux-persist (`persist:<key>`) tempat cache & favorit disimpan. */
const PERSIST_KEY = 'persist:root';

export default function More() {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const dispatch = useAppDispatch();
  const [bytes, setBytes] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const dataLanguage = useDataLanguage();
  const meta = useGetMetaQuery();

  const measure = useCallback(async () => {
    await persistor.flush();
    const raw = await AsyncStorage.getItem(PERSIST_KEY);
    setBytes(raw ? raw.length : 0);
  }, []);
  const { refreshing, refresh } = useRefresh([measure, meta.refetch]);

  useFocusEffect(
    useCallback(() => {
      measure();
    }, [measure]),
  );

  useEffect(() => {
    if (!cleared) {
      return;
    }
    const timer = setTimeout(() => setCleared(false), 3000);
    return () => clearTimeout(timer);
  }, [cleared]);

  const clearCache = async () => {
    setConfirmOpen(false);
    dispatch(pokeApi.util.resetApiState());
    // Index Pokédex dipakai semua layar — muat ulang segera supaya Home tidak kosong.
    const request = dispatch(pokemonApi.endpoints.getPokemonIndex.initiate());
    request.unsubscribe();
    await measure();
    setCleared(true);
  };

  const size = bytes === null ? '…' : formatBytes(bytes);
  const languageName = DATA_LANGUAGES.find(
    l => l.code === dataLanguage,
  )?.native;
  // `deploy_date` = detik Unix rilis data PokéAPI yang sedang dilayani.
  const dataVersion = meta.data
    ? formatDate(Number(meta.data.deploy_date) * 1000)
    : meta.isError
    ? '—'
    : '…';

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: bottomInset },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.brand]}
            tintColor={colors.brand}
            progressViewOffset={insets.top}
          />
        }
      >
        <AppText variant="screenTitle" accessibilityRole="header">
          Lainnya
        </AppText>

        <Group
          title="Data"
          index={0}
          note="Bahasa data mengatur nama & deskripsi Pokémon, move, dan item dari PokéAPI. Tampilan app tetap bahasa Indonesia."
        >
          <Item
            icon={<Languages size={20} color={colors.ink2} />}
            label="Bahasa data"
            value={languageName}
            trailing={<ChevronRight size={18} color={colors.ink3} />}
            onPress={() => setLanguageOpen(true)}
            accessibilityHint="Pilih bahasa nama dan deskripsi dari PokéAPI"
          />
          <Item
            icon={<Database size={20} color={colors.ink2} />}
            label="Sumber data"
            value="PokéAPI"
            trailing={<ArrowUpRight size={18} color={colors.ink3} />}
            onPress={() => Linking.openURL(POKEAPI_URL)}
            accessibilityHint="Buka situs PokéAPI"
          />
          <Item
            icon={<HardDrive size={20} color={colors.ink2} />}
            label="Data tersimpan"
            value={size}
          />
          <Item
            icon={
              cleared ? (
                <CircleCheck size={20} color={colors.success} />
              ) : (
                <Trash2 size={20} color={colors.danger} />
              )
            }
            label={cleared ? 'Cache dihapus' : 'Hapus cache'}
            labelColor={cleared ? colors.success : colors.danger}
            onPress={cleared ? undefined : () => setConfirmOpen(true)}
            last
          />
        </Group>

        <Group title="Tentang" index={1}>
          <Item
            icon={<Info size={20} color={colors.ink2} />}
            label="Versi aplikasi"
            value={APP_VERSION}
          />
          <Item
            icon={<DatabaseZap size={20} color={colors.ink2} />}
            label="Versi data PokéAPI"
            value={dataVersion}
          />
          <Item
            icon={<Code size={20} color={colors.ink2} />}
            label="Kode sumber"
            trailing={<ArrowUpRight size={18} color={colors.ink3} />}
            onPress={() => Linking.openURL(SOURCE_URL)}
            accessibilityHint="Buka repositori GitHub"
            last
          />
        </Group>

        <AppText variant="label" color={colors.ink3} style={styles.disclaimer}>
          Pokémon dan nama karakternya adalah merek dagang Nintendo, Creatures
          Inc., dan GAME FREAK inc. Aplikasi ini tidak berafiliasi dengan
          mereka.
        </AppText>
      </ScrollView>
      <StatusBarScrim />

      <ClearCacheSheet
        visible={confirmOpen}
        size={size}
        onClose={() => setConfirmOpen(false)}
        onConfirm={clearCache}
      />
      <LanguageSheet
        visible={languageOpen}
        value={dataLanguage}
        onChange={language => dispatch(setDataLanguage(language))}
        onClose={() => setLanguageOpen(false)}
      />
    </View>
  );
}

function Group({
  title,
  index,
  note,
  children,
}: {
  title: string;
  index: number;
  /** Penjelasan kecil di bawah daftar. */
  note?: string;
  children: ReactNode;
}) {
  return (
    <Animated.View entering={listItemEntering(index)} style={styles.group}>
      <AppText variant="label" color={colors.ink3} style={styles.overline}>
        {title.toUpperCase()}
      </AppText>
      <View style={styles.list}>{children}</View>
      {note && (
        <AppText variant="label" color={colors.ink3} style={styles.disclaimer}>
          {note}
        </AppText>
      )}
    </Animated.View>
  );
}

interface ItemProps {
  icon: ReactNode;
  label: string;
  labelColor?: string;
  value?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  accessibilityHint?: string;
  last?: boolean;
}

function Item({
  icon,
  label,
  labelColor = colors.ink,
  value,
  trailing,
  onPress,
  accessibilityHint,
  last,
}: ItemProps) {
  return (
    <PressableScale
      scaleTo={0.99}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={[styles.item, !last && styles.divider]}
    >
      {icon}
      <AppText variant="bodyMedium" color={labelColor} style={styles.itemLabel}>
        {label}
      </AppText>
      {value && (
        <AppText variant="callout" color={colors.ink3}>
          {value}
        </AppText>
      )}
      {trailing}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    gap: 24,
    paddingHorizontal: 20,
  },
  group: {
    gap: 8,
  },
  overline: {
    letterSpacing: 0.8,
  },
  list: {
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  item: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  itemLabel: {
    flex: 1,
  },
  disclaimer: {
    lineHeight: 18,
  },
});
