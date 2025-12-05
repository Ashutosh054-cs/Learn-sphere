# Quick Database Setup Verification
# Run this after setting up Supabase to verify everything is working

Write-Host "Checking LearnSphere Database Setup..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check if credentials are set
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "your-project-id|your-anon-key") {
        Write-Host "⚠️  WARNING: .env still contains placeholder values!" -ForegroundColor Yellow
        Write-Host "   Update .env with your actual Supabase credentials" -ForegroundColor Yellow
    } else {
        Write-Host "✅ .env appears to be configured" -ForegroundColor Green
    }
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "   Create .env file with your Supabase credentials" -ForegroundColor Yellow
}

Write-Host ""

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules not found - run 'npm install'" -ForegroundColor Yellow
}

Write-Host ""

# Check if database setup files exist
$sqlFiles = @(
    "database\USER_PROFILES_SETUP.sql",
    "database\COMPLETE_DATABASE_SETUP.sql"
)

foreach ($file in $sqlFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file not found!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open Supabase Dashboard: https://app.supabase.com" -ForegroundColor White
Write-Host "2. Go to SQL Editor and run: database\USER_PROFILES_SETUP.sql" -ForegroundColor White
Write-Host "3. Then run: database\COMPLETE_DATABASE_SETUP.sql" -ForegroundColor White
Write-Host "4. Create Storage bucket 'user-uploads' (see SUPABASE_SETUP_GUIDE.md)" -ForegroundColor White
Write-Host "5. Run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Full Guide: SUPABASE_SETUP_GUIDE.md" -ForegroundColor Cyan
