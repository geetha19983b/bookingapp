import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.vendorItemHistory.deleteMany();
  await prisma.contactPerson.deleteMany();
  await prisma.item.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.unit.deleteMany();
  // Note: Accounts should be seeded separately using accountSeed.ts before running this seed

  // Seed Units (UQC - Unique Quantity Codes for GST)
  console.log('Seeding units...');
  const units = await prisma.unit.createMany({
    data: [
      { code: 'BOX', name: 'Box', description: 'Box', isActive: true, createdBy: 'system' },
      { code: 'CMS', name: 'Centimeters', description: 'Centimeters', isActive: true, createdBy: 'system' },
      { code: 'FTS', name: 'Feet', description: 'Feet', isActive: true, createdBy: 'system' },
      { code: 'GMS', name: 'Grams', description: 'Grams', isActive: true, createdBy: 'system' },
      { code: 'HRS', name: 'Hours', description: 'Hours', isActive: true, createdBy: 'system' },
      { code: 'KGS', name: 'Kilograms', description: 'Kilograms', isActive: true, createdBy: 'system' },
      { code: 'KME', name: 'Kilometers', description: 'Kilometers', isActive: true, createdBy: 'system' },
      { code: 'LBS', name: 'Pounds', description: 'Pounds', isActive: true, createdBy: 'system' },
      { code: 'MGS', name: 'Milligrams', description: 'Milligrams', isActive: true, createdBy: 'system' },
      { code: 'MLT', name: 'Milliliters', description: 'Milliliters', isActive: true, createdBy: 'system' },
      { code: 'MTR', name: 'Meters', description: 'Meters', isActive: true, createdBy: 'system' },
      { code: 'PCS', name: 'Pieces', description: 'Pieces', isActive: true, createdBy: 'system' },
      { code: 'SQF', name: 'Square Feet', description: 'Square Feet', isActive: true, createdBy: 'system' },
      { code: 'SQM', name: 'Square Meters', description: 'Square Meters', isActive: true, createdBy: 'system' },
      { code: 'NOS', name: 'Numbers', description: 'Numbers', isActive: true, createdBy: 'system' },
    ],
  });

  console.log(`Created ${15} units`);

  // Get units for reference
  const unitPcs = await prisma.unit.findUnique({ where: { code: 'PCS' } });
  const unitHrs = await prisma.unit.findUnique({ where: { code: 'HRS' } });

  // Seed Vendors
  console.log('Seeding vendors...');
  const vendor1 = await prisma.vendor.create({
    data: {
      companyName: 'Acme Corporation',
      displayName: 'Acme Corp',
      email: 'contact@acme.com',
      workPhone: '+1-555-0100',
      mobilePhone: '+1-555-0101',
      billingAddressLine1: '123 Business St',
      billingCity: 'New York',
      billingState: 'NY',              // State ISO code
      billingCountry: 'US',            // Country ISO2 code
      billingZipCode: '10001',
      shippingAddressLine1: '123 Business St',
      shippingCity: 'New York',
      shippingState: 'NY',             // State ISO code
      shippingCountry: 'US',           // Country ISO2 code
      shippingZipCode: '10001',
      gstTreatment: 'Registered Business',
      gstin: '29ABCDE1234F1Z5',
      pan: 'ABCDE1234F',
      isMsmeRegistered: true,
      currency: 'INR',
      openingBalance: 0,
      paymentTerms: 'Net 30',
      isActive: true,
      createdBy: 'system',
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      companyName: 'Tech Solutions India Pvt Ltd',
      displayName: 'Tech Solutions',
      email: 'info@techsolutions.in',
      workPhone: '+91-22-12345678',
      mobilePhone: '+91-9876543210',
      billingAddressLine1: 'Plot 456, Industrial Area',
      billingCity: 'Mumbai',
      billingState: 'MH',              // State ISO code (Maharashtra)
      billingCountry: 'IN',            // Country ISO2 code (India)
      billingZipCode: '400001',
      shippingAddressLine1: 'Plot 456, Industrial Area',
      shippingCity: 'Mumbai',
      shippingState: 'MH',             // State ISO code (Maharashtra)
      shippingCountry: 'IN',           // Country ISO2 code (India)
      shippingZipCode: '400001',
      gstTreatment: 'Registered Business',
      gstin: '27XYZAB5678C1ZD',
      sourceOfSupply: 'Maharashtra',
      pan: 'XYZAB5678C',
      isMsmeRegistered: false,
      currency: 'INR',
      openingBalance: 5000.00,
      paymentTerms: 'Due on Receipt',
      bankName: 'HDFC Bank',
      bankAccountNumber: '12345678901234',
      bankIfscCode: 'HDFC0001234',
      bankBranch: 'Andheri West',
      isActive: true,
      createdBy: 'system',
    },
  });

  console.log(`Created ${2} vendors`);

  // Seed Contact Persons
  console.log('Seeding contact persons...');
  await prisma.contactPerson.createMany({
    data: [
      {
        vendorId: vendor1.id,
        salutation: 'Mr.',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@acme.com',
        workPhone: '+1-555-0102',
        mobilePhone: '+1-555-0103',
        designation: 'Sales Manager',
        department: 'Sales',
        isPrimary: true,
      },
      {
        vendorId: vendor1.id,
        salutation: 'Ms.',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@acme.com',
        workPhone: '+1-555-0104',
        designation: 'Account Manager',
        department: 'Accounts',
        isPrimary: false,
      },
      {
        vendorId: vendor2.id,
        salutation: 'Mr.',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh@techsolutions.in',
        workPhone: '+91-22-12345679',
        mobilePhone: '+91-9876543211',
        designation: 'Business Head',
        department: 'Management',
        isPrimary: true,
      },
    ],
  });

  console.log(`Created ${3} contact persons`);

  // Look up accounts for item creation
  console.log('Looking up accounts...');
  const salesAccount = await prisma.account.findFirst({
    where: { accountName: 'Sales', isActive: true },
  });
  const serviceRevenueAccount = await prisma.account.findFirst({
    where: { accountName: 'Service Income', isActive: true },
  });
  const cogsAccount = await prisma.account.findFirst({
    where: { 
      OR: [
        { accountName: 'Cost of Goods Sold' },
        { accountName: 'COGS' }
      ],
      isActive: true 
    },
  });

  // Use fallback if specific accounts not found
  const fallbackSalesAccountId = salesAccount?.id;
  const fallbackServiceAccountId = serviceRevenueAccount?.id || salesAccount?.id;
  const fallbackPurchaseAccountId = cogsAccount?.id;

  if (!fallbackSalesAccountId) {
    console.warn('⚠️  Warning: Sales account not found. Run accountSeed.ts first. Items will be created without account references.');
  }

  // Seed Items
  console.log('Seeding items...');
  const item1 = await prisma.item.create({
    data: {
      itemType: 'goods',
      name: 'Laptop - Dell Latitude 5420',
      sku: 'LAP-DELL-5420',
      unitId: unitPcs?.id,
      hsnCode: '84713010',
      taxPreference: 'taxable',
      intraStateTaxRate: 'GST18 (18%)',
      intraStateTaxPercentage: 18.00,
      interStateTaxRate: 'IGST18 (18%)',
      interStateTaxPercentage: 18.00,
      isSellable: true,
      sellingPrice: 65000.00,
      salesAccountId: fallbackSalesAccountId,
      salesDescription: 'Dell Latitude 5420 Business Laptop',
      isPurchasable: true,
      costPrice: 55000.00,
      purchaseAccountId: fallbackPurchaseAccountId,
      purchaseDescription: 'Dell Latitude Business Laptop for resale',
      preferredVendorId: vendor1.id,
      trackInventory: true,
      openingStock: 10,
      openingStockRate: 55000.00,
      reorderLevel: 5,
      isActive: true,
      createdBy: 'system',
    },
  });

  const item2 = await prisma.item.create({
    data: {
      itemType: 'service',
      name: 'IT Consulting Services',
      sku: 'IT-CONS',
      unitId: unitHrs?.id,
      hsnCode: '998314',
      taxPreference: 'taxable',
      intraStateTaxRate: 'GST18 (18%)',
      intraStateTaxPercentage: 18.00,
      interStateTaxRate: 'IGST18 (18%)',
      interStateTaxPercentage: 18.00,
      isSellable: true,
      sellingPrice: 2500.00,
      salesAccountId: fallbackServiceAccountId,
      salesDescription: 'Professional IT consulting and advisory services',
      isPurchasable: false,
      trackInventory: false,
      isActive: true,
      createdBy: 'system',
    },
  });

  console.log(`Created ${2} items`);

  // Seed Vendor Items History
  console.log('Seeding vendor items history...');
  await prisma.vendorItemHistory.createMany({
    data: [
      {
        vendorId: vendor1.id,
        itemId: item1.id,
        purchasePrice: 55000.00,
        quantity: 12,
        unitId: unitPcs?.id,
        purchaseOrderNumber: 'PO-2024-001',
        invoiceNumber: 'INV-ACME-001',
        purchaseDate: new Date('2024-01-15'),
        notes: 'First bulk purchase order',
      },
      {
        vendorId: vendor1.id,
        itemId: item1.id,
        purchasePrice: 54500.00,
        quantity: 10,
        unitId: unitPcs?.id,
        purchaseOrderNumber: 'PO-2024-002',
        invoiceNumber: 'INV-ACME-002',
        purchaseDate: new Date('2024-02-20'),
        notes: 'Volume discount applied',
      },
    ],
  });

  console.log(`Created ${2} vendor item history records`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
