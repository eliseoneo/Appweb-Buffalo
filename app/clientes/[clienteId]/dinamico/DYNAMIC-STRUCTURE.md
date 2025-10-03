# 🔄 Estructura Dinámica - Sección Dinámico

## 📋 Descripción General

La sección **Dinámico** está completamente diseñada para ser **100% configurable** a través de archivos JSON. Esto significa que puedes cambiar completamente la estructura, diseño, métricas y comportamiento de la página sin tocar el código.

## 🎯 Características Dinámicas

### ✨ Configuración Completamente Dinámica

- **Títulos y Subtítulos**: Personalizables desde JSON
- **Layouts**: Grid, List, Card - configurables
- **Temas**: Modern, Classic, Minimal - intercambiables
- **Columnas Responsivas**: Configurables para móvil, tablet y desktop
- **Filtros**: Mostrar/ocultar según configuración
- **Botones**: Refresh y Add - configurables
- **Métricas**: Cantidad, tipos, colores - dinámicos
- **Gráficos**: Tipos, tamaños, configuraciones - flexibles

## 📁 Estructura de Archivos

```
dinamico/
├── page.tsx                    # Componente principal (lógica de renderizado)
├── dinamico-data.json          # Configuración por defecto
├── dinamico-data-examples.json # Ejemplos de configuraciones
├── dinamico-config-loader.ts   # Utilidades para cargar configuraciones
├── README.md                   # Documentación general
└── DYNAMIC-STRUCTURE.md        # Esta guía
```

## 🔧 Configuraciones Disponibles

### 1. **Dashboard Estándar** (`default`)
- Configuración balanceada con 4 secciones
- Métricas de ventas, marketing, operaciones y finanzas
- Layout grid con 4 columnas en desktop

### 2. **Vista Minimalista** (`minimal`)
- Interfaz simplificada
- Solo métricas esenciales
- Sin filtros, layout compacto

### 3. **Dashboard Ejecutivo** (`executive`)
- Vista estratégica para directivos
- Métricas de alto nivel
- Colores corporativos

### 4. **Dashboard Operacional** (`operational`)
- Métricas detalladas de operaciones
- 6 columnas en desktop
- Actualización cada minuto

### 5. **Configuración Personalizada** (`custom`)
- Guardada en localStorage
- Completamente personalizable

## 🛠️ Cómo Personalizar la Estructura

### Paso 1: Modificar el JSON Principal

Edita `dinamico-data.json` para cambiar la configuración por defecto:

```json
{
  "pageConfig": {
    "title": "Mi Dashboard Personalizado",
    "subtitle": "Métricas de mi empresa",
    "layout": "grid",
    "theme": "modern",
    "gridColumns": {
      "mobile": 1,
      "tablet": 3,
      "desktop": 6
    }
  }
}
```

### Paso 2: Agregar Nueva Sección

```json
{
  "id": "mi-nueva-seccion",
  "title": "Mi Nueva Sección",
  "description": "Descripción de la sección",
  "lastUpdated": "2025-10-02T16:30:00Z",
  "layout": {
    "metricsPerRow": 3,
    "chartLayout": "side-by-side",
    "backgroundColor": "#f0f9ff",
    "accentColor": "#0ea5e9"
  },
  "metrics": [
    {
      "id": "nueva-metrica",
      "name": "Nueva Métrica",
      "value": 1000,
      "unit": "€",
      "trend": "up",
      "change": 5.2,
      "color": "#0ea5e9",
      "category": "custom"
    }
  ],
  "charts": [
    {
      "id": "nuevo-grafico",
      "title": "Nuevo Gráfico",
      "type": "line",
      "data": [
        { "name": "Ene", "value": 100 },
        { "name": "Feb", "value": 150 }
      ],
      "config": {
        "color": "#0ea5e9",
        "height": 300
      }
    }
  ]
}
```

### Paso 3: Crear Nueva Configuración

1. Agrega tu configuración a `dinamico-data-examples.json`:

```json
{
  "examples": {
    "mi-configuracion": {
      "pageConfig": {
        "title": "Mi Dashboard",
        "subtitle": "Configuración personalizada",
        "layout": "card",
        "theme": "minimal"
      },
      "sections": [...]
    }
  }
}
```

2. Actualiza `dinamico-config-loader.ts`:

```typescript
export type DinamicoConfigType = 'default' | 'minimal' | 'executive' | 'operational' | 'custom' | 'mi-configuracion'
```

## 🎨 Personalización Visual

### Colores y Temas

```json
{
  "pageConfig": {
    "theme": "modern",  // modern, classic, minimal
    "defaultColors": [
      "#0ea5e9",  // Azul personalizado
      "#10b981",  // Verde
      "#f59e0b",  // Amarillo
      "#ef4444"   // Rojo
    ]
  }
}
```

### Layouts Responsivos

```json
{
  "pageConfig": {
    "gridColumns": {
      "mobile": 1,   // 1 columna en móvil
      "tablet": 2,   // 2 columnas en tablet
      "desktop": 4   // 4 columnas en desktop
    },
    "chartGridColumns": {
      "mobile": 1,   // 1 gráfico por fila en móvil
      "tablet": 1,   // 1 gráfico por fila en tablet
      "desktop": 2   // 2 gráficos por fila en desktop
    }
  }
}
```

### Configuración de Secciones

```json
{
  "layout": {
    "metricsPerRow": 4,           // Métricas por fila
    "chartLayout": "side-by-side", // side-by-side, stacked, grid
    "showDescription": true,       // Mostrar descripción
    "showLastUpdated": true,       // Mostrar última actualización
    "backgroundColor": "#ffffff",  // Color de fondo
    "borderColor": "#e5e7eb",     // Color del borde
    "accentColor": "#0ea5e9"      // Color de acento
  }
}
```

## 📊 Tipos de Gráficos Soportados

### 1. **Gráfico de Líneas** (`line`)
```json
{
  "type": "line",
  "config": {
    "color": "#0ea5e9",
    "height": 300,
    "showGrid": true,
    "showLegend": true,
    "animation": true
  }
}
```

### 2. **Gráfico de Barras** (`bar`)
```json
{
  "type": "bar",
  "config": {
    "color": "#10b981",
    "height": 300
  }
}
```

### 3. **Gráfico Circular** (`pie`)
```json
{
  "type": "pie",
  "data": [
    { "name": "Categoría A", "value": 45, "color": "#0ea5e9" },
    { "name": "Categoría B", "value": 35, "color": "#10b981" },
    { "name": "Categoría C", "value": 20, "color": "#f59e0b" }
  ]
}
```

### 4. **Gráfico de Área** (`area`)
```json
{
  "type": "area",
  "config": {
    "color": "#8b5cf6",
    "fillColor": "#8b5cf6",
    "height": 300
  }
}
```

## 🔄 Cambio Dinámico de Configuración

### Desde la Interfaz

La página incluye un selector que permite cambiar entre configuraciones en tiempo real:

```tsx
<select
  value={currentConfigType}
  onChange={(e) => handleConfigChange(e.target.value)}
>
  <option value="default">Dashboard Estándar</option>
  <option value="minimal">Vista Minimalista</option>
  <option value="executive">Dashboard Ejecutivo</option>
  <option value="operational">Dashboard Operacional</option>
  <option value="custom">Configuración Personalizada</option>
</select>
```

### Programáticamente

```typescript
import { loadDinamicoConfig, saveCustomConfig } from './dinamico-config-loader'

// Cargar configuración específica
const config = loadDinamicoConfig('executive')

// Guardar configuración personalizada
saveCustomConfig(myCustomConfig)
```

## 🚀 Ejemplos Prácticos

### Ejemplo 1: Dashboard de Ventas

```json
{
  "pageConfig": {
    "title": "Dashboard de Ventas",
    "subtitle": "Métricas de ventas en tiempo real",
    "layout": "grid",
    "gridColumns": { "mobile": 1, "tablet": 2, "desktop": 4 }
  },
  "sections": [
    {
      "id": "ventas-principales",
      "title": "KPIs de Ventas",
      "metrics": [
        {
          "id": "ventas-totales",
          "name": "Ventas Totales",
          "value": 250000,
          "unit": "€",
          "trend": "up",
          "change": 15.3,
          "color": "#059669"
        }
      ]
    }
  ]
}
```

### Ejemplo 2: Dashboard de Marketing

```json
{
  "pageConfig": {
    "title": "Marketing Analytics",
    "subtitle": "Análisis de campañas y conversiones",
    "theme": "modern",
    "showFilters": true
  },
  "sections": [
    {
      "id": "campañas",
      "title": "Rendimiento de Campañas",
      "layout": {
        "chartLayout": "grid",
        "metricsPerRow": 3
      },
      "charts": [
        {
          "id": "conversiones-tiempo",
          "title": "Conversiones por Tiempo",
          "type": "area",
          "config": { "color": "#8b5cf6" }
        }
      ]
    }
  ]
}
```

## 🔧 Utilidades de Desarrollo

### Validación de Configuración

```typescript
import { validateConfig } from './dinamico-config-loader'

if (validateConfig(myConfig)) {
  console.log('Configuración válida')
} else {
  console.error('Configuración inválida')
}
```

### Creación de Configuración Personalizada

```typescript
import { createCustomConfig } from './dinamico-config-loader'

const customConfig = createCustomConfig(
  baseConfig,
  {
    pageConfig: {
      title: "Mi Dashboard",
      theme: "minimal"
    },
    sections: [...]
  }
)
```

## 📱 Responsive Design

La estructura es completamente responsive y se adapta automáticamente:

- **Mobile**: 1 columna de métricas, 1 gráfico por fila
- **Tablet**: 2-3 columnas de métricas, 1-2 gráficos por fila
- **Desktop**: 4-6 columnas de métricas, 2-3 gráficos por fila

## 🎯 Ventajas de la Estructura Dinámica

1. **Sin Código**: Cambios completos sin tocar TypeScript/React
2. **Tiempo Real**: Cambios instantáneos en la interfaz
3. **Reutilizable**: Múltiples configuraciones para diferentes casos
4. **Escalable**: Fácil agregar nuevas secciones y métricas
5. **Mantenible**: Separación clara entre lógica y configuración
6. **Flexible**: Soporte para cualquier tipo de métrica o gráfico

## 🚀 Próximas Funcionalidades

- [ ] Editor visual de configuraciones
- [ ] Importación/exportación de configuraciones
- [ ] Configuraciones por usuario/rol
- [ ] Plantillas predefinidas
- [ ] Validación en tiempo real
- [ ] Preview de configuraciones

---

**¡La estructura es completamente dinámica y configurable!** 🎉

Puedes cambiar cualquier aspecto de la página modificando solo los archivos JSON, sin necesidad de tocar el código React/TypeScript.
