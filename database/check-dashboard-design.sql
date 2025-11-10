-- ============================================================
-- CHECK DASHBOARD DESIGN INFORMATION IN DATABASE
-- This query shows where the dashboard design variant is stored
-- ============================================================

-- Location: clientes.personalizacion JSONB column
-- Structure: clientes.personalizacion.designVariant

-- Query to see all clientes with their personalizacion data
SELECT 
    c.id,
    c.nombre_empresa,
    c.personalizacion,
    -- Extract specific fields from personalizacion JSONB
    c.personalizacion->>'designVariant' as design_variant,
    c.personalizacion->>'fuente' as fuente,
    c.personalizacion->>'estilo' as estilo,
    c.personalizacion->'color' as colores,
    c.personalizacion->'color'->0 as color_principal,
    c.personalizacion->'color'->1 as color_secundario,
    c.personalizacion->'color'->2 as color_acento
FROM clientes c
ORDER BY c.id;

-- Query to see only clientes with designVariant set
SELECT 
    c.id,
    c.nombre_empresa,
    c.personalizacion->>'designVariant' as design_variant,
    c.personalizacion->>'fuente' as fuente,
    c.personalizacion->>'estilo' as estilo,
    c.personalizacion->'color' as colores
FROM clientes c
WHERE c.personalizacion->>'designVariant' IS NOT NULL
ORDER BY c.id;

-- Query to see the full structure of personalizacion for a specific cliente
-- Replace 'CLIENTE_ID' with the actual cliente ID
SELECT 
    c.id,
    c.nombre_empresa,
    c.personalizacion,
    jsonb_pretty(c.personalizacion) as personalizacion_formatted
FROM clientes c
WHERE c.id = 5; -- Example: cliente ID 5

-- Example of what the personalizacion JSONB structure should look like:
-- {
--   "color": ["#1ea986", "#35699c", "#be6a6a"],
--   "fuente": "Inter",
--   "estilo": "Profesional",
--   "contacto": "email@empresa.com",
--   "designVariant": "classic" or "modern"
-- }

