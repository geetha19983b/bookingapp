import { PrismaClient, Prisma } from '@prisma/client';
import type { CreateUnitInput, UpdateUnitInput, UnitQueryParams } from '../schemas/unitSchemas';

const prisma = new PrismaClient();

export class UnitService {
  /**
   * Get all units with pagination and filtering
   */
  async getAllUnits(params: UnitQueryParams) {
    const { search, isActive, page, limit, sortBy, sortOrder } = params;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Prisma.UnitWhereInput = {};

    // Filter by active status
    if (isActive === 'true') {
      where.isActive = true;
    } else if (isActive === 'false') {
      where.isActive = false;
    }
    // 'all' means no filter on isActive

    // Search in code, name, or description
    if (search && search.trim()) {
      where.OR = [
        { code: { contains: search.trim(), mode: 'insensitive' } },
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // Execute query with pagination
    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.unit.count({ where }),
    ]);

    return {
      data: units,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get a single unit by ID
   */
  async getUnitById(id: number) {
    const unit = await prisma.unit.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true,
            vendorItemsHistory: true,
          },
        },
      },
    });

    if (!unit) {
      throw new Error('Unit not found');
    }

    return unit;
  }

  /**
   * Get a unit by code
   */
  async getUnitByCode(code: string) {
    return await prisma.unit.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  /**
   * Create a new unit
   */
  async createUnit(data: CreateUnitInput) {
    // Check if unit code already exists
    const existing = await this.getUnitByCode(data.code);
    if (existing) {
      throw new Error(`Unit with code '${data.code}' already exists`);
    }

    return await prisma.unit.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
  }

  /**
   * Update an existing unit
   */
  async updateUnit(id: number, data: UpdateUnitInput) {
    // Check if unit exists
    const existing = await prisma.unit.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Unit not found');
    }

    // If updating code, check for duplicates
    if (data.code && data.code.toUpperCase() !== existing.code) {
      const duplicate = await this.getUnitByCode(data.code);
      if (duplicate) {
        throw new Error(`Unit with code '${data.code}' already exists`);
      }
    }

    return await prisma.unit.update({
      where: { id },
      data: {
        ...data,
        code: data.code ? data.code.toUpperCase() : undefined,
      },
    });
  }

  /**
   * Soft delete a unit (set isActive = false)
   */
  async softDeleteUnit(id: number, deletedBy?: string) {
    // Check if unit exists
    const existing = await prisma.unit.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true,
            vendorItemsHistory: true,
          },
        },
      },
    });

    if (!existing) {
      throw new Error('Unit not found');
    }

    // Check if unit is in use
    const inUse = existing._count.items > 0 || existing._count.vendorItemsHistory > 0;
    if (inUse) {
      // Only allow soft delete if in use
      return await prisma.unit.update({
        where: { id },
        data: {
          isActive: false,
          updatedBy: deletedBy || null,
        },
      });
    }

    // If not in use, can be soft deleted
    return await prisma.unit.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: deletedBy || null,
      },
    });
  }

  /**
   * Hard delete a unit (permanent deletion)
   * Only allowed if unit is not referenced by any items or history
   */
  async hardDeleteUnit(id: number) {
    // Check if unit exists and get usage count
    const existing = await prisma.unit.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true,
            vendorItemsHistory: true,
          },
        },
      },
    });

    if (!existing) {
      throw new Error('Unit not found');
    }

    // Prevent deletion if in use
    const inUse = existing._count.items > 0 || existing._count.vendorItemsHistory > 0;
    if (inUse) {
      throw new Error(
        `Cannot delete unit '${existing.code}'. It is currently used by ${existing._count.items} item(s) and ${existing._count.vendorItemsHistory} vendor history record(s). Please deactivate it instead.`
      );
    }

    // Safe to delete
    return await prisma.unit.delete({
      where: { id },
    });
  }

  /**
   * Reactivate a soft-deleted unit
   */
  async reactivateUnit(id: number, reactivatedBy?: string) {
    const existing = await prisma.unit.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Unit not found');
    }

    return await prisma.unit.update({
      where: { id },
      data: {
        isActive: true,
        updatedBy: reactivatedBy || null,
      },
    });
  }

  /**
   * Get active units only (for dropdowns)
   */
  async getActiveUnits() {
    return await prisma.unit.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
      },
    });
  }
}

export const unitService = new UnitService();
