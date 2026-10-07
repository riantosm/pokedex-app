import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_DATA_LANGUAGE, type DataLanguage } from '@/utils/i18n';
import type { RootState } from '../index';

interface SettingsState {
  /** Bahasa nama & deskripsi dari PokéAPI. UI app tetap bahasa Indonesia. */
  dataLanguage: DataLanguage;
}

const initialState: SettingsState = { dataLanguage: DEFAULT_DATA_LANGUAGE };

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDataLanguage(state, action: PayloadAction<DataLanguage>) {
      state.dataLanguage = action.payload;
    },
  },
});

export const { setDataLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectDataLanguage = (state: RootState) =>
  state.settings.dataLanguage;
