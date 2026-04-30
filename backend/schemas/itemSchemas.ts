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
      .regex(/^[0-9]{4,8}$/, 'hsn_code must be 4-8 digits')
      .nullable()
      .optional()
  );

const itemBaseSchema = z.object({
  itemType: z.enum(['goods', 'service'], {
    message: 'itemType must be either "goods" or "service"',
  }),
  name: z.string().trim().min(1, 'name is required').max(255),
  sku: nullableTrimmedString(100),
  unit: nullableTrimmedString(50),
  hsnCode: hsnCodeSchema,
  
  // Tax Information
  taxPreference: z.enum(['taxable', 'non-taxable'], {
    message: 'taxPreference must be either "taxable" or "non-taxable"',
  }).optional(),
  intraStateTaxRate: nullableTrimmedString(50),
  intraStateTaxPercentage: z.coerce.number().min(0).max(100).optional(),
  interStateTaxRate: nullableTrimmedString(50),
  interStateTaxPercentage: z.coerce.number().min(0).max(100).optional(),
  
  // Sales Information
  isSellable: z.boolean().optional(),
  sellingPrice: z.coerce.number().min(0).finite().optional(),
  salesAccount: nullableTrimmedString(100),
  salesDescription: nullableTrimmedString(10000),
  
  // Purchase Information
  isPurchasable: z.boolean().optional(),
  costPrice: z.coerce.number().min(0).finite().optional(),
  purchaseAccount: nullableTrimmedString(100),
  purchaseDescription: nullableTrimmedString(10000),
  preferredVendorId: z.coerce.number().int().positive().nullable().optional(),
  
  // Inventory Management
  trackInventory: z.boolean().optional(),
  openingStock: z.coerce.number().min(0).finite().optional(),
  openingStockRate: z.coerce.number().min(0).finite().optional(),
  reorderLevel: z.coerce.number().min(0).finite().optional(),
  
  // Images
  imageUrl: nullableTrimmedString(500),
  imageUrls: z.array(z.string().url().max(500)).optional(),
  
  // Additional Information
  customFields: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  
  // Status and Metadata
  isActive: z.boolean().optional(),
  createdBy: nullableTrimmedString(100),
  updatedBy: nullableTrimmedString(100),
});

export const createItemBodySchema = itemBaseSchema.extend({
  itemType: z.enum(['goods', 'service'], {
    message: 'itemType is required and must be either "goods" or "service"',
  }),
  name: z.string().trim().min(1, 'name is required').max(255),
});

export const updateItemBodySchema = itemBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one valid field is required for update',
});

export const itemIdParamsSchema = z.object({
  id: z.coerce.number().int().positive('item id must be a positive integer'),
});

export type CreateItemBody = z.infer<typeof createItemBodySchema>;
export type UpdateItemBody = z.infer<typeof updateItemBodySchema>;
export type ItemIdParams = z.infer<typeof itemIdParamsSchema>;

export const parseBody = <T>(schema: z.ZodSchema<T>, body: unknown): T => schema.parse(body);
export const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown): T => schema.parse(params);
