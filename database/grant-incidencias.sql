-- Grant privileges on incidencias to application user
DO $$
DECLARE
  app_user TEXT := 'buffalo_user';
BEGIN
  EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.incidencias TO %I', app_user);
  -- Grant sequence usage if needed
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'incidencias_id_seq') THEN
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE public.incidencias_id_seq TO %I', app_user);
  END IF;
END $$;


