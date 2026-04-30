import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchItems, deleteItem, clearSuccessMessage, clearError } from '../store/itemSlice';
import { Table, Button, Alert, Badge } from '@components/ui';
import type { Item } from '../types/item.types';

// Define table columns
const columnHelper = createColumnHelper<Item>();

export default function ItemList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, loading, error, successMessage } = useAppSelector((state) => state.items);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleView = (itemId: number) => {
    navigate(`/items/${itemId}`);
  };

  const handleEdit = (itemId: number) => {
    navigate(`/items/edit/${itemId}`);
  };

  const handleDelete = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await dispatch(deleteItem(itemId));
    }
  };

  // Define columns for the table
  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="cursor-pointer"
        />
      ),
      enableSorting: false,
      size: 50,
    }),
    columnHelper.accessor('imageUrl', {
      header: 'Image',
      cell: (info) => {
        const imageUrl = info.getValue();
        const itemName = info.row.original.name;
        return imageUrl ? (
          <img
            src={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5174/api/v1').replace('/api/v1', '')}${imageUrl}`}
            alt={itemName}
            className="w-10 h-10 object-cover rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-medium text-sm">
            {itemName.charAt(0).toUpperCase()}
          </div>
        );
      },
      enableSorting: false,
      size: 80,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <button
          onClick={() => handleView(info.row.original.id)}
          className="text-teal font-medium cursor-pointer bg-transparent border-none underline p-0 hover:text-opacity-80"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('sku', {
      header: 'SKU',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('itemType', {
      header: 'Type',
      cell: (info) => (
        <Badge variant={info.getValue() === 'goods' ? 'primary' : 'info'} size="sm">
          {info.getValue() === 'goods' ? 'Goods' : 'Service'}
        </Badge>
      ),
    }),
    columnHelper.accessor('unit', {
      header: 'Unit',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('sellingPrice', {
      header: 'Selling Price',
      cell: (info) => {
        const price = info.getValue();
        return price !== null && price !== undefined ? `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';
      },
    }),
    columnHelper.accessor('costPrice', {
      header: 'Cost Price',
      cell: (info) => {
        const price = info.getValue();
        return price !== null && price !== undefined ? `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';
      },
    }),
    columnHelper.accessor('preferredVendor', {
      header: 'Preferred Vendor',
      cell: (info) => info.getValue()?.displayName || '-',
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: (info) => (
        <Badge variant={info.getValue() ? 'success' : 'error'} size="sm">
          {info.getValue() ? 'Active' : 'Inactive'}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row.original.id)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
      enableSorting: false,
      size: 150,
    }),
  ];

  return (
    <div className="p-6 max-w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Items</h1>
          <p className="text-gray-600 mt-1">Manage your inventory items and services</p>
        </div>
        <Button
          variant="secondary"
          size="md"
          leftIcon={
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          }
          onClick={() => navigate('/items/new')}
        >
          New Item
        </Button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-4">
          <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())}>
            {successMessage}
          </Alert>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4">
          <Alert variant="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        </div>
      )}

      {/* Selected Items Info */}
      {selectedItems.length > 0 && (
        <div className="mb-4">
          <Badge variant="primary" size="md">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </Badge>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={items}
          columns={columns}
          isLoading={loading}
          error={error || undefined}
          emptyMessage="No items found. Create your first item to get started."
          enableSorting
          enablePagination
          enableRowSelection
          pageSize={25}
          pageSizeOptions={[10, 25, 50, 100]}
          onRowSelectionChange={setSelectedItems}
        />
      </div>
    </div>
  );
}
