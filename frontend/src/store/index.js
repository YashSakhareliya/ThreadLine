import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import fabricsSlice from './slices/fabricsSlice';
import tailorsSlice from './slices/tailorsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    fabrics: fabricsSlice,
    tailors: tailorsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
