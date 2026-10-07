import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/atoms/AppText';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import TypeBadge from '@/components/atoms/TypeBadge';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetMoveQuery } from '@/services/api/move.service';
import { colors } from '@/theme/colors';
import { pickName } from '@/utils/i18n';
import { damageClassLabel } from '@/utils/labels';
import { isPokemonTypeName } from '@/utils/pokemon';

export const MOVE_COLUMNS = { power: 36, accuracy: 44, pp: 28 } as const;

export interface MoveRowProps {
  name: string;
  /** Level (tab Moves) — kolom pertama, opsional. */
  level?: number;
  first: boolean;
  last: boolean;
  /** Tanpa padding & latar kartu — dipakai di dalam tab Detail Pokémon. */
  flush?: boolean;
  onPress: (name: string) => void;
}

/** Baris move: nama · tipe · kategori · power/akurasi/PP. Detail dimuat lazy per baris. */
function MoveRow({
  name,
  level,
  first,
  last,
  flush = false,
  onPress,
}: MoveRowProps) {
  const lang = useDataLanguage();
  const { data, isError } = useGetMoveQuery(name);
  const type =
    data && isPokemonTypeName(data.type.name) ? data.type.name : null;

  return (
    <PressableScale
      scaleTo={0.99}
      accessibilityRole="button"
      onPress={() => onPress(name)}
      style={[
        styles.row,
        flush && styles.flush,
        first && styles.first,
        last && styles.last,
        !last && styles.divider,
      ]}
    >
      {level !== undefined && (
        <View style={styles.level}>
          <AppText variant="subheading" style={styles.levelText}>
            {level}
          </AppText>
        </View>
      )}
      <View style={styles.info}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {pickName(data?.names, lang, name)}
        </AppText>
        <View style={styles.meta}>
          {type ? (
            <TypeBadge type={type} style={styles.badge} />
          ) : !isError ? (
            <Skeleton width={46} height={16} radius={8} />
          ) : null}
          {data && (
            <AppText variant="caption" color={colors.ink3}>
              {damageClassLabel(data.damage_class.name)}
            </AppText>
          )}
        </View>
      </View>
      <Value width={MOVE_COLUMNS.power} text={data ? data.power ?? '—' : ''} />
      <Value
        width={MOVE_COLUMNS.accuracy}
        text={data ? (data.accuracy ? `${data.accuracy}%` : '—') : ''}
      />
      {level === undefined && (
        <Value width={MOVE_COLUMNS.pp} text={data ? data.pp ?? '—' : ''} />
      )}
    </PressableScale>
  );
}

function Value({ width, text }: { width: number; text: string | number }) {
  return (
    <AppText
      variant="captionStrong"
      align="right"
      color={text === '—' ? colors.ink3 : colors.ink}
      style={{ width }}
    >
      {String(text)}
    </AppText>
  );
}

export default memo(MoveRow);

const styles = StyleSheet.create({
  row: {
    minHeight: 60,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
  },
  flush: {
    paddingHorizontal: 0,
  },
  first: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  last: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  level: {
    width: 40,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  levelText: {
    fontSize: 14,
    lineHeight: 18,
  },
  info: {
    flex: 1,
    gap: 4,
    paddingVertical: 10,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    height: 18,
    paddingHorizontal: 7,
  },
});
