import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from '@features/vendors/store/vendorSlice';
import itemReducer from '@features/items/store/itemSlice';

export const store = configureStore({
  reducer: {
    vendors: vendorReducer,
    items: itemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
