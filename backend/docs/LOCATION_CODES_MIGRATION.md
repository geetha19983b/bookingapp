# Location Codes Migration Guide

## Overview
The database schema has been updated to store **ISO codes** instead of full names for country and state fields, enabling better integration with cascading dropdown libraries and standardized data storage.

## Schema Changes

### Modified Fields in `Vendor` Model

| Field | Old Type | New Type | Stores | Example |
|-------|----------|----------|--------|---------|
| `billingCountry` | VARCHAR(100) | VARCHAR(2) | ISO2 Country Code | "US", "IN", "GB" |
| `billingState` | VARCHAR(100) | VARCHAR(10) | State ISO Code | "NY", "MH", "CA" |
| `billingCity` | VARCHAR(100) | VARCHAR(100) | City Name (unchanged) | "Mumbai", "New York" |
| `shippingCountry` | VARCHAR(100) | VARCHAR(2) | ISO2 Country Code | "US", "IN", "GB" |
| `shippingState` | VARCHAR(100) | VARCHAR(10) | State ISO Code | "NY", "MH", "CA" |
| `shippingCity` | VARCHAR(100) | VARCHAR(100) | City Name (unchanged) | "Mumbai", "New York" |

### Why These Changes?
- **Country Codes**: Use ISO 3166-1 alpha-2 standard (2 letters)
- **State Codes**: Use ISO 3166-2 standard subdivision codes (typically 2-3 characters)
- **City Names**: No international standard exists, so we continue storing names
- **Benefits**: 
  - Standardized data across the system
  - Works seamlessly with `country-state-city` npm package
  - Better data validation and integrity
  - Smaller storage footprint

## Migration Strategy

### ❌ You DO NOT Need to Drop and Recreate the Database!

Prisma Migrate will handle the schema changes automatically. However, you have two options based on whether you have existing data:

---

## Option 1: Fresh Database (No Existing Data)

If your database is empty or you're okay with losing data:

```powershell
# Reset database and apply new schema
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run seed script (with updated codes)
```

---

## Option 2: Existing Database with Data (Recommended)

If you have existing vendor data that you want to preserve:

### Step 1: Create the Migration

```powershell
# Generate migration for schema changes
npx prisma migrate dev --name update_location_codes

# This creates a migration that:
# - Changes column types from VARCHAR(100) to VARCHAR(2) for countries
# - Changes column types from VARCHAR(100) to VARCHAR(10) for states
```

### Step 2: Data Transformation Required

**⚠️ Important**: Prisma will **not** automatically convert your existing data from names to codes!

You need to create a data migration script to transform existing data. Here's an example:

```typescript
// migration-scripts/convert-location-codes.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping of common country names to ISO2 codes
const countryNameToCode: Record<string, string> = {
  'USA': 'US',
  'United States': 'US',
  'India': 'IN',
  'United Kingdom': 'GB',
  'UK': 'GB',
  'Canada': 'CA',
  // Add more mappings as needed
};

// Mapping of state names to codes (example for US and India)
const stateNameToCode: Record<string, string> = {
  // US States
  'New York': 'NY',
  'California': 'CA',
  'Texas': 'TX',
  // Indian States
  'Maharashtra': 'MH',
  'Karnataka': 'KA',
  'Tamil Nadu': 'TN',
  // Add more mappings as needed
};

async function migrateLocationData() {
  const vendors = await prisma.vendor.findMany();
  
  for (const vendor of vendors) {
    const updates: any = {};
    
    // Convert billing country
    if (vendor.billingCountry && countryNameToCode[vendor.billingCountry]) {
      updates.billingCountry = countryNameToCode[vendor.billingCountry];
    }
    
    // Convert billing state
    if (vendor.billingState && stateNameToCode[vendor.billingState]) {
      updates.billingState = stateNameToCode[vendor.billingState];
    }
    
    // Convert shipping country
    if (vendor.shippingCountry && countryNameToCode[vendor.shippingCountry]) {
      updates.shippingCountry = countryNameToCode[vendor.shippingCountry];
    }
    
    // Convert shipping state
    if (vendor.shippingState && stateNameToCode[vendor.shippingState]) {
      updates.shippingState = stateNameToCode[vendor.shippingState];
    }
    
    // Update the vendor if any changes were made
    if (Object.keys(updates).length > 0) {
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: updates,
      });
      console.log(`Updated vendor ${vendor.displayName}`);
    }
  }
}

migrateLocationData()
  .then(() => console.log('Migration completed'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Step 3: Run the Data Migration

```powershell
# Run the data transformation script
npx ts-node migration-scripts/convert-location-codes.ts
```

---

## Seed Data Updates

The seed data has been updated to use ISO codes:

### Before:
```typescript
billingCountry: 'USA',           // Full name
billingState: 'Maharashtra',      // Full name
```

### After:
```typescript
billingCountry: 'US',            // ISO2 code
billingState: 'MH',              // State code
```

---

## Frontend Integration

The frontend will use the `country-state-city` npm package to:
1. **Display**: Convert codes → names for user-friendly display
2. **Submit**: Send codes to the backend when saving
3. **Cascading Dropdowns**: Auto-populate states based on country, cities based on state

Example:
```typescript
// User sees: "United States"
// Stored in DB: "US"
// User sees: "New York"
// Stored in DB: "NY"
```

---

## Common ISO Codes Reference

### Countries
| Code | Country |
|------|---------|
| US | United States |
| IN | India |
| GB | United Kingdom |
| CA | Canada |
| AU | Australia |

### Indian States
| Code | State |
|------|-------|
| MH | Maharashtra |
| KA | Karnataka |
| TN | Tamil Nadu |
| DL | Delhi |
| GJ | Gujarat |

### US States
| Code | State |
|------|-------|
| NY | New York |
| CA | California |
| TX | Texas |
| FL | Florida |

---

## Rollback Plan

If you need to rollback:

```powershell
# Rollback the last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Or reset to a specific migration
npx prisma migrate reset
```

---

## Summary

✅ **Schema Updated**: Country and state fields now store ISO codes  
✅ **Seed Data Updated**: Uses proper ISO codes  
✅ **No Drop Required**: Use Prisma migrate to transform the schema  
⚠️ **Data Migration Needed**: If you have existing data, create a conversion script  
🔄 **Frontend Ready**: Will work seamlessly with `country-state-city` package

---

## Next Steps

1. Review this migration guide
2. Choose Option 1 (fresh DB) or Option 2 (preserve data)
3. Run the appropriate migration commands
4. Install `country-state-city` package in frontend
5. Update VendorForm component to use cascading dropdowns
