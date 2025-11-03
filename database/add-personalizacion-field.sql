-- ============================================================
-- ADD PERSONALIZACION FIELD TO CLIENTES TABLE
-- This migration adds a personalizacion JSONB field to store
-- client customization data (colores, fuente, estilo, contacto)
-- ============================================================

-- Add personalizacion column to clientes table
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS personalizacion JSONB NULL;

-- Add comment to explain the field
COMMENT ON COLUMN clientes.personalizacion IS 'Configuración de personalización del cliente (colores, fuente, estilo, contacto)';

-- Add index for better query performance on personalizacion
CREATE INDEX IF NOT EXISTS idx_clientes_personalizacion 
ON clientes USING GIN (personalizacion);

-- Example of how the data will be stored:
-- {
--   "colores": ["blue", "black"],
--   "fuente": "Arial, Roboto",
--   "estilo": "Moderno",
--   "contacto": "email@empresa.com"
-- }

