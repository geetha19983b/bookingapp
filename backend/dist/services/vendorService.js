"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendor = exports.updateVendor = exports.createVendor = void 0;
const db_1 = require("../db");
const VENDOR_COLUMNS = [
    'company_name',
    'display_name',
    'email',
    'work_phone',
    'mobile_phone',
    'billing_address_line1',
    'billing_address_line2',
    'billing_city',
    'billing_state',
    'billing_country',
    'billing_zip_code',
    'shipping_address_line1',
    'shipping_address_line2',
    'shipping_city',
    'shipping_state',
    'shipping_country',
    'shipping_zip_code',
    'gst_treatment',
    'gstin',
    'source_of_supply',
    'pan',
    'is_msme_registered',
    'currency',
    'opening_balance',
    'payment_terms',
    'bank_name',
    'bank_account_number',
    'bank_ifsc_code',
    'bank_branch',
    'remarks',
    'custom_fields',
    'reporting_tags',
    'is_active',
    'created_by',
    'updated_by',
];
const buildInsertQuery = (payload) => {
    const payloadRecord = payload;
    const keys = Object.keys(payloadRecord).filter((key) => VENDOR_COLUMNS.includes(key));
    const columns = keys.join(', ');
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const values = keys.map((key) => payloadRecord[key]);
    return {
        sql: `INSERT INTO vendors (${columns}) VALUES (${placeholders}) RETURNING *`,
        values,
    };
};
const buildUpdateQuery = (vendorId, payload) => {
    const payloadRecord = payload;
    const keys = Object.keys(payloadRecord).filter((key) => VENDOR_COLUMNS.includes(key));
    const updates = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = keys.map((key) => payloadRecord[key]);
    return {
        sql: `UPDATE vendors SET ${updates} WHERE id = $${keys.length + 1} RETURNING *`,
        values: [...values, vendorId],
    };
};
const createVendor = async (payload) => {
    const { sql, values } = buildInsertQuery(payload);
    const result = await (0, db_1.query)(sql, values);
    return result.rows[0];
};
exports.createVendor = createVendor;
const updateVendor = async (vendorId, payload) => {
    const { sql, values } = buildUpdateQuery(vendorId, payload);
    const result = await (0, db_1.query)(sql, values);
    return result.rows[0] || null;
};
exports.updateVendor = updateVendor;
const deleteVendor = async (vendorId) => {
    const result = await (0, db_1.query)('DELETE FROM vendors WHERE id = $1 RETURNING id', [vendorId]);
    return result.rows[0] || null;
};
exports.deleteVendor = deleteVendor;
