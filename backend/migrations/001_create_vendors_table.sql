-- Migration: Create vendors table
-- Description: Stores vendor/supplier information for the bookkeeping app

CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    display_name VARCHAR(255) NOT NULL UNIQUE,
    
    -- Contact Details
    email VARCHAR(255),
    work_phone VARCHAR(20),
    mobile_phone VARCHAR(20),
    
    -- Address Information
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_country VARCHAR(100),
    billing_zip_code VARCHAR(20),
    
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_country VARCHAR(100),
    shipping_zip_code VARCHAR(20),
    
    -- GST & Tax Information
    gst_treatment VARCHAR(100),
    gstin VARCHAR(15),
    source_of_supply VARCHAR(100),
    pan VARCHAR(10),
    
    -- Business Information
    is_msme_registered BOOLEAN DEFAULT FALSE,
    currency VARCHAR(3) DEFAULT 'INR',
    opening_balance DECIMAL(15, 2) DEFAULT 0.00,
    payment_terms VARCHAR(100) DEFAULT 'Due on Receipt',
    
    -- Bank Details
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc_code VARCHAR(11),
    bank_branch VARCHAR(255),
    
    -- Additional Information
    remarks TEXT,
    custom_fields JSONB,
    reporting_tags TEXT[],
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vendors_display_name ON vendors(display_name);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_gstin ON vendors(gstin);
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vendors_updated_at()
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
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_vendors_updated_at'
    ) THEN
        EXECUTE 'DROP TRIGGER trigger_vendors_updated_at ON vendors';
    END IF;
END$$;

CREATE TRIGGER trigger_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_vendors_updated_at();

-- Add comments for documentation
COMMENT ON TABLE vendors IS 'Stores vendor/supplier information';
COMMENT ON COLUMN vendors.display_name IS 'Unique display name for the vendor (required)';
COMMENT ON COLUMN vendors.gst_treatment IS 'GST treatment type for the vendor';
COMMENT ON COLUMN vendors.source_of_supply IS 'Source of supply state/location';
COMMENT ON COLUMN vendors.is_msme_registered IS 'Whether the vendor is MSME registered';
