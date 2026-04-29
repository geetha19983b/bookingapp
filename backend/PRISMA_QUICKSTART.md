# Prisma Quick Start

This is a quick reference guide for using Prisma ORM in the BookKeeping App backend.

## Prerequisites

- PostgreSQL installed and running
- Node.js installed
- `.env` file configured with `DATABASE_URL`

## Quick Setup

### Windows (PowerShell)

```powershell
# Run the setup script
.\setup-prisma.ps1
```

### Manual Setup

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Choose one:

# Option A: Fresh database
npx prisma migrate dev --name init
npx prisma db seed

# Option B: Existing database
npx prisma db pull
npx prisma generate
```

## Essential Commands

```bash
# Development
npm run dev                    # Start dev server with hot reload
npm run prisma:studio          # Open Prisma Studio (DB GUI)

# Database Management
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Create & apply migration
npm run prisma:deploy          # Apply migrations (production)
npm run prisma:pull            # Sync schema from database
npm run prisma:push            # Push schema to database
npm run prisma:seed            # Seed database

# Utilities
npm run prisma:reset           # Reset database (⚠️ deletes data)
prisma format                  # Format schema.prisma file
```

## Environment Setup

Create/update `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Example:
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/bookkeeping_db?schema=public"
```

## Database Operations

### Create a new table

1. Edit `prisma/schema.prisma`
2. Add your model:

```prisma
model MyTable {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  
  @@map("my_table")
}
```

3. Run migration:

```bash
npm run prisma:migrate -- --name add_my_table
```

### Query Examples

```typescript
import prisma from './db';

// Find all
const vendors = await prisma.vendor.findMany();

// Find one
const vendor = await prisma.vendor.findUnique({
  where: { id: 1 }
});

// Create
const vendor = await prisma.vendor.create({
  data: {
    displayName: 'New Vendor',
    email: 'vendor@example.com'
  }
});

// Update
const vendor = await prisma.vendor.update({
  where: { id: 1 },
  data: { displayName: 'Updated Name' }
});

// Delete
await prisma.vendor.delete({
  where: { id: 1 }
});

// With relations
const vendor = await prisma.vendor.findUnique({
  where: { id: 1 },
  include: {
    contactPersons: true,
    vendorItemsHistory: true
  }
});
```

## Troubleshooting

### Problem: "Environment variable not found: DATABASE_URL"

**Solution:** Create `.env` file with `DATABASE_URL`

### Problem: "Prisma Client did not initialize yet"

**Solution:** Run `npm run prisma:generate`

### Problem: Type errors after schema changes

**Solution:** 
1. Run `npm run prisma:generate`
2. Restart TypeScript server (VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server")

### Problem: Can't connect to database

**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL credentials
- Ensure database exists: `createdb bookkeeping_db`

## Schema Location

- Main schema: `backend/prisma/schema.prisma`
- Migrations: `backend/prisma/migrations/`
- Seed file: `backend/prisma/seed.ts`

## Database GUI

Open Prisma Studio to view/edit data:

```bash
npm run prisma:studio
```

Opens at: http://localhost:5555

## More Information

See [PRISMA_MIGRATION_GUIDE.md](./PRISMA_MIGRATION_GUIDE.md) for detailed information about the migration from raw SQL to Prisma.

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
