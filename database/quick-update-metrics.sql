-- 🚀 Quick Update Script for Dynamic Dashboard Values
-- Easy to modify for different clients and values

-- =====================================================
-- 📝 INSTRUCTIONS:
-- 1. Change 'techcorp' to your client ID
-- 2. Modify the values as needed
-- 3. Run this script to update the dashboard
-- =====================================================

-- Set client ID (change this for different clients)
\set client_id 'techcorp'

-- =====================================================
-- 💰 VENTAS METRICS UPDATES
-- =====================================================

-- Update Ventas Totales (€)
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '160000')
WHERE cliente_id = :'client_id' 
  AND section_id = 'ventas' 
  AND data_type = 'metric' 
  AND data_key = 'ventas-totales';

-- Update Tasa de Conversión (%)
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '4.1')
WHERE cliente_id = :'client_id' 
  AND section_id = 'ventas' 
  AND data_type = 'metric' 
  AND data_key = 'conversion-rate';

-- Update Leads Generados
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '1800')
WHERE cliente_id = :'client_id' 
  AND section_id = 'ventas' 
  AND data_type = 'metric' 
  AND data_key = 'leads-generados';

-- Update Costo de Adquisición (€)
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '38')
WHERE cliente_id = :'client_id' 
  AND section_id = 'ventas' 
  AND data_type = 'metric' 
  AND data_key = 'costo-adquisicion';

-- =====================================================
-- 📈 MARKETING METRICS UPDATES
-- =====================================================

-- Update Impresiones
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '3200000')
WHERE cliente_id = :'client_id' 
  AND section_id = 'marketing' 
  AND data_type = 'metric' 
  AND data_key = 'impresiones';

-- Update CTR (%)
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '2.8')
WHERE cliente_id = :'client_id' 
  AND section_id = 'marketing' 
  AND data_type = 'metric' 
  AND data_key = 'ctr';

-- Update ROAS (x)
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{value}', '5.1')
WHERE cliente_id = :'client_id' 
  AND section_id = 'marketing' 
  AND data_type = 'metric' 
  AND data_key = 'roas';

-- =====================================================
-- 📊 CHART DATA UPDATES
-- =====================================================

-- Update last month in Ventas chart
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{data,5,value}', '160000')
WHERE cliente_id = :'client_id' 
  AND section_id = 'ventas' 
  AND data_type = 'chart' 
  AND data_key = 'ventas-tiempo';

-- Update Web channel percentage
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{data,0,value}', '55')
WHERE cliente_id = :'client_id' 
  AND section_id = 'ventas' 
  AND data_type = 'chart' 
  AND data_key = 'canales-venta';

-- =====================================================
-- 🕒 UPDATE TIMESTAMPS
-- =====================================================

-- Update timestamps
UPDATE tb_dinamico 
SET data_value = jsonb_set(data_value, '{lastUpdated}', to_jsonb(now()::text))
WHERE cliente_id = :'client_id' 
  AND data_type = 'section' 
  AND data_key = 'info';

-- =====================================================
-- ✅ SHOW RESULTS
-- =====================================================

-- Show updated values
SELECT 
    section_id,
    data_key,
    data_value->>'name' as name,
    data_value->>'value' as value,
    data_value->>'unit' as unit
FROM tb_dinamico 
WHERE cliente_id = :'client_id' 
  AND data_type = 'metric'
ORDER BY section_id, data_key;
