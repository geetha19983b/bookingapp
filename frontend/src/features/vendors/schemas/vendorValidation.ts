import { z } from 'zod';

/**
 * Vendor Form Validation Schema
 * Uses Zod for type-safe runtime validation with React Hook Form
 */

// Helper function for zip code validation
const createZipCodeValidation = () =>
  z
    .string()
    .regex(
      /^[A-Z0-9][A-Z0-9\s-]{0,18}[A-Z0-9]$/i,
      'Invalid zip code format (e.g., 12345, 12345-6789, 400001, SW1A 1AA)'
    )
    .optional()
    .nullable()
    .or(z.literal(''));

// Helper function for phone validation
const createPhoneValidation = () =>
  z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
      'Invalid phone number (e.g., 1234567890, +91-1234567890, (123) 456-7890)'
    )
    .optional()
    .nullable()
    .or(z.literal(''));

// Helper function for state code validation
const createStateCodeValidation = () =>
  z
    .string()
    .regex(/^[A-Z0-9]{2,10}$/i, 'Invalid state code (e.g., NY, CA, MH, DL)')
    .optional()
    .nullable()
    .or(z.literal(''));

// Helper function for country code validation
const createCountryCodeValidation = () =>
  z
    .string()
    .regex(/^[A-Z]{2}$/i, 'Invalid country code (must be 2-letter ISO code, e.g., US, IN, GB)')
    .optional()
    .nullable()
    .or(z.literal(''));

// Helper function for bank account validation
const createBankAccountValidation = () =>
  z
    .string()
    .regex(/^[A-Z0-9]{6,34}$/i, 'Invalid bank account number (must be alphanumeric, 6-34 characters)')
    .optional()
    .nullable()
    .or(z.literal(''));

// Helper function for currency validation
const createCurrencyValidation = () =>
  z
    .string()
    .regex(/^[A-Z]{3}$/i, 'Invalid currency code (must be 3-letter ISO code, e.g., USD, INR, GBP)')
    .max(3);

export const vendorFormSchema = z.object({
  // Basic Details
  displayName: z.string().min(1, 'Display name is required').max(255),
  companyName: z.string().max(255).optional().nullable(),
  email: z.string().email('Invalid email address').max(255).optional().nullable().or(z.literal('')),
  workPhone: createPhoneValidation(),
  mobilePhone: createPhoneValidation(),
  
  // Billing Address
  billingAddressLine1: z.string().max(255).optional().nullable(),
  billingAddressLine2: z.string().max(255).optional().nullable(),
  billingCity: z.string().max(100).optional().nullable(),
  billingState: createStateCodeValidation(),
  billingCountry: createCountryCodeValidation(),
  billingZipCode: createZipCodeValidation(),
  
  // Shipping Address
  shippingAddressLine1: z.string().max(255).optional().nullable(),
  shippingAddressLine2: z.string().max(255).optional().nullable(),
  shippingCity: z.string().max(100).optional().nullable(),
  shippingState: createStateCodeValidation(),
  shippingCountry: createCountryCodeValidation(),
  shippingZipCode: createZipCodeValidation(),
  
  // Tax & Compliance
  gstTreatment: z.string().max(100).optional().nullable(),
  gstin: z.string()
    .max(15)
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format')
    .optional()
    .nullable()
    .or(z.literal('')),
  sourceOfSupply: z.string().max(100).optional().nullable(),
  pan: z.string()
    .max(10)
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    .optional()
    .nullable()
    .or(z.literal('')),
  isMsmeRegistered: z.boolean(),
  
  // Financial
  currency: createCurrencyValidation(),
  openingBalance: z.number(),
  paymentTerms: z.string().max(100).optional().nullable(),
  
  // Bank Details
  bankName: z.string().max(255).optional().nullable(),
  bankAccountNumber: createBankAccountValidation(),
  bankIfscCode: z.string()
    .max(11)
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
    .optional()
    .nullable()
    .or(z.literal('')),
  bankBranch: z.string().max(255).optional().nullable(),
  
  // Other
  remarks: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type VendorFormValues = z.infer<typeof vendorFormSchema>;
