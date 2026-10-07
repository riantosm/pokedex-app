import { memo } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import BottomSheet from '@/components/organisms/BottomSheet';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetMoveQuery } from '@/services/api/move.service';
import {
  useGetCharacteristicQuery,
  useGetNatureQuery,
  useGetStatQuery,
} from '@/services/api/nature.service';
import { colors, typeColors } from '@/theme/colors';
import { pickEntry, pickName } from '@/utils/i18n';
import { idFromUrl, isPokemonTypeName } from '@/utils/pokemon';

const MAX_MOVES = 5;

export interface StatSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Stat terakhir yang dipilih — tetap ada selama animasi tutup. */
  stat: { name: string; label: string; value: number } | null;
  pokemonName: string;
  onMovePress: (name: string) => void;
  onNaturesPress: () => void;
}

function NatureChip({ name, onPress }: { name: string; onPress: () => void }) {
  const lang = useDataLanguage();
  const { data } = useGetNatureQuery(name);
  return (
    <PressableScale
      accessibilityRole="link"
      onPress={onPress}
      style={styles.chip}
    >
      <AppText variant="label">{pickName(data?.names, lang, name)}</AppText>
    </PressableScale>
  );
}

const MoveChange = memo(function MoveChangeInner({
  name,
  change,
  onPress,
}: {
  name: string;
  change: number;
  onPress: (name: string) => void;
}) {
  const lang = useDataLanguage();
  const { data } = useGetMoveQuery(name);
  const type =
    data && isPokemonTypeName(data.type.name) ? data.type.name : null;
  const up = change > 0;
  const color = up ? colors.success : colors.danger;
  return (
    <PressableScale
      scaleTo={0.99}
      accessibilityRole="link"
      onPress={() => onPress(name)}
      style={styles.move}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: type ? typeColors[type] : colors.line },
        ]}
      />
      <AppText variant="bodyMedium" style={styles.flex} numberOfLines={1}>
        {pickName(data?.names, lang, name)}
      </AppText>
      <View style={[styles.change, { backgroundColor: `${color}1A` }]}>
        <AppText variant="label" color={color}>
          {`${up ? '+' : ''}${change} tingkat`}
        </AppText>
      </View>
    </PressableScale>
  );
});

function CharacteristicRow({ id, last }: { id: number; last: boolean }) {
  const lang = useDataLanguage();
  const { data } = useGetCharacteristicQuery(id);
  return (
    <View style={[styles.char, !last && styles.divider]}>
      {data ? (
        <>
          <AppText variant="captionStrong" style={styles.flex}>
            {pickEntry(data.descriptions, lang)?.description ?? '—'}
          </AppText>
          <AppText variant="micro" color={colors.ink3}>
            {`IV ${data.possible_values.join(', ')}`}
          </AppText>
        </>
      ) : (
        <Skeleton width="60%" height={14} />
      )}
    </View>
  );
}

/** Sheet stat: nature yang menaikkan/menurunkan, move yang mengubahnya, dan karakteristik. */
export default function StatSheet({
  visible,
  onClose,
  stat,
  pokemonName,
  onMovePress,
  onNaturesPress,
}: StatSheetProps) {
  const lang = useDataLanguage();
  const { height } = useWindowDimensions();
  const { data } = useGetStatQuery(stat?.name ?? '', { skip: !stat });

  const raising = data
    ? [...data.affecting_moves.increase]
        .sort((a, b) => b.change - a.change)
        .slice(0, MAX_MOVES)
    : [];
  const natures = data?.affecting_natures;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.head}>
        <AppText variant="heading" accessibilityRole="header">
          {stat ? pickName(data?.names, lang, stat.label) : ''}
        </AppText>
        {stat && (
          <AppText variant="caption" color={colors.ink3}>
            {`Base stat ${pokemonName}: ${stat.value} dari 255`}
          </AppText>
        )}
      </View>

      <ScrollView
        style={{ maxHeight: height * 0.6 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {!data ? (
          <View style={styles.section}>
            <Skeleton />
            <Skeleton width="70%" />
            <Skeleton height={120} radius={14} />
          </View>
        ) : (
          <>
            {natures &&
              (natures.increase.length > 0 || natures.decrease.length > 0) && (
                <View style={styles.section}>
                  <AppText variant="calloutStrong">Nature</AppText>
                  {(
                    [
                      ['Naik', natures.increase, true],
                      ['Turun', natures.decrease, false],
                    ] as const
                  ).map(([label, list, up]) => (
                    <View key={label} style={styles.natureRow}>
                      <View style={styles.natureLabel}>
                        {up ? (
                          <ArrowUp size={14} color={colors.success} />
                        ) : (
                          <ArrowDown size={14} color={colors.danger} />
                        )}
                        <AppText
                          variant="captionStrong"
                          color={up ? colors.success : colors.danger}
                        >
                          {label}
                        </AppText>
                      </View>
                      <View style={styles.chips}>
                        {list.map(n => (
                          <NatureChip
                            key={n.name}
                            name={n.name}
                            onPress={onNaturesPress}
                          />
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}

            {raising.length > 0 && (
              <View style={styles.list}>
                <AppText variant="calloutStrong">Move yang menaikkan</AppText>
                {raising.map(m => (
                  <MoveChange
                    key={m.move.name}
                    name={m.move.name}
                    change={m.change}
                    onPress={onMovePress}
                  />
                ))}
              </View>
            )}

            {data.characteristics.length > 0 && (
              <View style={styles.section}>
                <AppText variant="calloutStrong">Karakteristik</AppText>
                <AppText variant="caption" color={colors.ink3}>
                  {`Teks di layar ringkasan game kalau ${pickName(
                    data.names,
                    lang,
                    stat?.label ?? '',
                  )} adalah IV tertinggi — ditentukan oleh nilai IV-nya.`}
                </AppText>
                <View style={styles.charList}>
                  {data.characteristics.map((c, i) => (
                    <CharacteristicRow
                      key={c.url}
                      id={idFromUrl(c.url)}
                      last={i === data.characteristics.length - 1}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  head: {
    gap: 2,
    paddingTop: 6,
  },
  body: {
    gap: 20,
    paddingBottom: 4,
  },
  section: {
    gap: 10,
  },
  list: {
    gap: 4,
  },
  natureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  natureLabel: {
    width: 72,
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chips: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: colors.bg,
  },
  move: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  flex: {
    flex: 1,
  },
  change: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  charList: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 14,
    backgroundColor: colors.bg,
  },
  char: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
});
