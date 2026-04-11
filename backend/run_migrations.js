// Migration runner script for PostgreSQL
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bookkeeping',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Get all migration files sorted by name
function getMigrationFiles() {
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql') && !file.toLowerCase().includes('rollback'))
    .sort();
}

// Run a single migration file
async function runMigration(filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf8');
  
  console.log(`Running migration: ${filename}`);
  
  try {
    await pool.query(sql);
    console.log(`✓ Migration ${filename} completed successfully`);
    return true;
  } catch (error) {
    console.error(`✗ Migration ${filename} failed:`, error.message);
    throw error;
  }
}

// Run all migrations
async function runAllMigrations() {
  console.log('Starting database migrations...\n');
  
  const files = getMigrationFiles();
  
  if (files.length === 0) {
    console.log('No migration files found.');
    return;
  }
  
  for (const file of files) {
    await runMigration(file);
  }
  
  console.log('\n✓ All migrations completed successfully!');
}

// Main execution
async function main() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('✓ Database connection successful\n');
    client.release();
    
    // Run migrations
    await runAllMigrations();
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runAllMigrations, runMigration };
