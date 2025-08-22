import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './loginForm';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sidebarSlice from './sidebar';
import postDataSlice from './postDataSlice';
import appDataSlice from './appDataSlice';
import onboadingData from './onboadingDataSlice'
// Define the root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  post: postDataSlice,
  appData:appDataSlice,
  onboading:onboadingData,
  sidebar: sidebarSlice.reducer
});

// Create the persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','appData'], // persist only 'auth' and 'themeDart'
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    });
  }
});

// Persist the store
persistStore(store);

// Export the store
export { store };
