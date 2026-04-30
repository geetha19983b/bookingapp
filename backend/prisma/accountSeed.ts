/**
 * Seed script for populating accounts from account.json
 * Run with: npx ts-node prisma/accountSeed.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface AccountJson {
  account_id: string;
  account_type: string;
  account_name: string;
  account_code: string;
  parent_account_id: string;
  ParentGeneralLedgerID: string;
  account_hint: string;
  depth: number;
  account_type_int: number;
  schedule_balancesheet_category: string;
  schedule_profit_and_loss_category: string;
  is_tax_account: boolean;
  is_default: boolean;
  is_primary_account: boolean;
  is_root_account_with_child: boolean;
  is_active: boolean;
}

interface AccountJsonFile {
  income_accounts_list: AccountJson[];
  purchase_accounts_list: AccountJson[];
}

async function seedAccounts() {
  console.log('Starting account seed...');

  try {
    // Read account.json
    const accountJsonPath = path.join(__dirname, 'account.json');
    const accountData: AccountJsonFile = JSON.parse(
      fs.readFileSync(accountJsonPath, 'utf-8')
    );

    // Combine both income and purchase accounts, removing duplicates by account_id
    const allAccounts = new Map<string, AccountJson>();
    
    for (const account of accountData.income_accounts_list) {
      allAccounts.set(account.account_id, account);
    }
    
    for (const account of accountData.purchase_accounts_list) {
      if (!allAccounts.has(account.account_id)) {
        allAccounts.set(account.account_id, account);
      }
    }

    console.log(`Found ${allAccounts.size} unique accounts to seed`);

    // First pass: Create all accounts without parent relationships
    const accountIdMap = new Map<string, number>(); // Maps external account_id to internal id
    
    for (const [, accountJson] of allAccounts) {
      try {
        const account = await prisma.account.create({
          data: {
            accountId: accountJson.account_id,
            accountType: accountJson.account_type,
            accountName: accountJson.account_name,
            accountCode: accountJson.account_code || null,
            description: null,
            accountHint: accountJson.account_hint || null,
            depth: accountJson.depth || 0,
            accountTypeInt: accountJson.account_type_int || null,
            scheduleBalanceSheetCategory: accountJson.schedule_balancesheet_category || null,
            scheduleProfitAndLossCategory: accountJson.schedule_profit_and_loss_category || null,
            isTaxAccount: accountJson.is_tax_account || false,
            isDefault: accountJson.is_default || false,
            isPrimaryAccount: accountJson.is_primary_account || false,
            isRootAccountWithChild: accountJson.is_root_account_with_child || false,
            isActive: accountJson.is_active !== false,
          },
        });

        accountIdMap.set(accountJson.account_id, account.id);
        console.log(`✓ Created account: ${account.accountName} (ID: ${account.id})`);
      } catch (error) {
        console.error(`✗ Failed to create account ${accountJson.account_name}:`, error);
      }
    }

    // Second pass: Update parent relationships
    for (const [, accountJson] of allAccounts) {
      if (accountJson.parent_account_id || accountJson.ParentGeneralLedgerID) {
        const parentExternalId = accountJson.parent_account_id || accountJson.ParentGeneralLedgerID;
        const parentInternalId = accountIdMap.get(parentExternalId);
        const currentInternalId = accountIdMap.get(accountJson.account_id);

        if (parentInternalId && currentInternalId) {
          try {
            await prisma.account.update({
              where: { id: currentInternalId },
              data: { parentAccountId: parentInternalId },
            });
            console.log(`✓ Linked ${accountJson.account_name} to parent account`);
          } catch (error) {
            console.error(`✗ Failed to link parent for ${accountJson.account_name}:`, error);
          }
        }
      }
    }

    console.log('\n✅ Account seed completed successfully!');
    console.log(`Total accounts created: ${accountIdMap.size}`);
    
    // Show summary by account type
    const typeCounts = await prisma.account.groupBy({
      by: ['accountType'],
      _count: true,
    });
    
    console.log('\nAccounts by type:');
    for (const typeCount of typeCounts) {
      console.log(`  - ${typeCount.accountType}: ${typeCount._count}`);
    }

  } catch (error) {
    console.error('Error seeding accounts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedAccounts()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
