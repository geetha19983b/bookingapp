import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Table, Button, Badge } from '@components/ui';
import type { Vendor } from '@features/vendors/types/vendor.types';

/**
 * Example: Using the Table component with Vendor data
 * 
 * This demonstrates how to use the reusable Table component with TanStack Table
 * for displaying vendor data with sorting, pagination, and row selection.
 */

const columnHelper = createColumnHelper<Vendor>();

// Define columns for the vendor table
export const vendorColumns = [
  // Checkbox column for row selection
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    size: 50,
  }),

  // Display Name column
  columnHelper.accessor('displayName', {
    header: 'Name',
    cell: (info) => (
      <div style={{ fontWeight: 500 }}>
        {info.getValue()}
      </div>
    ),
  }),

  // Company Name column
  columnHelper.accessor('companyName', {
    header: 'Company Name',
    cell: (info) => info.getValue() || '-',
  }),

  // Email column
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue() || '-',
  }),

  // Work Phone column
  columnHelper.accessor('workPhone', {
    header: 'Work Phone',
    cell: (info) => info.getValue() || '-',
  }),

  // Source of Supply column
  columnHelper.accessor('sourceOfSupply', {
    header: 'Source of Supply',
    cell: (info) => info.getValue() || '-',
  }),

  // Status column with Badge
  columnHelper.accessor('isActive', {
    header: 'Status',
    cell: (info) => (
      <Badge variant={info.getValue() ? 'success' : 'error'} size="sm">
        {info.getValue() ? 'Active' : 'Inactive'}
      </Badge>
    ),
  }),

  // Actions column
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
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

// Action handlers
const handleEdit = (id: number) => {
  console.log('Edit vendor:', id);
  // Navigate to edit page or open modal
};

const handleDelete = (id: number) => {
  console.log('Delete vendor:', id);
  // Show confirmation modal
};

/**
 * Example Component Usage
 */
export function VendorTableExample({ vendors, loading, error }: { vendors: Vendor[]; loading: boolean; error?: string }) {
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);

  return (
    <div>
      {selectedVendors.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <Badge variant="primary">{selectedVendors.length} selected</Badge>
        </div>
      )}

      <Table
        data={vendors}
        columns={vendorColumns}
        isLoading={loading}
        error={error}
        emptyMessage="No vendors found. Create your first vendor to get started."
        enableSorting={true}
        enablePagination={true}
        enableRowSelection={true}
        pageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        onRowSelectionChange={setSelectedVendors}
      />
    </div>
  );
}
