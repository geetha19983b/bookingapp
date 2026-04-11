"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = exports.getClient = exports.query = exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'bookkeeping',
    password: process.env.DB_PASSWORD || 'postgres',
    port: Number.parseInt(process.env.DB_PORT || '5432', 10),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});
exports.pool.on('error', (error) => {
    console.error('Unexpected error on idle client', error);
    process.exit(-1);
});
const query = async (text, params = []) => {
    const start = Date.now();
    try {
        const result = await exports.pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    }
    catch (error) {
        const err = error;
        console.error('Query error', { text, error: err.message });
        throw error;
    }
};
exports.query = query;
const getClient = async () => exports.pool.connect();
exports.getClient = getClient;
const transaction = async (callback) => {
    const client = await (0, exports.getClient)();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
};
exports.transaction = transaction;
