@echo off
REM Buffalo AI - Cloud to Local Database Sync (Windows Batch)
REM Simple launcher for the sync script

echo.
echo 🔄 Buffalo AI - Cloud to Local Database Sync
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo    Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ .env.local file not found!
    echo    Please create .env.local with DATABASE_URL_CLOUD
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules\pg" (
    echo 📦 Installing required dependencies...
    call npm install pg dotenv
    echo.
)

REM Display menu
echo Select sync mode:
echo 1. Basic Sync (fast, simple)
echo 2. Advanced Sync (handles foreign keys, indexes)
echo 3. Dry Run (see what would be synced)
echo 4. Structure Only (no data)
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Running basic sync...
    node sync-cloud-to-local.js
) else if "%choice%"=="2" (
    echo.
    echo 🚀 Running advanced sync...
    node sync-cloud-to-local-advanced.js
) else if "%choice%"=="3" (
    echo.
    echo 🚀 Running dry run...
    node sync-cloud-to-local-advanced.js --dry-run
) else if "%choice%"=="4" (
    echo.
    echo 🚀 Running structure only sync...
    node sync-cloud-to-local-advanced.js --skip-data
) else (
    echo.
    echo ❌ Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
pause

