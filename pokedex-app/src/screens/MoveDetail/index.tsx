import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Skeleton from '@/components/atoms/Skeleton';
import EmptyState from '@/components/molecules/EmptyState';
import FactStrip from '@/components/molecules/FactStrip';
import InfoRow from '@/components/molecules/InfoRow';
import SectionHeader from '@/components/molecules/SectionHeader';
import CollapsingTopBar, {
  TOP_BAR_HEIGHT,
} from '@/components/organisms/CollapsingTopBar';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGridWidth } from '@/hooks/useGridWidth';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import {
  useGetMoveQuery,
  useGetMoveReferenceQuery,
} from '@/services/api/move.service';
import { useGetPokemonIndexQuery } from '@/services/api/pokemon.service';
import { colors, neutralPalette, typePalette } from '@/theme/colors';
import type { PokemonTypeName } from '@/types';
import { cleanFlavorText, formatCount, formatName } from '@/utils/format';
import { pickEntry, pickName } from '@/utils/i18n';
import {
  damageClassLabel,
  generationRoman,
  moveCategoryLabel,
} from '@/utils/labels';
import { isPokemonTypeName } from '@/utils/pokemon';
import { fillEffectChance } from '@/utils/search';
import PokemonGridCell from '../shared/PokemonGridCell';
import ContestCard from './ContestCard';
import MachineChip from './MachineChip';

const PREVIEW_LEARNERS = 4;
const MAX_MACHINES = 4;

export default function MoveDetail({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.MOVE_DETAIL>) {
  const { name } = route.params;
  const lang = useDataLanguage();
  const insets = useSafeAreaInsets();
  const cardWidth = useGridWidth(2);
  const scrollY = useSharedValue(0);
  const seenIds = useState(() => new Set<number>())[0];

  const { data: move, isError, refetch } = useGetMoveQuery(name);
  const target = useGetMoveReferenceQuery(
    move
      ? { resource: 'move-target', name: move.target.name }
      : { resource: 'move-target', name: 'selected-pokemon' },
    { skip: !move },
  );
  const { data: index } = useGetPokemonIndexQuery();
  const { refreshing, refresh } = useRefresh([refetch]);

  const type =
    move && isPokemonTypeName(move.type.name) ? move.type.name : null;
  const palette = type ? typePalette(type) : neutralPalette;
  useStatusBarStyle(
    palette.text === colors.white ? 'light-content' : 'dark-content',
  );

  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  const openPokemon = useCallback(
    (id: number, pokemonName: string, types?: PokemonTypeName[]) =>
      navigation.push(ROUTES.POKEMON_DETAIL, { id, name: pokemonName, types }),
    [navigation],
  );

  const title = pickName(move?.names, lang, name);
  const effect = pickEntry(move?.effect_entries, lang);
  const flavor = pickEntry(move?.flavor_text_entries, lang)?.flavor_text;
  const machines = move ? move.machines.slice(-MAX_MACHINES).reverse() : [];
  const learners = move
    ? move.learnedBy.slice(0, PREVIEW_LEARNERS).map(id => ({
        id,
        name: index?.find(p => p.id === id)?.name ?? String(id),
      }))
    : [];

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.brand]}
            tintColor={palette.text}
            progressViewOffset={insets.top + TOP_BAR_HEIGHT}
          />
        }
      >
        <View
          style={[styles.hero, { paddingTop: insets.top + TOP_BAR_HEIGHT + 8 }]}
        >
          <View
            style={[styles.overscroll, { backgroundColor: palette.background }]}
          />
          <View style={[styles.ring, { borderColor: palette.ring }]} />
          <AppText
            variant="heroTitle"
            color={palette.text}
            accessibilityRole="header"
          >
            {title}
          </AppText>
          <View style={styles.pills}>
            {move ? (
              [
                formatName(move.type.name),
                damageClassLabel(move.damage_class.name),
                `Generasi ${generationRoman(move.generation.name)}`,
              ].map(label => (
                <View
                  key={label}
                  style={[styles.pill, { backgroundColor: palette.pill }]}
                >
                  <AppText variant="label" color={palette.text}>
                    {label}
                  </AppText>
                </View>
              ))
            ) : (
              <Skeleton
                width={120}
                height={26}
                radius={13}
                color={palette.pill}
              />
            )}
          </View>
        </View>

        <View style={styles.body}>
          {isError && !move ? (
            <EmptyState
              icon={<WifiOff size={30} color={colors.ink3} />}
              title="Move gagal dimuat"
              body="Move ini belum pernah dibuka saat online. Sambungkan internet lalu coba lagi."
              actionLabel="Coba lagi"
              actionVariant="primary"
              onAction={refresh}
              style={styles.error}
            />
          ) : !move ? (
            <View style={styles.loading}>
              <Skeleton height={68} radius={16} />
              <Skeleton />
              <Skeleton width="70%" />
            </View>
          ) : (
            <>
              <FactStrip
                items={[
                  {
                    value: move.power ? String(move.power) : '—',
                    label: 'Power',
                  },
                  {
                    value: move.accuracy ? `${move.accuracy}%` : '—',
                    label: 'Akurasi',
                  },
                  { value: move.pp ? String(move.pp) : '—', label: 'PP' },
                  { value: String(move.priority), label: 'Prioritas' },
                ]}
              />
              {flavor && (
                <AppText color={colors.ink2} style={styles.flavor}>
                  {cleanFlavorText(flavor)}
                </AppText>
              )}

              <View>
                <SectionHeader title="Detail" variant="subheading" />
                {effect && (
                  <InfoRow
                    label="Efek"
                    value={fillEffectChance(
                      cleanFlavorText(effect.short_effect ?? effect.effect),
                      move.effect_chance,
                    )}
                  />
                )}
                {move.meta && move.meta.ailment.name !== 'none' && (
                  <InfoRow
                    label="Status"
                    value={`${formatName(move.meta.ailment.name)}${
                      move.meta.ailment_chance
                        ? ` · ${move.meta.ailment_chance}%`
                        : ''
                    }`}
                  />
                )}
                <InfoRow
                  label="Target"
                  value={pickName(target.data?.names, lang, move.target.name)}
                />
                {move.meta && (
                  <InfoRow
                    label="Kategori efek"
                    value={moveCategoryLabel(move.meta.category.name)}
                  />
                )}
                {machines.length > 0 && (
                  <InfoRow
                    label="TM / HM"
                    divider={false}
                    value={
                      <View style={styles.machines}>
                        {machines.map(m => (
                          <MachineChip
                            key={m.machineId}
                            machineId={m.machineId}
                            versionGroup={m.versionGroup}
                          />
                        ))}
                      </View>
                    }
                  />
                )}
              </View>

              {move.contest_type && (
                <View style={styles.section}>
                  <SectionHeader title="Kontes" variant="subheading" />
                  <ContestCard
                    contestType={move.contest_type.name}
                    contestEffectId={move.contestEffectId}
                    superContestEffectId={move.superContestEffectId}
                  />
                </View>
              )}

              {move.learnedBy.length > 0 && (
                <View style={styles.section}>
                  <SectionHeader
                    title="Dipelajari oleh"
                    meta={`${formatCount(move.learnedBy.length)} Pokémon`}
                    variant="subheading"
                  />
                  <View style={styles.grid}>
                    {learners.map((p, i) => (
                      <PokemonGridCell
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        index={i}
                        width={cardWidth}
                        seenIds={seenIds}
                        onPress={openPokemon}
                      />
                    ))}
                  </View>
                  {move.learnedBy.length > PREVIEW_LEARNERS && (
                    <Button
                      label={`Lihat ${formatCount(
                        move.learnedBy.length,
                      )} Pokémon`}
                      variant="secondary"
                      onPress={() =>
                        navigation.push(ROUTES.POKEMON_COLLECTION, {
                          source: 'move',
                          name,
                          title,
                        })
                      }
                    />
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </Animated.ScrollView>
      <CollapsingTopBar
        title={title}
        palette={palette}
        scrollY={scrollY}
        revealAt={90}
        onBack={navigation.goBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    backgroundColor: colors.surface,
  },
  hero: {
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 56,
    overflow: 'hidden',
  },
  overscroll: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1000,
    bottom: 0,
  },
  ring: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 36,
  },
  pills: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 13,
    justifyContent: 'center',
  },
  body: {
    marginTop: -28,
    minHeight: 480,
    gap: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
  },
  flavor: {
    lineHeight: 23,
  },
  section: {
    gap: 12,
  },
  machines: {
    gap: 6,
    alignItems: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  loading: {
    gap: 12,
  },
  error: {
    paddingTop: 24,
  },
});
