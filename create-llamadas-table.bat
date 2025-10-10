@echo off
REM Create llamadas_data table in local PostgreSQL database
REM Usage: create-llamadas-table.bat [local|cloud]

echo.
echo =====================================================
echo   Create llamadas_data Table
echo =====================================================
echo.

if "%1"=="" (
    echo Target: Local Database
    node run-create-llamadas-table.js local
) else (
    echo Target: %1 Database
    node run-create-llamadas-table.js %1
)

echo.
pause

