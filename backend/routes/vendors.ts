import { Router, Request, Response, NextFunction } from 'express';
import {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} from '../services/vendorService';
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
    const vendors = await getAllVendors();
    res.status(200).json({
      message: 'Vendors fetched successfully',
      data: vendors,
    });
  })
);

// GET vendor by id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(vendorIdParamsSchema, req.params);
    const vendor = await getVendorById(params.id);
    
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    
    res.status(200).json({
      message: 'Vendor fetched successfully',
      data: vendor,
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
