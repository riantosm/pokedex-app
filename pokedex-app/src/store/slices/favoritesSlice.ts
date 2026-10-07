import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FavoritePokemon } from '@/types';
import type { RootState } from '../index';

interface FavoritesState {
  /** Urutan = urutan disimpan, terbaru di depan. */
  items: FavoritePokemon[];
}

const initialState: FavoritesState = { items: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<FavoritePokemon>) {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectIsFavorite = (id: number) => (state: RootState) =>
  state.favorites.items.some(p => p.id === id);
