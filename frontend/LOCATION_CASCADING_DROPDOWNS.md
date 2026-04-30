# Location Cascading Dropdowns - Frontend Implementation

## Overview
This implementation uses the `country-state-city` npm package to provide cascading dropdowns for Country → State → City selection. The form stores **ISO codes** (for country and state) in the database but displays **human-readable names** in the UI.

## Architecture

### Data Flow
```
UI (Names) → Form (Codes) → API (Codes) → Database (Codes)
Database (Codes) → API (Codes) → UI (Converts to Names)
```

### Key Components

#### 1. **Location Utilities** (`src/utils/locationUtils.ts`)
Provides functions to:
- Convert codes to names: `getCountryName()`, `getStateName()`
- Get dropdown options: `getAllCountries()`, `getStatesByCountry()`, `getCitiesByStateAndCountry()`
- Format addresses: `formatAddress()`

#### 2. **useLocationData Hook** (`src/hooks/useLocationData.ts`)
Custom hook that manages cascading dropdown logic:
- Automatically generates options based on selections
- Resets dependent fields when parent changes
- Memoizes options for performance

#### 3. **AddressDisplay Component** (`src/components/AddressDisplay.tsx`)
Displays formatted addresses with code-to-name conversion:
- `<AddressDisplay />` - Multi-line formatted address
- `<InlineAddressDisplay />` - Single-line address

## Usage Examples

### 1. Using in Forms (VendorForm)

```tsx
import { Select } from '@components/ui';
import { useLocationData } from '@/hooks/useLocationData';

// Inside your component
const billingLocation = useLocationData({
  watch,
  setValue,
  countryField: 'billingCountry',
  stateField: 'billingState',
  cityField: 'billingCity',
});

// In your JSX
<Select
  label="Country"
  {...register('billingCountry')}
  options={billingLocation.countryOptions}
  placeholder="Select country"
/>

<Select
  label="State"
  {...register('billingState')}
  options={billingLocation.stateOptions}
  placeholder="Select state"
  disabled={!watch('billingCountry')}
/>

<Select
  label="City"
  {...register('billingCity')}
  options={billingLocation.cityOptions}
  placeholder="Select city"
  disabled={!watch('billingState')}
/>
```

### 2. Displaying Addresses

```tsx
import { AddressDisplay } from '@/components/AddressDisplay';

<AddressDisplay
  label="Billing Address"
  addressLine1={vendor.billingAddressLine1}
  addressLine2={vendor.billingAddressLine2}
  city={vendor.billingCity}
  stateCode={vendor.billingState}      // "MH" converts to "Maharashtra"
  countryCode={vendor.billingCountry}  // "IN" converts to "India"
  zipCode={vendor.billingZipCode}
/>

// Or inline
<InlineAddressDisplay
  addressLine1={vendor.shippingAddressLine1}
  city={vendor.shippingCity}
  stateCode={vendor.shippingState}
  countryCode={vendor.shippingCountry}
  zipCode={vendor.shippingZipCode}
/>
```

### 3. Converting Codes in Table Cells

```tsx
import { getCountryName, getStateName } from '@/utils/locationUtils';

columnHelper.accessor('billingCountry', {
  header: 'Country',
  cell: (info) => getCountryName(info.getValue()) || '-',
});

columnHelper.accessor('billingState', {
  header: 'State',
  cell: (info) => {
    const vendor = info.row.original;
    return getStateName(info.getValue(), vendor.billingCountry) || '-';
  },
});
```

## Data Storage

### What Gets Stored in Database

| Field | Example Value | Type | Description |
|-------|---------------|------|-------------|
| `billingCountry` | `"IN"` | VARCHAR(2) | ISO 3166-1 alpha-2 code |
| `billingState` | `"MH"` | VARCHAR(10) | ISO 3166-2 state code |
| `billingCity` | `"Mumbai"` | VARCHAR(100) | City name (no code) |
| `shippingCountry` | `"US"` | VARCHAR(2) | ISO 3166-1 alpha-2 code |
| `shippingState` | `"NY"` | VARCHAR(10) | ISO 3166-2 state code |
| `shippingCity` | `"New York"` | VARCHAR(100) | City name (no code) |

### API Requests/Responses

**POST/PUT Request:**
```json
{
  "billingCountry": "IN",
  "billingState": "MH",
  "billingCity": "Mumbai"
}
```

**GET Response:**
```json
{
  "billingCountry": "IN",
  "billingState": "MH",
  "billingCity": "Mumbai"
}
```

Frontend converts these codes to display names in the UI.

## Common ISO Codes

### Popular Countries
- `US` - United States
- `IN` - India
- `GB` - United Kingdom
- `CA` - Canada
- `AU` - Australia

### Indian States
- `MH` - Maharashtra
- `DL` - Delhi
- `KA` - Karnataka
- `TN` - Tamil Nadu
- `GJ` - Gujarat

### US States
- `NY` - New York
- `CA` - California
- `TX` - Texas
- `FL` - Florida

## Benefits

✅ **Standardized Data**: ISO codes ensure consistency  
✅ **User-Friendly**: Users see full names, not codes  
✅ **Data Integrity**: Validation against known codes  
✅ **Internationalization**: Works for 250+ countries  
✅ **Cascading Logic**: State options filtered by country  
✅ **Smaller Database**: Codes take less space than full names  

## Validation

The Zod schema validates field lengths:

```typescript
billingCountry: z.string().max(2).optional().nullable(),     // ISO2 code
billingState: z.string().max(10).optional().nullable(),      // State code
billingCity: z.string().max(100).optional().nullable(),      // City name
```

## Troubleshooting

### Dropdown Not Showing Options
- Ensure country is selected before state
- Ensure state is selected before city
- Check that `country-state-city` package is installed

### Wrong State/City Names
- Verify the country code is correct
- Some countries may have limited state/city data in the library

### Form Submission Issues
- Verify codes (not names) are being sent to API
- Check validation schema allows codes (2 chars for country, 10 for state)

## Future Enhancements

- Add custom city input if city not found in dropdown
- Add search/filter functionality to dropdowns
- Cache location data for better performance
- Add internationalization for country/state names
