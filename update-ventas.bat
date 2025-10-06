@echo off
echo ========================================
echo  Update "Evolucion de Ventas" Chart
echo ========================================
echo.
echo Available months: Ene, Feb, Mar, Abr, May, Jun
echo.
echo Usage examples:
echo   node update-ventas-chart.js Jun 150000
echo   node update-ventas-chart.js Ene 95000
echo   node update-ventas-chart.js Mar 120000
echo.
echo Or run interactive mode:
echo   node update-multiple-months.js
echo.
echo ========================================

set /p choice="Choose option (1 for single month, 2 for multiple months): "

if "%choice%"=="1" (
    echo.
    set /p month="Enter month (Ene, Feb, Mar, Abr, May, Jun): "
    set /p value="Enter new value: "
    node update-ventas-chart.js %month% %value%
) else if "%choice%"=="2" (
    node update-multiple-months.js
) else (
    echo Invalid choice. Please run the script again.
)

pause
