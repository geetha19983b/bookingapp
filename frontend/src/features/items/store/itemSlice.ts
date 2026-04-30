import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { itemService } from '../services/itemService';
import type { Item, CreateItemPayload, UpdateItemPayload } from '../types/item.types';

interface ItemState {
  items: Item[];
  selectedItem: Item | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ItemState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Async thunks
export const fetchItems = createAsyncThunk('items/fetchAll', async () => {
  const items = await itemService.getAllItems();
  return items;
});

export const fetchItemById = createAsyncThunk('items/fetchById', async (id: number) => {
  const item = await itemService.getItemById(id);
  return item;
});

export const createItem = createAsyncThunk('items/create', async (payload: CreateItemPayload) => {
  const item = await itemService.createItem(payload);
  return item;
});

export const updateItem = createAsyncThunk(
  'items/update',
  async ({ id, payload }: { id: number; payload: UpdateItemPayload }) => {
    const item = await itemService.updateItem(id, payload);
    return item;
  }
);

export const deleteItem = createAsyncThunk('items/delete', async (id: number) => {
  await itemService.deleteItem(id);
  return id;
});

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearSelectedItem: (state) => {
      state.selectedItem = null;
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
      // Fetch all items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })

      // Fetch item by ID
      .addCase(fetchItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action: PayloadAction<Item>) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch item';
      })

      // Create item
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.loading = false;
        state.items.push(action.payload);
        state.successMessage = 'Item created successfully';
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create item';
      })

      // Update item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.loading = false;
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedItem = action.payload;
        state.successMessage = 'Item updated successfully';
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item';
      })

      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.successMessage = 'Item deleted successfully';
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete item';
      });
  },
});

export const { clearSelectedItem, clearError, clearSuccessMessage } = itemSlice.actions;
export default itemSlice.reducer;
