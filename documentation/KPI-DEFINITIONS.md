# KPI Definitions for Call Analytics Dashboard

Complete reference guide for all 20 Key Performance Indicators (KPIs) available in the n8n-powered analytics dashboard.

---

## 📊 Overview

This document defines 20 professional KPIs for comprehensive call center analytics:
- **13 Base KPIs** - Core metrics from the existing system
- **7 Enhanced KPIs** - Advanced business intelligence metrics

---

## Base KPIs (1-13)

### 1. Número Total de Llamadas
**Category:** Volume Metrics  
**Type:** Single Value (individual)  
**Description:** Total number of calls registered in the dataset. Fundamental metric for understanding activity volume.  
**Calculation:** `COUNT(id)`  
**Chart Type:** Large number display  
**Use Case:** Quick overview of call volume, tracking daily/weekly/monthly trends

**Example Value:** 12,345 calls

---

### 2. Duración Media de las Llamadas
**Category:** Performance Metrics  
**Type:** Single Value (individual)  
**Description:** Average duration of calls in seconds. Evaluates efficiency and interaction length.  
**Calculation:** `AVG(duracion_ms)`  
**Chart Type:** Large number with seconds unit  
**Use Case:** Monitor call efficiency, identify training needs

**Example Value:** 120 seconds (2:00 minutes)

---

### 3. Costo Total de las Llamadas
**Category:** Financial Metrics  
**Type:** Single Value (individual)  
**Description:** Sum of total cost of all calls in euros. Provides overall spending visibility.  
**Calculation:** `SUM(coste_total)`  
**Chart Type:** Currency display  
**Use Case:** Budget tracking, cost optimization analysis

**Example Value:** € 1,500.50

---

### 4. Evolución del Número de Llamadas por Día
**Category:** Trend Analysis  
**Type:** Time Series (línea)  
**Description:** Daily call volume evolution over time. Identifies trends and activity peaks.  
**Calculation:** `COUNT(id) GROUP BY DATE(fecha_inicio)`  
**Chart Type:** Line chart  
**Use Case:** Identify busy periods, staffing optimization

**X-Axis:** Date  
**Y-Axis:** Number of calls

---

### 5. Evolución de la Duración Media por Día
**Category:** Trend Analysis  
**Type:** Time Series (línea)  
**Description:** Average call duration over time. Detects if interactions are getting longer or shorter.  
**Calculation:** `AVG(duracion_ms) GROUP BY DATE(fecha_inicio)`  
**Chart Type:** Line chart  
**Use Case:** Quality monitoring, agent training effectiveness

**X-Axis:** Date  
**Y-Axis:** Average duration (seconds)

---

### 6. Distribución de Motivos de Desconexión
**Category:** Quality Metrics  
**Type:** Categorical Distribution (barras_vertical)  
**Description:** Frequency of each disconnect reason. Identifies common issues or improvement areas.  
**Calculation:** `COUNT(*) GROUP BY razon_desconexion`  
**Chart Type:** Vertical bar chart  
**Values:**
- usuario cuelga
- agente cuelga
- no hay respuesta
- ocupado
- tiempo maximo

**Use Case:** Call quality improvement, process optimization

---

### 7. Sentimiento del Usuario en las Llamadas
**Category:** Customer Experience  
**Type:** Proportion (donut)  
**Description:** Distribution of user sentiments during calls. Evaluates overall customer satisfaction.  
**Calculation:** `COUNT(*) GROUP BY sentimiento`  
**Chart Type:** Donut chart  
**Values:**
- Positive
- Negative
- Neutral
- Unknown (treated as Neutral)

**Use Case:** Customer satisfaction tracking, agent performance

---

### 8. Distribución de Agentes por Número de Llamadas
**Category:** Agent Performance  
**Type:** Categorical Comparison (barras_horizontal)  
**Description:** Compares call volume handled by each agent. Evaluates workload distribution.  
**Calculation:** `COUNT(*) GROUP BY agent_name`  
**Chart Type:** Horizontal bar chart  
**Use Case:** Workload balancing, productivity tracking

---

### 9. Estado de Interés en Entrevista
**Category:** Lead Quality  
**Type:** Proportion (donut)  
**Description:** Distribution of call outcomes related to interview achievement. Measures effectiveness in generating qualified leads.  
**Calculation:** `COUNT(*) GROUP BY entrevista`  
**Chart Type:** Donut chart  
**Values:**
- Calificado > Quiere entrevista
- no se ha proporcionado esta info
- Sin interes
- No se puede contactar

**Use Case:** Lead qualification tracking, conversion optimization

---

### 10. Situación Laboral de los Usuarios Contactados
**Category:** Demographics  
**Type:** Proportion (donut)  
**Description:** Employment status distribution of contacted users. Useful for audience segmentation.  
**Calculation:** `COUNT(*) GROUP BY Situacion_laboral`  
**Chart Type:** Donut chart  
**Values:**
- Sí (working)
- No (not working)
- no se ha proporcionado esta info
- NULL

**Use Case:** Target audience profiling, campaign customization

---

### 11. Antigüedad Laboral de los Usuarios
**Category:** Demographics  
**Type:** Categorical Distribution (barras_horizontal)  
**Description:** Work experience distribution of contacted users. Understand professional experience of contact base.  
**Calculation:** `COUNT(*) GROUP BY Antigüedad_laboral`  
**Chart Type:** Horizontal bar chart  
**Values:**
- <1 año
- 1 año – 3 años
- 3 años – 10 años
- >10 años
- NULL
- no se ha proporcionado esta info

**Use Case:** Demographic profiling, targeted messaging

---

### 12. Nivel de Estudios de los Usuarios
**Category:** Demographics  
**Type:** Categorical Distribution (barras_horizontal)  
**Description:** Education level distribution of contacted users. Demographic profiling.  
**Calculation:** `COUNT(*) GROUP BY nivel_estudios`  
**Chart Type:** Horizontal bar chart  
**Values:**
- Estudios superiores
- Bachillerato
- Sin estudios oficiales
- Estudios secundarios
- NULL
- no se ha proporcionado esta info

**Use Case:** Demographic analysis, campaign targeting

---

### 13. Preferencia de Turno de Contacto
**Category:** Operational Optimization  
**Type:** Proportion (donut)  
**Description:** Distribution of preferred contact times by users. Optimize call scheduling.  
**Calculation:** `COUNT(*) GROUP BY turno_contacto`  
**Chart Type:** Donut chart  
**Values:**
- Tarde
- Mañana
- Mediodía
- NULL
- no se ha proporcionado esta info

**Use Case:** Call scheduling optimization, contact rate improvement

---

## Enhanced Professional KPIs (14-20)

### 14. Tasa de Respuesta
**Category:** Performance Metrics  
**Type:** Percentage (individual)  
**Description:** Percentage of calls answered vs not answered. Measures contact success rate.  
**Calculation:** 
```
(COUNT WHERE razon_desconexion NOT IN ('no hay respuesta', 'ocupado', 'tiempo maximo') 
/ COUNT(*)) * 100
```
**Chart Type:** Percentage gauge  
**Benchmark:** >70% is good, >85% is excellent  
**Use Case:** Contact strategy effectiveness, timing optimization

**Example Value:** 78.5%

---

### 15. Tiempo Promedio de Espera
**Category:** User Experience  
**Type:** Single Value (individual)  
**Description:** Average time before call connection based on latency metrics.  
**Calculation:** `AVG(latency_e2e) / 1000` (convert to seconds)  
**Chart Type:** Time display (seconds)  
**Benchmark:** <5 seconds is excellent, <10 is acceptable  
**Use Case:** User experience optimization, technical performance

**Example Value:** 4.2 seconds

---

### 16. Costo por Conversión
**Category:** Financial ROI  
**Type:** Currency (individual)  
**Description:** Total cost divided by successful interviews. Measures campaign efficiency.  
**Calculation:** 
```
SUM(coste_total) / COUNT(WHERE entrevista = 'Calificado > Quiere entrevista')
```
**Chart Type:** Currency with comparison  
**Use Case:** ROI analysis, budget optimization, campaign effectiveness

**Example Value:** € 12.50 per conversion

---

### 17. ROI de Campaña
**Category:** Financial ROI  
**Type:** Multi-value comparison (barras_vertical)  
**Description:** Return on investment analysis per campaign type.  
**Calculation:** 
```
(Conversions * Expected Value - Total Cost) / Total Cost * 100
GROUP BY campaña
```
**Chart Type:** Vertical bar chart with trend line  
**Use Case:** Campaign selection, budget allocation

**Example Value:** +245% ROI for TEST campaign

---

### 18. Comparativa de Rendimiento por Modelo
**Category:** AI Performance  
**Type:** Multi-dimensional comparison (table + chart)  
**Description:** Performance comparison between MODEL 1 and MODEL 2.  
**Metrics Compared:**
- Average duration
- Conversion rate
- Sentiment distribution
- Cost per call
- Response rate

**Calculation:** `GROUP BY modelo` with multiple aggregations  
**Chart Type:** Comparison table + radar chart  
**Use Case:** AI model optimization, A/B testing analysis

**Example:**
| Model | Avg Duration | Conversion | Sentiment Positive | Cost/Call |
|-------|--------------|------------|-------------------|-----------|
| 1     | 15.2s        | 18%        | 45%               | €0.04     |
| 2     | 21.6s        | 22%        | 52%               | €0.057    |

---

### 19. Tasa de Recontacto
**Category:** Lead Management  
**Type:** Percentage (individual)  
**Description:** Percentage of callbacks requested or scheduled.  
**Calculation:** 
```
COUNT(WHERE observaciones LIKE '%llamar%' OR observaciones LIKE '%contactar%') 
/ COUNT(*) * 100
```
**Chart Type:** Percentage with trend  
**Benchmark:** Lower is better (indicates first-contact resolution)  
**Use Case:** First-call resolution tracking, follow-up management

**Example Value:** 15.3%

---

### 20. Análisis de Campañas
**Category:** Business Intelligence  
**Type:** Multi-metric dashboard (combined)  
**Description:** Campaign effectiveness breakdown showing conversion by campaign type.  
**Metrics Included:**
- Total calls per campaign
- Conversion rate per campaign
- Average cost per campaign
- Sentiment distribution per campaign
- ROI per campaign

**Calculation:** Multiple aggregations `GROUP BY campaña`  
**Chart Type:** Combined dashboard (bars + line + table)  
**Use Case:** Strategic planning, campaign optimization, resource allocation

**Example:**
```json
{
  "TEST": {
    "calls": 3500,
    "conversion_rate": 18.5,
    "avg_cost": 0.045,
    "positive_sentiment": 48,
    "roi": 245
  }
}
```

---

## 🎯 KPI Priority Matrix

### Critical KPIs (Check Daily)
1. Número Total de Llamadas
2. Tasa de Respuesta
3. Costo Total de las Llamadas
4. Sentimiento del Usuario

### Important KPIs (Check Weekly)
5. Duración Media de las Llamadas
6. Estado de Interés en Entrevista
7. Costo por Conversión
8. Distribución de Motivos de Desconexión

### Strategic KPIs (Check Monthly)
9. ROI de Campaña
10. Comparativa de Rendimiento por Modelo
11. Análisis de Campañas
12. All demographic KPIs (10-13)

---

## 📈 Dashboard Layout Recommendations

### Executive Dashboard (High-Level)
- Número Total de Llamadas
- Costo Total
- Tasa de Respuesta
- Sentimiento del Usuario
- Evolución del Número de Llamadas por Día
- ROI de Campaña

### Operations Dashboard (Detailed)
- Distribución de Agentes por Número de Llamadas
- Distribución de Motivos de Desconexión
- Duración Media de las Llamadas
- Tiempo Promedio de Espera
- Tasa de Recontacto

### Analytics Dashboard (Strategic)
- Análisis de Campañas
- Comparativa de Rendimiento por Modelo
- All demographic KPIs
- Costo por Conversión
- Estado de Interés en Entrevista

---

## 🔧 Technical Implementation Notes

### Data Requirements
- All KPIs require normalized data from n8n-data-normalizer
- Timestamp fields must be in ISO 8601 format
- Numeric fields must be properly typed (not strings)

### Refresh Rates
- Real-time KPIs: 1-5 minutes
- Standard KPIs: 15-30 minutes
- Strategic KPIs: 1-24 hours

### Performance Optimization
- Use database indexes on: `fecha_inicio`, `agent_id`, `campaña`, `modelo`
- Implement caching for slow calculations (ROI, complex aggregations)
- Pre-calculate daily summaries for historical trend analysis

---

## 📝 Notes for Dashboard Developers

1. **Color Coding:**
   - Green: Positive metrics (conversions, positive sentiment)
   - Red: Negative metrics (high costs, failed calls)
   - Blue: Neutral/informational metrics
   - Yellow: Warning thresholds

2. **Interactivity:**
   - All charts should support drill-down
   - Enable date range filtering on all dashboards
   - Provide export functionality for reports

3. **Mobile Responsiveness:**
   - Priority KPIs (1-7) must be mobile-optimized
   - Use responsive chart libraries (Recharts, Chart.js, D3.js)

4. **Accessibility:**
   - Include alt-text for all visualizations
   - Ensure color-blind friendly palettes
   - Support keyboard navigation

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Maintained by:** Data Analytics Team

