import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './loginForm';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // <-- add this

// Define the root reducer
const rootReducer = combineReducers({
  auth: authSlice,
});

// Create the persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['auth','appData'], // persist only 'auth' and 'themeDark'
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persist the store
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };
