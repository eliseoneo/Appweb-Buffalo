# Buffalo AI - Cloud to Local Database Sync (PowerShell)
# 
# This script syncs data from cloud PostgreSQL to local PostgreSQL
# One-way sync: Cloud -> Local
#
# Usage: .\sync-cloud-to-local.ps1

Write-Host ""
Write-Host "🔄 Buffalo AI - Cloud to Local Database Sync" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "   Please create .env.local with DATABASE_URL_CLOUD" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found .env.local configuration" -ForegroundColor Green
Write-Host ""

# Check if pg module is installed
$pgInstalled = Test-Path "node_modules/pg"
if (-not $pgInstalled) {
    Write-Host "📦 Installing required dependencies..." -ForegroundColor Yellow
    npm install pg dotenv
    Write-Host ""
}

# Display menu
Write-Host "Select sync mode:" -ForegroundColor Cyan
Write-Host "1. Basic Sync (fast, simple)" -ForegroundColor White
Write-Host "2. Advanced Sync (handles foreign keys, indexes)" -ForegroundColor White
Write-Host "3. Dry Run (see what would be synced)" -ForegroundColor White
Write-Host "4. Structure Only (no data)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Running basic sync..." -ForegroundColor Green
        node sync-cloud-to-local.js
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Running advanced sync..." -ForegroundColor Green
        node sync-cloud-to-local-advanced.js
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Running dry run..." -ForegroundColor Green
        node sync-cloud-to-local-advanced.js --dry-run
    }
    "4" {
        Write-Host ""
        Write-Host "🚀 Running structure only sync..." -ForegroundColor Green
        node sync-cloud-to-local-advanced.js --skip-data
    }
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

