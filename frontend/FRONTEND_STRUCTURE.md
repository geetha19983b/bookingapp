# Frontend Application - BookKeeping App

## Project Structure

The frontend has been restructured following React best practices with TypeScript and Redux Toolkit for state management.

```
frontend/src/
├── features/                    # Feature-based modules
│   └── vendors/                # Vendor management feature
│       ├── components/         # Vendor-specific components
│       │   ├── VendorList.tsx  # Display vendors in table
│       │   └── VendorForm.tsx  # Add/Edit vendor form
│       ├── services/           # API service layer
│       │   └── vendorService.ts
│       ├── store/              # Redux slice
│       │   └── vendorSlice.ts
│       └── types/              # TypeScript types
│           └── vendor.types.ts
│
├── components/                  # Shared components
│   └── layout/                 # Layout components
│       ├── Sidebar.tsx         # Application sidebar
│       └── TopNavbar.tsx       # Top navigation bar
│
├── store/                       # Redux store configuration
│   ├── store.ts                # Store setup
│   └── hooks.ts                # Typed Redux hooks
│
├── types/                       # Global TypeScript types
│   ├── jsx.d.ts                # JSX type declarations
│   └── index.ts
│
├── styles/                      # SCSS styles
│   ├── _theme.scss             # Theme variables
│   └── _examples.scss
│
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── vite-env.d.ts               # Vite environment types
```

## Key Technologies

- **TypeScript**: Strong typing for better development experience
- **React 19**: Latest React features
- **Redux Toolkit**: State management with async thunks
- **React Router**: Client-side routing
- **Vite**: Fast build tool
- **SCSS**: Styled with theme variables
- **Tailwind CSS**: Utility-first CSS framework

## Features

### Vendor Management

- **List View**: Displays all vendors with search and filter capabilities
- **Add/Edit Form**: Comprehensive form with tabs for:
  - Basic Details (name, contact info, currency)
  - Address (billing and shipping)
  - Tax & Compliance (GST, PAN, MSME)
  - Bank Details
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Redux Integration**: Centralized state management
- **Type Safety**: Full TypeScript coverage

### Navigation

- Sidebar with expandable sections
- Vendors under Purchases section
- Plus icon navigation to quickly add vendors
- Dynamic navbar that adapts based on current route

## Path Aliases

The following path aliases are configured for cleaner imports:

- `@/*` → `./src/*`
- `@features/*` → `./src/features/*`
- `@components/*` → `./src/components/*`
- `@store/*` → `./src/store/*`
- `@types/*` → `./src/types/*`
- `@styles/*` → `./src/styles/*`

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

The frontend communicates with the backend at `http://localhost:5174/api`

### Vendor Endpoints

- `GET /api/vendors` - Fetch all vendors
- `GET /api/vendors/:id` - Fetch single vendor
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

## Theme Colors

The application uses a custom theme defined in `_theme.scss`:

- Primary: Yale Blue (#1B4079)
- Accent: Mindaro (#CBDF90)
- Secondary: Air Force Blue (#4D7C8A)

All colors are referenced via CSS classes (no hardcoded colors):

- `text-primary`, `text-secondary`, `text-muted`
- `bg-main`, `bg-card`, `bg-hover`
- `btn-theme-primary`, `btn-theme-secondary`

## Best Practices

1. **Feature-Based Organization**: Each feature (vendors, items) has its own folder with components, services, types, and store
2. **Strong Typing**: All components, services, and store use TypeScript
3. **Reusable Components**: Layout components are shared across features
4. **Service Layer**: API calls are abstracted in service files
5. **Redux Toolkit**: Modern Redux with async thunks for API calls
6. **Responsive Design**: Uses CSS Grid and Flexbox for layouts
7. **Theme Consistency**: All colors from theme variables, no hardcoded values

## Next Steps

Consider migrating remaining JSX files (ItemList, NewItemForm) to TypeScript for full type safety.
