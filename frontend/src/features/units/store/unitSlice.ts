import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { unitService } from '../services/unitService';
import type { Unit, CreateUnitPayload, UpdateUnitPayload, ActiveUnit } from '../types/unit.types';

interface UnitState {
  units: Unit[];
  activeUnits: ActiveUnit[];
  selectedUnit: Unit | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: UnitState = {
  units: [],
  activeUnits: [],
  selectedUnit: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Async thunks
export const fetchActiveUnits = createAsyncThunk('units/fetchActive', async () => {
  const units = await unitService.getActiveUnits();
  return units;
});

export const fetchUnits = createAsyncThunk('units/fetchAll', async () => {
  const units = await unitService.getAllUnits();
  return units;
});

export const fetchUnitById = createAsyncThunk('units/fetchById', async (id: number) => {
  const unit = await unitService.getUnitById(id);
  return unit;
});

export const createUnit = createAsyncThunk('units/create', async (payload: CreateUnitPayload) => {
  const unit = await unitService.createUnit(payload);
  return unit;
});

export const updateUnit = createAsyncThunk(
  'units/update',
  async ({ id, payload }: { id: number; payload: UpdateUnitPayload }) => {
    const unit = await unitService.updateUnit(id, payload);
    return unit;
  }
);

export const deleteUnit = createAsyncThunk('units/delete', async (id: number) => {
  await unitService.deleteUnit(id);
  return id;
});

const unitSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    clearSelectedUnit: (state) => {
      state.selectedUnit = null;
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
      // Fetch active units
      .addCase(fetchActiveUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveUnits.fulfilled, (state, action: PayloadAction<ActiveUnit[]>) => {
        state.loading = false;
        state.activeUnits = action.payload;
      })
      .addCase(fetchActiveUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch active units';
      })

      // Fetch all units
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action: PayloadAction<Unit[]>) => {
        state.loading = false;
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch units';
      })

      // Fetch unit by ID
      .addCase(fetchUnitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnitById.fulfilled, (state, action: PayloadAction<Unit>) => {
        state.loading = false;
        state.selectedUnit = action.payload;
      })
      .addCase(fetchUnitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch unit';
      })

      // Create unit
      .addCase(createUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createUnit.fulfilled, (state, action: PayloadAction<Unit>) => {
        state.loading = false;
        state.units.push(action.payload);
        if (action.payload.isActive) {
          state.activeUnits.push({
            id: action.payload.id,
            code: action.payload.code,
            name: action.payload.name,
            description: action.payload.description,
          });
        }
        state.successMessage = 'Unit created successfully';
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create unit';
      })

      // Update unit
      .addCase(updateUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUnit.fulfilled, (state, action: PayloadAction<Unit>) => {
        state.loading = false;
        const index = state.units.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.units[index] = action.payload;
        }
        // Update active units
        const activeIndex = state.activeUnits.findIndex((u) => u.id === action.payload.id);
        if (action.payload.isActive) {
          if (activeIndex !== -1) {
            state.activeUnits[activeIndex] = {
              id: action.payload.id,
              code: action.payload.code,
              name: action.payload.name,
              description: action.payload.description,
            };
          } else {
            state.activeUnits.push({
              id: action.payload.id,
              code: action.payload.code,
              name: action.payload.name,
              description: action.payload.description,
            });
          }
        } else if (activeIndex !== -1) {
          state.activeUnits.splice(activeIndex, 1);
        }
        state.successMessage = 'Unit updated successfully';
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update unit';
      })

      // Delete unit
      .addCase(deleteUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteUnit.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.units = state.units.filter((u) => u.id !== action.payload);
        state.activeUnits = state.activeUnits.filter((u) => u.id !== action.payload);
        state.successMessage = 'Unit deleted successfully';
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete unit';
      });
  },
});

export const { clearSelectedUnit, clearError, clearSuccessMessage } = unitSlice.actions;
export default unitSlice.reducer;
