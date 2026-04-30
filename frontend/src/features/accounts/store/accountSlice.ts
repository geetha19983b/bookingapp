import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { accountService } from '../services/accountService';
import type { AccountOption } from '../types/account.types';

interface AccountState {
  incomeAccounts: AccountOption[];
  purchaseAccounts: AccountOption[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  incomeAccounts: [],
  purchaseAccounts: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchIncomeAccounts = createAsyncThunk('accounts/fetchIncome', async () => {
  const accounts = await accountService.getIncomeAccounts();
  return accounts;
});

export const fetchPurchaseAccounts = createAsyncThunk('accounts/fetchPurchase', async () => {
  const accounts = await accountService.getPurchaseAccounts();
  return accounts;
});

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch income accounts
      .addCase(fetchIncomeAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomeAccounts.fulfilled, (state, action: PayloadAction<AccountOption[]>) => {
        state.loading = false;
        state.incomeAccounts = action.payload;
      })
      .addCase(fetchIncomeAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch income accounts';
      })

      // Fetch purchase accounts
      .addCase(fetchPurchaseAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseAccounts.fulfilled, (state, action: PayloadAction<AccountOption[]>) => {
        state.loading = false;
        state.purchaseAccounts = action.payload;
      })
      .addCase(fetchPurchaseAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch purchase accounts';
      });
  },
});

export const { clearError } = accountSlice.actions;

export default accountSlice.reducer;
