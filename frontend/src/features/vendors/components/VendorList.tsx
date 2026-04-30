import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchVendors, deleteVendor, clearSuccessMessage, clearError } from '../store/vendorSlice';
import { Table, Button, Alert, Badge } from '@components/ui';
import type { Vendor } from '../types/vendor.types';

// Define table columns
const columnHelper = createColumnHelper<Vendor>();

export default function VendorList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { vendors, loading, error, successMessage } = useAppSelector((state) => state.vendors);
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleView = (vendorId: number) => {
    navigate(`/vendors/${vendorId}`);
  };

  const handleEdit = (vendorId: number) => {
    navigate(`/vendors/edit/${vendorId}`);
  };

  const handleDelete = async (vendorId: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      await dispatch(deleteVendor(vendorId));
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
    columnHelper.accessor('displayName', {
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
    columnHelper.accessor('companyName', {
      header: 'Company Name',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('workPhone', {
      header: 'Work Phone',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('sourceOfSupply', {
      header: 'Source of Supply',
      cell: (info) => info.getValue() || '-',
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
          <h1 className="text-xl font-bold text-gray-900 m-0">Vendors</h1>
          <p className="text-gray-600 mt-1">Manage your vendor relationships and contact information</p>
        </div>
        <Button
          variant="secondary"
          size="md"
          leftIcon={
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          }
          onClick={() => navigate('/vendors/new')}
        >
          New Vendor
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

      {/* Selected Vendors Info */}
      {selectedVendors.length > 0 && (
        <div className="mb-4">
          <Badge variant="primary" size="md">
            {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''} selected
          </Badge>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={vendors}
          columns={columns}
          isLoading={loading}
          error={error || undefined}
          emptyMessage="No vendors found. Create your first vendor to get started."
          enableSorting
          enablePagination
          enableRowSelection
          pageSize={25}
          pageSizeOptions={[10, 25, 50, 100]}
          onRowSelectionChange={setSelectedVendors}
        />
      </div>
    </div>
  );
}
