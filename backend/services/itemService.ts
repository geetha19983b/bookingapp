import prisma from '../db';
import logger from '../utils/logger';
import type { CreateItemBody, UpdateItemBody } from '../schemas/itemSchemas';
import type { Item } from '@prisma/client';

export type ItemRecord = Item;

export const getAllItems = async (): Promise<ItemRecord[]> => {
  return await prisma.item.findMany({
    orderBy: { id: 'asc' },
    include: {
      preferredVendor: {
        select: {
          id: true,
          displayName: true,
        },
      },
      salesAccountRef: {
        select: {
          id: true,
          accountName: true,
          accountType: true,
        },
      },
      purchaseAccountRef: {
        select: {
          id: true,
          accountName: true,
          accountType: true,
        },
      },
      unitRef: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });
};

export const getItemById = async (itemId: number): Promise<ItemRecord | null> => {
  return await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      preferredVendor: {
        select: {
          id: true,
          displayName: true,
        },
      },
      salesAccountRef: {
        select: {
          id: true,
          accountName: true,
          accountType: true,
        },
      },
      purchaseAccountRef: {
        select: {
          id: true,
          accountName: true,
          accountType: true,
        },
      },
      unitRef: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });
};

export const createItem = async (payload: CreateItemBody): Promise<ItemRecord> => {
  try {
    logger.info('Creating item with payload:', payload);
    const result = await prisma.item.create({ 
      data: payload as any,
      include: {
        preferredVendor: {
          select: {
            id: true,
            displayName: true,
          },
        },
        salesAccountRef: {
          select: {
            id: true,
            accountName: true,
            accountType: true,
          },
        },
        purchaseAccountRef: {
          select: {
            id: true,
            accountName: true,
            accountType: true,
          },
        },
        unitRef: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });
    logger.info('Item created successfully:', result);
    return result;
  } catch (error) {
    logger.error('Failed to create item', {
      payload,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const updateItem = async (itemId: number, payload: UpdateItemBody): Promise<ItemRecord | null> => {
  try {
    return await prisma.item.update({
      where: { id: itemId },
      data: payload as any,
      include: {
        preferredVendor: {
          select: {
            id: true,
            displayName: true,
          },
        },
        salesAccountRef: {
          select: {
            id: true,
            accountName: true,
            accountType: true,
          },
        },
        purchaseAccountRef: {
          select: {
            id: true,
            accountName: true,
            accountType: true,
          },
        },
        unitRef: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    logger.warn('Failed to update item', {
      itemId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Return null if item not found
    return null;
  }
};

export const deleteItem = async (itemId: number): Promise<{ id: number } | null> => {
  try {
    const deleted = await prisma.item.delete({
      where: { id: itemId },
      select: { id: true },
    });
    return deleted;
  } catch (error) {
    logger.warn('Failed to delete item', {
      itemId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Return null if item not found
    return null;
  }
};
