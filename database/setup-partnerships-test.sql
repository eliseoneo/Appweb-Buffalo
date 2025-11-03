-- Setup test partnerships and link existing clientes
-- This script creates partnerships and links existing clientes to them

-- 1) Insert partnerships (if they don't exist)
INSERT INTO partnerships (nombre, slug) 
VALUES 
  ('SergieTest', 'sergietest'),
  ('MariaTest', 'mariatest')
ON CONFLICT (nombre) DO NOTHING;

-- 2) Link existing clientes to partnerships
-- Get partnership IDs
DO $$
DECLARE
  sergie_id INTEGER;
  maria_id INTEGER;
  cliente_count INTEGER;
BEGIN
  -- Get partnership IDs
  SELECT id INTO sergie_id FROM partnerships WHERE nombre = 'SergieTest';
  SELECT id INTO maria_id FROM partnerships WHERE nombre = 'MariaTest';
  
  -- Check how many clientes exist
  SELECT COUNT(*) INTO cliente_count FROM clientes;
  
  -- Link first cliente to SergieTest
  IF cliente_count >= 1 THEN
    UPDATE clientes 
    SET partnership_id = sergie_id 
    WHERE id = (SELECT id FROM clientes ORDER BY id LIMIT 1)
    AND partnership_id IS NULL;
  END IF;
  
  -- Link second cliente to MariaTest
  IF cliente_count >= 2 THEN
    UPDATE clientes 
    SET partnership_id = maria_id 
    WHERE id = (SELECT id FROM clientes ORDER BY id LIMIT 1 OFFSET 1)
    AND partnership_id IS NULL;
  END IF;
  
  RAISE NOTICE 'Partnerships setup complete. SergieTest ID: %, MariaTest ID: %, Clientes linked: %', sergie_id, maria_id, cliente_count;
END $$;

-- 3) Verify the setup
SELECT 
  p.nombre as partnership_name,
  COUNT(c.id) as clientes_count,
  STRING_AGG(c.nombre_empresa, ', ') as clientes_nombres
FROM partnerships p
LEFT JOIN clientes c ON c.partnership_id = p.id
WHERE p.nombre IN ('SergieTest', 'MariaTest')
GROUP BY p.id, p.nombre
ORDER BY p.nombre;

