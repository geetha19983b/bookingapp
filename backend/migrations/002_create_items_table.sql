-- Migration: Create items table
-- Description: Stores items (goods/services) information for inventory and sales

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    
    -- Basic Information
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('goods', 'service')),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    unit VARCHAR(50),
    hsn_code VARCHAR(20),
    
    -- Tax Information
    tax_preference VARCHAR(50) NOT NULL DEFAULT 'taxable',
    intra_state_tax_rate VARCHAR(50), -- e.g., 'GST18 (18 %)'
    intra_state_tax_percentage DECIMAL(5, 2), -- 18.00
    inter_state_tax_rate VARCHAR(50), -- e.g., 'IGST18 (18 %)'
    inter_state_tax_percentage DECIMAL(5, 2), -- 18.00
    
    -- Sales Information
    is_sellable BOOLEAN DEFAULT TRUE,
    selling_price DECIMAL(15, 2),
    sales_account VARCHAR(100), -- e.g., 'Sales'
    sales_description TEXT,
    
    -- Purchase Information
    is_purchasable BOOLEAN DEFAULT TRUE,
    cost_price DECIMAL(15, 2),
    purchase_account VARCHAR(100), -- e.g., 'Cost of Goods Sold'
    purchase_description TEXT,
    preferred_vendor_id INTEGER REFERENCES vendors(id) ON DELETE SET NULL,
    
    -- Inventory Management
    track_inventory BOOLEAN DEFAULT FALSE,
    opening_stock DECIMAL(15, 2) DEFAULT 0,
    opening_stock_rate DECIMAL(15, 2) DEFAULT 0,
    reorder_level DECIMAL(15, 2),
    
    -- Images
    image_url VARCHAR(500),
    image_urls TEXT[], -- Multiple images support
    
    -- Additional Information
    custom_fields JSONB,
    tags TEXT[],
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Create indexes for better query performance

CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_sku ON items(sku);
CREATE INDEX IF NOT EXISTS idx_items_item_type ON items(item_type);
CREATE INDEX IF NOT EXISTS idx_items_hsn_code ON items(hsn_code);
CREATE INDEX IF NOT EXISTS idx_items_preferred_vendor ON items(preferred_vendor_id);
CREATE INDEX IF NOT EXISTS idx_items_is_active ON items(is_active);
CREATE INDEX IF NOT EXISTS idx_items_is_sellable ON items(is_sellable);
CREATE INDEX IF NOT EXISTS idx_items_is_purchasable ON items(is_purchasable);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);

-- Create GIN index for JSONB and array fields
CREATE INDEX IF NOT EXISTS idx_items_custom_fields ON items USING GIN(custom_fields);
CREATE INDEX IF NOT EXISTS idx_items_tags ON items USING GIN(tags);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_items_updated_at()
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
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_items_updated_at'
    ) THEN
        EXECUTE 'DROP TRIGGER trigger_items_updated_at ON items';
    END IF;
END$$;

CREATE TRIGGER trigger_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_items_updated_at();

-- Add comments for documentation
COMMENT ON TABLE items IS 'Stores items (goods/services) for inventory and sales management';
COMMENT ON COLUMN items.item_type IS 'Type of item: goods or service';
COMMENT ON COLUMN items.sku IS 'Stock Keeping Unit - unique identifier for the item';
COMMENT ON COLUMN items.hsn_code IS 'Harmonized System of Nomenclature code for GST';
COMMENT ON COLUMN items.tax_preference IS 'Tax preference: taxable, non-taxable, or exempt';
COMMENT ON COLUMN items.track_inventory IS 'Whether to track inventory for this item';
COMMENT ON COLUMN items.preferred_vendor_id IS 'Default vendor for purchasing this item';
