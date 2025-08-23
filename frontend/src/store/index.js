import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import fabricsSlice from './slices/fabricsSlice';
import tailorsSlice from './slices/tailorsSlice';
import ordersSlice from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    fabrics: fabricsSlice,
    tailors: tailorsSlice,
    orders: ordersSlice,
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
