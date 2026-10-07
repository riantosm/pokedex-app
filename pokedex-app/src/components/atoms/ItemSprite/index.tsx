import { useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

const BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

export interface ItemSpriteProps {
  /** Nama item, mis. `great-ball`, `oran-berry`. */
  name: string;
  size: number;
  style?: ViewStyle;
}

/**
 * Sprite item. Versi dream-world (±90 px) jauh lebih tajam, tapi tidak tersedia untuk semua item —
 * kalau gagal dimuat, jatuh ke sprite default 30 px.
 */
export default function ItemSprite({ name, size, style }: ItemSpriteProps) {
  const [fallback, setFallback] = useState(false);
  const uri = fallback
    ? `${BASE}/${name}.png`
    : `${BASE}/dream-world/${name}.png`;

  return (
    <View style={[{ width: size, height: size }, style]} pointerEvents="none">
      <FastImage
        key={uri}
        source={{ uri }}
        style={[styles.fill, { width: size, height: size }]}
        resizeMode={FastImage.resizeMode.contain}
        onError={() => setFallback(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {},
});
