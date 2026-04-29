import { z } from 'zod';

/**
 * Vendor Form Validation Schema
 * Uses Zod for type-safe runtime validation with React Hook Form
 */
export const vendorFormSchema = z.object({
  // Basic Details
  displayName: z.string().min(1, 'Display name is required').max(255),
  companyName: z.string().max(255).optional().nullable(),
  email: z.string().email('Invalid email address').max(255).optional().nullable().or(z.literal('')),
  workPhone: z.string().max(20).optional().nullable(),
  mobilePhone: z.string().max(20).optional().nullable(),
  
  // Billing Address
  billingAddressLine1: z.string().max(255).optional().nullable(),
  billingAddressLine2: z.string().max(255).optional().nullable(),
  billingCity: z.string().max(100).optional().nullable(),
  billingState: z.string().max(100).optional().nullable(),
  billingCountry: z.string().max(100).optional().nullable(),
  billingZipCode: z.string().max(20).optional().nullable(),
  
  // Shipping Address
  shippingAddressLine1: z.string().max(255).optional().nullable(),
  shippingAddressLine2: z.string().max(255).optional().nullable(),
  shippingCity: z.string().max(100).optional().nullable(),
  shippingState: z.string().max(100).optional().nullable(),
  shippingCountry: z.string().max(100).optional().nullable(),
  shippingZipCode: z.string().max(20).optional().nullable(),
  
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
  currency: z.string().max(3),
  openingBalance: z.number(),
  paymentTerms: z.string().max(100).optional().nullable(),
  
  // Bank Details
  bankName: z.string().max(255).optional().nullable(),
  bankAccountNumber: z.string().max(50).optional().nullable(),
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
