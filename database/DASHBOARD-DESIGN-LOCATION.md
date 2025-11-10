# 📍 Ubicación de la Información del Diseño del Dashboard

## 🗄️ Ubicación en la Base de Datos

La información del diseño del dashboard se almacena en la base de datos PostgreSQL en la siguiente ubicación:

### Tabla: `clientes`
### Columna: `personalizacion` (tipo JSONB)

## 📋 Estructura de Datos

El campo `personalizacion` es un objeto JSONB que contiene toda la información de personalización del cliente, incluyendo el diseño del dashboard:

```json
{
  "color": ["#1ea986", "#35699c", "#be6a6a"],
  "fuente": "Inter",
  "estilo": "Profesional",
  "contacto": "email@empresa.com",
  "designVariant": "classic"  // o "modern"
}
```

## 🔑 Campos Relacionados con el Diseño

| Campo | Tipo | Descripción | Valores Posibles |
|-------|------|-------------|------------------|
| `designVariant` | string | Variante de diseño del dashboard | `"classic"` o `"modern"` |
| `color` | array | Array de colores hexadecimales | `["#hex1", "#hex2", "#hex3"]` |
| `fuente` | string | Fuente tipográfica seleccionada | `"Inter"`, `"Roboto"`, etc. |
| `estilo` | string | Estilo de diseño general | `"Profesional"`, `"Moderno"`, etc. |

## 📊 Consultas SQL Útiles

### Ver todos los clientes con su información de diseño:

```sql
SELECT 
    c.id,
    c.nombre_empresa,
    c.personalizacion->>'designVariant' as design_variant,
    c.personalizacion->>'fuente' as fuente,
    c.personalizacion->>'estilo' as estilo,
    c.personalizacion->'color' as colores
FROM clientes c
ORDER BY c.id;
```

### Ver solo clientes con designVariant configurado:

```sql
SELECT 
    c.id,
    c.nombre_empresa,
    c.personalizacion->>'designVariant' as design_variant
FROM clientes c
WHERE c.personalizacion->>'designVariant' IS NOT NULL;
```

### Ver la estructura completa de personalizacion para un cliente específico:

```sql
SELECT 
    c.id,
    c.nombre_empresa,
    jsonb_pretty(c.personalizacion) as personalizacion_formatted
FROM clientes c
WHERE c.id = 5; -- Reemplazar con el ID del cliente
```

## 🔄 Flujo de Datos

1. **Creación del Cliente** (`app/admin/crear-cliente/page.tsx`):
   - El usuario selecciona el diseño en el Step 7 (Preview Dashboard)
   - Se guarda en `formData.personalizacion.designVariant`
   - Al crear el cliente, se inserta en `clientes.personalizacion` como JSONB

2. **Lectura del Diseño** (`app/clientes/[clienteId]/dashboard-kpis/page.tsx`):
   - Se obtiene el cliente desde `/api/clientes/[id]`
   - Se extrae `personalizacion.designVariant` de la respuesta
   - Se aplica el diseño correspondiente al dashboard

3. **API Endpoint** (`app/api/clientes/[id]/route.ts`):
   - El endpoint GET devuelve `cliente.personalizacion` completo
   - Incluye `designVariant`, `color`, `fuente`, `estilo`

## 📝 Notas Importantes

- El campo `personalizacion` es de tipo **JSONB** en PostgreSQL, lo que permite consultas eficientes y almacenamiento flexible
- Si un cliente no tiene `designVariant` configurado, se usa el valor por defecto: `"classic"`
- Los colores se almacenan como un array de strings hexadecimales en `personalizacion.color`
- La información se actualiza cuando se edita un cliente desde `/admin/clientes`

## 🔍 Archivos Relacionados

- **Schema SQL**: `database/add-personalizacion-field.sql`
- **Crear Cliente API**: `app/api/clientes/create/route.ts`
- **Obtener Cliente API**: `app/api/clientes/[id]/route.ts`
- **Dashboard Cliente**: `app/clientes/[clienteId]/dashboard-kpis/page.tsx`
- **Formulario Crear Cliente**: `app/admin/crear-cliente/page.tsx`

