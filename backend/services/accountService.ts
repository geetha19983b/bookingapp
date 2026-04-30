/**
 * Service layer for Account operations
 */

import { PrismaClient, Prisma } from '@prisma/client';
import type { CreateAccountInput, UpdateAccountInput, AccountQuery } from '../schemas/accountSchemas';

const prisma = new PrismaClient();

export class AccountService {
  /**
   * Get all accounts with optional filtering
   */
  async getAccounts(query: AccountQuery) {
    const {
      accountType,
      isTaxAccount,
      isActive,
      parentAccountId,
      search,
      page = '1',
      limit = '50',
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Prisma.AccountWhereInput = {};

    if (accountType) {
      where.accountType = accountType;
    }

    if (isTaxAccount !== undefined) {
      where.isTaxAccount = isTaxAccount === 'true';
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (parentAccountId) {
      where.parentAccountId = parentAccountId === 'null' ? null : parseInt(parentAccountId, 10);
    }

    if (search) {
      where.OR = [
        { accountName: { contains: search, mode: 'insensitive' } },
        { accountCode: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query
    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        include: {
          parentAccount: {
            select: {
              id: true,
              accountName: true,
              accountType: true,
            },
          },
          _count: {
            select: {
              childAccounts: true,
              itemsSales: true,
              itemsPurchase: true,
            },
          },
        },
        orderBy: [{ accountType: 'asc' }, { accountName: 'asc' }],
        skip,
        take: limitNum,
      }),
      prisma.account.count({ where }),
    ]);

    return {
      data: accounts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get account by ID
   */
  async getAccountById(id: number) {
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        parentAccount: {
          select: {
            id: true,
            accountName: true,
            accountType: true,
          },
        },
        childAccounts: {
          select: {
            id: true,
            accountName: true,
            accountType: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            itemsSales: true,
            itemsPurchase: true,
          },
        },
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  }

  /**
   * Get accounts by type (for dropdowns)
   */
  async getAccountsByType(accountType: string, activeOnly = true) {
    const where: Prisma.AccountWhereInput = {
      accountType,
    };

    if (activeOnly) {
      where.isActive = true;
    }

    return prisma.account.findMany({
      where,
      select: {
        id: true,
        accountName: true,
        accountCode: true,
        accountType: true,
        depth: true,
        parentAccountId: true,
        isTaxAccount: true,
        isRootAccountWithChild: true,
      },
      orderBy: [{ depth: 'asc' }, { accountName: 'asc' }],
    });
  }

  /**
   * Get income accounts (for sales dropdown)
   */
  async getIncomeAccounts(activeOnly = true) {
    return this.getAccountsByType('income', activeOnly);
  }

  /**
   * Get expense/asset accounts (for purchase dropdown)
   */
  async getPurchaseAccounts(activeOnly = true) {
    const accounts = await prisma.account.findMany({
      where: {
        accountType: {
          in: ['expense', 'cost_of_goods_sold', 'other_current_asset', 'other_current_liability'],
        },
        ...(activeOnly ? { isActive: true } : {}),
      },
      select: {
        id: true,
        accountName: true,
        accountCode: true,
        accountType: true,
        depth: true,
        parentAccountId: true,
        isTaxAccount: true,
        isRootAccountWithChild: true,
      },
      orderBy: [{ accountType: 'asc' }, { depth: 'asc' }, { accountName: 'asc' }],
    });

    return accounts;
  }

  /**
   * Create a new account
   */
  async createAccount(data: CreateAccountInput, createdBy?: string) {
    // Validate parent account exists if parentAccountId is provided
    if (data.parentAccountId) {
      const parentAccount = await prisma.account.findUnique({
        where: { id: data.parentAccountId },
      });

      if (!parentAccount) {
        throw new Error('Parent account not found');
      }

      // Update parent to mark it has children
      await prisma.account.update({
        where: { id: data.parentAccountId },
        data: { isRootAccountWithChild: true },
      });
    }

    return prisma.account.create({
      data: {
        ...data,
        createdBy,
      },
    });
  }

  /**
   * Update an account
   */
  async updateAccount(id: number, data: UpdateAccountInput, updatedBy?: string) {
    // Check if account exists
    const existingAccount = await prisma.account.findUnique({
      where: { id },
    });

    if (!existingAccount) {
      throw new Error('Account not found');
    }

    // Validate parent account exists if being updated
    if (data.parentAccountId !== undefined && data.parentAccountId !== null) {
      const parentAccount = await prisma.account.findUnique({
        where: { id: data.parentAccountId },
      });

      if (!parentAccount) {
        throw new Error('Parent account not found');
      }

      // Prevent circular reference
      if (data.parentAccountId === id) {
        throw new Error('Account cannot be its own parent');
      }
    }

    return prisma.account.update({
      where: { id },
      data: {
        ...data,
        updatedBy,
      },
    });
  }

  /**
   * Soft delete an account (set isActive to false)
   */
  async deleteAccount(id: number, updatedBy?: string) {
    // Check if account exists
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            childAccounts: true,
            itemsSales: true,
            itemsPurchase: true,
          },
        },
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Prevent deletion if account has child accounts
    if (account._count.childAccounts > 0) {
      throw new Error('Cannot delete account with child accounts');
    }

    // Prevent deletion if account is used by items
    if (account._count.itemsSales > 0 || account._count.itemsPurchase > 0) {
      throw new Error('Cannot delete account that is used by items');
    }

    // Soft delete
    return prisma.account.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy,
      },
    });
  }

  /**
   * Get account hierarchy (tree structure)
   */
  async getAccountHierarchy(accountType?: string) {
    const where: Prisma.AccountWhereInput = {
      isActive: true,
    };

    if (accountType) {
      where.accountType = accountType;
    }

    // Get all accounts
    const accounts = await prisma.account.findMany({
      where,
      orderBy: [{ accountType: 'asc' }, { depth: 'asc' }, { accountName: 'asc' }],
    });

    // Build tree structure
    const accountMap = new Map();
    const roots: any[] = [];

    // First pass: create map
    accounts.forEach((account) => {
      accountMap.set(account.id, { ...account, children: [] });
    });

    // Second pass: build tree
    accounts.forEach((account) => {
      const node = accountMap.get(account.id);
      if (account.parentAccountId) {
        const parent = accountMap.get(account.parentAccountId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}

export default new AccountService();
