-- Update Dynamic Dashboard Values Script
-- This script demonstrates how to update specific values in the dynamic dashboard

-- =====================================================
-- 🔄 UPDATE METRICS VALUES
-- =====================================================

-- Update "Ventas Totales" from 125000 to 160000
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '160000')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'ventas' 
  AND data_type = 'metric' 
  AND data_key = 'ventas-totales';

-- Update "Tasa de Conversión" from 3.2 to 4.1
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '4.1')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'ventas' 
  AND data_type = 'metric' 
  AND data_key = 'conversion-rate';

-- Update "Leads Generados" from 1250 to 1800
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '1800')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'ventas' 
  AND data_type = 'metric' 
  AND data_key = 'leads-generados';

-- Update "Costo de Adquisición" from 45 to 38
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '38')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'ventas' 
  AND data_type = 'metric' 
  AND data_key = 'costo-adquisicion';

-- =====================================================
-- 📊 UPDATE CHART DATA VALUES
-- =====================================================

-- Update the last month value in "Evolución de Ventas" chart
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{data,5,value}', '160000')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'ventas' 
  AND data_type = 'chart' 
  AND data_key = 'ventas-tiempo';

-- Update "Ventas por Canal" - increase Web percentage
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{data,0,value}', '55')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'ventas' 
  AND data_type = 'chart' 
  AND data_key = 'canales-venta';

-- =====================================================
-- 🎯 UPDATE MARKETING METRICS
-- =====================================================

-- Update "Impresiones" from 2500000 to 3200000
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '3200000')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'marketing' 
  AND data_type = 'metric' 
  AND data_key = 'impresiones';

-- Update "CTR" from 2.1 to 2.8
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '2.8')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'marketing' 
  AND data_type = 'metric' 
  AND data_key = 'ctr';

-- Update "ROAS" from 4.2 to 5.1
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '5.1')
WHERE cliente_id = 'techcorp' 
  AND section_id = 'marketing' 
  AND data_type = 'metric' 
  AND data_key = 'roas';

-- =====================================================
-- 🔄 UPDATE LAST UPDATED TIMESTAMPS
-- =====================================================

-- Update last updated timestamp for ventas section
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{lastUpdated}', to_jsonb(now()::text))
WHERE cliente_id = 'techcorp' 
  AND section_id = 'ventas' 
  AND data_type = 'section' 
  AND data_key = 'info';

-- Update last updated timestamp for marketing section
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{lastUpdated}', to_jsonb(now()::text))
WHERE cliente_id = 'techcorp' 
  AND section_id = 'marketing' 
  AND data_type = 'section' 
  AND data_key = 'info';

-- =====================================================
-- ✅ VERIFICATION QUERIES
-- =====================================================

-- Show updated ventas metrics
SELECT 
    data_key as metric_id,
    data_value->>'name' as metric_name,
    data_value->>'value' as new_value,
    data_value->>'unit' as unit
FROM tb_dinamico 
WHERE cliente_id = 'techcorp' 
  AND section_id = 'ventas' 
  AND data_type = 'metric'
ORDER BY data_key;

-- Show updated marketing metrics
SELECT 
    data_key as metric_id,
    data_value->>'name' as metric_name,
    data_value->>'value' as new_value,
    data_value->>'unit' as unit
FROM tb_dinamico 
WHERE cliente_id = 'techcorp' 
  AND section_id = 'marketing' 
  AND data_type = 'metric'
ORDER BY data_key;

-- Show updated chart data preview
SELECT 
    section_id,
    data_key as chart_id,
    data_value->>'title' as chart_title,
    data_value->'data'->0->>'value' as first_data_point,
    data_value->'data'->-1->>'value' as last_data_point
FROM tb_dinamico 
WHERE cliente_id = 'techcorp' 
  AND data_type = 'chart'
ORDER BY section_id, data_key;

-- Show last updated timestamps
SELECT 
    section_id,
    data_value->>'title' as section_title,
    data_value->>'lastUpdated' as last_updated
FROM tb_dinamico 
WHERE cliente_id = 'techcorp' 
  AND data_type = 'section' 
  AND data_key = 'info'
ORDER BY section_id;
