-- ============================================================
-- REMOVE configuracion_personalizada FIELD FROM CLIENTES TABLE
-- This migration removes the old field in favor of 'personalizacion'
-- Field 'configuracion_personalizada' is replaced by 'personalizacion'
-- ============================================================

-- Drop the old configuracion_personalizada column
ALTER TABLE clientes 
DROP COLUMN IF EXISTS configuracion_personalizada;

-- Verify the change
-- The table should now only have 'personalizacion' field for client customization

