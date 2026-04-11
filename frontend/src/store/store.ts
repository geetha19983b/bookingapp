import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from '@features/vendors/store/vendorSlice';

export const store = configureStore({
  reducer: {
    vendors: vendorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
