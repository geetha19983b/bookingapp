import express, { Request, Response } from 'express';
import { unitService } from '../services/unitService';
import {
  createUnitSchema,
  updateUnitSchema,
  unitQuerySchema,
  type CreateUnitInput,
  type UpdateUnitInput,
} from '../schemas/unitSchemas';
import { ZodError } from 'zod';

const router = express.Router();

/**
 * GET /api/units
 * Get all units with pagination and filtering
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const queryParams = unitQuerySchema.parse(req.query);
    const result = await unitService.getAllUnits(queryParams);
    res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.issues,
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch units',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

/**
 * GET /api/units/active
 * Get all active units (for dropdowns)
 */
router.get('/active', async (req: Request, res: Response) => {
  try {
    const units = await unitService.getActiveUnits();
    res.json(units);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch active units',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/units/:id
 * Get a single unit by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid unit ID' });
    }

    const unit = await unitService.getUnitById(id);
    res.json(unit);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unit not found') {
      res.status(404).json({ error: 'Unit not found' });
    } else {
      res.status(500).json({
        error: 'Failed to fetch unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

/**
 * POST /api/units
 * Create a new unit
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData: CreateUnitInput = createUnitSchema.parse(req.body);
    const unit = await unitService.createUnit(validatedData);
    res.status(201).json(unit);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.issues,
      });
    } else if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        error: 'Conflict',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Failed to create unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

/**
 * PUT /api/units/:id
 * Update an existing unit
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid unit ID' });
    }

    const validatedData: UpdateUnitInput = updateUnitSchema.parse(req.body);
    const unit = await unitService.updateUnit(id, validatedData);
    res.json(unit);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.issues,
      });
    } else if (error instanceof Error && error.message === 'Unit not found') {
      res.status(404).json({ error: 'Unit not found' });
    } else if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        error: 'Conflict',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Failed to update unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

/**
 * DELETE /api/units/:id
 * Delete a unit (soft delete if in use, hard delete otherwise)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid unit ID' });
    }

    const hardDelete = req.query.hard === 'true';
    const deletedBy = req.body?.deletedBy || req.query.deletedBy;

    if (hardDelete) {
      await unitService.hardDeleteUnit(id);
      res.json({ message: 'Unit permanently deleted successfully' });
    } else {
      const unit = await unitService.softDeleteUnit(id, deletedBy);
      res.json({
        message: 'Unit deactivated successfully',
        unit,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unit not found') {
      res.status(404).json({ error: 'Unit not found' });
    } else if (error instanceof Error && error.message.includes('Cannot delete')) {
      res.status(409).json({
        error: 'Cannot delete unit',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Failed to delete unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

/**
 * PATCH /api/units/:id/reactivate
 * Reactivate a deactivated unit
 */
router.patch('/:id/reactivate', async (req: Request, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid unit ID' });
    }

    const reactivatedBy = req.body?.reactivatedBy;
    const unit = await unitService.reactivateUnit(id, reactivatedBy);
    res.json({
      message: 'Unit reactivated successfully',
      unit,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unit not found') {
      res.status(404).json({ error: 'Unit not found' });
    } else {
      res.status(500).json({
        error: 'Failed to reactivate unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

export default router;
