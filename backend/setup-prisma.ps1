# Prisma Setup Script
# This script helps you set up Prisma ORM for the BookKeeping App

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Prisma ORM Setup for BookKeeping App" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create a .env file with the following content:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host 'DATABASE_URL="postgresql://postgres:your_password@localhost:5432/bookkeeping_db?schema=public"' -ForegroundColor Gray
    Write-Host ""
    Write-Host "You can copy .env.example and update it with your credentials:" -ForegroundColor Yellow
    Write-Host "  copy .env.example .env" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green

# Check if DATABASE_URL is set
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch "DATABASE_URL") {
    Write-Host "❌ DATABASE_URL not found in .env file!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please add DATABASE_URL to your .env file:" -ForegroundColor Yellow
    Write-Host 'DATABASE_URL="postgresql://postgres:your_password@localhost:5432/bookkeeping_db?schema=public"' -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ DATABASE_URL configured" -ForegroundColor Green
Write-Host ""

# Ask user which option they want
Write-Host "Choose setup option:" -ForegroundColor Cyan
Write-Host "  1. Fresh setup (create new database and tables)" -ForegroundColor White
Write-Host "  2. Use existing database (introspect existing tables)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "🚀 Starting fresh setup..." -ForegroundColor Cyan
    Write-Host ""
    
    # Generate Prisma Client
    Write-Host "Step 1: Generating Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Prisma Client generated" -ForegroundColor Green
    Write-Host ""
    
    # Run migrations
    Write-Host "Step 2: Running migrations..." -ForegroundColor Yellow
    npx prisma migrate dev --name init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Migration failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Migrations applied" -ForegroundColor Green
    Write-Host ""
    
    # Ask if user wants to seed
    $seedChoice = Read-Host "Do you want to seed the database with sample data? (y/n)"
    if ($seedChoice -eq "y" -or $seedChoice -eq "Y") {
        Write-Host "Step 3: Seeding database..." -ForegroundColor Yellow
        npx prisma db seed
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  Seeding failed (you can run 'npm run prisma:seed' later)" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Database seeded successfully" -ForegroundColor Green
        }
    }
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "🔍 Using existing database..." -ForegroundColor Cyan
    Write-Host ""
    
    # Pull from existing database
    Write-Host "Step 1: Introspecting database..." -ForegroundColor Yellow
    npx prisma db pull
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to introspect database" -ForegroundColor Red
        Write-Host "Make sure:" -ForegroundColor Yellow
        Write-Host "  - PostgreSQL is running" -ForegroundColor Gray
        Write-Host "  - Database exists and is accessible" -ForegroundColor Gray
        Write-Host "  - DATABASE_URL credentials are correct" -ForegroundColor Gray
        exit 1
    }
    Write-Host "✅ Database schema pulled" -ForegroundColor Green
    Write-Host ""
    
    # Generate Prisma Client
    Write-Host "Step 2: Generating Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Prisma Client generated" -ForegroundColor Green
    
} else {
    Write-Host "❌ Invalid choice" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Prisma setup completed!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Start the backend: npm run dev" -ForegroundColor White
Write-Host "  2. Open Prisma Studio: npm run prisma:studio" -ForegroundColor White
Write-Host "  3. View migration guide: See PRISMA_MIGRATION_GUIDE.md" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  npm run prisma:studio     - Open database GUI" -ForegroundColor White
Write-Host "  npm run prisma:generate   - Regenerate Prisma Client" -ForegroundColor White
Write-Host "  npm run prisma:migrate    - Create new migration" -ForegroundColor White
Write-Host "  npm run prisma:seed       - Seed database" -ForegroundColor White
Write-Host ""
