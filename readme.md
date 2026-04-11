npx create-vite@latest . --template react

npm uninstall tailwindcss
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

//backend
npm init -y
npm install express

node backend.js


npm run dev

#db

# 1. Install dependencies
cd backend
npm install

# 2. Create database
psql -U postgres -c "CREATE DATABASE bookkeeping_db;"

# 3. Update .env with your PostgreSQL password

# 4. Run migrations and load sample data
npm run db:setup

# roll back and run
npm run migrate -- --rollback

npm run migrate
npm run seed

# (or)
npm run db:setup
