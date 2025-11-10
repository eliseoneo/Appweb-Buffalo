-- ============================================================
-- UPDATE CLIENTE ID 5 WITH HEXADECIMAL COLOR VALUES
-- Updates the personalizacion.color array with hex values
-- ============================================================

-- Update cliente id 5 with the color values from the image:
-- Color 1: #1ea986
-- Color 2: #35699c
-- Color 3: #be6a6a

UPDATE clientes
SET personalizacion = COALESCE(personalizacion, '{}'::jsonb) || 
    jsonb_build_object(
        'color', '["#1ea986", "#35699c", "#be6a6a"]'::jsonb
    )
WHERE id = 5;

-- Verify the update
SELECT 
    id,
    nombre_empresa,
    personalizacion->'color' as color_array,
    personalizacion
FROM clientes
WHERE id = 5;

