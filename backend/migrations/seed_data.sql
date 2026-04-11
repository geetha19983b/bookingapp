-- Clear all tables before inserting (idempotent seed)

DELETE FROM vendor_items_history;
DELETE FROM items;
DELETE FROM contact_persons;
DELETE FROM vendors;

-- Insert vendors with explicit IDs
INSERT INTO vendors (
    id, display_name, company_name, 
    email, work_phone, mobile_phone,
    gst_treatment, gstin, source_of_supply, pan,
    is_msme_registered, currency, opening_balance, payment_terms,
    billing_address_line1, billing_city, billing_state, billing_country, billing_zip_code
) VALUES
    (1, 'ABC Supplies Ltd', 'ABC Supplies Private Limited', 'rajesh@abcsupplies.com', '+91-11-12345678', '+91-9876543210', 'Registered Business - Regular', '29AAACC1234E1Z5', 'Karnataka', 'AAACC1234E', true, 'INR', 0.00, 'Net 30', '123 Industrial Area, Phase 2', 'Bangalore', 'Karnataka', 'India', '560001'),
    (2, 'XYZ Enterprises', 'XYZ Enterprises', 'priya@xyzent.com', '+91-22-87654321', '+91-9123456789', 'Registered Business - Regular', '27BBBDD5678F1Z3', 'Maharashtra', 'BBBDD5678F', false, 'INR', 5000.00, 'Due on Receipt', '456 Business Park', 'Mumbai', 'Maharashtra', 'India', '400001'),
    (3, 'Tech Solutions Inc', 'Tech Solutions India Private Limited', 'amit@techsolutions.in', '+91-80-23456789', '+91-9988776655', 'Registered Business - Regular', '29CCCEE9012G1Z9', 'Karnataka', 'CCCEE9012G', true, 'INR', 0.00, 'Net 15', '789 Tech Park, Whitefield', 'Bangalore', 'Karnataka', 'India', '560066');

-- Reset vendor id sequence
SELECT setval(pg_get_serial_sequence('vendors', 'id'), (SELECT MAX(id) FROM vendors));

-- Insert contact persons for vendors
INSERT INTO contact_persons (
    vendor_id, salutation, first_name, last_name, 
    email, work_phone, mobile_phone, designation, is_primary
) VALUES
(1, 'Mr.', 'Rajesh', 'Kumar', 'rajesh@abcsupplies.com', '+91-11-12345678', '+91-9876543210', 'Director', true),
(1, 'Ms.', 'Sneha', 'Reddy', 'sneha@abcsupplies.com', '+91-11-12345679', '+91-9876543211', 'Sales Manager', false),
(2, 'Mrs.', 'Priya', 'Sharma', 'priya@xyzent.com', '+91-22-87654321', '+91-9123456789', 'CEO', true),
(3, 'Mr.', 'Amit', 'Patel', 'amit@techsolutions.in', '+91-80-23456789', '+91-9988776655', 'Managing Director', true);


INSERT INTO items (
    id, item_type, name, sku, unit, hsn_code,
    tax_preference, intra_state_tax_rate, intra_state_tax_percentage,
    inter_state_tax_rate, inter_state_tax_percentage,
    is_sellable, selling_price, sales_account, sales_description,
    is_purchasable, cost_price, purchase_account, purchase_description,
    preferred_vendor_id, track_inventory
) VALUES
    (1, 'goods', 'Laptop - Dell Inspiron 15', 'LAP-DELL-INS15-001', 'pcs', '84713000', 'taxable', 'GST18 (18%)', 18.00, 'IGST18 (18%)', 18.00, true, 55000.00, 'Sales', 'Dell Inspiron 15 Laptop with 8GB RAM and 512GB SSD', true, 45000.00, 'Cost of Goods Sold', 'Dell Inspiron 15 Laptop for resale', 1, true),
    (2, 'goods', 'Office Chair - Ergonomic', 'FURN-CHAIR-ERG-001', 'pcs', '94016900', 'taxable', 'GST18 (18%)', 18.00, 'IGST18 (18%)', 18.00, true, 8500.00, 'Sales', 'Ergonomic office chair with lumbar support', true, 6000.00, 'Cost of Goods Sold', 'Ergonomic office chair for office use', 2, true),
    (3, 'goods', 'Printer Ink Cartridge - HP 680', 'CONS-INK-HP680-001', 'pcs', '84439990', 'taxable', 'GST18 (18%)', 18.00, 'IGST18 (18%)', 18.00, true, 450.00, 'Sales', 'HP 680 Black Ink Cartridge', true, 350.00, 'Cost of Goods Sold', 'HP 680 ink cartridge for retail', 1, true),
    (4, 'service', 'IT Consulting Services', 'SRV-IT-CONS-001', 'hours', '998314', 'taxable', 'GST18 (18%)', 18.00, 'IGST18 (18%)', 18.00, true, 2500.00, 'Sales', 'Professional IT consulting and advisory services', false, 0.00, 'Cost of Goods Sold', '', null, false),
    (5, 'service', 'Software Development', 'SRV-DEV-SOFT-001', 'hours', '998314', 'taxable', 'GST18 (18%)', 18.00, 'IGST18 (18%)', 18.00, true, 3500.00, 'Sales', 'Custom software development services', false, 0.00, 'Cost of Goods Sold', '', null, false);

-- Reset items id sequence
SELECT setval(pg_get_serial_sequence('items', 'id'), (SELECT MAX(id) FROM items));

-- Insert vendor items purchase history
INSERT INTO vendor_items_history (
    vendor_id, item_id, purchase_price, quantity, unit,
    purchase_order_number, invoice_number, purchase_date, notes
) VALUES
(1, 1, 44000.00, 10, 'pcs', 'PO-2024-001', 'INV-001', '2024-01-15', 'Bulk purchase - 10 units'),
(1, 3, 340.00, 100, 'pcs', 'PO-2024-002', 'INV-002', '2024-01-20', 'Stock replenishment'),
(2, 2, 5800.00, 20, 'pcs', 'PO-2024-003', 'INV-003', '2024-02-05', 'Office furniture order'),
(1, 1, 43500.00, 5, 'pcs', 'PO-2024-004', 'INV-004', '2024-02-10', 'Follow-up order with better pricing'),
(2, 2, 5900.00, 10, 'pcs', 'PO-2024-005', 'INV-005', '2024-03-01', 'Additional chairs for new office');

-- Display summary
SELECT 'Vendors' as table_name, COUNT(*) as record_count FROM vendors
UNION ALL
SELECT 'Contact Persons', COUNT(*) FROM contact_persons
UNION ALL
SELECT 'Items', COUNT(*) FROM items
UNION ALL
SELECT 'Vendor Items History', COUNT(*) FROM vendor_items_history;
