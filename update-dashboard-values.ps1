# 🚀 Dynamic Dashboard Value Updater
# Simple PowerShell script to update dashboard values

param(
    [string]$ClientId = "techcorp",
    [string]$Section = "ventas",
    [string]$MetricKey = "ventas-totales",
    [string]$NewValue = "160000"
)

Write-Host "🔄 Updating dashboard values..." -ForegroundColor Cyan
Write-Host "Client: $ClientId" -ForegroundColor Yellow
Write-Host "Section: $Section" -ForegroundColor Yellow
Write-Host "Metric: $MetricKey" -ForegroundColor Yellow
Write-Host "New Value: $NewValue" -ForegroundColor Yellow

# Create temporary SQL file
$sqlContent = @"
-- Update metric value
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '$NewValue')
WHERE cliente_id = '$ClientId' 
  AND section_id = '$Section' 
  AND data_type = 'metric' 
  AND data_key = '$MetricKey';

-- Update timestamp
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{lastUpdated}', to_jsonb(now()::text))
WHERE cliente_id = '$ClientId' 
  AND section_id = '$Section' 
  AND data_type = 'section' 
  AND data_key = 'info';

-- Show result
SELECT 
    data_key,
    data_value->>'name' as name,
    data_value->>'value' as value,
    data_value->>'unit' as unit
FROM tb_dinamico 
WHERE cliente_id = '$ClientId' 
  AND section_id = '$Section' 
  AND data_type = 'metric' 
  AND data_key = '$MetricKey';
"@

$tempFile = "temp-update.sql"
$sqlContent | Out-File -FilePath $tempFile -Encoding UTF8

try {
    # Execute the SQL
    Get-Content $tempFile | docker exec -i buffalo-postgres psql -U buffalo_user -d buffalo_dashboard
    
    Write-Host "✅ Update completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error updating values: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # Clean up temporary file
    if (Test-Path $tempFile) {
        Remove-Item $tempFile
    }
}

Write-Host "`n📝 Usage Examples:" -ForegroundColor Cyan
Write-Host "  .\update-dashboard-values.ps1 -ClientId 'techcorp' -Section 'ventas' -MetricKey 'ventas-totales' -NewValue '200000'" -ForegroundColor Gray
Write-Host "  .\update-dashboard-values.ps1 -ClientId 'techcorp' -Section 'marketing' -MetricKey 'impresiones' -NewValue '5000000'" -ForegroundColor Gray
