# PowerShell script to update "Evolución de Ventas" chart
# This script sets the environment variables and runs the update

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Update 'Evolucion de Ventas' Chart" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:DATABASE_URL = "postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard?schema=public"
$env:NODE_ENV = "development"

Write-Host "Database URL set to: $($env:DATABASE_URL)" -ForegroundColor Green
Write-Host ""

Write-Host "Available months: Ene, Feb, Mar, Abr, May, Jun" -ForegroundColor Yellow
Write-Host ""
Write-Host "Usage examples:" -ForegroundColor Yellow
Write-Host "  node update-ventas-chart.js Jun 150000"
Write-Host "  node update-ventas-chart.js Ene 95000"
Write-Host "  node update-ventas-chart.js Mar 120000"
Write-Host ""
Write-Host "Or run interactive mode:"
Write-Host "  node update-multiple-months.js"
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

$choice = Read-Host "Choose option (1 for single month, 2 for multiple months)"

if ($choice -eq "1") {
    Write-Host ""
    $month = Read-Host "Enter month (Ene, Feb, Mar, Abr, May, Jun)"
    $value = Read-Host "Enter new value"
    node update-ventas-chart.js $month $value
} elseif ($choice -eq "2") {
    node update-multiple-months.js
} else {
    Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
