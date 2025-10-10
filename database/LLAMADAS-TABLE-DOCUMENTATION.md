# Documentación de la Tabla `llamadas_data`

## Descripción General
Esta tabla almacena todos los datos relacionados con las llamadas realizadas por los agentes. Fue generada desde el campo `columnas` de la tabla `crear_kpis` (primer registro).

## Estructura de Columnas

### 📋 Identificadores

| Columna | Tipo | Descripción |
|---------|------|-------------|
| **id** | VARCHAR(255) | Identificador único de la llamada, con un formato específico como `CALL_1756982566330_9jpc9pg2v_kyn23tpqc_613062`. **PRIMARY KEY** |
| **id_llamada** | VARCHAR(255) | Identificador único de la llamada, con un formato específico como `call_b12f0d7bbdf6926ecbc37b5aa48`. |

---

### 👤 Información del Agente

| Columna | Tipo | Descripción |
|---------|------|-------------|
| **agent_name** | VARCHAR(255) | Nombre del agente o el contexto de la llamada. Valores posibles:<br>- `DEMO V2 PLANETA` (llamada saliente)<br>- `Si llaman a EAE` (llamada entrante)<br>- `Llamar mas tarde al lead` (llamada saliente programada) |
| **agent_id** | VARCHAR(255) | Identificador único del agente, como `agent_cca57189945925f90c98bd578a`. |

---

### ⏱️ Métricas de Duración y Tiempo

| Columna | Tipo | Descripción |
|---------|------|-------------|
| **duracion_ms** | INTEGER | Duración de la llamada en **segundos** (nota: el nombre indica "ms" pero según la descripción son segundos). |
| **fecha_inicio** | TIMESTAMP | Fecha y hora exacta en que la llamada comenzó. |
| **fecha_final** | TIMESTAMP | Fecha y hora exacta en que la llamada finalizó. |

---

### 📞 Estado de la Llamada

| Columna | Tipo | Descripción |
|---------|------|-------------|
| **razon_desconexion** | VARCHAR(255) | Motivo de la desconexión de la llamada. Valores posibles:<br>- `usuario cuelga`<br>- `agente cuelga`<br>- `no hay respuesta`<br>- `ocupado`<br>- `tiempo maximo` |
| **sentimiento** | VARCHAR(255) | Sentimiento del usuario durante la llamada. Valores posibles:<br>- `Negative`<br>- `Positive`<br>- `Neutral`<br>- `Unknown` (equivalente a Neutral) |

---

### 💰 Costos

| Columna | Tipo | Descripción | Relevancia |
|---------|------|-------------|------------|
| **coste_total** | DECIMAL(10,2) | Costo total de la llamada en euros. | ✅ Relevante |
| **coste_voice** | DECIMAL(10,2) | Costo de la voz de la llamada. | ❌ No relevante para el análisis |
| **cost_llm** | DECIMAL(10,2) | Costo del LLM (Large Language Model) utilizado. | ❌ No relevante para el análisis |
| **cost_knowledge** | DECIMAL(10,2) | Costo del conocimiento utilizado. | ❌ No relevante para el análisis |

---

### 🔧 Métricas Técnicas

| Columna | Tipo | Descripción | Relevancia |
|---------|------|-------------|------------|
| **llm_tockens** | INTEGER | Número de tokens del LLM. | ❌ No relevante para el análisis |
| **latency:total** | DECIMAL(10,2) | Latencia total. | ❌ No relevante para el análisis |
| **latency_e2e** | DECIMAL(10,2) | Latencia de extremo a extremo. | ❌ No relevante para el análisis |
| **latency_llm** | DECIMAL(10,2) | Latencia del LLM. | ❌ No relevante para el análisis |
| **latency_tts** | DECIMAL(10,2) | Latencia de Text-to-Speech. | ❌ No relevante para el análisis |
| **latency_kb** | DECIMAL(10,2) | Latencia de la base de conocimiento. | ❌ No relevante para el análisis |

---

### 🎯 Información del Lead

| Columna | Tipo | Descripción | Relevancia |
|---------|------|-------------|------------|
| **lead name** | VARCHAR(255) | Nombre del usuario asociado a la llamada. | ✅ Relevante |
| **voicemail** | BOOLEAN | Indica si se dejó un mensaje de voz. Valores: `TRUE`, `FALSE`, `NULL`. | ❌ No relevante para el análisis |

---

### 📊 Calificación y Estado del Lead

| Columna | Tipo | Descripción |
|---------|------|-------------|
| **entrevista** | VARCHAR(255) | Estado de interés en una entrevista. Valores posibles:<br>- `Calificado > Quiere entrevista`<br>- `no se ha proporcionado esta info`<br>- `Sin interes`<br>- `No se puede contactar` |
| **Situacion_laboral** | VARCHAR(255) | Situación laboral del usuario. Valores posibles:<br>- `Sí` (trabajando)<br>- `No` (no trabajando)<br>- `no se ha proporcionado esta info`<br>- `NULL` (no se pudo contactar) |
| **Antigüedad_laboral** | VARCHAR(255) | Antigüedad laboral del usuario. Valores posibles:<br>- `<1 año`<br>- `1 año – 3 años`<br>- `3 años – 10 años`<br>- `>10 años`<br>- `NULL` (no se pudo contactar)<br>- `no se ha proporcionado esta info` |
| **nivel_estudios** | VARCHAR(255) | Nivel de estudios del usuario. Valores posibles:<br>- `Estudios superiores`<br>- `Bachillerato`<br>- `Sin estudios oficiales`<br>- `Estudios secundarios`<br>- `NULL` (no se pudo contactar)<br>- `no se ha proporcionado esta info` |
| **turno_contacto** | VARCHAR(255) | Turno preferido para el contacto. Valores posibles:<br>- `Tarde`<br>- `Mañana`<br>- `Mediodía` (equivalente a Tarde)<br>- `NULL` (no se pudo contactar)<br>- `no se ha proporcionado esta info` |
| **cargo** | VARCHAR(255) | Cargo del usuario. | ❌ No relevante para el análisis |

---

### 📝 Información Adicional

| Columna | Tipo | Descripción | Relevancia |
|---------|------|-------------|------------|
| **observaciones** | TEXT | Observaciones adicionales. | ❌ No relevante para el análisis |
| **transcripcion** | TEXT | Transcripción de la llamada. | ❌ No relevante para el análisis |

---

## Índices

Para mejorar el rendimiento de las consultas, se han creado los siguientes índices:

- `idx_llamadas_fecha_inicio` - Índice en `fecha_inicio` para consultas por fecha
- `idx_llamadas_agent_name` - Índice en `agent_name` para filtrado por agente
- `idx_llamadas_sentimiento` - Índice en `sentimiento` para análisis de sentimiento
- `idx_llamadas_entrevista` - Índice en `entrevista` para análisis de conversión

---

## Columnas Relevantes para Análisis

### ✅ Principales Columnas de Análisis:
1. **id** - Conteo de llamadas
2. **duracion_ms** - Análisis de duración
3. **fecha_inicio** / **fecha_final** - Análisis temporal
4. **razon_desconexion** - Análisis de causas de finalización
5. **sentimiento** - Análisis de satisfacción
6. **coste_total** - Análisis de costos
7. **agent_name** - Análisis por agente
8. **lead name** - Identificación del contacto
9. **entrevista** - Análisis de conversión
10. **Situacion_laboral** - Segmentación de leads
11. **Antigüedad_laboral** - Perfil profesional
12. **nivel_estudios** - Perfil demográfico
13. **turno_contacto** - Optimización de horarios

### ❌ Columnas de Soporte Técnico (No para Análisis):
- Todas las columnas de `latency_*`
- `cost_llm`, `cost_knowledge`, `llm_tockens`
- `coste_voice`
- `voicemail`
- `cargo`
- `observaciones`
- `transcripcion`

---

## Notas Importantes

1. **Nota sobre duracion_ms**: Aunque el nombre de la columna sugiere milisegundos, la descripción indica que son **segundos**.

2. **Columnas con espacios y caracteres especiales**: 
   - `"lead name"` - Requiere comillas dobles en SQL
   - `"latency:total"` - Requiere comillas dobles en SQL
   - `"Situacion_laboral"` - Mayúsculas, requiere comillas
   - `"Antigüedad_laboral"` - Mayúsculas, requiere comillas

3. **Valores NULL**: Varios campos pueden contener `NULL` literal como string cuando no se pudo contactar al usuario.

4. **Valores "no se ha proporcionado esta info"**: Es un valor estándar para indicar que el dato no fue proporcionado durante la llamada.

---

## Ejemplo de Consulta

```sql
-- Obtener resumen de llamadas por agente con sentimiento positivo
SELECT 
  agent_name,
  COUNT(*) as total_llamadas,
  AVG(duracion_ms) as duracion_promedio,
  SUM(coste_total) as costo_total
FROM llamadas_data
WHERE sentimiento = 'Positive'
  AND fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY agent_name
ORDER BY total_llamadas DESC;
```

---

## Información de Origen

- **Fuente**: Tabla `crear_kpis`, campo `columnas`
- **Registro de Referencia**: ID `01dcd33b-bb67-4cba-a0f4-518752c83381`
- **Total de Columnas**: 28 columnas
- **Fecha de Generación**: 2025-10-10

