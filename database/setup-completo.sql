-- =====================================================
-- BUFFALO AI - Setup Completo en un Solo Script
-- =====================================================

-- =====================================================
-- PASO 1: CREAR USUARIO Y BASE DE DATOS
-- =====================================================

-- Crear usuario (ignorar si ya existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'buffalo_user') THEN
        CREATE USER buffalo_user WITH PASSWORD 'buffalo_password_2024';
    END IF;
END
$$;

-- Crear base de datos (ignorar si ya existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'buffalo_dashboard') THEN
        CREATE DATABASE buffalo_dashboard OWNER buffalo_user;
    END IF;
END
$$;

-- Conceder permisos
GRANT ALL PRIVILEGES ON DATABASE buffalo_dashboard TO buffalo_user;

-- =====================================================
-- PASO 2: CONECTAR A LA BASE DE DATOS Y CREAR ESTRUCTURA
-- =====================================================

-- Conectar a la base de datos
\c buffalo_dashboard;

-- Conceder permisos en el esquema public
GRANT ALL ON SCHEMA public TO buffalo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO buffalo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO buffalo_user;

-- =====================================================
-- CREAR TABLAS
-- =====================================================

-- Tabla de usuarios (admins y clientes)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('admin', 'cliente')) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    nombre_empresa VARCHAR(100) NOT NULL,
    logo_empresa VARCHAR(255) NULL,
    tipo_cliente VARCHAR(20) CHECK (tipo_cliente IN ('startup', 'empresa', 'freelancer', 'otro')) DEFAULT 'empresa',
    webhook_url VARCHAR(255) NULL,
    personalizacion JSONB NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE (usuario_id)
);

-- Tabla de funcionalidades disponibles
CREATE TABLE IF NOT EXISTS funcionalidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT NULL,
    icono VARCHAR(50) NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de permisos de clientes
CREATE TABLE IF NOT EXISTS cliente_funcionalidades (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    funcionalidad_id INTEGER NOT NULL,
    habilitado BOOLEAN DEFAULT FALSE,
    configuracion JSONB NULL,
    fecha_habilitacion TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (funcionalidad_id) REFERENCES funcionalidades(id) ON DELETE CASCADE,
    UNIQUE (cliente_id, funcionalidad_id)
);

-- Tabla de aplicaciones generadas
CREATE TABLE IF NOT EXISTS aplicaciones (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    tipo_aplicacion VARCHAR(20) CHECK (tipo_aplicacion IN ('llamadas', 'chat', 'automatizacion', 'metricas')) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    url_acceso VARCHAR(255) NOT NULL,
    configuracion JSONB NULL,
    estado VARCHAR(20) CHECK (estado IN ('activa', 'inactiva', 'en_desarrollo')) DEFAULT 'activa',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actividad TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabla de métricas
CREATE TABLE IF NOT EXISTS metricas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NULL,
    aplicacion_id INTEGER NULL,
    tipo_metrica VARCHAR(50) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    fecha_metrica TIMESTAMP NOT NULL,
    metadata JSONB NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (aplicacion_id) REFERENCES aplicaciones(id) ON DELETE CASCADE
);

-- Tabla de KPIs
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

-- Tabla de logs de auditoría
CREATE TABLE IF NOT EXISTS logs_auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NULL,
    cliente_id INTEGER NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(50) NULL,
    registro_id INTEGER NULL,
    datos_anteriores JSONB NULL,
    datos_nuevos JSONB NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- Tabla de configuraciones del sistema
CREATE TABLE IF NOT EXISTS configuraciones_sistema (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
    descripcion TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar funcionalidades disponibles
INSERT INTO funcionalidades (nombre, descripcion, icono) VALUES
('llamadas', 'Sistema de llamadas telefónicas', 'phone'),
('chat', 'Chat en vivo', 'message-circle'),
('automatizacion', 'Procesos automatizados', 'zap'),
('metricas', 'Dashboard de métricas', 'bar-chart'),
('marketing', 'Campañas de marketing', 'target'),
('pruebas_ab', 'Pruebas A/B', 'flask')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar configuraciones del sistema
INSERT INTO configuraciones_sistema (clave, valor, tipo, descripcion) VALUES
('sistema_activo', 'true', 'boolean', 'Estado general del sistema'),
('version_sistema', '1.0.0', 'string', 'Versión actual del sistema'),
('max_clientes', '1000', 'number', 'Máximo número de clientes permitidos'),
('session_timeout', '3600', 'number', 'Timeout de sesión en segundos'),
('webhook_timeout', '30', 'number', 'Timeout para webhooks en segundos'),
('empresa_nombre', 'Buffalo AI', 'string', 'Nombre de la empresa'),
('empresa_logo', 'https://agenciabuffalo.es/wp-content/uploads/2025/08/a58a83c2-193d-4bea-b71e-9aa1ca8e9d02.png', 'string', 'URL del logo de la empresa'),
('color_principal', '#00C896', 'string', 'Color principal del sistema'),
('color_secundario', '#1a1a1a', 'string', 'Color secundario del sistema')
ON CONFLICT (clave) DO NOTHING;

-- =====================================================
-- CREAR ÍNDICES
-- =====================================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_usuario ON clientes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON clientes(activo);
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes(tipo_cliente);
CREATE INDEX IF NOT EXISTS idx_clientes_personalizacion ON clientes USING GIN (personalizacion);

-- Índices para aplicaciones
CREATE INDEX IF NOT EXISTS idx_aplicaciones_cliente ON aplicaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_aplicaciones_tipo ON aplicaciones(tipo_aplicacion);
CREATE INDEX IF NOT EXISTS idx_aplicaciones_estado ON aplicaciones(estado);

-- Índices para métricas
CREATE INDEX IF NOT EXISTS idx_metricas_cliente ON metricas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_metricas_aplicacion ON metricas(aplicacion_id);
CREATE INDEX IF NOT EXISTS idx_metricas_fecha ON metricas(fecha_metrica);
CREATE INDEX IF NOT EXISTS idx_metricas_tipo ON metricas(tipo_metrica);

-- Índices para KPIs
CREATE INDEX IF NOT EXISTS idx_kpis_cliente ON kpis(cliente_id);
CREATE INDEX IF NOT EXISTS idx_kpis_aplicacion ON kpis(aplicacion_id);
CREATE INDEX IF NOT EXISTS idx_kpis_json_kpis ON kpis USING GIN (json_kpis);
CREATE INDEX IF NOT EXISTS idx_kpis_json_mapper ON kpis USING GIN (json_mapper);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_cliente ON logs_auditoria(cliente_id);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs_auditoria(fecha_accion);
CREATE INDEX IF NOT EXISTS idx_logs_accion ON logs_auditoria(accion);

-- =====================================================
-- CREAR VISTAS ÚTILES
-- =====================================================

-- Vista de clientes completos
CREATE OR REPLACE VIEW vista_clientes_completa AS
SELECT 
    c.id,
    c.nombre_empresa,
    c.logo_empresa,
    c.tipo_cliente,
    c.webhook_url,
    c.activo,
    c.fecha_creacion,
    u.username,
    u.ultimo_acceso,
    STRING_AGG(f.nombre, ', ') as funcionalidades_habilitadas
FROM clientes c
JOIN usuarios u ON c.usuario_id = u.id
LEFT JOIN cliente_funcionalidades cf ON c.id = cf.cliente_id AND cf.habilitado = TRUE
LEFT JOIN funcionalidades f ON cf.funcionalidad_id = f.id
GROUP BY c.id, c.nombre_empresa, c.logo_empresa, c.tipo_cliente, c.webhook_url, c.activo, c.fecha_creacion, u.username, u.ultimo_acceso;

-- Vista de métricas por cliente
CREATE OR REPLACE VIEW vista_metricas_cliente AS
SELECT 
    c.id as cliente_id,
    c.nombre_empresa,
    m.tipo_metrica,
    COUNT(*) as total_registros,
    AVG(m.valor) as promedio,
    MAX(m.valor) as maximo,
    MIN(m.valor) as minimo,
    MAX(m.fecha_metrica) as ultima_metrica
FROM clientes c
LEFT JOIN metricas m ON c.id = m.cliente_id
GROUP BY c.id, c.nombre_empresa, m.tipo_metrica;

-- =====================================================
-- CREAR FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cliente_funcionalidades_updated_at ON cliente_funcionalidades;
CREATE TRIGGER update_cliente_funcionalidades_updated_at BEFORE UPDATE ON cliente_funcionalidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_aplicaciones_updated_at ON aplicaciones;
CREATE TRIGGER update_aplicaciones_updated_at BEFORE UPDATE ON aplicaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_configuraciones_sistema_updated_at ON configuraciones_sistema;
CREATE TRIGGER update_configuraciones_sistema_updated_at BEFORE UPDATE ON configuraciones_sistema FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear cliente completo
CREATE OR REPLACE FUNCTION sp_crear_cliente(
    p_username VARCHAR(50),
    p_password_hash VARCHAR(255),
    p_nombre_empresa VARCHAR(100),
    p_tipo_cliente VARCHAR(20),
    p_webhook_url VARCHAR(255)
)
RETURNS INTEGER AS $$
DECLARE
    v_usuario_id INTEGER;
    v_cliente_id INTEGER;
BEGIN
    -- Crear usuario
    INSERT INTO usuarios (username, password_hash, tipo_usuario) 
    VALUES (p_username, p_password_hash, 'cliente')
    RETURNING id INTO v_usuario_id;
    
    -- Crear cliente
    INSERT INTO clientes (usuario_id, nombre_empresa, tipo_cliente, webhook_url)
    VALUES (v_usuario_id, p_nombre_empresa, p_tipo_cliente, p_webhook_url)
    RETURNING id INTO v_cliente_id;
    
    -- Habilitar métricas por defecto
    INSERT INTO cliente_funcionalidades (cliente_id, funcionalidad_id, habilitado, fecha_habilitacion)
    SELECT v_cliente_id, id, TRUE, NOW() 
    FROM funcionalidades 
    WHERE nombre = 'metricas';
    
    RETURN v_cliente_id;
END;
$$ LANGUAGE plpgsql;

-- Función para habilitar funcionalidad
CREATE OR REPLACE FUNCTION sp_habilitar_funcionalidad(
    p_cliente_id INTEGER,
    p_funcionalidad_nombre VARCHAR(50)
)
RETURNS VOID AS $$
DECLARE
    v_funcionalidad_id INTEGER;
BEGIN
    SELECT id INTO v_funcionalidad_id 
    FROM funcionalidades 
    WHERE nombre = p_funcionalidad_nombre;
    
    IF v_funcionalidad_id IS NOT NULL THEN
        INSERT INTO cliente_funcionalidades (cliente_id, funcionalidad_id, habilitado, fecha_habilitacion)
        VALUES (p_cliente_id, v_funcionalidad_id, TRUE, NOW())
        ON CONFLICT (cliente_id, funcionalidad_id) 
        DO UPDATE SET habilitado = TRUE, fecha_habilitacion = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CONCEDER PERMISOS FINALES
-- =====================================================

-- Conceder todos los permisos al usuario
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO buffalo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO buffalo_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO buffalo_user;
GRANT USAGE ON SCHEMA public TO buffalo_user;

-- =====================================================
-- INSERTAR DATOS DE PRUEBA
-- =====================================================

-- Insertar usuario admin (contraseña: admin123)
INSERT INTO usuarios (username, password_hash, tipo_usuario) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Cliente 1: Startup Demo
INSERT INTO usuarios (username, password_hash, tipo_usuario) VALUES
('startup_demo', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente')
ON CONFLICT (username) DO NOTHING;

INSERT INTO clientes (usuario_id, nombre_empresa, tipo_cliente, webhook_url) VALUES
((SELECT id FROM usuarios WHERE username = 'startup_demo'), 'TechStartup Demo', 'startup', 'https://webhook.site/startup-demo')
ON CONFLICT (usuario_id) DO NOTHING;

-- Cliente 2: Empresa Demo
INSERT INTO usuarios (username, password_hash, tipo_usuario) VALUES
('empresa_demo', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente')
ON CONFLICT (username) DO NOTHING;

INSERT INTO clientes (usuario_id, nombre_empresa, tipo_cliente, webhook_url) VALUES
((SELECT id FROM usuarios WHERE username = 'empresa_demo'), 'Empresa Grande Demo', 'empresa', 'https://webhook.site/empresa-demo')
ON CONFLICT (usuario_id) DO NOTHING;

-- Habilitar funcionalidades para startup demo
INSERT INTO cliente_funcionalidades (cliente_id, funcionalidad_id, habilitado, fecha_habilitacion)
SELECT 
    (SELECT id FROM clientes WHERE nombre_empresa = 'TechStartup Demo'), 
    id, 
    TRUE, 
    NOW() 
FROM funcionalidades 
WHERE nombre IN ('llamadas', 'chat', 'metricas')
ON CONFLICT (cliente_id, funcionalidad_id) DO NOTHING;

-- Habilitar todas las funcionalidades para empresa demo
INSERT INTO cliente_funcionalidades (cliente_id, funcionalidad_id, habilitado, fecha_habilitacion)
SELECT 
    (SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo'), 
    id, 
    TRUE, 
    NOW() 
FROM funcionalidades
ON CONFLICT (cliente_id, funcionalidad_id) DO NOTHING;

-- Crear aplicaciones de ejemplo
INSERT INTO aplicaciones (cliente_id, tipo_aplicacion, nombre, descripcion, url_acceso, configuracion) VALUES
((SELECT id FROM clientes WHERE nombre_empresa = 'TechStartup Demo'), 'llamadas', 'Sistema de Llamadas Startup', 'Sistema básico de llamadas para startup', '/startup_demo/llamadas', 
 '{"max_llamadas_simultaneas": 5, "grabacion_automatica": true, "horario_atencion": "9:00-18:00"}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'TechStartup Demo'), 'chat', 'Chat en Vivo Startup', 'Widget de chat para sitio web', '/startup_demo/chat',
 '{"respuestas_automaticas": true, "escalamiento_humano": true, "horario_atencion": "24/7"}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'TechStartup Demo'), 'metricas', 'Dashboard Métricas Startup', 'Métricas básicas de la startup', '/startup_demo/metricas',
 '{"kpis_principales": ["llamadas_atendidas", "tiempo_respuesta", "satisfaccion_cliente"]}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo'), 'llamadas', 'Sistema Avanzado de Llamadas', 'Sistema completo de llamadas empresariales', '/empresa_demo/llamadas',
 '{"max_llamadas_simultaneas": 50, "grabacion_automatica": true, "ivr_avanzado": true, "horario_atencion": "8:00-20:00"}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo'), 'chat', 'Chat Empresarial', 'Sistema de chat con múltiples agentes', '/empresa_demo/chat',
 '{"respuestas_automaticas": true, "escalamiento_humano": true, "multi_agente": true, "horario_atencion": "24/7"}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo'), 'automatizacion', 'Automatización Empresarial', 'Flujos de trabajo automatizados', '/empresa_demo/automatizacion',
 '{"flujos_disponibles": ["bienvenida", "soporte_tecnico", "ventas", "post_venta"]}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo'), 'metricas', 'Dashboard Ejecutivo', 'Métricas avanzadas para directivos', '/empresa_demo/metricas',
 '{"kpis_principales": ["llamadas_atendidas", "tiempo_respuesta", "satisfaccion_cliente", "conversion_ventas", "coste_por_cliente"]}');

-- Insertar métricas de ejemplo
INSERT INTO metricas (cliente_id, aplicacion_id, tipo_metrica, valor, fecha_metrica, metadata) VALUES
((SELECT id FROM clientes WHERE nombre_empresa = 'TechStartup Demo'), 
 (SELECT id FROM aplicaciones WHERE cliente_id = (SELECT id FROM clientes WHERE nombre_empresa = 'TechStartup Demo') AND tipo_aplicacion = 'llamadas'), 
 'llamadas_atendidas', 45, CURRENT_TIMESTAMP - INTERVAL '1 day', '{"duracion_promedio": 180, "satisfaccion": 4.2}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'TechStartup Demo'), 
 (SELECT id FROM aplicaciones WHERE cliente_id = (SELECT id FROM clientes WHERE nombre_empresa = 'TechStartup Demo') AND tipo_aplicacion = 'chat'), 
 'mensajes_chat', 120, CURRENT_TIMESTAMP - INTERVAL '1 day', '{"tiempo_respuesta_promedio": 45, "satisfaccion": 4.3}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo'), 
 (SELECT id FROM aplicaciones WHERE cliente_id = (SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo') AND tipo_aplicacion = 'llamadas'), 
 'llamadas_atendidas', 245, CURRENT_TIMESTAMP - INTERVAL '1 day', '{"duracion_promedio": 220, "satisfaccion": 4.4}'),
((SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo'), 
 (SELECT id FROM aplicaciones WHERE cliente_id = (SELECT id FROM clientes WHERE nombre_empresa = 'Empresa Grande Demo') AND tipo_aplicacion = 'chat'), 
 'mensajes_chat', 450, CURRENT_TIMESTAMP - INTERVAL '1 day', '{"tiempo_respuesta_promedio": 25, "satisfaccion": 4.5}');

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar resumen
SELECT 'Setup completado exitosamente' as status;
SELECT 'Tablas creadas:' as info, COUNT(*) as total FROM information_schema.tables WHERE table_schema = 'public';
SELECT 'Usuarios creados:' as info, COUNT(*) as total FROM usuarios;
SELECT 'Clientes creados:' as info, COUNT(*) as total FROM clientes;
SELECT 'Aplicaciones generadas:' as info, COUNT(*) as total FROM aplicaciones;
SELECT 'Métricas registradas:' as info, COUNT(*) as total FROM metricas;

-- Mostrar credenciales
SELECT 'CREDENCIALES DE ACCESO:' as info;
SELECT 'Admin: admin / admin123' as credenciales;
SELECT 'Cliente Startup: startup_demo / admin123' as credenciales;
SELECT 'Cliente Empresa: empresa_demo / admin123' as credenciales;
