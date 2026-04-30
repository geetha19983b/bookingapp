import { z } from 'zod';

// Helper functions for string validation
const trimmedString = (maxLength?: number) => {
  let schema = z.string().trim();
  if (maxLength) {
    schema = schema.max(maxLength, `Must be at most ${maxLength} characters`);
  }
  return schema;
};

const nullableTrimmedString = (maxLength?: number) => {
  let schema = z.string().trim();
  if (maxLength) {
    schema = schema.max(maxLength, `Must be at most ${maxLength} characters`);
  }
  return schema.optional().nullable();
};

// Create Unit Schema
export const createUnitSchema = z.object({
  code: trimmedString(10)
    .min(1, 'Code is required')
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, 'Code must contain only uppercase letters and numbers'),
  name: trimmedString(100).min(1, 'Name is required'),
  description: nullableTrimmedString(255),
  createdBy: nullableTrimmedString(100),
});

// Update Unit Schema
export const updateUnitSchema = z.object({
  code: trimmedString(10)
    .min(1, 'Code is required')
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, 'Code must contain only uppercase letters and numbers')
    .optional(),
  name: trimmedString(100).min(1, 'Name is required').optional(),
  description: nullableTrimmedString(255),
  isActive: z.boolean().optional(),
  updatedBy: nullableTrimmedString(100),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// Query Parameters Schema
export const unitQuerySchema = z.object({
  search: z.string().optional(),
  isActive: z.enum(['true', 'false', 'all']).optional().default('true'),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('50'),
  sortBy: z.enum(['code', 'name', 'createdAt', 'updatedAt']).optional().default('code'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Types
export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
export type UnitQueryParams = z.infer<typeof unitQuerySchema>;
