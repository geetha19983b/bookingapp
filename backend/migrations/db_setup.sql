-- Database configuration for PostgreSQL connection

-- Create database (run this separately as postgres superuser if needed)
-- CREATE DATABASE bookkeeping_db;
-- \c bookkeeping_db;

-- Create a dedicated user for the application (optional)
-- CREATE USER bookkeeper WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE bookkeeping_db TO bookkeeper;

-- After running migrations, grant permissions on tables
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bookkeeper;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bookkeeper;

-- Connection string format for Node.js pg library:
-- postgresql://username:password@localhost:5432/bookkeeping_db

-- Environment variables to set:
-- DB_USER=postgres
-- DB_HOST=localhost
-- DB_NAME=bookkeeping_db
-- DB_PASSWORD=your_password
-- DB_PORT=5432
