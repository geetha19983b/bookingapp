# Database Seeding Guide

## Seed Order

**Important**: Seeds must be run in the correct order due to foreign key dependencies.

### 1. Run Migrations First
```bash
cd backend
npx prisma migrate dev
```

This creates all tables including:
- `units`
- `vendors`
- `accounts` (new)
- `items`
- `contact_persons`
- `vendor_items_history`

### 2. Seed Accounts (Must Run First)
```bash
cd backend
npx ts-node prisma/accountSeed.ts
```

**Why first?** Items reference accounts via `salesAccountId` and `purchaseAccountId`.

This will:
- Read from `backend/prisma/account.json`
- Create all income, expense, asset, and liability accounts
- Establish parent-child relationships (e.g., "Input Tax Credits" → "Input CGST/IGST/SGST")
- Display summary of created accounts

Expected output:
```
Found 26 unique accounts to seed
✓ Created account: Sales (ID: 1)
✓ Created account: GST Payable (ID: 2)
...
✅ Account seed completed successfully!
Total accounts created: 26

Accounts by type:
  - income: 8
  - other_current_asset: 9
  - other_current_liability: 9
```

### 3. Seed Master Data & Sample Items
```bash
cd backend
npx ts-node prisma/seed.ts
```

This will:
- Seed units (PCS, KGS, HRS, etc.)
- Seed vendors
- Seed contact persons
- **Lookup accounts by name** to get account IDs
- Seed items with account references
- Seed vendor item history

Expected output:
```
Starting database seed...
Clearing existing data...
Seeding units...
Created 15 units
Seeding vendors...
Created 2 vendors
Seeding contact persons...
Created 3 contact persons
Looking up accounts...
Seeding items...
Created 2 items
Seeding vendor items history...
Created 2 vendor item history records
Database seeding completed successfully!
```

### 4. Generate Prisma Client
```bash
cd backend
npx prisma generate
```

This updates TypeScript types to include the `Account` model and new relations.

### 5. Start Server
```bash
cd backend
npm run dev
```

## Complete Setup Script

For a fresh setup, run all commands in order:

```bash
cd backend

# 1. Run migrations
npx prisma migrate dev

# 2. Generate Prisma client
npx prisma generate

# 3. Seed accounts first
npx ts-node prisma/accountSeed.ts

# 4. Seed master data and sample items
npx ts-node prisma/seed.ts

# 5. Start server
npm run dev
```

## What If Accounts Aren't Seeded?

If you run `seed.ts` before `accountSeed.ts`, you'll see:
```
⚠️  Warning: Sales account not found. Run accountSeed.ts first. Items will be created without account references.
```

Items will still be created, but:
- `salesAccountId` will be `null`
- `purchaseAccountId` will be `null`
- Old string fields (`salesAccount`, `purchaseAccount`) will still be populated for backward compatibility

## Resetting the Database

To completely reset and reseed:

```bash
cd backend

# Option 1: Reset with migrate (recommended)
npx prisma migrate reset
# This will:
# - Drop the database
# - Recreate it
# - Run all migrations
# - Run seed.ts automatically (but NOT accountSeed.ts)

# Then manually seed accounts
npx ts-node prisma/accountSeed.ts

# Option 2: Manual reset
npx prisma db push --force-reset
npx prisma generate
npx ts-node prisma/accountSeed.ts
npx ts-node prisma/seed.ts
```


cd backend

# 1. Reset database (drops and recreates)
npx prisma migrate reset --skip-seed

# 2. Generate Prisma client
npx prisma generate

# 3. Seed accounts first
npx ts-node prisma/accountSeed.ts

# 4. Seed everything else
npx ts-node prisma/seed.ts

# 5. Start server
npm run dev

## Verifying the Seed

Check data was created correctly:

```bash
# Option 1: Using Prisma Studio (GUI)
npx prisma studio

# Option 2: Using psql (if you have it)
psql -d your_database_name
```

Then check:
```sql
-- Check accounts
SELECT id, account_name, account_type, parent_account_id FROM accounts LIMIT 10;

-- Check items with account relations
SELECT 
  i.id,
  i.name,
  i.sales_account_id,
  sa.account_name as sales_account,
  i.purchase_account_id,
  pa.account_name as purchase_account
FROM items i
LEFT JOIN accounts sa ON i.sales_account_id = sa.id
LEFT JOIN accounts pa ON i.purchase_account_id = pa.id;
```

## Seed Files

| File | Purpose | Dependencies |
|------|---------|-------------|
| `accountSeed.ts` | Populates accounts from account.json | None (run first) |
| `seed.ts` | Populates units, vendors, items, etc. | Requires accounts to exist |

## Account Lookup Logic in seed.ts

The seed script looks up accounts by name:

```typescript
// Looks for "Sales" account
const salesAccount = await prisma.account.findFirst({
  where: { accountName: 'Sales', isActive: true }
});

// Looks for "Service Income" account, falls back to "Sales"
const serviceRevenueAccount = await prisma.account.findFirst({
  where: { accountName: 'Service Income', isActive: true }
});

// Uses the IDs when creating items
const item = await prisma.item.create({
  data: {
    name: "Laptop",
    salesAccountId: salesAccount?.id,  // ← Uses account ID
    salesAccount: "Sales",              // ← Kept for backward compatibility
    // ... other fields
  }
});
```

## Troubleshooting

### "Account not found" warnings
**Solution**: Run `accountSeed.ts` first.

### "Property 'account' does not exist on PrismaClient"
**Solution**: Run `npx prisma generate` after updating schema.

### Foreign key constraint errors
**Solution**: Make sure accounts exist before creating items.

### Duplicate key errors
**Solution**: Database might already have data. Either:
- Clear the data first: `npx prisma migrate reset`
- Or modify seed script to skip duplicates

## Next Steps After Seeding

1. Test the API:
```bash
# Get all accounts
curl http://localhost:3000/api/v1/accounts

# Get income accounts for dropdown
curl http://localhost:3000/api/v1/accounts/income

# Get all items with account relations
curl http://localhost:3000/api/v1/items
```

2. Update frontend to use account dropdowns
3. Create items with account references instead of string names

See [ACCOUNTS_IMPLEMENTATION.md](../backend/docs/ACCOUNTS_IMPLEMENTATION.md) for full API documentation.
