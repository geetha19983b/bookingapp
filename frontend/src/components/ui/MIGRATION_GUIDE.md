# UI Component Library Migration Guide

## Overview
This guide shows how to migrate existing components to use the new reusable UI component library.

## Benefits of Migration

### Before Migration
- Repeated UI code across components
- Inconsistent styling
- Maintenance nightmare
- No standardized behavior
- Larger bundle size

### After Migration
- Consistent, reusable components
- Centralized styling
- Easy maintenance and updates
- Standardized UX patterns
- Smaller bundle size

---

## Example Migration: VendorList Component

### Before (Old Approach)
The old `VendorList.tsx` had:
- Inline Tailwind classes mixed with CSS Modules
- Custom table implementation
- Manual row selection logic
- Inconsistent button styling
- Repeated alert/toast components

```tsx
// Old approach
<div className="p-6 max-w-full">
  {successMessage && (
    <div className="mb-4 px-4 py-3 rounded-lg border border-success bg-success text-white font-semibold shadow-lg">
      {successMessage}
    </div>
  )}
  
  <button
    onClick={() => navigate('/vendors/new')}
    className="btn-theme-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
    Create New Vendor
  </button>

  <table className="min-w-full divide-y divide-border-light">
    {/* Manual table implementation */}
  </table>
</div>
```

### After (New Approach with UI Library)
The new approach uses reusable components:

```tsx
import { Table, Button, Alert, Badge } from '@components/ui';
import { createColumnHelper } from '@tanstack/react-table';
import type { Vendor } from '../types/vendor.types';

const columnHelper = createColumnHelper<Vendor>();

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.accessor('displayName', {
    header: 'Name',
    cell: (info) => <strong>{info.getValue()}</strong>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue() || '-',
  }),
  columnHelper.accessor('isActive', {
    header: 'Status',
    cell: (info) => (
      <Badge variant={info.getValue() ? 'success' : 'error'}>
        {info.getValue() ? 'Active' : 'Inactive'}
      </Badge>
    ),
  }),
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
  }),
];

export function VendorListNew() {
  const { vendors, loading, error, successMessage } = useAppSelector((state) => state.vendors);
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <Button
          variant="primary"
          leftIcon={
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
          onClick={() => navigate('/vendors/new')}
        >
          New Vendor
        </Button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())}>
          {successMessage}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Selected Vendors Info */}
      {selectedVendors.length > 0 && (
        <div className="mb-4">
          <Badge variant="primary">{selectedVendors.length} vendors selected</Badge>
        </div>
      )}

      {/* Data Table */}
      <Table
        data={vendors}
        columns={columns}
        isLoading={loading}
        error={error}
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
```

---

## Step-by-Step Migration Guide

### 1. Replace Buttons

**Before:**
```tsx
<button
  onClick={handleSubmit}
  className="btn-theme-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg"
>
  Submit
</button>
```

**After:**
```tsx
import { Button } from '@components/ui';

<Button variant="primary" onClick={handleSubmit}>
  Submit
</Button>
```

### 2. Replace Form Inputs

**Before:**
```tsx
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">Email</label>
  <input
    type="email"
    name="email"
    className="w-full px-3 py-2 border rounded-md"
    value={formData.email}
    onChange={handleChange}
  />
  {errors.email && <span className="text-error text-xs">{errors.email}</span>}
</div>
```

**After:**
```tsx
import { Input } from '@components/ui';

<Input
  label="Email"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  required
/>
```

### 3. Replace Alerts/Toasts

**Before:**
```tsx
{successMessage && (
  <div className="mb-4 px-4 py-3 rounded-lg border border-success bg-success text-white">
    {successMessage}
  </div>
)}
```

**After:**
```tsx
import { Alert } from '@components/ui';

{successMessage && (
  <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())}>
    {successMessage}
  </Alert>
)}
```

### 4. Replace Tables

**Before:** Custom table with manual sorting, pagination, and selection.

**After:**
```tsx
import { Table } from '@components/ui';
import { createColumnHelper } from '@tanstack/react-table';

// Define columns once
const columnHelper = createColumnHelper<YourDataType>();
const columns = [/* define columns */];

// Use the Table component
<Table
  data={data}
  columns={columns}
  enableSorting
  enablePagination
  enableRowSelection
  onRowSelectionChange={setSelectedRows}
/>
```

### 5. Replace Status Indicators

**Before:**
```tsx
<span className={`px-2 py-1 rounded-full text-xs ${
  status === 'active' ? 'bg-success' : 'bg-error'
}`}>
  {status}
</span>
```

**After:**
```tsx
import { Badge } from '@components/ui';

<Badge variant={status === 'active' ? 'success' : 'error'}>
  {status}
</Badge>
```

---

## Complete Example: Migrating VendorForm

See the example implementation in:
- `frontend/src/features/vendors/components/VendorForm.refactored.tsx`

Key changes:
1. Replace all input fields with `<Input />`, `<Select />`, `<TextArea />`
2. Replace submit/cancel buttons with `<Button />`
3. Replace success/error messages with `<Alert />`
4. Wrap in `<Card />` for consistent spacing
5. Use `<Modal />` for confirmation dialogs

---

## Testing Checklist

After migration, verify:
- [ ] All buttons have consistent styling
- [ ] Form inputs show proper focus states
- [ ] Error messages display correctly
- [ ] Loading states work as expected
- [ ] Table sorting, filtering, pagination work
- [ ] Row selection updates parent state
- [ ] Modals trap focus correctly
- [ ] Keyboard navigation works
- [ ] Mobile responsive design maintained
- [ ] No console errors or warnings
- [ ] Build completes successfully

---

## Next Steps

1. **Start with low-risk components** - Migrate simple components first
2. **Test thoroughly** - Ensure functionality matches before migration
3. **Update gradually** - One component at a time
4. **Document as you go** - Add examples for team reference
5. **Gather feedback** - Get team buy-in on new patterns

---

## Support

For questions or issues:
- Check `frontend/src/components/ui/README.md` for component docs
- See `frontend/src/components/ui/Table.example.tsx` for table usage
- Review theme variables in `frontend/src/styles/_theme.scss`
