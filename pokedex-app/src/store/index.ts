import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { pokeApi } from '@/services/api/pokeApi';
import favoritesReducer from './slices/favoritesSlice';
import networkReducer from './slices/networkSlice';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  network: networkReducer,
  [pokeApi.reducerPath]: pokeApi.reducer,
});

/**
 * Whitelist: favorit (data pengguna) + cache PokéAPI (supaya data yang pernah dibuka
 * tetap ada saat offline). Cache dipulihkan lewat `extractRehydrationInfo` di pokeApi.ts.
 */
const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['favorites', pokeApi.reducerPath],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Cache RTK Query besar & sudah pasti serializable — lewati cek dev yang lambat.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: [pokeApi.reducerPath],
      },
      immutableCheck: { ignoredPaths: [pokeApi.reducerPath] },
    }).concat(pokeApi.middleware),
});

export const persistor = persistStore(store);

/**
 * Sambungkan status koneksi & app ke RTK Query (bawaan `setupListeners` memakai event browser
 * yang tidak ada di RN). Saat kembali online, query yang aktif diambil ulang (`refetchOnReconnect`).
 */
setupListeners(
  store.dispatch,
  (dispatch, { onOnline, onOffline, onFocus, onFocusLost }) => {
    const unsubscribeNet = NetInfo.addEventListener(state => {
      const online =
        state.isConnected !== false && state.isInternetReachable !== false;
      dispatch(online ? onOnline() : onOffline());
    });
    const appState = AppState.addEventListener('change', status =>
      dispatch(status === 'active' ? onFocus() : onFocusLost()),
    );
    return () => {
      unsubscribeNet();
      appState.remove();
    };
  },
);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
