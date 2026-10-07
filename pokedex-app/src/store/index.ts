import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createMigrate,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { pokeApi } from '@/services/api/pokeApi';
import { addConnectionListener } from '@/services/network';
import favoritesReducer from './slices/favoritesSlice';
import networkReducer from './slices/networkSlice';
import { PERSIST_VERSION, createMigrations } from './migrations';
import settingsReducer from './slices/settingsSlice';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  network: networkReducer,
  settings: settingsReducer,
  [pokeApi.reducerPath]: pokeApi.reducer,
});

/**
 * Whitelist: favorit & pengaturan (data pengguna) + cache PokéAPI (supaya data yang pernah dibuka
 * tetap ada saat offline). Cache dipulihkan lewat `extractRehydrationInfo` di pokeApi.ts.
 */
const persistedReducer = persistReducer(
  {
    key: 'root',
    version: PERSIST_VERSION,
    storage: AsyncStorage,
    migrate: createMigrate(createMigrations(pokeApi.reducerPath), {
      debug: false,
    }),
    whitelist: ['favorites', 'settings', pokeApi.reducerPath],
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
    const unsubscribeNet = addConnectionListener(state => {
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
