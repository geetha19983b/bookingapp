import prisma from '../db';
import logger from '../utils/logger';
import type { CreateCustomerBody, UpdateCustomerBody } from '../schemas/customerSchemas';
import type { Customer } from '@prisma/client';

export type CustomerRecord = Customer;

export const getAllCustomers = async (): Promise<CustomerRecord[]> => {
  return await prisma.customer.findMany({
    orderBy: { id: 'asc' },
  });
};

export const getCustomerById = async (customerId: number): Promise<CustomerRecord | null> => {
  return await prisma.customer.findUnique({
    where: { id: customerId },
  });
};

export const createCustomer = async (payload: CreateCustomerBody): Promise<CustomerRecord> => {
  try {
    logger.info('Creating customer with payload:', payload);
    const result = await prisma.customer.create({ data: payload as any });
    logger.info('Customer created successfully:', result);
    return result;
  } catch (error) {
    logger.error('Failed to create customer', {
      payload,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const updateCustomer = async (customerId: number, payload: UpdateCustomerBody): Promise<CustomerRecord | null> => {
  try {
    return await prisma.customer.update({
      where: { id: customerId },
      data: payload as any,
    });
  } catch (error) {
    logger.warn('Failed to update customer', {
      customerId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Return null if customer not found
    return null;
  }
};

export const deleteCustomer = async (customerId: number): Promise<{ id: number } | null> => {
  try {
    const deleted = await prisma.customer.delete({
      where: { id: customerId },
      select: { id: true },
    });
    return deleted;
  } catch (error) {
    logger.warn('Failed to delete customer', {
      customerId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Return null if customer not found
    return null;
  }
};
