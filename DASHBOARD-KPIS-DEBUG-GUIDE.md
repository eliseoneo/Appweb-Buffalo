# 🔍 Dashboard KPIs - Debugging Guide

## ✅ Changes Made to Fix Rendering

### 1. **Fixed React Keys**
- ✅ Added unique keys to individual KPI cards
- ✅ Added unique keys to chart components
- ✅ Keys now use format: `individual-${title}-${index}` and `chart-${title}-${index}`

### 2. **Added Console Debugging**
- ✅ Logs when mock data loads
- ✅ Shows total KPI count
- ✅ Shows KPI types and titles
- ✅ Logs individual vs chart KPI counts during render

### 3. **Direct Render Calls**
- ✅ Individual KPIs now call `renderIndividualKPI()` directly
- ✅ Charts call `renderKPI()` which handles type switching

---

## 🧪 How to Test

### Step 1: Start the Dev Server
```bash
npm run dev
```

### Step 2: Open Browser Console
1. Open Chrome/Firefox DevTools (F12)
2. Go to the Console tab
3. Clear the console (Ctrl+L)

### Step 3: Navigate to Dashboard
```
http://localhost:3000/clientes/techcorp/dashboard-kpis
```

### Step 4: Check Console Output

You should see:
```
🔄 Loading mock KPIs data...
✅ Mock KPIs loaded: 13 KPIs
📊 KPI types: [
  { titulo: 'Número total de llamadas', tipo: 'individual' },
  { titulo: 'Duración media de las llamadas', tipo: 'individual' },
  { titulo: 'Costo total de las llamadas', tipo: 'individual' },
  { titulo: 'Evolución del número de llamadas por día', tipo: 'linea' },
  { titulo: 'Evolución de la duración media...', tipo: 'linea' },
  { titulo: 'Distribución de motivos de desconexión', tipo: 'barras_vertical' },
  { titulo: 'Sentimiento del usuario...', tipo: 'donut' },
  { titulo: 'Estado de interés en entrevista', tipo: 'donut' },
  { titulo: 'Situación laboral...', tipo: 'donut' },
  { titulo: 'Preferencia de turno de contacto', tipo: 'donut' },
  { titulo: 'Distribución de agentes...', tipo: 'barras_horizontal' },
  { titulo: 'Antigüedad laboral...', tipo: 'barras_horizontal' },
  { titulo: 'Nivel de estudios...', tipo: 'barras_horizontal' }
]
📊 Individual KPIs to render: 3
📈 Chart KPIs to render: 10 ['linea', 'linea', 'barras_vertical', 'donut', 'donut', 'donut', 'donut', 'barras_horizontal', 'barras_horizontal', 'barras_horizontal']
```

---

## 🔎 What to Look For

### ✅ Expected Behavior:
1. **3 Individual Cards** appear at the top
   - Número total de llamadas (📞)
   - Duración media (⏱️)
   - Costo total (💰)

2. **2 Line Charts** in the first row
   - Evolución del número de llamadas
   - Evolución de la duración media

3. **1 Vertical Bar Chart**
   - Distribución de motivos de desconexión

4. **4 Donut Charts** in 2 rows
   - Sentimiento del usuario
   - Estado de interés en entrevista
   - Situación laboral
   - Preferencia de turno

5. **3 Horizontal Bar Charts**
   - Distribución de agentes
   - Antigüedad laboral
   - Nivel de estudios

---

## 🚨 Common Issues & Solutions

### Issue 1: Console shows "0 KPIs loaded"
**Cause**: Data not loading

**Solution**:
```bash
# Check browser console for errors
# Look for red error messages
# Check Network tab for failed API calls
```

### Issue 2: Console shows "3 Individual KPIs, 0 Chart KPIs"
**Cause**: Chart KPIs have wrong `tipo` values

**Check**:
- Look at the console output for KPI types
- All should be: 'individual', 'linea', 'barras_vertical', 'barras_horizontal', 'donut'
- NOT: 'line', 'bar', 'pie' (English names won't work)

### Issue 3: Charts appear blank/empty
**Cause**: Missing data array

**Solution**:
1. Open DevTools Console
2. Run: `localStorage.clear()`
3. Refresh page (F5)

### Issue 4: Only 3 cards show, no charts
**Cause**: Filter is removing all chart KPIs

**Debug**:
```javascript
// In browser console, run:
console.log('All KPIs:', kpis)
console.log('Individual:', kpis.filter(k => k.tipo === 'individual'))
console.log('Charts:', kpis.filter(k => k.tipo !== 'individual'))
```

---

## 🔧 Manual Debug Commands

Open browser console and run these:

### Check KPI Count:
```javascript
// This will show in React DevTools or you can check the state
console.log('KPIs loaded:', window.__kpis_debug)
```

### Force Reload:
```javascript
// Clear all cache and reload
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Check Recharts:
```javascript
// Verify Recharts is loaded
console.log('Recharts available:', typeof LineChart !== 'undefined')
```

---

## 📊 Expected Visual Layout

```
┌─────────────────────────────────────────────────────┐
│  3 CARDS IN A ROW (Individual Metrics)             │
│  ┌─────┐ ┌─────┐ ┌─────┐                          │
│  │ 📞  │ │ ⏱️  │ │ 💰  │                          │
│  └─────┘ └─────┘ └─────┘                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  2 LINE CHARTS                                      │
│  ┌────────────────┐ ┌────────────────┐             │
│  │ 📈 Evolution   │ │ 📈 Avg Duration│             │
│  │    of Calls    │ │    Evolution   │             │
│  └────────────────┘ └────────────────┘             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  1 VERTICAL BAR CHART                               │
│  ┌────────────────┐                                 │
│  │ 📊 Disconnect  │                                 │
│  │    Reasons     │                                 │
│  └────────────────┘                                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  4 DONUT CHARTS (2x2 Grid)                          │
│  ┌────────────────┐ ┌────────────────┐             │
│  │ 🍩 Sentiment   │ │ 🍩 Interview   │             │
│  └────────────────┘ └────────────────┘             │
│  ┌────────────────┐ ┌────────────────┐             │
│  │ 🍩 Employment  │ │ 🍩 Contact Time│             │
│  └────────────────┘ └────────────────┘             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  3 HORIZONTAL BAR CHARTS                            │
│  ┌────────────────┐ ┌────────────────┐             │
│  │ 📊 Agents      │ │ 📊 Work Exp    │             │
│  └────────────────┘ └────────────────┘             │
│  ┌────────────────┐                                 │
│  │ 📊 Education   │                                 │
│  └────────────────┘                                 │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Success Checklist

When the page loads correctly, you should see:

- [ ] Yellow warning box saying "Mostrando datos de ejemplo"
- [ ] 3 metric cards at the top with icons and numbers
- [ ] 2 line charts with blue lines
- [ ] 1 vertical bar chart with colored bars
- [ ] 4 donut charts with legends at the bottom
- [ ] 3 horizontal bar charts
- [ ] **Total: 13 visualizations**

---

## 🔄 If Nothing Appears

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. **Check console for errors**: Look for red error messages
4. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## 📝 Report Issue Format

If charts still don't render, provide this info:

1. **Console output**: Copy the logs starting with 🔄, ✅, 📊, 📈
2. **Network errors**: Check Network tab for failed requests
3. **Browser**: Chrome/Firefox/Safari version
4. **Screen size**: Desktop/Mobile/Tablet
5. **Screenshot**: Of the page and console

---

## 🎯 Quick Test Script

Run this in browser console:
```javascript
// Quick diagnostic
console.log('=== DASHBOARD DIAGNOSTICS ===')
console.log('1. KPIs state available?', window.location.href)
console.log('2. Recharts loaded?', typeof ResponsiveContainer !== 'undefined')
console.log('3. React version:', React?.version || 'Not found')
console.log('4. Check Network tab for API errors')
console.log('=============================')
```

---

**Last Updated**: 2025-10-10  
**Version**: 2.0 (With Debug Logs)

