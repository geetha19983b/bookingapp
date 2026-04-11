# BookKeeping App - Database Setup Guide

This guide will help you set up the PostgreSQL database for the BookKeeping application.

## Prerequisites

1. **PostgreSQL** installed on your system
   - Windows: Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Verify installation: `psql --version`
   
2. **Node.js** (v14 or higher)
   - Verify: `node --version`

## Quick Start

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Database

Open PostgreSQL command line (psql) and run:

```sql
-- Connect as postgres superuser
CREATE DATABASE bookkeeping_db;
```

Or use command line:

```bash
psql -U postgres -c "CREATE DATABASE bookkeeping_db;"
```

### Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and update the database credentials:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_actual_password
   DB_NAME=bookkeeping_db
   ```

### Step 4: Run Migrations

Run the migration script to create all tables:

```bash
npm run migrate
```

Or manually using psql:

```bash
cd backend/migrations
psql -U postgres -d bookkeeping_db -f 001_create_vendors_table.sql
psql -U postgres -d bookkeeping_db -f 002_create_items_table.sql
psql -U postgres -d bookkeeping_db -f 003_create_contact_persons_table.sql
psql -U postgres -d bookkeeping_db -f 004_create_vendor_items_history_table.sql
```

### Step 5: Load Sample Data (Optional)

```bash
psql -U postgres -d bookkeeping_db -f backend/migrations/seed_data.sql
```

Or if you set up npm scripts:

```bash
npm run seed
```

### Step 6: Verify Setup

Connect to the database and verify tables:

```bash
psql -U postgres -d bookkeeping_db
```

Then in psql:

```sql
-- List all tables
\dt

-- Check vendors table
SELECT * FROM vendors;

-- Check items table
SELECT * FROM items;

-- Check contact_persons table
SELECT * FROM contact_persons;

-- Check vendor_items_history table
SELECT * FROM vendor_items_history;

-- Exit
\q
```

## Database Schema

### Core Tables

#### 1. vendors
Stores vendor/supplier master information:
- Basic details: display_name, company_name, contact info
- GST/Tax: gstin, pan, gst_treatment, source_of_supply
- Financial: opening_balance, payment_terms
- Addresses: billing and shipping addresses
- Bank details: account number, IFSC code
- Status tracking: is_active, created_at, updated_at

**Key Fields:**
- `display_name` (required, unique) - Vendor display name
- `gstin` - GST Identification Number
- `pan` - Permanent Account Number
- `is_msme_registered` - MSME registration status

#### 2. items
Stores goods and services information:
- Basic: item_type (goods/service), name, sku, hsn_code
- Tax: intra_state and inter_state tax rates
- Sales: selling_price, sales_account, sales_description
- Purchase: cost_price, purchase_account, preferred_vendor_id
- Inventory: track_inventory, opening_stock, reorder_level

**Key Fields:**
- `item_type` - 'goods' or 'service'
- `sku` (unique) - Stock Keeping Unit
- `hsn_code` - Harmonized System of Nomenclature code
- `preferred_vendor_id` - Default vendor for purchases

#### 3. contact_persons
Multiple contacts per vendor:
- Personal: salutation, first_name, last_name
- Contact: email, work_phone, mobile_phone
- Role: designation, department
- Primary contact flag

#### 4. vendor_items_history
Purchase transaction history:
- Links vendors to items
- Tracks purchase_price, quantity, purchase_date
- Reference: purchase_order_number, invoice_number

## Common Operations

### Adding a New Vendor

```sql
INSERT INTO vendors (
    display_name, company_name, email, 
    gst_treatment, gstin, source_of_supply
) VALUES (
    'New Vendor Ltd',
    'New Vendor Private Limited',
    'contact@newvendor.com',
    'Registered Business - Regular',
    '29XXXXX1234Y1Z5',
    'Karnataka'
);
```

### Adding a New Item

```sql
INSERT INTO items (
    item_type, name, sku, hsn_code,
    selling_price, cost_price,
    is_sellable, is_purchasable,
    preferred_vendor_id
) VALUES (
    'goods',
    'Laptop Bag',
    'ACC-BAG-001',
    '42021900',
    1500.00,
    1000.00,
    true,
    true,
    1
);
```

### Querying Items by Vendor

```sql
SELECT i.*, v.display_name as vendor_name
FROM items i
LEFT JOIN vendors v ON i.preferred_vendor_id = v.id
WHERE v.id = 1;
```

### Purchase History Report

```sql
SELECT 
    v.display_name as vendor,
    i.name as item,
    h.purchase_price,
    h.quantity,
    h.purchase_date,
    h.invoice_number
FROM vendor_items_history h
JOIN vendors v ON h.vendor_id = v.id
JOIN items i ON h.item_id = i.id
ORDER BY h.purchase_date DESC;
```

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Check if PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status
   ```

2. Verify credentials in `.env` file

3. Test connection:
   ```bash
   psql -U postgres -d bookkeeping_db
   ```

### Migration Errors

If migrations fail:

1. Check if database exists:
   ```bash
   psql -U postgres -l
   ```

2. Rollback and retry:
   ```bash
   psql -U postgres -d bookkeeping_db -f backend/migrations/rollback_all.sql
   npm run migrate
   ```

### Permission Issues

If you get permission errors:

```sql
-- Connect as postgres superuser
psql -U postgres

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE bookkeeping_db TO your_user;
\c bookkeeping_db
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

## Next Steps

1. ✅ Database setup complete
2. ✅ Update backend.ts to use PostgreSQL for vendor APIs
3. ⬜ Create API endpoints for vendors (GET, POST, PUT, DELETE)
4. ⬜ Create API endpoints for items (GET, POST, PUT, DELETE)
5. ⬜ Update frontend forms to work with new API
6. ⬜ Implement image upload for items
7. ⬜ Add validation and error handling

## Useful Commands

```bash
# Start backend server
npm start

# Run with auto-reload (development)
npm run dev

# Run migrations
npm run migrate

# Load seed data
npm run seed

# Complete setup (migrate + seed)
npm run db:setup
```

## Database Maintenance

### Backup Database

```bash
pg_dump -U postgres bookkeeping_db > backup.sql
```

### Restore Database

```bash
psql -U postgres -d bookkeeping_db < backup.sql
```

### Reset Database

```bash
psql -U postgres -d bookkeeping_db -f backend/migrations/rollback_all.sql
npm run migrate
npm run seed
```

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
