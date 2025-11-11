-- Add archivo_mapper column (up to 500 chars)
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS archivo_mapper VARCHAR(500);

-- Update specific cliente (ID = 14)
UPDATE clientes
SET archivo_mapper = 'mapper-Empresa-Test-10-b2d08968'
WHERE id = 14;


