/**
 * Tax-related constants for items
 */

import type { SelectOption } from '@components/ui';

export interface TaxRateOption extends SelectOption {
  percentage: number;
}

/**
 * Tax Preference Options
 */
export const TAX_PREFERENCE_OPTIONS: SelectOption[] = [
  { value: 'taxable', label: 'Taxable' },
  { value: 'non-taxable', label: 'Non-Taxable' },
  { value: 'out-of-scope', label: 'Out of Scope' },
  { value: 'non-gst-supply', label: 'Non-GST Supply' },
];

/**
 * GST Tax Rates for Intra State (within same state)
 * Uses CGST + SGST structure
 */
export const INTRA_STATE_TAX_RATES: TaxRateOption[] = [
  { value: '', label: 'Tax Group', percentage: 0, disabled: true },
  { value: 'GST0 [0%]', label: 'GST0 [0%]', percentage: 0 },
  { value: 'GST5 [5%]', label: 'GST5 [5%]', percentage: 5 },
  { value: 'GST12 [12%]', label: 'GST12 [12%]', percentage: 12 },
  { value: 'GST18 [18%]', label: 'GST18 [18%]', percentage: 18 },
  { value: 'GST28 [28%]', label: 'GST28 [28%]', percentage: 28 },
  { value: 'GST40 [40%]', label: 'GST40 [40%]', percentage: 40 },
];

/**
 * GST Tax Rates for Inter State (across states)
 * Uses IGST structure
 */
export const INTER_STATE_TAX_RATES: TaxRateOption[] = [
  { value: '', label: 'Tax Group', percentage: 0, disabled: true },
  { value: 'IGST0 [0%]', label: 'IGST0 [0%]', percentage: 0 },
  { value: 'IGST5 [5%]', label: 'IGST5 [5%]', percentage: 5 },
  { value: 'IGST12 [12%]', label: 'IGST12 [12%]', percentage: 12 },
  { value: 'IGST18 [18%]', label: 'IGST18 [18%]', percentage: 18 },
  { value: 'IGST28 [28%]', label: 'IGST28 [28%]', percentage: 28 },
  { value: 'IGST40 [40%]', label: 'IGST40 [40%]', percentage: 40 },
];

/**
 * Currency code for India
 */
export const CURRENCY_CODE = 'INR';
