import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from '@features/vendors/store/vendorSlice';
import itemReducer from '@features/items/store/itemSlice';
import unitReducer from '@features/units/store/unitSlice';
import accountReducer from '@features/accounts/store/accountSlice';

export const store = configureStore({
  reducer: {
    vendors: vendorReducer,
    items: itemReducer,
    units: unitReducer,
    accounts: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
