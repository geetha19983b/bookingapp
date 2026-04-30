# Account Master Data Implementation

## Overview

The Account Master Table stores the **Chart of Accounts** - the fundamental accounting structure that categorizes all financial transactions. This replaces the previous string-based account fields in Items with a structured, hierarchical account system.

## What Are Accounts?

In accounting, every transaction must be recorded in specific **ledger accounts** that categorize:
- **Income**: Revenue from sales, services, interest, etc.
- **Expenses**: Costs of doing business (COGS, utilities, salaries, etc.)
- **Assets**: What the company owns (cash, inventory, equipment, etc.)
- **Liabilities**: What the company owes (payables, loans, taxes, etc.)
- **Equity**: Owner's stake in the business

For items in your inventory, two main account types matter:
- **Sales Account**: Where revenue from selling this item is recorded (e.g., "Sales", "Service Income")
- **Purchase Account**: Where expenses from buying this item are recorded (e.g., "Cost of Goods Sold", "GST Payable")

## Database Schema

### Account Model
```prisma
model Account {
  id                      Int       @id @default(autoincrement())
  accountId               String?   @unique  // External system ID (e.g., Zoho ID)
  accountType             String    // income, expense, asset, liability, equity
  accountName             String
  accountCode             String?
  parentAccountId         Int?      // For hierarchical accounts
  
  // Account Details
  description             String?
  accountHint             String?   // User-friendly description
  depth                   Int       @default(0)  // Hierarchy depth (0 = root)
  
  // Flags
  isTaxAccount            Boolean   @default(false)
  isDefault               Boolean   @default(false)
  isRootAccountWithChild  Boolean   @default(false)
  
  // Relations
  parentAccount           Account?  @relation("AccountHierarchy")
  childAccounts           Account[] @relation("AccountHierarchy")
  itemsSales              Item[]    @relation("SalesAccount")
  itemsPurchase           Item[]    @relation("PurchaseAccount")
}
```

### Updated Item Model
```prisma
model Item {
  // ... other fields
  
  salesAccountId          Int?      // New: Foreign key to Account
  salesAccount            String?   // Deprecated: kept for backward compatibility
  
  purchaseAccountId       Int?      // New: Foreign key to Account
  purchaseAccount         String?   // Deprecated: kept for backward compatibility
  
  // Relations
  salesAccountRef         Account?  @relation("SalesAccount")
  purchaseAccountRef      Account?  @relation("PurchaseAccount")
}
```

## Hierarchical Account Structure

Accounts support parent-child relationships. For example:

```
Input Tax Credits (Parent)
├── Input CGST (Child)
├── Input IGST (Child)
└── Input SGST (Child)

GST Payable (Parent)
├── Output CGST (Child)
├── Output IGST (Child)
└── Output SGST (Child)
```

This is tracked using:
- `parentAccountId`: Links to parent account
- `depth`: Hierarchy level (0 = root, 1 = first level child, etc.)
- `isRootAccountWithChild`: Marks parent accounts that have children

## Setup Instructions

### 1. Run Database Migration

```bash
cd backend
npx prisma migrate dev
```

This will create the `accounts` table and add the new foreign key columns to the `items` table.

### 2. Seed Accounts from JSON

Populate the accounts table from your existing `account.json` file:

```bash
cd backend
npx ts-node prisma/accountSeed.ts
```

This will:
- Read all accounts from `account.json`
- Create accounts in the database
- Establish parent-child relationships
- Display a summary of created accounts

### 3. Generate Prisma Client

```bash
cd backend
npx prisma generate
```

### 4. Start the Server

```bash
cd backend
npm run dev
```

## API Endpoints

### Get All Accounts
```http
GET /api/v1/accounts?accountType=income&isActive=true&page=1&limit=50
```

Query Parameters:
- `accountType`: Filter by type (income, expense, asset, liability, equity)
- `isTaxAccount`: Filter tax accounts (true/false)
- `isActive`: Filter active/inactive accounts (true/false)
- `parentAccountId`: Filter by parent (or 'null' for root accounts)
- `search`: Search in name, code, or description
- `page`, `limit`: Pagination

### Get Income Accounts (for Sales Dropdown)
```http
GET /api/v1/accounts/income?activeOnly=true
```

Returns all active income accounts, sorted by hierarchy.

### Get Purchase Accounts (for Purchase Dropdown)
```http
GET /api/v1/accounts/purchase?activeOnly=true
```

Returns all accounts suitable for purchases (expenses, assets, liabilities).

### Get Account Hierarchy
```http
GET /api/v1/accounts/hierarchy?accountType=income
```

Returns accounts in a tree structure with parent-child relationships.

### Get Account by ID
```http
GET /api/v1/accounts/:id
```

Returns full account details with parent, children, and usage counts.

### Create Account
```http
POST /api/v1/accounts
Content-Type: application/json

{
  "accountType": "income",
  "accountName": "Consulting Services",
  "accountCode": "4100",
  "parentAccountId": null,
  "description": "Revenue from consulting services",
  "isActive": true
}
```

### Update Account
```http
PUT /api/v1/accounts/:id
Content-Type: application/json

{
  "accountName": "Consulting & Advisory Services",
  "description": "Updated description"
}
```

### Delete Account (Soft Delete)
```http
DELETE /api/v1/accounts/:id
```

Sets `isActive` to false. Prevents deletion if:
- Account has child accounts
- Account is used by items

## Frontend Integration

### Item Form Dropdowns

When creating/editing items, use these endpoints to populate dropdowns:

**Sales Account Dropdown:**
```typescript
const response = await fetch('/api/v1/accounts/income');
const { data: accounts } = await response.json();

// Display accounts with indentation based on depth
accounts.forEach(account => {
  const indent = '  '.repeat(account.depth);
  console.log(`${indent}${account.accountName}`);
});
```

**Purchase Account Dropdown:**
```typescript
const response = await fetch('/api/v1/accounts/purchase');
const { data: accounts } = await response.json();
```

### Creating Items with Accounts

```typescript
const itemData = {
  name: "MacBook Pro",
  itemType: "goods",
  isSellable: true,
  salesAccountId: 123,  // Use the account ID from dropdown
  isPurchasable: true,
  purchaseAccountId: 456,  // Use the account ID from dropdown
  // ... other fields
};

await fetch('/api/v1/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(itemData),
});
```

## Business Logic

### How Accounts Relate to Items

| Item Field | Account Type | Example Accounts |
|------------|-------------|------------------|
| `isSellable: true` | Income | "Sales", "Service Income", "Consulting Revenue" |
| `isPurchasable: true` | Expense/Asset/Liability | "Cost of Goods Sold", "GST Payable", "Input CGST" |
| `taxPreference: "taxable"` | Tax Accounts | "Input CGST", "Output IGST", "GST Payable" |

### Account Selection Rules

1. **For Sales (Income Accounts)**:
   - Goods → Usually "Sales" or "Revenue from Operations"
   - Services → Usually "Service Income" or "Professional Fees"

2. **For Purchases**:
   - Goods → Usually "Cost of Goods Sold" or "Purchases"
   - Tax-related → "Input CGST", "Input IGST", "GST Payable"
   - Prepaid → "Prepaid Expenses"
   - Fixed Assets → "Furniture and Equipment"

### Backward Compatibility

The old string fields (`salesAccount`, `purchaseAccount`) are kept for backward compatibility:
- Existing items will continue to work
- Frontend can be updated gradually
- Both fields can coexist temporarily
- Plan to deprecate string fields after migration is complete

## Migration Strategy

### Phase 1: Parallel Fields (Current)
- Both `salesAccountId` and `salesAccount` exist
- Frontend uses new account dropdowns
- Backend accepts both formats

### Phase 2: Data Migration (Future)
```sql
-- Example: Migrate existing string accounts to IDs
UPDATE items i
SET sales_account_id = a.id
FROM accounts a
WHERE i.sales_account = a.account_name
AND i.sales_account_id IS NULL;
```

### Phase 3: Deprecation (Future)
- Remove `salesAccount` and `purchaseAccount` string fields
- Make `salesAccountId` and `purchaseAccountId` required (where applicable)

## Common Account Types from Zoho Books

### Income Accounts
- Sales
- Service Income
- Discount
- General Income
- Interest Income
- Late Fee Income
- Other Charges
- Shipping Charge

### Expense/Purchase Accounts
- Cost of Goods Sold
- GST Payable (with children: Output CGST, Output IGST, Output SGST)
- Prepaid Expenses
- Employee Advance
- Furniture and Equipment

### Tax Accounts (Assets)
- Input Tax Credits (with children: Input CGST, Input IGST, Input SGST)
- Advance Tax
- TDS Receivable
- Reverse Charge Tax Input but not due

## Troubleshooting

### Issue: Migration fails
**Solution**: Make sure your database is backed up, then manually apply the migration:
```bash
cd backend
psql -d your_database -f prisma/migrations/20260430100000_add_accounts_table/migration.sql
```

### Issue: Seed script fails with "Parent account not found"
**Solution**: The seed script processes accounts in two passes to handle parent relationships. Check that `account.json` is valid JSON.

### Issue: Items API returns null for account references
**Solution**: Make sure to include the account relations in your Prisma query:
```typescript
const item = await prisma.item.findUnique({
  where: { id },
  include: {
    salesAccountRef: true,
    purchaseAccountRef: true,
  },
});
```

## Next Steps

1. ✅ Database schema updated with Account model
2. ✅ Migration created
3. ✅ Seed script ready
4. ✅ API endpoints implemented
5. ⏳ Update frontend Item form with account dropdowns
6. ⏳ Create Account management UI (optional)
7. ⏳ Migrate existing item data from strings to account IDs
8. ⏳ Update reporting to use account hierarchy

## References

- [Prisma Schema](../backend/prisma/schema.prisma)
- [Account Service](../backend/services/accountService.ts)
- [Account Routes](../backend/routes/accounts.ts)
- [Account Schemas](../backend/schemas/accountSchemas.ts)
- [Seed Script](../backend/prisma/accountSeed.ts)
