import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookOpen,
  Egg,
  Footprints,
  Gamepad2,
  GitBranch,
  Palette,
  Smile,
  Sparkles,
  Trees,
  TrendingUp,
  VenusAndMars,
  Zap,
} from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import ItemSprite from '@/components/atoms/ItemSprite';
import PressableScale from '@/components/atoms/PressableScale';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import ListGroup from '@/components/molecules/ListGroup';
import ListRow, { RowLead } from '@/components/molecules/ListRow';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import Overline from '@/components/atoms/Overline';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { ROUTES } from '@/navigation/paths';
import type { MainTabScreenProps } from '@/navigation/types';
import {
  useGetResourceCountQuery,
  type ResourceName,
} from '@/services/api/resource.service';
import { colors, typeColors, typePalette } from '@/theme/colors';
import { POKEMON_TYPE_NAMES } from '@/types';
import { formatCount } from '@/utils/format';
import FastImage from '@d11/react-native-fast-image';
import { artworkUrl } from '@/utils/pokemon';

const ICON = 20;

/** Jumlah resource (`?limit=1`), `…` selama dimuat. */
function useCount(resource: ResourceName) {
  const q = useGetResourceCountQuery(resource);
  return {
    text: q.data !== undefined ? formatCount(q.data) : '…',
    refetch: q.refetch,
  };
}

export default function Explore({
  navigation,
}: MainTabScreenProps<typeof ROUTES.EXPLORE>) {
  useStatusBarStyle('dark-content');
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();

  const counts = {
    move: useCount('move'),
    item: useCount('item'),
    berry: useCount('berry'),
    region: useCount('region'),
    location: useCount('location'),
    generation: useCount('generation'),
    versionGroup: useCount('version-group'),
    version: useCount('version'),
    pokedex: useCount('pokedex'),
    eggGroup: useCount('egg-group'),
    color: useCount('pokemon-color'),
    shape: useCount('pokemon-shape'),
    habitat: useCount('pokemon-habitat'),
    growth: useCount('growth-rate'),
    nature: useCount('nature'),
    contest: useCount('contest-type'),
    trigger: useCount('evolution-trigger'),
    variable: useCount('evolution-variable'),
    method: useCount('encounter-method'),
  };
  const { refreshing, refresh } = useRefresh(
    Object.values(counts).map(c => c.refetch),
  );

  const icon = (C: typeof Zap) => (
    <RowLead>
      <C size={ICON} color={colors.ink2} />
    </RowLead>
  );

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 4, paddingBottom: bottomInset },
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
        <ScreenHeader
          title="Jelajah"
          subtitle="Semua data PokéAPI di luar Pokédex"
        />

        <View style={styles.group}>
          <Overline>Data utama</Overline>
          <View style={styles.tiles}>
            <Tile
              title="Tipe"
              count={`${POKEMON_TYPE_NAMES.length} tipe`}
              background={typePalette('water').background}
              onPress={() => navigation.navigate(ROUTES.TYPES)}
            >
              <View style={styles.dots}>
                {(
                  ['fire', 'grass', 'electric', 'psychic', 'dark'] as const
                ).map((t, i) => (
                  <View
                    key={t}
                    style={[
                      styles.dot,
                      { left: i * 18, backgroundColor: typeColors[t] },
                    ]}
                  />
                ))}
              </View>
            </Tile>
            <Tile
              title="Moves"
              count={`${counts.move.text} jurus`}
              background={typePalette('fighting').background}
              onPress={() => navigation.navigate(ROUTES.MOVE_LIST)}
            >
              <View style={styles.moveChip}>
                <Zap size={13} color={colors.white} />
                <AppText variant="micro" color={colors.white}>
                  Power · Akurasi · PP
                </AppText>
              </View>
            </Tile>
          </View>
          <View style={styles.tiles}>
            <Tile
              title="Item"
              count={`${counts.item.text} item`}
              light
              onPress={() => navigation.navigate(ROUTES.ITEM_LIST)}
            >
              <ItemSprite name="great-ball" size={62} style={styles.sprite} />
            </Tile>
            <Tile
              title="Berry"
              count={`${counts.berry.text} berry`}
              light
              onPress={() => navigation.navigate(ROUTES.BERRY_LIST)}
            >
              <ItemSprite name="oran-berry" size={62} style={styles.sprite} />
            </Tile>
          </View>
        </View>

        <ListGroup title="Dunia">
          <ListRow
            lead={
              <RowLead>
                <FastImage
                  source={{ uri: artworkUrl(4) }}
                  style={styles.leadArt}
                />
              </RowLead>
            }
            title="Region & lokasi"
            subtitle={`${counts.region.text} region · ${counts.location.text} lokasi · Pal Park`}
            onPress={() => navigation.navigate(ROUTES.REGION_LIST)}
          />
          <ListRow
            lead={icon(Gamepad2)}
            title="Game & generasi"
            subtitle={`${counts.generation.text} generasi · ${counts.versionGroup.text} grup versi · ${counts.version.text} versi`}
            onPress={() => navigation.navigate(ROUTES.GAMES)}
          />
          <ListRow
            lead={icon(BookOpen)}
            title="Pokédex regional"
            subtitle={`${counts.pokedex.text} Pokédex, mis. Kanto, Paldea`}
            onPress={() => navigation.navigate(ROUTES.POKEDEX_DETAIL)}
            divider={false}
          />
        </ListGroup>

        <ListGroup title="Kelompok Pokémon">
          <ListRow
            lead={icon(Egg)}
            title="Egg group"
            subtitle={`${counts.eggGroup.text} grup · mis. Monster, Dragon`}
            onPress={() =>
              navigation.navigate(ROUTES.POKEMON_GROUP, { kind: 'egg-group' })
            }
          />
          <ListRow
            lead={icon(Palette)}
            title="Warna & bentuk"
            subtitle={`${counts.color.text} warna · ${counts.shape.text} bentuk`}
            onPress={() =>
              navigation.navigate(ROUTES.POKEMON_GROUP, {
                kind: 'pokemon-color',
              })
            }
          />
          <ListRow
            lead={icon(Trees)}
            title="Habitat"
            subtitle={`${counts.habitat.text} habitat · mis. Forest, Sea`}
            onPress={() =>
              navigation.navigate(ROUTES.POKEMON_GROUP, {
                kind: 'pokemon-habitat',
              })
            }
          />
          <ListRow
            lead={icon(VenusAndMars)}
            title="Gender"
            subtitle="Betina saja, jantan saja, tanpa gender"
            onPress={() =>
              navigation.navigate(ROUTES.POKEMON_GROUP, { kind: 'gender' })
            }
          />
          <ListRow
            lead={icon(TrendingUp)}
            title="Growth rate"
            subtitle={`${counts.growth.text} kurva EXP sampai level 100`}
            onPress={() => navigation.navigate(ROUTES.GROWTH_RATE)}
            divider={false}
          />
        </ListGroup>

        <ListGroup title="Referensi">
          <ListRow
            lead={icon(Smile)}
            title="Nature"
            subtitle={`${counts.nature.text} nature · stat naik & turun`}
            onPress={() => navigation.navigate(ROUTES.NATURES)}
          />
          <ListRow
            lead={icon(Sparkles)}
            title="Kontes"
            subtitle={`${counts.contest.text} kategori · Cool sampai Tough`}
            onPress={() => navigation.navigate(ROUTES.CONTESTS)}
          />
          <ListRow
            lead={icon(GitBranch)}
            title="Pemicu evolusi"
            subtitle={`${counts.trigger.text} pemicu · ${counts.variable.text} variabel tersembunyi`}
            onPress={() => navigation.navigate(ROUTES.EVOLUTION_TRIGGERS)}
          />
          <ListRow
            lead={icon(Footprints)}
            title="Metode encounter"
            subtitle={`${counts.method.text} metode · jalan, selancar, memancing`}
            onPress={() => navigation.navigate(ROUTES.ENCOUNTER_METHODS)}
            divider={false}
          />
        </ListGroup>
      </ScrollView>
      <StatusBarScrim />
    </View>
  );
}

interface TileProps {
  title: string;
  count: string;
  background?: string;
  /** Tile putih (item/berry) — teks gelap. */
  light?: boolean;
  onPress: () => void;
  children?: React.ReactNode;
}

function Tile({
  title,
  count,
  background,
  light,
  onPress,
  children,
}: TileProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${count}`}
      onPress={onPress}
      style={[
        styles.tile,
        { backgroundColor: light ? colors.surface : background },
      ]}
    >
      <AppText variant="cardTitle" color={light ? colors.ink : colors.white}>
        {title}
      </AppText>
      <AppText variant="label" color={light ? colors.ink3 : '#FFFFFFBF'}>
        {count}
      </AppText>
      {children}
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
    gap: 10,
  },
  tiles: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    height: 116,
    padding: 16,
    gap: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dots: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    width: 100,
    height: 26,
  },
  dot: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: typePalette('water').background,
  },
  moveChip: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#FFFFFF33',
  },
  sprite: {
    position: 'absolute',
    right: 12,
    bottom: 8,
  },
  leadArt: {
    width: 36,
    height: 36,
  },
});
