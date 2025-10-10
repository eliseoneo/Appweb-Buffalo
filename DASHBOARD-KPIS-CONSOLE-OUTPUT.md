# 🔍 Dashboard KPIs - Expected Console Output

## ✅ Complete Console Output (All 13 KPIs Rendering)

When the dashboard loads correctly with all 13 KPIs, you should see this in the browser console:

```
🔄 Loading mock KPIs data...
✅ Mock KPIs loaded: 13 KPIs
📊 KPI types: [
  { titulo: 'Número total de llamadas', tipo: 'individual' },
  { titulo: 'Duración media de las llamadas', tipo: 'individual' },
  { titulo: 'Costo total de las llamadas', tipo: 'individual' },
  { titulo: 'Evolución del número de llamadas por día', tipo: 'linea' },
  { titulo: 'Evolución de la duración media de las llamadas por día', tipo: 'linea' },
  { titulo: 'Distribución de motivos de desconexión', tipo: 'barras_vertical' },
  { titulo: 'Sentimiento del usuario en las llamadas', tipo: 'donut' },
  { titulo: 'Estado de interés en entrevista', tipo: 'donut' },
  { titulo: 'Situación laboral de los usuarios contactados', tipo: 'donut' },
  { titulo: 'Preferencia de turno de contacto', tipo: 'donut' },
  { titulo: 'Distribución de agentes por número de llamadas', tipo: 'barras_horizontal' },
  { titulo: 'Antigüedad laboral de los usuarios contactados', tipo: 'barras_horizontal' },
  { titulo: 'Nivel de estudios de los usuarios contactados', tipo: 'barras_horizontal' }
]

📊 Individual KPIs to render: 3

🎨 renderKPI called for: "Número total de llamadas" (type: individual)
🎨 renderKPI called for: "Duración media de las llamadas" (type: individual)
🎨 renderKPI called for: "Costo total de las llamadas" (type: individual)

📈 Chart KPIs to render: 10 [
  'linea',
  'linea',
  'barras_vertical',
  'donut',
  'donut',
  'donut',
  'donut',
  'barras_horizontal',
  'barras_horizontal',
  'barras_horizontal'
]

🎨 renderKPI called for: "Evolución del número de llamadas por día" (type: linea)
📈 Rendering line chart: Evolución del número de llamadas por día data: 7

🎨 renderKPI called for: "Evolución de la duración media de las llamadas por día" (type: linea)
📈 Rendering line chart: Evolución de la duración media de las llamadas por día data: 7

🎨 renderKPI called for: "Distribución de motivos de desconexión" (type: barras_vertical)
📊 Rendering vertical bar chart: Distribución de motivos de desconexión data: 5

🎨 renderKPI called for: "Sentimiento del usuario en las llamadas" (type: donut)
🍩 Rendering donut chart: Sentimiento del usuario en las llamadas data: 4

🎨 renderKPI called for: "Estado de interés en entrevista" (type: donut)
🍩 Rendering donut chart: Estado de interés en entrevista data: 4

🎨 renderKPI called for: "Situación laboral de los usuarios contactados" (type: donut)
🍩 Rendering donut chart: Situación laboral de los usuarios contactados data: 4

🎨 renderKPI called for: "Preferencia de turno de contacto" (type: donut)
🍩 Rendering donut chart: Preferencia de turno de contacto data: 4

🎨 renderKPI called for: "Distribución de agentes por número de llamadas" (type: barras_horizontal)
📊 Rendering horizontal bar chart: Distribución de agentes por número de llamadas data: 3

🎨 renderKPI called for: "Antigüedad laboral de los usuarios contactados" (type: barras_horizontal)
📊 Rendering horizontal bar chart: Antigüedad laboral de los usuarios contactados data: 5

🎨 renderKPI called for: "Nivel de estudios de los usuarios contactados" (type: barras_horizontal)
📊 Rendering horizontal bar chart: Nivel de estudios de los usuarios contactados data: 5
```

---

## 🚨 Error Scenarios

### Scenario 1: Charts Return Null (No Data)

If you see warnings like:
```
⚠️ Line chart has no data: Evolución del número de llamadas por día
⚠️ Donut chart has no data: Sentimiento del usuario en las llamadas
```

**Problem**: The `data` property is missing or empty in the KPI object

**Solution**: Check the mock data structure in `loadMockKPIs()` - each chart KPI must have:
```javascript
{
  titulo: "Chart Name",
  tipo: "linea", // or barras_vertical, barras_horizontal, donut
  data: [ /* array with data */ ],  // <- This must exist!
  descripcion: "..."
}
```

---

### Scenario 2: Unknown KPI Type Error

If you see:
```
❌ Unknown KPI type: "line" for KPI: "Evolución del número de llamadas por día"
```

**Problem**: KPI type is in English instead of Spanish

**Solution**: Types must be:
- ✅ `'linea'` (NOT 'line')
- ✅ `'barras_vertical'` (NOT 'bar' or 'vertical_bar')
- ✅ `'barras_horizontal'` (NOT 'horizontal_bar')
- ✅ `'donut'` (OK)
- ✅ `'individual'` (OK)

---

### Scenario 3: Only 3 Individual KPIs Render

Console shows:
```
📊 Individual KPIs to render: 3
📈 Chart KPIs to render: 0 []
```

**Problem**: All chart KPIs have `tipo: 'individual'` or wrong type names

**Solution**: Verify mock data has correct Spanish type names

---

### Scenario 4: Charts Render But Are Empty

Console shows:
```
🎨 renderKPI called for: "Sentimiento del usuario..." (type: donut)
🍩 Rendering donut chart: Sentimiento del usuario... data: 4
```

But chart appears blank.

**Problem**: Data structure doesn't match chart expectations

**For Recharts, verify:**
- Line charts need: `{ fecha: string, llamadas: number }`
- Bar charts need: `{ nombre: string, valor: number }`
- Donut charts need: `{ nombre: string, valor: number }`

---

## ✅ Success Indicators

### Console Logs ✅
- ✅ `Mock KPIs loaded: 13 KPIs`
- ✅ `Individual KPIs to render: 3`
- ✅ `Chart KPIs to render: 10`
- ✅ 13 total `renderKPI called` messages
- ✅ 2 `Rendering line chart` messages with data
- ✅ 1 `Rendering vertical bar chart` message with data
- ✅ 4 `Rendering donut chart` messages with data
- ✅ 3 `Rendering horizontal bar chart` messages with data
- ❌ **NO** warning messages (⚠️)
- ❌ **NO** error messages (❌)

### Visual Indicators ✅
- ✅ 3 cards at top with numbers
- ✅ 2 line charts with blue lines
- ✅ 1 vertical bar chart with colored bars
- ✅ 4 donut charts with legends
- ✅ 3 horizontal bar charts with colored bars

---

## 🔧 Quick Debug Commands

### Open Console and Run:

```javascript
// 1. Check if page loaded
console.log('Page URL:', window.location.href)

// 2. Force a re-render (if available in React DevTools)
// Look for the component and click "Re-render"

// 3. Clear everything and reload
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 📊 Expected Data Counts

| KPI Type | Count | Data Points Each |
|----------|-------|------------------|
| Individual | 3 | No data array needed |
| Line Charts | 2 | 7 data points each |
| Vertical Bar | 1 | 5 data points |
| Donut Charts | 4 | 4 data points each |
| Horizontal Bars | 3 | 3-5 data points each |
| **TOTAL** | **13** | **10 with data arrays** |

---

## 🎯 Testing Checklist

When you load the page:

1. [ ] Open browser console (F12)
2. [ ] Navigate to: `http://localhost:3000/clientes/techcorp/dashboard-kpis`
3. [ ] Wait for page to load
4. [ ] Check console for `✅ Mock KPIs loaded: 13 KPIs`
5. [ ] Count render messages: Should see 13 `🎨 renderKPI called` messages
6. [ ] Check for warnings: Should be **0** warning messages
7. [ ] Check for errors: Should be **0** error messages
8. [ ] Visual check: Count charts on page, should see **13 total** (3 cards + 10 charts)

---

## 📝 Copy This Template to Report Issues

```
## Dashboard KPIs Not Rendering

**Browser**: Chrome/Firefox/Safari [version]

**Console Output**:
```
[Paste your console output here]
```

**Visual Result**:
- Individual cards visible: Yes/No (count: ___)
- Line charts visible: Yes/No (count: ___)
- Vertical bar charts: Yes/No (count: ___)
- Donut charts: Yes/No (count: ___)
- Horizontal bar charts: Yes/No (count: ___)

**Errors in Console**: Yes/No
[If yes, paste error messages]

**Warnings in Console**: Yes/No
[If yes, paste warning messages]

**Screenshot**: [Attach if possible]
```

---

**Last Updated**: 2025-10-10  
**Version**: 3.0 (Enhanced Debugging)

