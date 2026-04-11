import { Router, Request, Response, NextFunction } from 'express';
import { createVendor, updateVendor, deleteVendor } from '../services/vendorService';
import { VendorRecord } from '../services/vendorService';
import { query } from '../db';
import {
  createVendorBodySchema,
  updateVendorBodySchema,
  vendorIdParamsSchema,
  parseBody,
  parseParams,
} from '../schemas/vendorSchemas';

const router = Router();

// Move asyncHandler above all usages
const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// GET all vendors
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    // You may want to select only specific columns
    const result = await query<VendorRecord>('SELECT * FROM vendors ORDER BY id ASC');
    res.status(200).json({
      message: 'Vendors fetched successfully',
      data: result.rows,
    });
  })
);

// GET vendor by id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid vendor id' });
      return;
    }
    const result = await query<VendorRecord>('SELECT * FROM vendors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    res.status(200).json({
      message: 'Vendor fetched successfully',
      data: result.rows[0],
    });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(createVendorBodySchema, req.body);
    const createdVendor = await createVendor(body);

    res.status(201).json({
      message: 'Vendor created successfully',
      data: createdVendor,
    });
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(vendorIdParamsSchema, req.params);
    const body = parseBody(updateVendorBodySchema, req.body);

    const updatedVendor = await updateVendor(params.id, body);
    if (!updatedVendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    res.status(200).json({
      message: 'Vendor updated successfully',
      data: updatedVendor,
    });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(vendorIdParamsSchema, req.params);

    const deletedVendor = await deleteVendor(params.id);
    if (!deletedVendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    res.status(200).json({
      message: 'Vendor deleted successfully',
      data: deletedVendor,
    });
  })
);

export default router;
