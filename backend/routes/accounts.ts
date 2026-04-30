/**
 * Routes for Account operations
 */

import express, { Request, Response } from 'express';
import accountService from '../services/accountService';
import {
  createAccountSchema,
  updateAccountSchema,
  accountQuerySchema,
} from '../schemas/accountSchemas';
import { ZodError } from 'zod';

const router = express.Router();

/**
 * GET /api/accounts
 * Get all accounts with filtering and pagination
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = accountQuerySchema.parse(req.query);
    const result = await accountService.getAccounts(query);
    res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

/**
 * GET /api/accounts/hierarchy
 * Get accounts in tree/hierarchy structure
 */
router.get('/hierarchy', async (req: Request, res: Response) => {
  try {
    const { accountType } = req.query;
    const hierarchy = await accountService.getAccountHierarchy(accountType as string);
    res.json({ data: hierarchy });
  } catch (error) {
    console.error('Error fetching account hierarchy:', error);
    res.status(500).json({ error: 'Failed to fetch account hierarchy' });
  }
});

/**
 * GET /api/accounts/income
 * Get income accounts for sales dropdown
 */
router.get('/income', async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.activeOnly !== 'false';
    const accounts = await accountService.getIncomeAccounts(activeOnly);
    res.json({ data: accounts });
  } catch (error) {
    console.error('Error fetching income accounts:', error);
    res.status(500).json({ error: 'Failed to fetch income accounts' });
  }
});

/**
 * GET /api/accounts/purchase
 * Get purchase-related accounts for purchase dropdown
 */
router.get('/purchase', async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.activeOnly !== 'false';
    const accounts = await accountService.getPurchaseAccounts(activeOnly);
    res.json({ data: accounts });
  } catch (error) {
    console.error('Error fetching purchase accounts:', error);
    res.status(500).json({ error: 'Failed to fetch purchase accounts' });
  }
});

/**
 * GET /api/accounts/:id
 * Get account by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    const account = await accountService.getAccountById(id);
    res.json({ data: account });
  } catch (error: any) {
    if (error.message === 'Account not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

/**
 * POST /api/accounts
 * Create a new account
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createAccountSchema.parse(req.body);
    const createdBy = req.headers['x-user-id'] as string | undefined;
    
    const account = await accountService.createAccount(data, createdBy);
    res.status(201).json({ data: account });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    if (error instanceof Error && error.message === 'Parent account not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

/**
 * PUT /api/accounts/:id
 * Update an account
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    const data = updateAccountSchema.parse(req.body);
    const updatedBy = req.headers['x-user-id'] as string | undefined;
    
    const account = await accountService.updateAccount(id, data, updatedBy);
    res.json({ data: account });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    if (error instanceof Error) {
      if (error.message === 'Account not found' || error.message === 'Parent account not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Account cannot be its own parent') {
        return res.status(400).json({ error: error.message });
      }
    }
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

/**
 * DELETE /api/accounts/:id
 * Soft delete an account (set isActive to false)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    const updatedBy = req.headers['x-user-id'] as string | undefined;
    
    const account = await accountService.deleteAccount(id, updatedBy);
    res.json({ data: account, message: 'Account deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Account not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Cannot delete')) {
        return res.status(400).json({ error: error.message });
      }
    }
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
