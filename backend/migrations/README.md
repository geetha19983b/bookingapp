# Database Migrations

This directory contains PostgreSQL migration scripts for the BookKeeping application.

## Migration Files

1. **001_create_vendors_table.sql** - Creates the vendors table to store supplier information
2. **002_create_items_table.sql** - Creates the items table for goods and services
3. **003_create_contact_persons_table.sql** - Creates the contact persons table for multiple vendor contacts
4. **004_create_vendor_items_history_table.sql** - Creates the purchase history table

## Running Migrations

### Using psql Command Line

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database_name

# Run migrations in order
\i 001_create_vendors_table.sql
\i 002_create_items_table.sql
\i 003_create_contact_persons_table.sql
\i 004_create_vendor_items_history_table.sql
```

### Using psql with File Path

```bash
psql -U your_username -d your_database_name -f backend/migrations/001_create_vendors_table.sql
psql -U your_username -d your_database_name -f backend/migrations/002_create_items_table.sql
psql -U your_username -d your_database_name -f backend/migrations/003_create_contact_persons_table.sql
psql -U your_username -d your_database_name -f backend/migrations/004_create_vendor_items_history_table.sql
```

### Using Node.js Migration Script

Create a migration runner script (see `run_migrations.js` example below).

## Database Schema Overview

### Tables

#### vendors
Stores vendor/supplier master data including:
- Contact information (name, email, phone)
- Address details (billing and shipping)
- GST/tax information (GSTIN, PAN, treatment)
- Business information (MSME status, payment terms)
- Bank details

#### items
Stores goods and services information including:
- Basic details (name, SKU, HSN code)
- Tax configuration (intra-state and inter-state rates)
- Sales information (price, account, description)
- Purchase information (cost, account, preferred vendor)
- Inventory tracking options

#### contact_persons
Stores multiple contact persons for each vendor:
- Personal details (name, email, phone)
- Role information (designation, department)
- Primary contact flag

#### vendor_items_history
Tracks purchase transactions between vendors and items:
- Purchase price and quantity
- Reference numbers (PO, invoice)
- Purchase dates and notes

### Relationships

```
vendors (1) ----< (many) contact_persons
vendors (1) ----< (many) items (via preferred_vendor_id)
vendors (1) ----< (many) vendor_items_history
items (1) ----< (many) vendor_items_history
```

## Features

- **Automatic Timestamps**: All tables have `created_at` and `updated_at` columns with triggers
- **Indexes**: Optimized indexes for common queries
- **Foreign Keys**: Proper relationships with CASCADE options
- **Data Validation**: CHECK constraints for data integrity
- **Flexible Storage**: JSONB fields for custom fields and extensibility
- **Comments**: Inline documentation for all tables and key columns

## Rollback Scripts

To rollback migrations (in reverse order):

```sql
-- 004 Rollback
DROP TABLE IF EXISTS vendor_items_history CASCADE;
DROP FUNCTION IF EXISTS update_vendor_items_history_updated_at();

-- 003 Rollback
DROP TABLE IF EXISTS contact_persons CASCADE;
DROP FUNCTION IF EXISTS update_contact_persons_updated_at();

-- 002 Rollback
DROP TABLE IF EXISTS items CASCADE;
DROP FUNCTION IF EXISTS update_items_updated_at();

-- 001 Rollback
DROP TABLE IF EXISTS vendors CASCADE;
DROP FUNCTION IF EXISTS update_vendors_updated_at();
```

## Next Steps

1. Set up your PostgreSQL database
2. Run migrations in numerical order
3. Update backend.js to connect to PostgreSQL
4. Implement API endpoints for vendors and items CRUD operations
5. Update frontend forms to work with the new database structure
