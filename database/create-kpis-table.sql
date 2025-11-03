-- ============================================================
-- CREATE KPIS TABLE
-- This table stores KPI configurations and mappers for clients
-- ============================================================

-- Create kpis table
CREATE TABLE IF NOT EXISTS kpis (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NULL,
    aplicacion_id INTEGER NULL,
    json_kpis JSONB NULL,
    json_mapper JSONB NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (aplicacion_id) REFERENCES aplicaciones(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_kpis_cliente ON kpis(cliente_id);
CREATE INDEX IF NOT EXISTS idx_kpis_aplicacion ON kpis(aplicacion_id);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_kpis_json_kpis ON kpis USING GIN (json_kpis);
CREATE INDEX IF NOT EXISTS idx_kpis_json_mapper ON kpis USING GIN (json_mapper);

-- Add comments
COMMENT ON TABLE kpis IS 'Almacena las configuraciones de KPIs y mappers para cada cliente';
COMMENT ON COLUMN kpis.cliente_id IS 'ID del cliente asociado';
COMMENT ON COLUMN kpis.aplicacion_id IS 'ID de la aplicación asociada';
COMMENT ON COLUMN kpis.json_kpis IS 'Datos JSON de los KPIs configurados';
COMMENT ON COLUMN kpis.json_mapper IS 'Datos JSON del mapper de columnas-KPIs';

