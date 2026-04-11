import { query } from '../db';
import type { CreateVendorBody, UpdateVendorBody } from '../schemas/vendorSchemas';

type VendorColumn =
  | 'company_name'
  | 'display_name'
  | 'email'
  | 'work_phone'
  | 'mobile_phone'
  | 'billing_address_line1'
  | 'billing_address_line2'
  | 'billing_city'
  | 'billing_state'
  | 'billing_country'
  | 'billing_zip_code'
  | 'shipping_address_line1'
  | 'shipping_address_line2'
  | 'shipping_city'
  | 'shipping_state'
  | 'shipping_country'
  | 'shipping_zip_code'
  | 'gst_treatment'
  | 'gstin'
  | 'source_of_supply'
  | 'pan'
  | 'is_msme_registered'
  | 'currency'
  | 'opening_balance'
  | 'payment_terms'
  | 'bank_name'
  | 'bank_account_number'
  | 'bank_ifsc_code'
  | 'bank_branch'
  | 'remarks'
  | 'custom_fields'
  | 'reporting_tags'
  | 'is_active'
  | 'created_by'
  | 'updated_by';

const VENDOR_COLUMNS: VendorColumn[] = [
  'company_name',
  'display_name',
  'email',
  'work_phone',
  'mobile_phone',
  'billing_address_line1',
  'billing_address_line2',
  'billing_city',
  'billing_state',
  'billing_country',
  'billing_zip_code',
  'shipping_address_line1',
  'shipping_address_line2',
  'shipping_city',
  'shipping_state',
  'shipping_country',
  'shipping_zip_code',
  'gst_treatment',
  'gstin',
  'source_of_supply',
  'pan',
  'is_msme_registered',
  'currency',
  'opening_balance',
  'payment_terms',
  'bank_name',
  'bank_account_number',
  'bank_ifsc_code',
  'bank_branch',
  'remarks',
  'custom_fields',
  'reporting_tags',
  'is_active',
  'created_by',
  'updated_by',
];

export interface VendorRecord {
  id: number;
  display_name: string;
  [key: string]: unknown;
}

type VendorPayload = CreateVendorBody | UpdateVendorBody;

const buildInsertQuery = (payload: VendorPayload): { sql: string; values: unknown[] } => {
  const payloadRecord = payload as Record<string, unknown>;
  const keys = Object.keys(payloadRecord).filter((key): key is VendorColumn =>
    VENDOR_COLUMNS.includes(key as VendorColumn)
  );

  const columns = keys.join(', ');
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
  const values = keys.map((key) => payloadRecord[key]);

  return {
    sql: `INSERT INTO vendors (${columns}) VALUES (${placeholders}) RETURNING *`,
    values,
  };
};

const buildUpdateQuery = (vendorId: number, payload: UpdateVendorBody): { sql: string; values: unknown[] } => {
  const payloadRecord = payload as Record<string, unknown>;
  const keys = Object.keys(payloadRecord).filter((key): key is VendorColumn =>
    VENDOR_COLUMNS.includes(key as VendorColumn)
  );
  const updates = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = keys.map((key) => payloadRecord[key]);

  return {
    sql: `UPDATE vendors SET ${updates} WHERE id = $${keys.length + 1} RETURNING *`,
    values: [...values, vendorId],
  };
};

export const createVendor = async (payload: CreateVendorBody): Promise<VendorRecord> => {
  const { sql, values } = buildInsertQuery(payload);
  const result = await query<VendorRecord>(sql, values);
  return result.rows[0];
};

export const updateVendor = async (vendorId: number, payload: UpdateVendorBody): Promise<VendorRecord | null> => {
  const { sql, values } = buildUpdateQuery(vendorId, payload);
  const result = await query<VendorRecord>(sql, values);
  return result.rows[0] || null;
};

export const deleteVendor = async (vendorId: number): Promise<{ id: number } | null> => {
  const result = await query<{ id: number }>('DELETE FROM vendors WHERE id = $1 RETURNING id', [vendorId]);
  return result.rows[0] || null;
};
