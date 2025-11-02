-- Create partnerships table and link to clientes

-- 1) Partnerships table
CREATE TABLE IF NOT EXISTS partnerships (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(120) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2) Add nullable foreign key to clientes if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='clientes' AND column_name='partnership_id'
  ) THEN
    ALTER TABLE clientes ADD COLUMN partnership_id INTEGER NULL;
    ALTER TABLE clientes 
      ADD CONSTRAINT clientes_partnership_id_fkey 
      FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_clientes_partnership_id ON clientes(partnership_id);
  END IF;
END$$;

-- 3) Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_partnerships_updated_at ON partnerships;
CREATE TRIGGER trg_partnerships_updated_at
BEFORE UPDATE ON partnerships
FOR EACH ROW EXECUTE FUNCTION update_timestamp();


