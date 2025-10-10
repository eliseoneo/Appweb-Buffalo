# 🧪 Dashboard KPIs - Complete Testing Guide

## 🚀 Step-by-Step Testing Instructions

### Step 1: Start the Server

```bash
npm run dev
```

Wait for:
```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

---

### Step 2: Open the Dashboard

Navigate to:
```
http://localhost:3000/clientes/techcorp/dashboard-kpis
```

---

### Step 3: Open Browser Console

**Press F12** and go to the **Console** tab.

---

## 📊 Expected Console Output (FULL)

You should see this EXACT output:

```javascript
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

  ➡️ Evolución del número de llamadas por día: 7 data items
  [
    { fecha: '01/01', llamadas: 120 },
    { fecha: '02/01', llamadas: 150 },
    { fecha: '03/01', llamadas: 135 },
    { fecha: '04/01', llamadas: 180 },
    { fecha: '05/01', llamadas: 165 },
    { fecha: '06/01', llamadas: 190 },
    { fecha: '07/01', llamadas: 210 }
  ]

  ➡️ Evolución de la duración media de las llamadas por día: 7 data items
  [
    { fecha: '01/01', llamadas: 240 },
    { fecha: '02/01', llamadas: 265 },
    ...
  ]

  ➡️ Distribución de motivos de desconexión: 5 data items
  [
    { nombre: 'usuario cuelga', valor: 450 },
    { nombre: 'agente cuelga', valor: 120 },
    ...
  ]

  ➡️ Sentimiento del usuario en las llamadas: 4 data items
  [
    { nombre: 'Positive', valor: 520 },
    { nombre: 'Negative', valor: 180 },
    ...
  ]

  ➡️ Estado de interés en entrevista: 4 data items [...]
  ➡️ Situación laboral de los usuarios contactados: 4 data items [...]
  ➡️ Preferencia de turno de contacto: 4 data items [...]
  ➡️ Distribución de agentes por número de llamadas: 3 data items [...]
  ➡️ Antigüedad laboral de los usuarios contactados: 5 data items [...]
  ➡️ Nivel de estudios de los usuarios contactados: 5 data items [...]

📊 Individual KPIs to render: 3
📈 Chart KPIs to render: 10 ['linea', 'linea', 'barras_vertical', 'donut', 'donut', 'donut', 'donut', 'barras_horizontal', 'barras_horizontal', 'barras_horizontal']

🎨 renderKPI called for: "Número total de llamadas" (type: individual)
🎨 renderKPI called for: "Duración media de las llamadas" (type: individual)
🎨 renderKPI called for: "Costo total de las llamadas" (type: individual)

🎨 renderKPI called for: "Evolución del número de llamadas por día" (type: linea)
📈 Rendering line chart: Evolución del número de llamadas por día data: 7
  Sample data: { fecha: '01/01', llamadas: 120 }

🎨 renderKPI called for: "Evolución de la duración media de las llamadas por día" (type: linea)
📈 Rendering line chart: Evolución de la duración media de las llamadas por día data: 7
  Sample data: { fecha: '01/01', llamadas: 240 }

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

## 🔍 Troubleshooting Based on Console Output

### Issue 1: "Mock KPIs loaded: 0 KPIs" or No Load Message

**Problem**: Mock data not loading

**Solutions**:
```bash
# Clear cache and hard reload
Ctrl + Shift + R

# Or restart server
Ctrl + C
npm run dev
```

---

### Issue 2: Console shows data but charts are blank/empty

**Check for these in console**:
- ✅ Do you see `➡️` messages with data arrays?
- ✅ Do you see `Sample data:` messages?
- ✅ Do you see `data: 7` or `data: 5` counts?

**If YES to all above**:

**Possible cause**: Recharts not loading

**Solution**:
1. Open browser console
2. Run this command:
```javascript
console.log('Recharts available?', typeof ResponsiveContainer)
```

If it says `undefined`, Recharts is not loaded. Try:
```bash
npm install recharts
npm run dev
```

---

### Issue 3: Console shows warnings "⚠️ has no data"

**Example**:
```
⚠️ Line chart has no data: Evolución del número de llamadas por día
```

**Problem**: Data is not being set properly

**Debug steps**:

1. **Check if you see the ➡️ messages with data**:
   - If NO → Data not in mock array
   - If YES → Data not reaching render function

2. **Check state**:
   Open React DevTools and inspect the component state for `kpis`

---

### Issue 4: Charts show but with wrong data

**Check**:
1. Sample data format in console
2. Verify field names match:
   - Line charts need: `fecha` and `llamadas`
   - Other charts need: `nombre` and `valor`

---

## 📸 What You Should SEE Visually

### Top Section - 3 Cards:
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 📞          │ │ ⏱️          │ │ 💰          │
│ 1,234       │ │ 4:30        │ │ €1,500.50   │
│ Número...   │ │ Duración... │ │ Costo...    │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Line Charts (2 charts with blue lines):
- Chart 1: Line going up from 120 to 210
- Chart 2: Line going up from 240 to 290 (with dips)

### Vertical Bar Chart (1 chart with 5 colored bars):
- Bars of different heights
- 5 bars total
- Colors: Blue, Green, Orange, Red, Purple

### Donut Charts (4 charts with colored segments):
- Each has 4 colored segments
- Legends at the bottom
- Different proportions for each

### Horizontal Bar Charts (3 charts):
- Bars extending from left to right
- Different lengths
- Multiple categories per chart

---

## 🚨 Common Issues & Fixes

### Issue: Blank page

**Fix**:
```bash
# Check server is running
# Look for this in terminal:
○ Local: http://localhost:3000

# If not running:
npm run dev
```

---

### Issue: Yellow warning "Mostrando datos de ejemplo" but no charts

**This is EXPECTED** - It means mock data is active

**But if no charts appear**:

1. **Check browser console** - Look for errors (red text)
2. **Check Network tab** - Look for failed requests
3. **Try different browser** - Test in Chrome/Firefox
4. **Clear all cache**:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

### Issue: Console shows errors in red

**Examples**:
```
Error: Cannot read property 'map' of undefined
TypeError: kpi.data is not iterable
```

**Take a screenshot and share**:
1. The error message
2. The stack trace
3. The line number

---

## 🎯 Quick Diagnostic Commands

Run these in browser console:

### 1. Check if page loaded:
```javascript
console.log('Current URL:', window.location.href)
```

### 2. Check React is working:
```javascript
console.log('React loaded?', typeof React !== 'undefined')
```

### 3. Check Recharts is loaded:
```javascript
console.log('Recharts loaded?', typeof ResponsiveContainer !== 'undefined')
```

### 4. Force reload everything:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload(true)
```

---

## ✅ Success Checklist

When everything works, you should have:

- [ ] Console shows `✅ Mock KPIs loaded: 13 KPIs`
- [ ] Console shows 10 `➡️` messages with data arrays
- [ ] Console shows `Sample data:` for charts
- [ ] Page shows 3 metric cards at top
- [ ] Page shows 2 line charts with blue lines
- [ ] Page shows 1 vertical bar chart with colored bars
- [ ] Page shows 4 donut charts with legends
- [ ] Page shows 3 horizontal bar charts
- [ ] **Total: 13 visualizations visible**
- [ ] **NO** red errors in console
- [ ] **NO** blank charts (all show data)
- [ ] Hover on charts shows tooltips
- [ ] Refresh button works

---

## 📹 Step-by-Step Video Checklist

1. ✅ Open browser to dashboard URL
2. ✅ Press F12 to open console
3. ✅ See loading messages in console
4. ✅ Scroll through console - verify all data logs
5. ✅ Scroll down page - count all visualizations
6. ✅ Hover over a chart - see tooltip
7. ✅ Click refresh button - see timestamp update
8. ✅ Resize window - see responsive layout

---

## 📝 Report Template

If charts still don't show, copy this and fill it out:

```
## Dashboard Not Working

**URL**: http://localhost:3000/clientes/[client]/dashboard-kpis

**Console Output**:
[Copy EVERYTHING from console - the full output]

**Visual State**:
- Cards visible: YES/NO (count: ___)
- Line charts visible: YES/NO (count: ___)
- Bar charts visible: YES/NO (count: ___)
- Donut charts visible: YES/NO (count: ___)

**Browser**: Chrome/Firefox version: ____

**Errors in Console** (red text):
[Copy any red error messages]

**Screenshot**: [Attach if possible]
```

---

## 🔧 Nuclear Option (If Nothing Works)

```bash
# Stop server
Ctrl + C

# Clear everything
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Restart
npm run dev

# Clear browser
# In browser console:
localStorage.clear()
sessionStorage.clear()

# Hard refresh
Ctrl + Shift + R
```

---

**Last Updated**: 2025-10-10  
**Version**: 5.0 (Enhanced Debugging)

**Now test it and share your console output!** 🚀

