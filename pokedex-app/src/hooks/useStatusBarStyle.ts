import { useCallback } from 'react';
import { StatusBar, type StatusBarStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Atur warna ikon status bar selama layar ini fokus.
 * Layar dengan header merah / hero berwarna pakai `light-content`.
 */
export function useStatusBarStyle(style: StatusBarStyle) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, true);
      return () => StatusBar.setBarStyle('dark-content', true);
    }, [style]),
  );
}
