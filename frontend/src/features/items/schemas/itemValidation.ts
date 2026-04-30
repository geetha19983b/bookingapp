import { z } from 'zod';

/**
 * Item Form Validation Schema
 * Uses Zod for type-safe runtime validation with React Hook Form
 */

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

const hsnCodeSchema = z
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
      .regex(/^[0-9]{4,8}$/, 'HSN Code must be 4-8 digits')
      .nullable()
      .optional()
  );

export const itemFormSchema = z.object({
  // Basic Information
  itemType: z.enum(['goods', 'service'], {
    message: 'Item type must be either "goods" or "service"',
  }),
  name: z.string().trim().min(1, 'Item name is required').max(255),
  sku: nullableTrimmedString(100),
  unit: nullableTrimmedString(50),
  hsnCode: hsnCodeSchema,
  
  // Tax Information
  taxPreference: z.enum(['taxable', 'non-taxable'], {
    message: 'Tax preference must be either "taxable" or "non-taxable"',
  }).optional(),
  intraStateTaxRate: nullableTrimmedString(50),
  intraStateTaxPercentage: z.coerce.number().min(0).max(100).optional().nullable(),
  interStateTaxRate: nullableTrimmedString(50),
  interStateTaxPercentage: z.coerce.number().min(0).max(100).optional().nullable(),
  
  // Sales Information
  isSellable: z.boolean().optional(),
  sellingPrice: z.coerce.number().min(0).finite().optional().nullable(),
  salesAccount: nullableTrimmedString(100),
  salesDescription: nullableTrimmedString(10000),
  
  // Purchase Information
  isPurchasable: z.boolean().optional(),
  costPrice: z.coerce.number().min(0).finite().optional().nullable(),
  purchaseAccount: nullableTrimmedString(100),
  purchaseDescription: nullableTrimmedString(10000),
  preferredVendorId: z.preprocess(
    (value) => {
      if (value === undefined || value === null || value === '') {
        return null;
      }
      return value;
    },
    z.coerce.number().int().positive().nullable().optional()
  ),
  
  // Inventory Management
  trackInventory: z.boolean().optional(),
  openingStock: z.coerce.number().min(0).finite().optional().nullable(),
  openingStockRate: z.coerce.number().min(0).finite().optional().nullable(),
  reorderLevel: z.coerce.number().min(0).finite().optional().nullable(),
  
  // Images
  imageUrl: nullableTrimmedString(500),
  imageUrls: z.array(z.string().url().max(500)).optional(),
  
  // Additional Information
  customFields: z.record(z.string(), z.unknown()).optional().nullable(),
  tags: z.array(z.string().trim().min(1)).optional(),
  
  // Status and Metadata
  isActive: z.boolean().optional(),
  createdBy: nullableTrimmedString(100),
  updatedBy: nullableTrimmedString(100),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;
