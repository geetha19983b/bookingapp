/**
 * Zod validation schemas for Account operations
 */

import { z } from 'zod';

// Account Types
export const accountTypes = [
  'income',
  'expense',
  'asset',
  'liability',
  'equity',
  'other_current_asset',
  'other_current_liability',
  'fixed_asset',
] as const;

// Base Account Schema
export const accountBaseSchema = z.object({
  accountId: z.string().max(50).optional().nullable(),
  accountType: z.enum(accountTypes),
  accountName: z.string().min(1).max(200),
  accountCode: z.string().max(20).optional().nullable(),
  parentAccountId: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  accountHint: z.string().optional().nullable(),
  depth: z.number().int().min(0).default(0),
  accountTypeInt: z.number().int().optional().nullable(),
  scheduleBalanceSheetCategory: z.string().max(100).optional().nullable(),
  scheduleProfitAndLossCategory: z.string().max(100).optional().nullable(),
  isTaxAccount: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  isPrimaryAccount: z.boolean().default(false),
  isRootAccountWithChild: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// Create Account Schema
export const createAccountSchema = accountBaseSchema;

// Update Account Schema (all fields optional except at least one should be present)
export const updateAccountSchema = accountBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

// Query Parameters Schema
export const accountQuerySchema = z.object({
  accountType: z.enum(accountTypes).optional(),
  isTaxAccount: z.enum(['true', 'false']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  parentAccountId: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// Response Schema
export const accountResponseSchema = accountBaseSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
});

// Type exports
export type AccountBase = z.infer<typeof accountBaseSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type AccountQuery = z.infer<typeof accountQuerySchema>;
export type AccountResponse = z.infer<typeof accountResponseSchema>;
