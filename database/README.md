# 🗄️ Base de Datos - Buffalo AI

## 📋 Instrucciones de Instalación

### 1. Ejecutar Script Completo (RECOMENDADO)

```bash
# Ejecutar todo en un solo comando
psql -U postgres -f database/setup-completo.sql
```

### 2. O Ejecutar Scripts por Separado

```bash
# 1. Crear usuario y base de datos
psql -U postgres -f database/1-create-user-db.sql

# 2. Crear tablas y estructura
psql -U postgres -f database/2-create-tables.sql

# 3. Insertar datos de prueba
psql -U postgres -f database/3-insert-data.sql

# 4. Verificar que todo funciona
psql -U postgres -f database/4-verify.sql
```

### 2. Configuración

Tu archivo `.env.local` debe contener:

```env
DATABASE_URL="postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard?schema=public"
JWT_SECRET="buffalo-ai-dashboard-2024-secret-key-change-in-production"
ADMIN_USERNAME="tu_usuario_admin"
ADMIN_PASSWORD="tu_contraseña_segura"
ADMIN_COMPANY="Tu Empresa"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## 🏗️ Estructura Creada

### Tablas Principales
- **usuarios** - Admins y clientes
- **clientes** - Información específica de cada cliente
- **funcionalidades** - Funcionalidades disponibles
- **cliente_funcionalidades** - Permisos por cliente
- **aplicaciones** - Apps generadas para cada cliente
- **metricas** - Métricas y estadísticas
- **logs_auditoria** - Logs de todas las acciones
- **configuraciones_sistema** - Configuraciones globales

### Datos de Prueba Incluidos
- **Usuario admin**: `admin` / `admin123`
- **Cliente startup**: `startup_demo` / `admin123`
- **Cliente empresa**: `empresa_demo` / `admin123`
- **6 aplicaciones** de ejemplo
- **Métricas** de los últimos 7 días
- **Logs de auditoría** de ejemplo

## 🔧 Funcionalidades

### Funciones Disponibles
- `sp_crear_cliente()` - Crear cliente completo
- `sp_habilitar_funcionalidad()` - Habilitar funcionalidad

### Vistas Útiles
- `vista_clientes_completa` - Clientes con funcionalidades
- `vista_metricas_cliente` - Métricas agrupadas

## ✅ Verificación

Después de ejecutar los scripts, deberías ver:
- ✅ 3 usuarios creados (1 admin + 2 clientes)
- ✅ 2 clientes registrados
- ✅ 6 funcionalidades disponibles
- ✅ 6 aplicaciones generadas
- ✅ Métricas de ejemplo
- ✅ Logs de auditoría

## 🚀 Próximos Pasos

1. ✅ Base de datos configurada
2. 🔄 Crear backend API
3. 🔄 Crear frontend Next.js
4. 🔄 Implementar autenticación
5. 🔄 Crear paneles de admin y cliente

## 🔍 Consultas Útiles

```sql
-- Ver todos los clientes
SELECT * FROM vista_clientes_completa;

-- Ver métricas de un cliente
SELECT * FROM vista_metricas_cliente WHERE cliente_id = 1;

-- Ver aplicaciones activas
SELECT c.nombre_empresa, a.nombre, a.tipo_aplicacion, a.estado
FROM aplicaciones a
JOIN clientes c ON a.cliente_id = c.id
WHERE a.estado = 'activa';
```
