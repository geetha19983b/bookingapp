import { Router, Request, Response, NextFunction } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../services/customerService';
import {
  createCustomerBodySchema,
  updateCustomerBodySchema,
  customerIdParamsSchema,
  parseBody,
  parseParams,
} from '../schemas/customerSchemas';

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

// GET all customers
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const customers = await getAllCustomers();
    res.status(200).json({
      message: 'Customers fetched successfully',
      data: customers,
    });
  })
);

// GET customer by id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(customerIdParamsSchema, req.params);
    const customer = await getCustomerById(params.id);
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    
    res.status(200).json({
      message: 'Customer fetched successfully',
      data: customer,
    });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(createCustomerBodySchema, req.body);
    const createdCustomer = await createCustomer(body);

    res.status(201).json({
      message: 'Customer created successfully',
      data: createdCustomer,
    });
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(customerIdParamsSchema, req.params);
    const body = parseBody(updateCustomerBodySchema, req.body);

    const updatedCustomer = await updateCustomer(params.id, body);
    if (!updatedCustomer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json({
      message: 'Customer updated successfully',
      data: updatedCustomer,
    });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(customerIdParamsSchema, req.params);

    const deletedCustomer = await deleteCustomer(params.id);
    if (!deletedCustomer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json({
      message: 'Customer deleted successfully',
      data: deletedCustomer,
    });
  })
);

export default router;
