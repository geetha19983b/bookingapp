-- Migration: Create contact_persons table
-- Description: Stores multiple contact persons for vendors

CREATE TABLE IF NOT EXISTS contact_persons (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    
    -- Personal Information
    salutation VARCHAR(10),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    work_phone VARCHAR(20),
    mobile_phone VARCHAR(20),
    
    -- Additional Information
    designation VARCHAR(100),
    department VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_persons_vendor_id ON contact_persons(vendor_id);
CREATE INDEX IF NOT EXISTS idx_contact_persons_email ON contact_persons(email);
CREATE INDEX IF NOT EXISTS idx_contact_persons_is_primary ON contact_persons(is_primary);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_persons_updated_at()
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
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_contact_persons_updated_at'
    ) THEN
        EXECUTE 'DROP TRIGGER trigger_contact_persons_updated_at ON contact_persons';
    END IF;
END$$;

CREATE TRIGGER trigger_contact_persons_updated_at
    BEFORE UPDATE ON contact_persons
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_persons_updated_at();

-- Add comments
COMMENT ON TABLE contact_persons IS 'Stores multiple contact persons for each vendor';
COMMENT ON COLUMN contact_persons.is_primary IS 'Indicates if this is the primary contact for the vendor';
