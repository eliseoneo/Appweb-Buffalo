# 📊 Sección Dinámico - Buffalo AI

## Descripción

La sección **Dinámico** es un dashboard avanzado que permite visualizar métricas y análisis en tiempo real de forma dinámica y personalizable. Esta sección está diseñada para proporcionar insights profundos sobre el rendimiento del negocio a través de múltiples secciones configurables.

## 🚀 Características

### ✨ Funcionalidades Principales

- **Múltiples Secciones**: Organiza métricas en secciones temáticas (Ventas, Marketing, Operaciones, Financiero)
- **Métricas en Tiempo Real**: Visualización de KPIs con tendencias y cambios porcentuales
- **Gráficos Dinámicos**: Soporte para múltiples tipos de gráficos (líneas, barras, pie, área)
- **Interfaz Intuitiva**: Navegación fácil entre secciones con filtros avanzados
- **Datos Personalizables**: Estructura JSON flexible para agregar nuevas métricas

### 📈 Tipos de Gráficos Soportados

1. **Gráficos de Líneas**: Para tendencias temporales
2. **Gráficos de Barras**: Para comparaciones categóricas
3. **Gráficos de Pie**: Para distribuciones porcentuales
4. **Gráficos de Área**: Para visualización de volumen

### 🎯 Secciones Predefinidas

#### 1. Métricas de Ventas
- Ventas Totales
- Tasa de Conversión
- Leads Generados
- Costo de Adquisición

#### 2. Métricas de Marketing
- Impresiones
- CTR (Click Through Rate)
- CPC (Cost Per Click)
- ROAS (Return on Ad Spend)

#### 3. Métricas Operacionales
- Productividad
- Tiempo de Respuesta
- Satisfacción del Cliente
- Tickets Resueltos

#### 4. Métricas Financieras
- Ingresos del Mes
- Gastos del Mes
- Margen de Beneficio
- ROI (Return on Investment)

## 📁 Estructura de Archivos

```
dinamico/
├── page.tsx              # Componente principal de la página
├── dinamico-data.json    # Datos de configuración y métricas
└── README.md            # Documentación
```

## 🔧 Configuración

### Estructura del JSON de Datos

El archivo `dinamico-data.json` contiene la configuración completa de las secciones y métricas:

```json
{
  "sections": [
    {
      "id": "ventas",
      "title": "Métricas de Ventas",
      "description": "Análisis completo del rendimiento de ventas",
      "lastUpdated": "2025-10-02T16:30:00Z",
      "metrics": [...],
      "charts": [...]
    }
  ],
  "config": {
    "refreshInterval": 300000,
    "maxSections": 10,
    "defaultColors": [...],
    "chartTypes": [...]
  }
}
```

### Agregar Nueva Sección

Para agregar una nueva sección, edita el archivo `dinamico-data.json`:

1. Agrega un nuevo objeto en el array `sections`
2. Define las métricas y gráficos correspondientes
3. La sección aparecerá automáticamente en la interfaz

### Agregar Nueva Métrica

```json
{
  "id": "nueva-metrica",
  "name": "Nombre de la Métrica",
  "value": 1000,
  "unit": "€",
  "trend": "up",
  "change": 5.2,
  "color": "#00bcd4",
  "category": "revenue"
}
```

## 🎨 Personalización

### Colores

Los colores se pueden personalizar en cada métrica usando códigos hexadecimales:

```json
{
  "color": "#00bcd4"  // Color personalizado
}
```

### Tendencias

Las tendencias soportadas son:
- `"up"`: Tendencia alcista (verde)
- `"down"`: Tendencia bajista (rojo)
- `"stable"`: Sin cambios (gris)

### Tipos de Gráficos

- `"line"`: Gráfico de líneas
- `"bar"`: Gráfico de barras
- `"pie"`: Gráfico circular
- `"area"`: Gráfico de área

## 🔄 Actualización de Datos

### Actualización Manual

Haz clic en el botón **"Actualizar"** para recargar los datos.

### Actualización Automática

El sistema está configurado para actualizar automáticamente cada 5 minutos (300,000ms).

## 📱 Responsive Design

La sección está completamente optimizada para:
- **Desktop**: Vista completa con múltiples gráficos
- **Tablet**: Layout adaptativo con gráficos reorganizados
- **Mobile**: Vista simplificada con navegación táctil

## 🛠️ Tecnologías Utilizadas

- **React**: Framework principal
- **TypeScript**: Tipado estático
- **Recharts**: Biblioteca de gráficos
- **Tailwind CSS**: Estilos y diseño
- **Lucide React**: Iconografía

## 🚀 Próximas Funcionalidades

- [ ] Exportación de datos a PDF/Excel
- [ ] Alertas automáticas por umbrales
- [ ] Comparación entre períodos
- [ ] Métricas personalizadas por usuario
- [ ] Integración con APIs externas
- [ ] Dashboard en tiempo real con WebSockets

## 📞 Soporte

Para soporte técnico o consultas sobre la sección Dinámico, contacta al equipo de desarrollo de Buffalo AI.

---

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025  
**Desarrollado por**: Buffalo AI
