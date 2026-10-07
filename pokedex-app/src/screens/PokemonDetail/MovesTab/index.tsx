import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown, Gamepad2 } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import PressableScale from '@/components/atoms/PressableScale';
import ListRow from '@/components/molecules/ListRow';
import Segmented from '@/components/molecules/Segmented';
import BottomSheet from '@/components/organisms/BottomSheet';
import { useGetVersionGroupQuery } from '@/services/api/game.service';
import { colors } from '@/theme/colors';
import type { PokemonMoveSet } from '@/types';
import { generationRoman, versionGroupLabel } from '@/utils/labels';
import MoveRow, { MOVE_COLUMNS } from '../../MoveList/MoveRow';

const PAGE = 20;
const METHODS = [
  { key: 'level-up', label: 'Level' },
  { key: 'machine', label: 'TM' },
  { key: 'egg', label: 'Telur' },
  { key: 'tutor', label: 'Tutor' },
] as const;
type Method = (typeof METHODS)[number]['key'];

export interface MovesTabProps {
  moves: PokemonMoveSet;
  onMovePress: (name: string) => void;
}

function GenerationMeta({ name }: { name: string }) {
  const { data } = useGetVersionGroupQuery(name);
  return (
    <AppText variant="caption" color={colors.ink3}>
      {data ? `Gen ${generationRoman(data.generation.name)}` : ''}
    </AppText>
  );
}

/** Move per grup versi & metode belajar. Grup versi terbaru dipilih default. */
export default function MovesTab({ moves, onMovePress }: MovesTabProps) {
  const { height } = useWindowDimensions();
  const [picked, setPicked] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [method, setMethod] = useState<Method>('level-up');
  const [limit, setLimit] = useState(PAGE);
  // Grup versi tanpa move dengan metode yang ditampilkan (mis. Champions) disembunyikan.
  const groups = useMemo(
    () =>
      moves.versionGroups.filter(vg =>
        moves.byVersionGroup[vg.name]?.some(e =>
          METHODS.some(m => m.key === e.method),
        ),
      ),
    [moves],
  );
  const group =
    picked && groups.some(g => g.name === picked)
      ? picked
      : groups[0]?.name ?? null;

  const byMethod = useMemo(() => {
    const out: Record<Method, { move: string; level: number }[]> = {
      'level-up': [],
      machine: [],
      egg: [],
      tutor: [],
    };
    const seen = new Set<string>();
    for (const e of group ? moves.byVersionGroup[group] : []) {
      const key = `${e.method}/${e.move}/${e.level}`;
      if (e.method in out && !seen.has(key)) {
        seen.add(key);
        out[e.method as Method].push({ move: e.move, level: e.level });
      }
    }
    out['level-up'].sort((a, b) => a.level - b.level);
    for (const m of ['machine', 'egg', 'tutor'] as const) {
      out[m].sort((a, b) => a.move.localeCompare(b.move));
    }
    return out;
  }, [group, moves]);

  const options = METHODS.map(m => ({
    ...m,
    count: byMethod[m.key].length,
    disabled: byMethod[m.key].length === 0,
  }));
  const active =
    byMethod[method].length > 0
      ? method
      : options.find(o => !o.disabled)?.key ?? method;
  const list = byMethod[active];
  const visible = list.slice(0, limit);
  const withLevel = active === 'level-up';

  if (!group) {
    return (
      <AppText color={colors.ink3}>
        PokéAPI tidak mencatat move untuk Pokémon ini.
      </AppText>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <PressableScale
          scaleTo={0.99}
          accessibilityRole="button"
          accessibilityLabel={`Game: ${versionGroupLabel(group)}. Ganti game`}
          onPress={() => setPickerOpen(true)}
          style={styles.picker}
        >
          <Gamepad2 size={18} color={colors.ink2} />
          <AppText
            variant="calloutStrong"
            style={styles.flex}
            numberOfLines={1}
          >
            {versionGroupLabel(group)}
          </AppText>
          <GenerationMeta name={group} />
          <ChevronDown size={18} color={colors.ink3} />
        </PressableScale>
        <Segmented
          options={options}
          value={active}
          onChange={k => {
            setMethod(k);
            setLimit(PAGE);
          }}
        />
      </View>

      <View>
        <View style={styles.head}>
          {withLevel && (
            <AppText variant="micro" color={colors.ink3} style={styles.lv}>
              LV
            </AppText>
          )}
          <AppText variant="micro" color={colors.ink3} style={styles.flex}>
            MOVE
          </AppText>
          <AppText
            variant="micro"
            color={colors.ink3}
            align="right"
            style={{ width: MOVE_COLUMNS.power }}
          >
            POW
          </AppText>
          <AppText
            variant="micro"
            color={colors.ink3}
            align="right"
            style={{ width: MOVE_COLUMNS.accuracy }}
          >
            ACC
          </AppText>
          {!withLevel && (
            <AppText
              variant="micro"
              color={colors.ink3}
              align="right"
              style={{ width: MOVE_COLUMNS.pp }}
            >
              PP
            </AppText>
          )}
        </View>
        {visible.map((m, i) => (
          <MoveRow
            key={`${active}-${m.move}-${m.level}`}
            name={m.move}
            level={withLevel ? m.level : undefined}
            first={false}
            last={i === visible.length - 1}
            flush
            onPress={onMovePress}
          />
        ))}
      </View>
      {list.length > visible.length && (
        <Button
          label={`Tampilkan ${Math.min(
            PAGE,
            list.length - visible.length,
          )} move lagi · ${list.length - visible.length} tersisa`}
          variant="secondary"
          onPress={() => setLimit(l => l + PAGE)}
        />
      )}

      <BottomSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Pilih game"
      >
        <ScrollView style={{ maxHeight: height * 0.6 }}>
          {groups.map((vg, i) => (
            <ListRow
              key={vg.name}
              title={versionGroupLabel(vg.name)}
              subtitle={`${
                moves.byVersionGroup[vg.name]?.length ?? 0
              } entri move`}
              minHeight={52}
              divider={i < groups.length - 1}
              trailing={
                vg.name === group ? (
                  <AppText variant="captionStrong" color={colors.brand}>
                    Dipilih
                  </AppText>
                ) : (
                  <GenerationMeta name={vg.name} />
                )
              }
              onPress={() => {
                setPicked(vg.name);
                setLimit(PAGE);
                setPickerOpen(false);
              }}
            />
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
  },
  controls: {
    gap: 12,
  },
  picker: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  head: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  lv: {
    width: 40,
  },
});
