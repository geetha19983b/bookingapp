# BookKeeping App - Backend

Backend API server for the BookKeeping application, built with Express.js, TypeScript, and Prisma ORM.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up Prisma**
   ```bash
   # Automated setup (Windows)
   .\setup-prisma.ps1
   
   # Or manual setup
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Server runs on: http://localhost:5174

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts            # Database seed script
│   └── migrations/        # Migration files
├── routes/
│   └── vendors.ts         # Vendor routes
├── services/
│   └── vendorService.ts   # Vendor business logic
├── schemas/
│   └── vendorSchemas.ts   # Zod validation schemas
├── migrations/            # Legacy SQL migrations (reference)
├── docs/                  # Database documentation
├── db.ts                  # Prisma Client instance
├── backend.ts             # Express app entry point
└── tsconfig.json          # TypeScript configuration
```

## Environment Variables

Create a `.env` file:

```env
# Prisma Database URL (Required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/bookkeeping_db?schema=public"

# Server Configuration
PORT=5174
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Available Scripts

### Development
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript to JavaScript
npm start                # Run production build
```

### Prisma Commands
```bash
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create and apply migration
npm run prisma:deploy    # Apply migrations (production)
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:pull      # Sync schema from database
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database with sample data
npm run prisma:reset     # Reset database (⚠️ deletes data)
```

### Legacy Commands
```bash
npm run migrate          # Run legacy SQL migrations
npm run seed             # Run legacy seed script
npm run db:setup         # Run migrate + seed
```

## API Endpoints

### Vendors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vendors` | Get all vendors |
| GET | `/api/vendors/:id` | Get vendor by ID |
| POST | `/api/vendors` | Create new vendor |
| PUT | `/api/vendors/:id` | Update vendor |
| DELETE | `/api/vendors/:id` | Delete vendor |

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items (legacy JSON file) |
| POST | `/api/items` | Create item (legacy JSON file) |

## Database

### Using Prisma

All database operations use **Prisma ORM**:

```typescript
import prisma from './db';

// Find all vendors
const vendors = await prisma.vendor.findMany();

// Find one vendor
const vendor = await prisma.vendor.findUnique({
  where: { id: 1 }
});

// Create vendor
const vendor = await prisma.vendor.create({
  data: { displayName: 'Acme Corp', email: 'info@acme.com' }
});

// Update vendor
const vendor = await prisma.vendor.update({
  where: { id: 1 },
  data: { displayName: 'New Name' }
});

// Delete vendor
await prisma.vendor.delete({
  where: { id: 1 }
});
```

### Schema Management

1. Edit `prisma/schema.prisma`
2. Create migration: `npm run prisma:migrate -- --name description`
3. Generate types: `npm run prisma:generate`

### Viewing Data

Open Prisma Studio - a GUI for viewing and editing database data:

```bash
npm run prisma:studio
```

Opens at: http://localhost:5555

## Models

- **Vendor** - Supplier/vendor information
- **Item** - Goods and services
- **ContactPerson** - Vendor contacts
- **VendorItemHistory** - Purchase history

See `prisma/schema.prisma` for full schema definition.

## Error Handling

The app handles:
- **Validation Errors** (400) - Via Zod schemas
- **Unique Constraint Violations** (409) - Prisma P2002
- **Not Found** (404) - Prisma P2025
- **Internal Server Errors** (500) - Unexpected errors

## TypeScript

The project uses strict TypeScript configuration. After schema changes:

1. Run `npm run prisma:generate`
2. Restart TypeScript server (VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server")

## Documentation

- [Prisma Migration Guide](./PRISMA_MIGRATION_GUIDE.md) - Detailed Prisma setup and migration info
- [Prisma Quick Start](./PRISMA_QUICKSTART.md) - Quick reference for common tasks
- [Migration Summary](./PRISMA_MIGRATION_SUMMARY.md) - Summary of changes made
- [Database Design](./docs/DATABASE_DESIGN_SUMMARY.md) - Database schema documentation

## Development Tips

1. **Hot Reload** - Changes auto-reload via `tsx watch`
2. **Type Safety** - Prisma generates TypeScript types automatically
3. **Database GUI** - Use Prisma Studio to view/edit data
4. **Debugging** - SQL queries are logged in console
5. **Validation** - Use Zod schemas in routes for input validation

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run: `npx prisma generate`

### "Environment variable not found: DATABASE_URL"
Create `.env` file with `DATABASE_URL`

### Database connection errors
1. Check PostgreSQL is running
2. Verify DATABASE_URL credentials
3. Ensure database exists: `createdb bookkeeping_db`

### TypeScript errors after schema changes
1. Run `npm run prisma:generate`
2. Restart TypeScript server

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables:
   ```env
   DATABASE_URL="your_production_database_url"
   NODE_ENV=production
   ```

3. Run migrations:
   ```bash
   npm run prisma:deploy
   ```

4. Start server:
   ```bash
   npm start
   ```

## Contributing

When adding new features:

1. Update Prisma schema if needed
2. Create migration: `npm run prisma:migrate`
3. Update types: `npm run prisma:generate`
4. Add validation schemas (Zod)
5. Create/update routes
6. Update documentation

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)

## License

ISC
