# Database Entity Relationship Diagram

## Overview

This document describes the database schema for the BookKeeping application. The database is designed to support vendor management and item inventory tracking similar to Zoho Books.

## Tables

### 1. vendors
**Purpose:** Store vendor/supplier master data

**Relationships:**
- One vendor can have many contact_persons (1:N)
- One vendor can be preferred vendor for many items (1:N)
- One vendor can have many purchase transactions (1:N)

**Key Columns:**
- `id` (PK) - Serial primary key
- `display_name` (UNIQUE, NOT NULL) - Vendor display name
- `gstin` - GST Identification Number
- `pan` - Permanent Account Number
- `is_msme_registered` - MSME registration flag

---

### 2. items
**Purpose:** Store goods and services information

**Relationships:**
- One item can belong to one preferred vendor (N:1 to vendors)
- One item can have many purchase transactions (1:N)

**Key Columns:**
- `id` (PK) - Serial primary key
- `item_type` - 'goods' or 'service'
- `name` (NOT NULL) - Item name
- `sku` (UNIQUE) - Stock Keeping Unit
- `preferred_vendor_id` (FK) - References vendors(id)

---

### 3. contact_persons
**Purpose:** Store multiple contact persons for each vendor

**Relationships:**
- Many contact_persons belong to one vendor (N:1 to vendors)

**Key Columns:**
- `id` (PK) - Serial primary key
- `vendor_id` (FK, NOT NULL) - References vendors(id)
- `is_primary` - Primary contact flag

---

### 4. vendor_items_history
**Purpose:** Track purchase transactions between vendors and items

**Relationships:**
- Many transactions belong to one vendor (N:1 to vendors)
- Many transactions belong to one item (N:1 to items)

**Key Columns:**
- `id` (PK) - Serial primary key
- `vendor_id` (FK, NOT NULL) - References vendors(id)
- `item_id` (FK, NOT NULL) - References items(id)
- `purchase_price` - Price at time of purchase
- `purchase_date` - Date of purchase

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────┐
│                    vendors                       │
│─────────────────────────────────────────────────│
│ • id (PK)                                        │
│   display_name (UNIQUE, NOT NULL)                │
│   company_name                                   │
│   first_name, last_name                          │
│   email, work_phone, mobile_phone                │
│   billing_address_*, shipping_address_*          │
│   gstin, pan, gst_treatment, source_of_supply    │
│   is_msme_registered                             │
│   currency, opening_balance, payment_terms       │
│   bank_name, bank_account_number, bank_ifsc_code │
│   is_active, created_at, updated_at              │
└────────────┬────────────────────────────┬────────┘
             │                            │
             │ 1                          │ 1
             │                            │
             │ N                          │ N
             │                            │
┌────────────▼──────────────┐   ┌────────▼─────────────────────────────────┐
│   contact_persons          │   │              items                        │
│────────────────────────────│   │───────────────────────────────────────────│
│ • id (PK)                  │   │ • id (PK)                                 │
│ ○ vendor_id (FK)           │   │   item_type ('goods'/'service')           │
│   salutation               │   │   name (NOT NULL)                         │
│   first_name, last_name    │   │   sku (UNIQUE)                            │
│   email                    │   │   unit, hsn_code                          │
│   work_phone, mobile_phone │   │   tax_preference                          │
│   designation, department  │   │   intra_state_tax_*, inter_state_tax_*    │
│   is_primary               │   │   is_sellable, selling_price              │
│   created_at, updated_at   │   │   sales_account, sales_description        │
└────────────────────────────┘   │   is_purchasable, cost_price              │
                                 │   purchase_account, purchase_description  │
                                 │ ○ preferred_vendor_id (FK)                │
                                 │   track_inventory, opening_stock          │
                                 │   image_url, image_urls[]                 │
                                 │   is_active, created_at, updated_at       │
                                 └────────────┬──────────────────────────────┘
                                              │
                                              │ 1
                                              │
                                              │ N
                                              │
                      ┌───────────────────────▼───────────────────────────┐
                      │         vendor_items_history                      │
                      │───────────────────────────────────────────────────│
                      │ • id (PK)                                         │
                      │ ○ vendor_id (FK) ────┐                           │
                      │ ○ item_id (FK) ──────┘                           │
                      │   purchase_price (NOT NULL)                       │
                      │   quantity, unit                                  │
                      │   purchase_order_number, invoice_number           │
                      │   purchase_date                                   │
                      │   notes                                           │
                      │   created_at, updated_at                          │
                      └───────────────────────────────────────────────────┘

Legend:
  • Primary Key
  ○ Foreign Key
  1 - One
  N - Many
  * - Multiple related columns
```

## Relationships Summary

1. **vendors ↔ contact_persons**
   - Type: One-to-Many
   - Cascade: ON DELETE CASCADE
   - Description: Each vendor can have multiple contact persons

2. **vendors ↔ items**
   - Type: One-to-Many (via preferred_vendor_id)
   - Cascade: ON DELETE SET NULL
   - Description: Each vendor can be the preferred vendor for multiple items

3. **vendors ↔ vendor_items_history**
   - Type: One-to-Many
   - Cascade: ON DELETE CASCADE
   - Description: Each vendor can have multiple purchase transactions

4. **items ↔ vendor_items_history**
   - Type: One-to-Many
   - Cascade: ON DELETE CASCADE
   - Description: Each item can have multiple purchase transactions

## Indexes

### vendors
- `idx_vendors_display_name` - For quick vendor lookup
- `idx_vendors_email` - For email searches
- `idx_vendors_gstin` - For GST number searches
- `idx_vendors_is_active` - For filtering active vendors
- `idx_vendors_created_at` - For date-based queries

### items
- `idx_items_name` - For item name searches
- `idx_items_sku` - For SKU lookups
- `idx_items_item_type` - For filtering goods vs services
- `idx_items_hsn_code` - For HSN code searches
- `idx_items_preferred_vendor` - For vendor-item relationships
- `idx_items_is_active` - For filtering active items
- `idx_items_custom_fields` (GIN) - For JSONB searches
- `idx_items_tags` (GIN) - For array searches

### contact_persons
- `idx_contact_persons_vendor_id` - For vendor-contact relationships
- `idx_contact_persons_email` - For email lookups
- `idx_contact_persons_is_primary` - For primary contact filtering

### vendor_items_history
- `idx_vendor_items_history_vendor_id` - For vendor transactions
- `idx_vendor_items_history_item_id` - For item transactions
- `idx_vendor_items_history_purchase_date` - For date-based queries
- `idx_vendor_items_history_composite` - For complex queries

## Triggers

All tables have automatic timestamp triggers:
- `trigger_vendors_updated_at`
- `trigger_items_updated_at`
- `trigger_contact_persons_updated_at`
- `trigger_vendor_items_history_updated_at`

These triggers automatically update the `updated_at` column whenever a row is modified.

## Data Types

### Decimal Precision
- Monetary values: `DECIMAL(15, 2)` - Up to 999,999,999,999.99
- Tax percentages: `DECIMAL(5, 2)` - Up to 999.99%
- Quantities: `DECIMAL(15, 2)` - Up to 999,999,999,999.99 units

### String Lengths
- Names: `VARCHAR(100)` or `VARCHAR(255)`
- Email: `VARCHAR(255)`
- Phone: `VARCHAR(20)`
- GST: `VARCHAR(15)`
- PAN: `VARCHAR(10)`
- IFSC: `VARCHAR(11)`
- Text fields: `TEXT` (unlimited)

### Special Types
- `JSONB` - For custom_fields (structured, indexable JSON)
- `TEXT[]` - For tags and arrays (PostgreSQL array type)
- `TIMESTAMP` - For date/time with timezone support
- `BOOLEAN` - For flags (is_active, is_primary, etc.)

## Sample Queries

### Get all items with vendor details
```sql
SELECT 
    i.id, i.name, i.sku, i.selling_price, i.cost_price,
    v.display_name as vendor_name,
    v.email as vendor_email
FROM items i
LEFT JOIN vendors v ON i.preferred_vendor_id = v.id
WHERE i.is_active = true
ORDER BY i.name;
```

### Get vendor with all contacts
```sql
SELECT 
    v.display_name,
    json_agg(
        json_build_object(
            'name', cp.first_name || ' ' || cp.last_name,
            'email', cp.email,
            'phone', cp.work_phone,
            'is_primary', cp.is_primary
        )
    ) as contacts
FROM vendors v
LEFT JOIN contact_persons cp ON v.id = cp.vendor_id
WHERE v.id = 1
GROUP BY v.id, v.display_name;
```

### Purchase history report
```sql
SELECT 
    v.display_name as vendor,
    i.name as item,
    i.sku,
    h.purchase_price,
    h.quantity,
    h.purchase_date,
    h.invoice_number,
    (h.purchase_price * h.quantity) as total_amount
FROM vendor_items_history h
JOIN vendors v ON h.vendor_id = v.id
JOIN items i ON h.item_id = i.id
WHERE h.purchase_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY h.purchase_date DESC;
```
