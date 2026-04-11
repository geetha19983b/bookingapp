-- Rollback script for all migrations
-- Run these in reverse order to undo migrations

-- 004 Rollback - vendor_items_history
DROP TABLE IF EXISTS vendor_items_history CASCADE;
DROP FUNCTION IF EXISTS update_vendor_items_history_updated_at();

-- 003 Rollback - contact_persons  
DROP TABLE IF EXISTS contact_persons CASCADE;
DROP FUNCTION IF EXISTS update_contact_persons_updated_at();

-- 002 Rollback - items
DROP TABLE IF EXISTS items CASCADE;
DROP FUNCTION IF EXISTS update_items_updated_at();

-- 001 Rollback - vendors
DROP TABLE IF EXISTS vendors CASCADE;
DROP FUNCTION IF EXISTS update_vendors_updated_at();

SELECT 'All tables dropped successfully' as status;
