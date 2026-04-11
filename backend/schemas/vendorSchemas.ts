import { z } from 'zod';

const nullableTrimmedString = (maxLength: number) =>
  z.preprocess(
    (value) => {
      if (value === undefined) {
        return undefined;
      }
      if (value === null) {
        return null;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed;
      }
      return value;
    },
    z.string().max(maxLength).nullable().optional()
  );

const emailSchema = z
  .preprocess(
    (value) => {
      if (value === undefined) {
        return undefined;
      }
      if (value === null) {
        return null;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed;
      }
      return value;
    },
    z.string().email('email must be a valid email address').max(255).nullable().optional()
  );

const gstinSchema = z
  .preprocess(
    (value) => {
      if (value === undefined) {
        return undefined;
      }
      if (value === null) {
        return null;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed.toUpperCase();
      }
      return value;
    },
    z
      .string()
      .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/, 'gstin format is invalid')
      .nullable()
      .optional()
  );

const panSchema = z
  .preprocess(
    (value) => {
      if (value === undefined) {
        return undefined;
      }
      if (value === null) {
        return null;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed.toUpperCase();
      }
      return value;
    },
    z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'pan format is invalid').nullable().optional()
  );

const ifscSchema = z
  .preprocess(
    (value) => {
      if (value === undefined) {
        return undefined;
      }
      if (value === null) {
        return null;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed.toUpperCase();
      }
      return value;
    },
    z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'bank_ifsc_code format is invalid').nullable().optional()
  );

const currencySchema = z
  .preprocess(
    (value) => {
      if (value === undefined) {
        return undefined;
      }
      if (value === null) {
        return null;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed.toUpperCase();
      }
      return value;
    },
    z.string().regex(/^[A-Z]{3}$/, 'currency must be a 3-letter ISO code').nullable().optional()
  );

const vendorBaseSchema = z.object({
  company_name: nullableTrimmedString(255),
  display_name: nullableTrimmedString(255),
  email: emailSchema,
  work_phone: nullableTrimmedString(20),
  mobile_phone: nullableTrimmedString(20),
  billing_address_line1: nullableTrimmedString(255),
  billing_address_line2: nullableTrimmedString(255),
  billing_city: nullableTrimmedString(100),
  billing_state: nullableTrimmedString(100),
  billing_country: nullableTrimmedString(100),
  billing_zip_code: nullableTrimmedString(20),
  shipping_address_line1: nullableTrimmedString(255),
  shipping_address_line2: nullableTrimmedString(255),
  shipping_city: nullableTrimmedString(100),
  shipping_state: nullableTrimmedString(100),
  shipping_country: nullableTrimmedString(100),
  shipping_zip_code: nullableTrimmedString(20),
  gst_treatment: nullableTrimmedString(100),
  gstin: gstinSchema,
  source_of_supply: nullableTrimmedString(100),
  pan: panSchema,
  is_msme_registered: z.boolean().optional(),
  currency: currencySchema,
  opening_balance: z.coerce.number().finite().optional(),
  payment_terms: nullableTrimmedString(100),
  bank_name: nullableTrimmedString(255),
  bank_account_number: nullableTrimmedString(50),
  bank_ifsc_code: ifscSchema,
  bank_branch: nullableTrimmedString(255),
  remarks: nullableTrimmedString(10000),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
  reporting_tags: z.array(z.string().trim().min(1)).optional(),
  is_active: z.boolean().optional(),
  created_by: nullableTrimmedString(100),
  updated_by: nullableTrimmedString(100),
});

export const createVendorBodySchema = vendorBaseSchema.extend({
  display_name: z.string().trim().min(1, 'display_name is required').max(255),
});

export const updateVendorBodySchema = vendorBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one valid field is required for update',
});

export const vendorIdParamsSchema = z.object({
  id: z.coerce.number().int().positive('vendor id must be a positive integer'),
});

export type CreateVendorBody = z.infer<typeof createVendorBodySchema>;
export type UpdateVendorBody = z.infer<typeof updateVendorBodySchema>;
export type VendorIdParams = z.infer<typeof vendorIdParamsSchema>;

export const parseBody = <T>(schema: z.ZodSchema<T>, body: unknown): T => schema.parse(body);
export const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown): T => schema.parse(params);
