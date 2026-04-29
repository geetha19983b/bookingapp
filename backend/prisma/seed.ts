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
      billingState: 'NY',
      billingCountry: 'USA',
      billingZipCode: '10001',
      shippingAddressLine1: '123 Business St',
      shippingCity: 'New York',
      shippingState: 'NY',
      shippingCountry: 'USA',
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
      billingState: 'Maharashtra',
      billingCountry: 'India',
      billingZipCode: '400001',
      shippingAddressLine1: 'Plot 456, Industrial Area',
      shippingCity: 'Mumbai',
      shippingState: 'Maharashtra',
      shippingCountry: 'India',
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

  // Seed Items
  console.log('Seeding items...');
  const item1 = await prisma.item.create({
    data: {
      itemType: 'goods',
      name: 'Laptop - Dell Latitude 5420',
      sku: 'LAP-DELL-5420',
      unit: 'pcs',
      hsnCode: '84713010',
      taxPreference: 'taxable',
      intraStateTaxRate: 'GST18 (18%)',
      intraStateTaxPercentage: 18.00,
      interStateTaxRate: 'IGST18 (18%)',
      interStateTaxPercentage: 18.00,
      isSellable: true,
      sellingPrice: 65000.00,
      salesAccount: 'Sales',
      salesDescription: 'Dell Latitude 5420 Business Laptop',
      isPurchasable: true,
      costPrice: 55000.00,
      purchaseAccount: 'Cost of Goods Sold',
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
      sku: 'SVC-IT-CONS',
      unit: 'hrs',
      hsnCode: '998314',
      taxPreference: 'taxable',
      intraStateTaxRate: 'GST18 (18%)',
      intraStateTaxPercentage: 18.00,
      interStateTaxRate: 'IGST18 (18%)',
      interStateTaxPercentage: 18.00,
      isSellable: true,
      sellingPrice: 2500.00,
      salesAccount: 'Service Revenue',
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
        quantity: 5,
        unit: 'pcs',
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
        unit: 'pcs',
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
