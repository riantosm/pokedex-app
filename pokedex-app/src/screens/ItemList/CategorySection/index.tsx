import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '@/components/atoms/Button';
import Skeleton from '@/components/atoms/Skeleton';
import ListGroup from '@/components/molecules/ListGroup';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetItemCategoryQuery } from '@/services/api/item.service';
import { pickName } from '@/utils/i18n';
import ItemRow from '../ItemRow';

const PREVIEW = 8;

export interface CategorySectionProps {
  category: string;
  onPressItem: (name: string) => void;
}

/** Satu kategori item dalam kantong. Hanya 8 item pertama dirender sampai pengguna minta semua. */
function CategorySection({ category, onPressItem }: CategorySectionProps) {
  const lang = useDataLanguage();
  const { data } = useGetItemCategoryQuery(category);
  const [expanded, setExpanded] = useState(false);

  if (!data) {
    return <Skeleton height={140} radius={16} />;
  }
  const items = expanded ? data.items : data.items.slice(0, PREVIEW);

  return (
    <View style={styles.root}>
      <ListGroup
        title={`${pickName(data.names, lang, category)} · ${data.items.length}`}
      >
        {items.map((name, i) => (
          <ItemRow
            key={name}
            name={name}
            divider={i < items.length - 1}
            onPress={onPressItem}
          />
        ))}
      </ListGroup>
      {!expanded && data.items.length > PREVIEW && (
        <Button
          label={`Tampilkan semua ${data.items.length} item`}
          variant="secondary"
          onPress={() => setExpanded(true)}
        />
      )}
    </View>
  );
}

export default memo(CategorySection);

const styles = StyleSheet.create({
  root: {
    gap: 10,
  },
});
