import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import FastImage from '@d11/react-native-fast-image';
import AppText from '@/components/atoms/AppText';
import ItemSprite from '@/components/atoms/ItemSprite';
import PressableScale from '@/components/atoms/PressableScale';
import Skeleton from '@/components/atoms/Skeleton';
import StatusBarScrim from '@/components/atoms/StatusBarScrim';
import ChipScroller from '@/components/molecules/ChipScroller';
import EmptyState from '@/components/molecules/EmptyState';
import FactStrip from '@/components/molecules/FactStrip';
import InfoRow from '@/components/molecules/InfoRow';
import ScreenHeader from '@/components/molecules/ScreenHeader';
import SectionHeader from '@/components/molecules/SectionHeader';
import TypeChip from '@/components/molecules/TypeChip';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useRefresh } from '@/hooks/useRefresh';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { ROUTES } from '@/navigation/paths';
import type { RootStackScreenProps } from '@/navigation/types';
import {
  useGetCurrencyQuery,
  useGetItemCategoryQuery,
  useGetItemQuery,
} from '@/services/api/item.service';
import { colors } from '@/theme/colors';
import { cleanFlavorText, formatCount } from '@/utils/format';
import { pickEntry, pickName } from '@/utils/i18n';
import {
  compareVersionGroupsNewestFirst,
  generationRoman,
  itemPocketLabel,
  versionGroupLabel,
} from '@/utils/labels';
import { artworkUrl, pokemonName } from '@/utils/pokemon';
import AttributeChip from './AttributeChip';
import FlingSection from './FlingSection';

const price = (v: number | null) => (v ? `₽${formatCount(v)}` : '—');

export default function ItemDetail({
  navigation,
  route,
}: RootStackScreenProps<typeof ROUTES.ITEM_DETAIL>) {
  const { name } = route.params;
  useStatusBarStyle('dark-content');
  const lang = useDataLanguage();
  const insets = useSafeAreaInsets();
  const { data: item, isError, refetch } = useGetItemQuery(name);
  const category = useGetItemCategoryQuery(item?.category.name ?? '', {
    skip: !item,
  });
  const [versionIndex, setVersionIndex] = useState<number | null>(null);
  const prices = useMemo(() => item?.prices ?? [], [item]);
  // Urutan `prices` dari PokéAPI tidak kronologis (grup Jepang & Legends: Z-A di akhir) → urutkan sendiri.
  const priceOrder = useMemo(
    () =>
      [...prices.keys()].sort((a, b) =>
        compareVersionGroupsNewestFirst(
          prices[a].versionGroup,
          prices[b].versionGroup,
        ),
      ),
    [prices],
  );
  const activeIndex = versionIndex ?? priceOrder[0];
  const selected = activeIndex === undefined ? undefined : prices[activeIndex];
  const currency = useGetCurrencyQuery(selected?.currency ?? 'poke-dollar', {
    skip: !selected,
  });
  const { refreshing, refresh } = useRefresh([refetch]);

  const effect = pickEntry(item?.effect_entries, lang);
  const flavor = pickEntry(item?.flavor_text_entries, lang)?.text;
  // Item pegangan (Flame Orb, Leftovers, …) — efek PokéAPI diawali "Held:".
  const heldEffect = /^held\b/i.test(effect?.effect ?? '');
  const openItem = (n: string) =>
    navigation.push(ROUTES.ITEM_DETAIL, { name: n });

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 4, paddingBottom: insets.bottom + 32 },
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
        <ScreenHeader title="" onBack={navigation.goBack} />
        <View style={styles.hero}>
          <View style={styles.circle}>
            <ItemSprite name={name} size={96} />
          </View>
          <AppText
            variant="heroTitle"
            align="center"
            accessibilityRole="header"
          >
            {pickName(item?.names, lang, name)}
          </AppText>
          {category.data && (
            <View style={styles.pills}>
              {[
                itemPocketLabel(category.data.pocket),
                pickName(category.data.names, lang, category.data.name),
              ].map(l => (
                <View key={l} style={styles.pill}>
                  <AppText variant="label" color={colors.ink2}>
                    {l}
                  </AppText>
                </View>
              ))}
            </View>
          )}
        </View>

        {isError && !item ? (
          <EmptyState
            icon={<WifiOff size={30} color={colors.ink3} />}
            title="Item gagal dimuat"
            body="Item ini belum pernah dibuka saat online. Sambungkan internet lalu coba lagi."
            actionLabel="Coba lagi"
            actionVariant="primary"
            onAction={refresh}
          />
        ) : !item ? (
          <Skeleton height={320} radius={24} />
        ) : (
          <View style={styles.card}>
            {selected && (
              <View style={styles.section}>
                <SectionHeader title="Harga" variant="subheading" />
                {prices.length > 1 && (
                  <ChipScroller inset={0}>
                    {priceOrder.map(i => (
                      <TypeChip
                        key={prices[i].versionGroup}
                        label={versionGroupLabel(prices[i].versionGroup)}
                        active={activeIndex === i}
                        onPress={() => setVersionIndex(i)}
                      />
                    ))}
                  </ChipScroller>
                )}
                <FactStrip
                  items={[
                    { value: price(selected.purchase), label: 'Beli' },
                    { value: price(selected.sell), label: 'Jual' },
                    {
                      value: pickName(
                        currency.data?.names,
                        lang,
                        selected.currency,
                      ),
                      label: 'Mata uang',
                    },
                  ]}
                />
                <AppText variant="caption" color={colors.ink3}>
                  {`Data harga untuk ${prices.length} grup versi game.`}
                </AppText>
              </View>
            )}

            {(effect || flavor) && (
              <View style={styles.section}>
                <SectionHeader
                  title={heldEffect ? 'Efek saat dipegang' : 'Efek'}
                  variant="subheading"
                />
                {effect && (
                  <AppText color={colors.ink2} style={styles.text}>
                    {cleanFlavorText(effect.short_effect ?? effect.effect)}
                  </AppText>
                )}
                {flavor && (
                  <AppText variant="caption" color={colors.ink3}>
                    {`“${cleanFlavorText(flavor)}”`}
                  </AppText>
                )}
              </View>
            )}

            {(item.fling_power || item.fling_effect) && (
              <FlingSection
                power={item.fling_power}
                effect={item.fling_effect?.name ?? null}
                onPressItem={openItem}
              />
            )}

            {item.attributes.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="Atribut" variant="subheading" />
                <View style={styles.wrap}>
                  {item.attributes.map(a => (
                    <AttributeChip key={a.name} name={a.name} />
                  ))}
                </View>
              </View>
            )}

            <View>
              <SectionHeader title="Data lainnya" variant="subheading" />
              {!item.fling_power && !item.fling_effect && (
                <InfoRow label="Fling" value="Tidak bisa dilempar" />
              )}
              <InfoRow
                label="Dipegang liar"
                value={
                  item.heldBy.length ? (
                    <View style={styles.wrap}>
                      {item.heldBy.slice(0, 4).map(p => (
                        <PressableScale
                          key={p.id}
                          onPress={() =>
                            navigation.push(ROUTES.POKEMON_DETAIL, {
                              id: p.id,
                              name: p.name,
                            })
                          }
                          style={styles.holder}
                        >
                          <FastImage
                            source={{ uri: artworkUrl(p.id) }}
                            style={styles.holderArt}
                          />
                          <AppText variant="captionStrong">
                            {pokemonName(p.name)}
                          </AppText>
                        </PressableScale>
                      ))}
                    </View>
                  ) : (
                    'Tidak ada'
                  )
                }
              />
              {!selected && (
                <InfoRow label="Harga" value="Tidak ada data harga" />
              )}
              <InfoRow
                label="Pertama muncul"
                value={
                  item.firstGeneration
                    ? `Generasi ${generationRoman(item.firstGeneration)}`
                    : '—'
                }
                divider={false}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <StatusBarScrim />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    gap: 16,
    paddingHorizontal: 20,
  },
  hero: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 8,
  },
  circle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
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
    backgroundColor: colors.surface,
  },
  card: {
    gap: 22,
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  section: {
    gap: 10,
  },
  text: {
    lineHeight: 23,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  holder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 3,
    paddingLeft: 4,
    paddingRight: 10,
    borderRadius: 999,
    backgroundColor: colors.bg,
  },
  holderArt: {
    width: 26,
    height: 26,
  },
});
