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
  persistReducer,
  persistStore,
} from 'redux-persist';
import { pokeApi } from '@/services/api/pokeApi';
import favoritesReducer from './slices/favoritesSlice';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
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

// refetchOnReconnect / refetchOnFocus RTK Query.
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
