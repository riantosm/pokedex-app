import { createSlice, type UnknownAction } from '@reduxjs/toolkit';
import type { ApiError } from '@/services/api/baseQuery';
import type { RootState } from '../index';

interface NetworkState {
  /**
   * `true` setelah request PokéAPI gagal tanpa response (offline, DNS gagal, Wi-Fi tanpa internet).
   * Kembali `false` begitu ada request yang berhasil. Melengkapi NetInfo, yang hanya membaca
   * status koneksi sistem.
   */
  apiUnreachable: boolean;
}

const initialState: NetworkState = { apiUnreachable: false };

const isApiAction = (action: UnknownAction, suffix: 'rejected' | 'fulfilled') =>
  action.type.startsWith('pokeApi/') && action.type.endsWith(`/${suffix}`);

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        (action): action is UnknownAction & { payload?: ApiError } =>
          isApiAction(action, 'rejected'),
        (state, action) => {
          // Rejected karena cache/condition tidak membawa payload — abaikan.
          if (action.payload && action.payload.status === null) {
            state.apiUnreachable = true;
          }
        },
      )
      .addMatcher(
        action => isApiAction(action, 'fulfilled'),
        state => {
          state.apiUnreachable = false;
        },
      );
  },
});

export default networkSlice.reducer;

export const selectApiUnreachable = (state: RootState) =>
  state.network.apiUnreachable;
