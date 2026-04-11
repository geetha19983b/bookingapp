# BookKeeping App - Database Design Summary

## Overview

A comprehensive PostgreSQL database design for a bookkeeping application similar to Zoho Books, focusing on vendor management and item inventory tracking.

## What Has Been Created

### 📁 Migration Scripts (`backend/migrations/`)

1. **001_create_vendors_table.sql**
   - Creates vendors table with complete GST/tax information
   - Includes billing & shipping addresses
   - Bank details support
   - Custom fields (JSONB) for extensibility
   - Automatic timestamp triggers
   - Comprehensive indexes

2. **002_create_items_table.sql**
   - Items (goods/services) table
   - Sales and purchase information
   - Tax rates (intra-state and inter-state)
   - Inventory tracking support
   - Image upload support
   - Links to preferred vendor

3. **003_create_contact_persons_table.sql**
   - Multiple contacts per vendor
   - Primary contact designation
   - Complete contact information

4. **004_create_vendor_items_history_table.sql**
   - Purchase transaction history
   - Tracks pricing over time
   - Links vendors to items with quantities and dates

5. **seed_data.sql**
   - Sample vendors (3 vendors)
   - Sample items (5 items - goods and services)
   - Contact persons
   - Purchase history records

6. **db_setup.sql**
   - Database creation commands
   - User and permissions setup

7. **rollback_all.sql**
   - Complete rollback script
   - Drops all tables and functions

### 📄 Configuration Files

1. **backend/.env.example**
   - Template for environment variables
   - Database configuration
   - Server settings

2. **backend/.env**
   - Actual environment configuration
   - Ready to use with default settings

3. **backend/package.json**
   - Updated with PostgreSQL dependencies (pg)
   - Added dotenv for environment variables
   - Migration scripts (migrate, seed, db:setup)
   - Development dependencies (nodemon)

### 🔧 Application Files

1. **backend/db.ts**
   - PostgreSQL connection pool
   - Query helper functions
   - Transaction support
   - Error handling and logging
   - Client management

2. **backend/run_migrations.js**
   - Automated migration runner
   - Runs all SQL files in order
   - Error handling
   - Connection testing

### 📖 Documentation

1. **DATABASE_SETUP.md**
   - Complete setup instructions
   - Step-by-step guide
   - Troubleshooting section
   - Common operations
   - SQL query examples
   - Maintenance commands

2. **DATABASE_ER_DIAGRAM.md**
   - Entity Relationship Diagram (ASCII art)
   - Table descriptions
   - Relationship explanations
   - Index documentation
   - Sample queries
   - Data type specifications

3. **backend/migrations/README.md**
   - Migration overview
   - Running instructions
   - Schema summary
   - Rollback procedures

## Database Schema

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **vendors** | Vendor master data | GST info, addresses, bank details, MSME status |
| **items** | Goods & services | Tax rates, sales/purchase info, inventory tracking |
| **contact_persons** | Vendor contacts | Multiple contacts per vendor, primary designation |
| **vendor_items_history** | Purchase transactions | Price history, PO/invoice tracking |

### Key Relationships

```
vendors (1) → (N) contact_persons
vendors (1) → (N) items [preferred_vendor]
vendors (1) → (N) vendor_items_history
items (1) → (N) vendor_items_history
```

### Special Features

#### ✅ Automatic Timestamps
- All tables have `created_at` and `updated_at`
- Triggers automatically update `updated_at` on modifications

#### ✅ Comprehensive Indexes
- Name and SKU lookups
- GST/PAN searches
- Date-based queries
- Composite indexes for complex queries
- GIN indexes for JSONB and array fields

#### ✅ Data Integrity
- Foreign key constraints with appropriate CASCADE rules
- CHECK constraints for data validation
- UNIQUE constraints where needed
- NOT NULL constraints for required fields

#### ✅ Extensibility
- JSONB custom_fields for flexible data storage
- Array types for tags and reporting
- Proper normalization while maintaining performance

## Fields Mapped from Zoho Books Forms

### Vendor Form Fields ✅
- [x] Primary Contact (salutation, first name, last name)
- [x] Company Name
- [x] Display Name (required, unique)
- [x] Email Address
- [x] Phone (work phone, mobile)
- [x] GST Treatment
- [x] Source of Supply
- [x] PAN
- [x] MSME Registered
- [x] Currency
- [x] Opening Balance
- [x] Payment Terms
- [x] Address (billing & shipping)
- [x] Contact Persons (separate table)
- [x] Bank Details
- [x] Custom Fields (JSONB)
- [x] Reporting Tags (array)
- [x] Remarks

### Item Form Fields ✅
- [x] Type (Goods/Service)
- [x] Name (required)
- [x] SKU
- [x] Unit
- [x] HSN Code
- [x] Tax Preference
- [x] Unit (required)
- [x] Sales Information
  - [x] Sellable checkbox
  - [x] Selling Price
  - [x] Account
  - [x] Description
- [x] Purchase Information
  - [x] Purchasable checkbox
  - [x] Cost Price
  - [x] Account
  - [x] Description
  - [x] Preferred Vendor
- [x] Default Tax Rates
  - [x] Intra State Tax Rate
  - [x] Inter State Tax Rate
- [x] Track Inventory checkbox
- [x] Image upload

## Installation & Setup

### Quick Setup (3 Steps)

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create database
psql -U postgres -c "CREATE DATABASE bookkeeping_db;"

# 3. Run migrations and seed data
npm run db:setup
```

### Manual Setup

```bash
# Install dependencies
npm install

# Edit .env file with your database credentials
notepad .env

# Run migrations
npm run migrate

# Load sample data
npm run seed
```

## What's Next?

### Immediate Next Steps

1. **Update Backend API** (backend.ts)
   - Replace JSON file storage with PostgreSQL
   - Create API endpoints for vendors:
     - `GET /api/vendors` - List all vendors
     - `POST /api/vendors` - Create vendor
     - `GET /api/vendors/:id` - Get vendor details
     - `PUT /api/vendors/:id` - Update vendor
     - `DELETE /api/vendors/:id` - Delete vendor
   - Create API endpoints for items:
     - `GET /api/items` - List all items
     - `POST /api/items` - Create item
     - `GET /api/items/:id` - Get item details
     - `PUT /api/items/:id` - Update item
     - `DELETE /api/items/:id` - Delete item

2. **Update Frontend Forms**
   - Connect vendor form to new API
   - Connect item form to new API
   - Add vendor selection dropdown in item form
   - Implement image upload for items

3. **Add Features**
   - Contact persons management
   - Purchase history tracking
   - Inventory management
   - Reports and analytics

### Future Enhancements

- [ ] Customer management
- [ ] Invoice creation
- [ ] Purchase orders
- [ ] Inventory tracking
- [ ] GST reports
- [ ] Financial reports
- [ ] Multi-user support with authentication
- [ ] Audit logs
- [ ] Export to PDF/Excel
- [ ] Email notifications

## Dependencies

### Backend Dependencies
```json
{
  "express": "^5.2.1",
  "pg": "^8.13.1",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5"
}
```

### Dev Dependencies
```json
{
  "nodemon": "^3.1.9"
}
```

## NPM Scripts

```bash
npm start          # Start the server
npm run dev        # Start with auto-reload (development)
npm run migrate    # Run database migrations
npm run seed       # Load sample data
npm run db:setup   # Run migrations + seed data
```

## File Structure

```
BookKeepingApp/
├── backend/
│   ├── migrations/
│   │   ├── 001_create_vendors_table.sql
│   │   ├── 002_create_items_table.sql
│   │   ├── 003_create_contact_persons_table.sql
│   │   ├── 004_create_vendor_items_history_table.sql
│   │   ├── seed_data.sql
│   │   ├── db_setup.sql
│   │   ├── rollback_all.sql
│   │   └── README.md
│   ├── backend.ts                 # Main server file
│   ├── db.ts                      # Database connection module
│   ├── run_migrations.js          # Migration runner
│   ├── package.json               # Updated with pg dependencies
│   ├── .env                       # Environment configuration
│   └── .env.example               # Environment template
├── frontend/                      # Existing frontend files
├── DATABASE_SETUP.md              # Complete setup guide
├── DATABASE_ER_DIAGRAM.md         # Schema documentation
└── readme.md                      # Main readme
```

## Support & Resources

### Documentation
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [node-postgres (pg) Library](https://node-postgres.com/)
- [Express.js Guide](https://expressjs.com/)

### Database Tools
- **pgAdmin** - GUI for PostgreSQL management
- **DBeaver** - Universal database tool
- **TablePlus** - Modern database GUI

### Testing Database

Use the provided seed data to test the setup:
- 3 sample vendors with different configurations
- 5 sample items (3 goods, 2 services)
- Multiple contact persons
- Purchase history records

## Validation Checklist

- [x] Vendors table created with all required fields
- [x] Items table created with goods/service support
- [x] Contact persons table for multiple contacts
- [x] Purchase history tracking
- [x] GST/Tax information fields
- [x] Addresses (billing & shipping)
- [x] Bank details
- [x] Inventory tracking support
- [x] Image upload support
- [x] Custom fields (JSONB)
- [x] Automatic timestamps
- [x] Proper indexes
- [x] Foreign key relationships
- [x] Sample data
- [x] Migration scripts
- [x] Rollback scripts
- [x] Documentation
- [x] Connection module
- [x] Environment configuration

## Success Criteria Met ✅

1. ✅ Database design covers all fields from attached forms
2. ✅ PostgreSQL migration scripts created
3. ✅ Proper relationships established (vendors ↔ items)
4. ✅ Support for adding and maintaining vendors
5. ✅ Support for adding and editing items for vendors
6. ✅ GST/tax information captured
7. ✅ Contact management
8. ✅ Purchase history tracking
9. ✅ Comprehensive documentation
10. ✅ Easy setup and installation process

---

**Status:** Database design complete and ready for use!  
**Next Action:** Run `npm install` and `npm run db:setup` in the backend directory.
