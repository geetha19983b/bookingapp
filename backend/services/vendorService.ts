import prisma from '../db';
import logger from '../utils/logger';
import type { CreateVendorBody, UpdateVendorBody } from '../schemas/vendorSchemas';
import type { Vendor } from '@prisma/client';

export type VendorRecord = Vendor;

export const getAllVendors = async (): Promise<VendorRecord[]> => {
  return await prisma.vendor.findMany({
    orderBy: { id: 'asc' },
  });
};

export const getVendorById = async (vendorId: number): Promise<VendorRecord | null> => {
  return await prisma.vendor.findUnique({
    where: { id: vendorId },
  });
};

export const createVendor = async (payload: CreateVendorBody): Promise<VendorRecord> => {
  try {
    logger.info('Creating vendor with payload:', payload);
    const result = await prisma.vendor.create({ data: payload as any });
    logger.info('Vendor created successfully:', result);
    return result;
  } catch (error) {
    logger.error('Failed to create vendor', {
      payload,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const updateVendor = async (vendorId: number, payload: UpdateVendorBody): Promise<VendorRecord | null> => {
  try {
    return await prisma.vendor.update({
      where: { id: vendorId },
      data: payload as any,
    });
  } catch (error) {
    logger.warn('Failed to update vendor', {
      vendorId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Return null if vendor not found
    return null;
  }
};

export const deleteVendor = async (vendorId: number): Promise<{ id: number } | null> => {
  try {
    const deleted = await prisma.vendor.delete({
      where: { id: vendorId },
      select: { id: true },
    });
    return deleted;
  } catch (error) {
    logger.warn('Failed to delete vendor', {
      vendorId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Return null if vendor not found
    return null;
  }
};
