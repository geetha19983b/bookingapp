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
          style={{ cursor: 'pointer' }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          style={{ cursor: 'pointer' }}
        />
      ),
      enableSorting: false,
      size: 50,
    }),
    columnHelper.accessor('displayName', {
      header: 'Name',
      cell: (info) => (
        <button
          onClick={() => handleEdit(info.row.original.id)}
          style={{
            color: '#81B29A',
            fontWeight: 500,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            textDecoration: 'underline',
            padding: 0,
          }}
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
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
    <div style={{ padding: '1.5rem', maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Vendors</h1>
        <Button
          variant="primary"
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
        <div style={{ marginBottom: '1rem' }}>
          <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())}>
            {successMessage}
          </Alert>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div style={{ marginBottom: '1rem' }}>
          <Alert variant="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        </div>
      )}

      {/* Selected Vendors Info */}
      {selectedVendors.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <Badge variant="primary">{selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''} selected</Badge>
        </div>
      )}

      {/* Data Table */}
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
  );
}
