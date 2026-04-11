-- Migration: Create vendor_items_history table
-- Description: Tracks purchase history and pricing for items from vendors

CREATE TABLE IF NOT EXISTS vendor_items_history (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    
    -- Purchase Information
    purchase_price DECIMAL(15, 2) NOT NULL,
    quantity DECIMAL(15, 2),
    unit VARCHAR(50),
    
    -- Reference Information
    purchase_order_number VARCHAR(100),
    invoice_number VARCHAR(100),
    purchase_date DATE,
    
    -- Additional Details
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendor_items_history_vendor_id ON vendor_items_history(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_items_history_item_id ON vendor_items_history(item_id);
CREATE INDEX IF NOT EXISTS idx_vendor_items_history_purchase_date ON vendor_items_history(purchase_date);
CREATE INDEX IF NOT EXISTS idx_vendor_items_history_composite ON vendor_items_history(vendor_id, item_id, purchase_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vendor_items_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Drop trigger if it exists (PostgreSQL does not support IF NOT EXISTS for triggers)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_vendor_items_history_updated_at'
    ) THEN
        EXECUTE 'DROP TRIGGER trigger_vendor_items_history_updated_at ON vendor_items_history';
    END IF;
END$$;

CREATE TRIGGER trigger_vendor_items_history_updated_at
    BEFORE UPDATE ON vendor_items_history
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_items_history_updated_at();

-- Add comments
COMMENT ON TABLE vendor_items_history IS 'Tracks purchase history and pricing for items purchased from vendors';
COMMENT ON COLUMN vendor_items_history.purchase_price IS 'Price at which the item was purchased from the vendor';
