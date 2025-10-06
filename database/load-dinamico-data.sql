-- Load dinamico-data.json structure into tb_dinamico table
-- This script loads the JSON structure for testing dynamic loading from PostgreSQL

-- Clear existing data for cliente 'techcorp'
DELETE FROM tb_dinamico WHERE cliente_id = 'techcorp';

-- Insert page configuration
INSERT INTO tb_dinamico (cliente_id, section_id, data_type, data_key, data_value) VALUES 
('techcorp', 'page', 'pageConfig', 'main', '{
  "title": "Dashboard Dinámico",
  "subtitle": "Métricas y Análisis en Tiempo Real",
  "layout": "grid",
  "theme": "modern",
  "refreshInterval": 300000,
  "maxSections": 10,
  "showFilters": true,
  "showRefreshButton": true,
  "showAddButton": true,
  "gridColumns": {
    "mobile": 1,
    "tablet": 2,
    "desktop": 4
  },
  "chartGridColumns": {
    "mobile": 1,
    "tablet": 1,
    "desktop": 2
  },
  "defaultColors": [
    "#00bcd4",
    "#22c55e",
    "#f59e0b",
    "#e53e3e",
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#f97316"
  ],
  "chartTypes": [
    "line",
    "bar",
    "pie",
    "area"
  ]
}'::jsonb);

-- Insert section: ventas
INSERT INTO tb_dinamico (cliente_id, section_id, data_type, data_key, data_value) VALUES 
('techcorp', 'ventas', 'section', 'info', '{
  "title": "Métricas de Ventas",
  "description": "Análisis completo del rendimiento de ventas y conversiones",
  "lastUpdated": "2025-10-02T16:30:00Z"
}'::jsonb),

('techcorp', 'ventas', 'section', 'layout', '{
  "metricsPerRow": 4,
  "chartLayout": "side-by-side",
  "showDescription": true,
  "showLastUpdated": true,
  "backgroundColor": "#ffffff",
  "borderColor": "#e5e7eb",
  "accentColor": "#00bcd4"
}'::jsonb);

-- Insert metrics for ventas section
INSERT INTO tb_dinamico (cliente_id, section_id, data_type, data_key, data_value) VALUES 
('techcorp', 'ventas', 'metric', 'ventas-totales', '{
  "id": "ventas-totales",
  "name": "Ventas Totales",
  "value": 125000,
  "unit": "€",
  "trend": "up",
  "change": 12.5,
  "color": "#00bcd4",
  "category": "revenue"
}'::jsonb),

('techcorp', 'ventas', 'metric', 'conversion-rate', '{
  "id": "conversion-rate",
  "name": "Tasa de Conversión",
  "value": 3.2,
  "unit": "%",
  "trend": "up",
  "change": 0.8,
  "color": "#22c55e",
  "category": "conversion"
}'::jsonb),

('techcorp', 'ventas', 'metric', 'leads-generados', '{
  "id": "leads-generados",
  "name": "Leads Generados",
  "value": 1250,
  "unit": "",
  "trend": "stable",
  "change": 0,
  "color": "#ff9800",
  "category": "leads"
}'::jsonb),

('techcorp', 'ventas', 'metric', 'costo-adquisicion', '{
  "id": "costo-adquisicion",
  "name": "Costo de Adquisición",
  "value": 45,
  "unit": "€",
  "trend": "down",
  "change": -5.2,
  "color": "#e53e3e",
  "category": "cost"
}'::jsonb);

-- Insert charts for ventas section
INSERT INTO tb_dinamico (cliente_id, section_id, data_type, data_key, data_value) VALUES 
('techcorp', 'ventas', 'chart', 'ventas-tiempo', '{
  "id": "ventas-tiempo",
  "title": "Evolución de Ventas",
  "type": "line",
  "data": [
    { "name": "Ene", "value": 85000 },
    { "name": "Feb", "value": 92000 },
    { "name": "Mar", "value": 78000 },
    { "name": "Abr", "value": 105000 },
    { "name": "May", "value": 118000 },
    { "name": "Jun", "value": 125000 }
  ],
  "config": {
    "color": "#00bcd4",
    "height": 300,
    "showGrid": true,
    "showLegend": true,
    "showTooltip": true,
    "animation": true
  },
  "layout": {
    "width": "100%",
    "height": 300,
    "responsive": true
  }
}'::jsonb),

('techcorp', 'ventas', 'chart', 'canales-venta', '{
  "id": "canales-venta",
  "title": "Ventas por Canal",
  "type": "pie",
  "data": [
    { "name": "Web", "value": 45, "color": "#00bcd4" },
    { "name": "Email", "value": 25, "color": "#22c55e" },
    { "name": "Social", "value": 20, "color": "#ff9800" },
    { "name": "Directo", "value": 10, "color": "#e53e3e" }
  ],
  "config": {}
}'::jsonb);

-- Insert section: marketing
INSERT INTO tb_dinamico (cliente_id, section_id, data_type, data_key, data_value) VALUES 
('techcorp', 'marketing', 'section', 'info', '{
  "title": "Métricas de Marketing",
  "description": "Seguimiento de campañas y efectividad publicitaria",
  "lastUpdated": "2025-10-02T16:25:00Z"
}'::jsonb);

-- Insert metrics for marketing section
INSERT INTO tb_dinamico (cliente_id, section_id, data_type, data_key, data_value) VALUES 
('techcorp', 'marketing', 'metric', 'impresiones', '{
  "id": "impresiones",
  "name": "Impresiones",
  "value": 2500000,
  "unit": "",
  "trend": "up",
  "change": 18.3,
  "color": "#3b82f6",
  "category": "reach"
}'::jsonb),

('techcorp', 'marketing', 'metric', 'ctr', '{
  "id": "ctr",
  "name": "CTR",
  "value": 2.1,
  "unit": "%",
  "trend": "up",
  "change": 0.3,
  "color": "#22c55e",
  "category": "engagement"
}'::jsonb),

('techcorp', 'marketing', 'metric', 'cpm', '{
  "id": "cpm",
  "name": "CPM",
  "value": 8.50,
  "unit": "€",
  "trend": "down",
  "change": -1.2,
  "color": "#e53e3e",
  "category": "cost"
}'::jsonb),

('techcorp', 'marketing', 'metric', 'roas', '{
  "id": "roas",
  "name": "ROAS",
  "value": 4.2,
  "unit": "x",
  "trend": "up",
  "change": 0.8,
  "color": "#10b981",
  "category": "performance"
}'::jsonb);

-- Insert charts for marketing section
INSERT INTO tb_dinamico (cliente_id, section_id, data_type, data_key, data_value) VALUES 
('techcorp', 'marketing', 'chart', 'impresiones-tiempo', '{
  "id": "impresiones-tiempo",
  "title": "Evolución de Impresiones",
  "type": "area",
  "data": [
    { "name": "Ene", "value": 45000 },
    { "name": "Feb", "value": 52000 },
    { "name": "Mar", "value": 38000 },
    { "name": "Abr", "value": 61000 },
    { "name": "May", "value": 68000 },
    { "name": "Jun", "value": 75000 }
  ],
  "config": {
    "color": "#10b981",
    "fillColor": "#10b981"
  }
}'::jsonb),

('techcorp', 'marketing', 'chart', 'distribucion-gastos', '{
  "id": "distribucion-gastos",
  "title": "Distribución de Gastos",
  "type": "bar",
  "data": [
    { "name": "Personal", "value": 45000 },
    { "name": "Marketing", "value": 25000 },
    { "name": "Tecnología", "value": 20000 },
    { "name": "Operaciones", "value": 15000 },
    { "name": "Otros", "value": 20000 }
  ],
  "config": {
    "color": "#e53e3e"
  }
}'::jsonb);

-- Insert global config
INSERT INTO tb_dinamico (cliente_id, section_id, data_type, data_key, data_value) VALUES 
('techcorp', 'global', 'config', 'main', '{
  "refreshInterval": 300000,
  "maxSections": 10,
  "defaultColors": [
    "#00bcd4",
    "#22c55e",
    "#f59e0b",
    "#e53e3e",
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#f97316"
  ],
  "chartTypes": [
    "line",
    "bar",
    "pie",
    "area"
  ]
}'::jsonb);

-- Verify the data was inserted
SELECT 
    cliente_id,
    section_id,
    data_type,
    data_key,
    CASE 
        WHEN length(data_value::text) > 100 THEN 
            left(data_value::text, 100) || '...'
        ELSE data_value::text
    END as data_preview
FROM tb_dinamico 
WHERE cliente_id = 'techcorp'
ORDER BY section_id, data_type, data_key;
