-- Add tabla_cliente column to clientes if it does not exist
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tabla_cliente VARCHAR(250);

-- Example update for a specific cliente
-- Update cliente_id = 14 to use 'empresa_test_10'
UPDATE clientes
SET tabla_cliente = 'empresa_test_10'
WHERE id = 14;


