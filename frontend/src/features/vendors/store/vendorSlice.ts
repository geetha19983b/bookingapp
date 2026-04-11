import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vendorService } from '../services/vendorService';
import type { Vendor, CreateVendorPayload, UpdateVendorPayload } from '../types/vendor.types';

interface VendorState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: VendorState = {
  vendors: [],
  selectedVendor: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Async thunks
export const fetchVendors = createAsyncThunk('vendors/fetchAll', async () => {
  const vendors = await vendorService.getAllVendors();
  return vendors;
});

export const fetchVendorById = createAsyncThunk('vendors/fetchById', async (id: number) => {
  const vendor = await vendorService.getVendorById(id);
  return vendor;
});

export const createVendor = createAsyncThunk('vendors/create', async (payload: CreateVendorPayload) => {
  const vendor = await vendorService.createVendor(payload);
  return vendor;
});

export const updateVendor = createAsyncThunk(
  'vendors/update',
  async ({ id, payload }: { id: number; payload: UpdateVendorPayload }) => {
    const vendor = await vendorService.updateVendor(id, payload);
    return vendor;
  }
);

export const deleteVendor = createAsyncThunk('vendors/delete', async (id: number) => {
  await vendorService.deleteVendor(id);
  return id;
});

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action: PayloadAction<Vendor[]>) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vendors';
      })

      // Fetch vendor by ID
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.loading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vendor';
      })

      // Create vendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.loading = false;
        state.vendors.push(action.payload);
        state.successMessage = 'Vendor created successfully';
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create vendor';
      })

      // Update vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.loading = false;
        const index = state.vendors.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        state.selectedVendor = action.payload;
        state.successMessage = 'Vendor updated successfully';
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update vendor';
      })

      // Delete vendor
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.vendors = state.vendors.filter((v) => v.id !== action.payload);
        state.successMessage = 'Vendor deleted successfully';
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete vendor';
      });
  },
});

export const { clearSelectedVendor, clearError, clearSuccessMessage } = vendorSlice.actions;
export default vendorSlice.reducer;
