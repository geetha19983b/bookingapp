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

const zipCodeSchema = z
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
    z
      .string()
      .regex(
        /^[A-Z0-9][A-Z0-9\s-]{0,18}[A-Z0-9]$/i,
        'zip_code must be alphanumeric with optional spaces or hyphens (e.g., 12345, 12345-6789, 400001, SW1A 1AA)'
      )
      .nullable()
      .optional()
  );

const phoneSchema = z
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
    z
      .string()
      .regex(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
        'phone must be a valid phone number (e.g., 1234567890, +91-1234567890, (123) 456-7890)'
      )
      .nullable()
      .optional()
  );

const stateCodeSchema = z
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
      .regex(/^[A-Z0-9]{2,10}$/, 'state must be a valid ISO code (e.g., NY, CA, MH, DL)')
      .nullable()
      .optional()
  );

const countryCodeSchema = z
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
      .regex(/^[A-Z]{2}$/, 'country must be a 2-letter ISO code (e.g., US, IN, GB)')
      .nullable()
      .optional()
  );

const bankAccountSchema = z
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
    z
      .string()
      .regex(/^[A-Z0-9]{6,34}$/i, 'bank_account_number must be alphanumeric, 6-34 characters')
      .nullable()
      .optional()
  );

const vendorBaseSchema = z.object({
  companyName: nullableTrimmedString(255),
  displayName: nullableTrimmedString(255),
  email: emailSchema,
  workPhone: phoneSchema,
  mobilePhone: phoneSchema,
  billingAddressLine1: nullableTrimmedString(255),
  billingAddressLine2: nullableTrimmedString(255),
  billingCity: nullableTrimmedString(100),
  billingState: stateCodeSchema,
  billingCountry: countryCodeSchema,
  billingZipCode: zipCodeSchema,
  shippingAddressLine1: nullableTrimmedString(255),
  shippingAddressLine2: nullableTrimmedString(255),
  shippingCity: nullableTrimmedString(100),
  shippingState: stateCodeSchema,
  shippingCountry: countryCodeSchema,
  shippingZipCode: zipCodeSchema,
  gstTreatment: nullableTrimmedString(100),
  gstin: gstinSchema,
  sourceOfSupply: nullableTrimmedString(100),
  pan: panSchema,
  isMsmeRegistered: z.boolean().optional(),
  currency: currencySchema,
  openingBalance: z.coerce.number().finite().optional(),
  paymentTerms: nullableTrimmedString(100),
  bankName: nullableTrimmedString(255),
  bankAccountNumber: bankAccountSchema,
  bankIfscCode: ifscSchema,
  bankBranch: nullableTrimmedString(255),
  remarks: nullableTrimmedString(10000),
  customFields: z.record(z.string(), z.unknown()).optional(),
  reportingTags: z.array(z.string().trim().min(1)).optional(),
  isActive: z.boolean().optional(),
  createdBy: nullableTrimmedString(100),
  updatedBy: nullableTrimmedString(100),
});

export const createVendorBodySchema = vendorBaseSchema.extend({
  displayName: z.string().trim().min(1, 'displayName is required').max(255),
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
