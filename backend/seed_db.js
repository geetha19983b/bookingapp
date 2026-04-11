// Node.js-based seed script for PostgreSQL using pg and dotenv
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bookkeeping',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function runSeed() {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', 'seed_data.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('✓ Database seeded successfully');
  } catch (err) {
    console.error('✗ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runSeed();
}
