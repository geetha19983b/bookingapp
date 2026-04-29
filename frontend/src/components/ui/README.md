# UI Component Library

A comprehensive set of reusable React components built with TypeScript, SCSS modules, and TanStack Table.

## Components

### Form Components
- **Button** - Versatile button with variants (primary, secondary, outline, ghost, danger) and sizes
- **Input** - Text input with label, error states, and icons
- **TextArea** - Multi-line text input with resize options
- **Select** - Dropdown select with custom styling

### Feedback Components
- **Alert** - Contextual feedback messages (success, error, warning, info)
- **Badge** - Small status indicators and labels
- **Spinner** - Loading indicator with size and color variants

### Layout Components
- **Card** - Container component with elevation and padding options
- **Modal** - Accessible modal dialog with overlay

### Data Display Components
- **Table** - Feature-rich table powered by TanStack Table with:
  - Sorting
  - Filtering
  - Pagination
  - Row selection
  - Custom cell rendering
  - Loading and empty states

## Installation

Dependencies are already installed:
- `clsx` - For conditional className management
- `@tanstack/react-table` - For advanced table functionality

## Usage Examples

### Button
```tsx
import { Button } from '@components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="outline" leftIcon={<PlusIcon />}>
  Add Item
</Button>

<Button variant="danger" isLoading>
  Deleting...
</Button>
```

### Input
```tsx
import { Input } from '@components/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
  error={errors.email}
/>

<Input
  label="Search"
  leftIcon={<SearchIcon />}
  placeholder="Search..."
/>
```

### Alert
```tsx
import { Alert } from '@components/ui';

<Alert variant="success" title="Success!" onClose={handleClose}>
  Your changes have been saved.
</Alert>

<Alert variant="error">
  Something went wrong. Please try again.
</Alert>
```

### Table
```tsx
import { Table } from '@components/ui';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Vendor>();

const columns = [
  columnHelper.accessor('displayName', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue() || '-',
  }),
  // Add more columns...
];

<Table
  data={vendors}
  columns={columns}
  enableSorting
  enablePagination
  enableRowSelection
  onRowSelectionChange={(rows) => console.log('Selected:', rows)}
  pageSize={25}
  isLoading={loading}
  error={error}
  emptyMessage="No vendors found"
/>
```

### Modal
```tsx
import { Modal } from '@components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to proceed?</p>
  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </div>
</Modal>
```

### Card
```tsx
import { Card } from '@components/ui';

<Card variant="elevated" padding="lg">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

## Styling

All components use CSS Modules with SCSS for scoped styling. They integrate with the centralized theme system in `src/styles/_theme.scss`.

### Theme Variables Used
- Colors: `$color-theme-primary`, `$color-theme-accent`, etc.
- Spacing: `$spacing-sm`, `$spacing-md`, etc.
- Border Radius: `$radius-md`, `$radius-lg`, etc.
- Shadows: `$shadow-sm`, `$shadow-lg`, etc.
- Typography: Font sizes, weights, and families

## Accessibility

All components follow accessibility best practices:
- Semantic HTML elements
- ARIA attributes where needed
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## TypeScript Support

All components are fully typed with TypeScript, providing excellent IntelliSense and type safety.
