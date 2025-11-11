-- Create incidencias table for tracking client issues
CREATE TABLE IF NOT EXISTS public.incidencias (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    fecha_crea_incidencia TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad VARCHAR(50) NULL,
    fecha_resolucion TIMESTAMP NULL,
    fecha_postergado TIMESTAMP NULL,
    datos_solucion TEXT NULL,
    tiempo_aplicado_solucion INTEGER NULL,
    contacto_crea_incidencia VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_incidencias_cliente ON public.incidencias(cliente_id);
CREATE INDEX IF NOT EXISTS idx_incidencias_estado ON public.incidencias(estado);
CREATE INDEX IF NOT EXISTS idx_incidencias_prioridad ON public.incidencias(prioridad);
CREATE INDEX IF NOT EXISTS idx_incidencias_fecha_crea ON public.incidencias(fecha_crea_incidencia);

-- Maintain updated_at automatically
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_incidencias_updated_at'
  ) THEN
    CREATE TRIGGER update_incidencias_updated_at
    BEFORE UPDATE ON public.incidencias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;


