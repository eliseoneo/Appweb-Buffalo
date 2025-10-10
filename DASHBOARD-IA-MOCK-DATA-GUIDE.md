# 🧪 Dashboard IA - Mock Data Testing Guide

## 🔥 Mock Data Mode

The Dashboard IA now includes **complete mock data** for testing the AI interface without requiring a database!

---

## 🎯 Toggle Mock Data Mode

### Enable Mock Data (For Testing)

**File:** `app/clientes/[clienteId]/dashboard-ia/page.tsx` (Line 92)

```typescript
const FORCE_MOCK_DATA = true  // ✅ Enable mock data
```

### Disable Mock Data (For Production)

```typescript
const FORCE_MOCK_DATA = false  // ❌ Use real database
```

---

## 📊 Mock Data Includes

### 8 AI-Selected Insights (Sorted by Relevance)

#### 1. Total de Llamadas (100% relevance)
```
Type: Metric
Value: 1,234
Category: Volumen
Color: Blue
Icon: 📞 Phone
```

#### 2. Satisfacción del Cliente (98% relevance) ⚠️
```
Type: ALERT
Value: 42.1%
Category: Calidad
Color: RED
Icon: ❤️ Heart
Description: ⚠️ Alto nivel de sentimiento negativo detectado (35% negativo)
```

#### 3. Tasa de Conversión (95% relevance) ✅
```
Type: Metric
Value: 28.3%
Category: Conversión
Color: GREEN
Icon: 🎯 Target
Description: 🎯 Excelente tasa de conversión a entrevistas
```

#### 4. Tendencia de Crecimiento (90% relevance) 📈
```
Type: TREND
Value: +12.5%
Category: Tendencias
Color: GREEN
Icon: 📈 TrendingUp
Description: 📈 Crecimiento sostenido en el volumen de llamadas
```

#### 5. Duración Promedio (85% relevance)
```
Type: Metric
Value: 4:32
Category: Eficiencia
Color: Blue
Icon: ⏱️ Clock
Description: Duración óptima de llamada - buena interacción con clientes
```

#### 6. Costo Total (85% relevance)
```
Type: Metric
Value: €1,245.80
Category: Costos
Color: GREEN
Icon: 💰 DollarSign
Description: Costo promedio por llamada: €1.01
```

#### 7. Agente Más Efectivo (80% relevance)
```
Type: Metric
Value: DEMO V2 PLANETA
Category: Rendimiento
Color: Blue
Icon: 👥 Users
Description: 650 llamadas gestionadas - 52% del total
```

#### 8. Mejor Horario para Contactar (75% relevance) 💡
```
Type: RECOMMENDATION
Value: Tarde
Category: Optimización
Color: PURPLE
Icon: ⏱️ Clock
Description: 💡 El 42% de contactos exitosos ocurren en la tarde
```

---

### 6 High-Impact Charts

#### Chart 1: Tendencia de Llamadas (85% relevance)
```
Type: AREA CHART
Data Points: 21 days (from 10/09 to 30/09)
Pattern: Growing trend from 35 to 85 calls/day
AI Insight: "📈 Crecimiento del 12.5% - Tendencia positiva sostenida"
```

Data:
```javascript
[
  { fecha: '10/09', llamadas: 35 },
  { fecha: '11/09', llamadas: 42 },
  ...
  { fecha: '30/09', llamadas: 85 }
]
// Shows clear upward trend
```

#### Chart 2: Distribución de Sentimiento (90% relevance) ⚠️
```
Type: DONUT CHART
Segments: 4
AI Insight: "⚠️ 35% de sentimiento negativo - Revisar calidad de servicio"
```

Data:
```javascript
[
  { nombre: 'Positive', valor: 520 },   // 42%
  { nombre: 'Negative', valor: 432 },   // 35% ⚠️
  { nombre: 'Neutral', valor: 220 },    // 18%
  { nombre: 'Unknown', valor: 62 }      // 5%
]
```

#### Chart 3: Estado de Conversión (95% relevance) ✅
```
Type: DONUT CHART
Segments: 4
AI Insight: "🎯 28.3% de conversión - Por encima del promedio de la industria (20%)"
```

Data:
```javascript
[
  { nombre: 'Calificado > Quiere entrevista', valor: 350 },  // 28.3% ✅
  { nombre: 'no se ha proporcionado esta info', valor: 450 },
  { nombre: 'Sin interes', valor: 280 },
  { nombre: 'No se puede contactar', valor: 154 }
]
```

#### Chart 4: Motivos de Desconexión (80% relevance)
```
Type: BAR CHART (Vertical)
Bars: 5
AI Insight: "El 36% de llamadas termina porque el usuario cuelga - indicador normal"
```

Data:
```javascript
[
  { nombre: 'usuario cuelga', valor: 450 },        // 36%
  { nombre: 'no hay respuesta', valor: 280 },      // 23%
  { nombre: 'ocupado', valor: 180 },               // 15%
  { nombre: 'agente cuelga', valor: 120 },         // 10%
  { nombre: 'tiempo maximo', valor: 85 }           // 7%
]
```

#### Chart 5: Rendimiento por Agente (75% relevance)
```
Type: BAR CHART (Vertical)
Bars: 3
AI Insight: "DEMO V2 PLANETA gestiona 52% de las llamadas - considerar balanceo de carga"
```

Data:
```javascript
[
  { nombre: 'DEMO V2 PLANETA', valor: 650 },           // 52%
  { nombre: 'Si llaman a EAE', valor: 420 },           // 34%
  { nombre: 'Llamar mas tarde al lead', valor: 164 }   // 13%
]
```

#### Chart 6: Preferencia de Horario (70% relevance) 💡
```
Type: DONUT CHART
Segments: 4
AI Insight: "💡 42% prefiere contacto en la tarde - programar más llamadas en ese horario"
```

Data:
```javascript
[
  { nombre: 'Tarde', valor: 520 },             // 42% ✅
  { nombre: 'Mañana', valor: 380 },            // 31%
  { nombre: 'Mediodía', valor: 220 },          // 18%
  { nombre: 'No especificado', valor: 114 }    // 9%
]
```

---

## 📋 Mock Data Features

### ✅ Realistic Scenario
The mock data represents a **realistic business situation**:

- **Volume:** 1,234 total calls
- **Problem:** High negative sentiment (35%) → Shows as RED ALERT
- **Success:** Good conversion rate (28.3%) → Shows as GREEN
- **Trend:** Growing volume (+12.5%) → Shows as TREND
- **Opportunity:** Best time to call identified → Shows as PURPLE RECOMMENDATION

### ✅ All Insight Types Included
- 5 Standard Metrics (blue/green)
- 1 Alert (red)
- 1 Trend (green)
- 1 Recommendation (purple)

### ✅ All Chart Types Included
- 1 Area chart (trend)
- 2 Bar charts (comparisons)
- 3 Donut charts (distributions)

---

## 🎨 Visual Preview (With Mock Data)

### Section 1: Insights (Grid of 8 cards)

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Volumen 100%│ │ Calidad  98%│ │ Conversión95│ │ Tendencias90│
│             │ │             │ │             │ │             │
│ Total   📞 │ │ Satisfac ❤️ │ │ Tasa    🎯  │ │ Crecim. 📈 │
│ 1,234       │ │ 42.1%  🔴  │ │ 28.3%  🟢  │ │ +12.5% 🟢  │
│             │ │             │ │             │ │             │
│ Volumen...  │ │⚠️ Alto neg. │ │🎯 Excelente │ │📈 Crecimien│
│             │ │             │ │             │ │             │
│             │ │ [⚠️ Alerta] │ │             │ │ [📈Tendenc]│
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Eficiencia85│ │ Costos   85%│ │ Rendimient80│ │ Optimiz. 75%│
│             │ │             │ │             │ │             │
│ Duración ⏱️ │ │ Costo   💰 │ │ Agente  👥  │ │ Horario ⏱️ │
│ 4:32        │ │ €1,245.80   │ │ DEMO V2...  │ │ Tarde       │
│             │ │             │ │             │ │             │
│ Óptima...   │ │ Promedio... │ │ 650 llamadas│ │💡 42% tarde │
│             │ │             │ │             │ │             │
│             │ │             │ │             │ │ [✨Recomen]│
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Section 2: Charts (Grid of 6 charts)

```
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ Tendencia de Llamadas     85%│ │ Distribución Sentimiento  90%│
│ Evolución últimos 30 días    │ │ Satisfacción del cliente     │
│                              │ │                              │
│     [AREA CHART - GROWING]   │ │     [DONUT - 4 SEGMENTS]     │
│        85                    │ │   Positive  Negative         │
│       /                      │ │   Neutral   Unknown          │
│      /                       │ │                              │
│     /                        │ │                              │
│    /                         │ │                              │
│   35                         │ │                              │
│                              │ │                              │
│ ┌──────────────────────────┐ │ │ ┌──────────────────────────┐ │
│ │ 🧠 IA: Crecimiento del   │ │ │ │ 🧠 IA: ⚠️ 35% sentimiento│ │
│ │    12.5% positivo        │ │ │ │    negativo - Revisar    │ │
│ └──────────────────────────┘ │ │ └──────────────────────────┘ │
└──────────────────────────────┘ └──────────────────────────────┘

┌──────────────────────────────┐ ┌──────────────────────────────┐
│ Conversión a Entrevista   95%│ │ Motivos de Desconexión    80%│
│ Efectividad de llamadas      │ │ Por qué terminan llamadas    │
│                              │ │                              │
│  [DONUT - 4 SEGMENTS]        │ │  [BAR CHART - 5 BARS]        │
│  28.3% Quiere entrevista     │ │  450  280  180  120  85      │
│                              │ │  [▓] [▓] [▓] [▓] [▓]         │
│                              │ │                              │
│ ┌──────────────────────────┐ │ │ ┌──────────────────────────┐ │
│ │ 🧠 IA: 🎯 28.3% conversión│ │ │ │ 🧠 IA: 36% usuario cuelga│ │
│ │    Por encima promedio   │ │ │ │    indicador normal      │ │
│ └──────────────────────────┘ │ │ └──────────────────────────┘ │
└──────────────────────────────┘ └──────────────────────────────┘

┌──────────────────────────────┐ ┌──────────────────────────────┐
│ Rendimiento por Agente    75%│ │ Preferencia Horario       70%│
│ Distribución de llamadas     │ │ Optimización planificación   │
│                              │ │                              │
│  [BAR CHART - 3 BARS]        │ │  [DONUT - 4 SEGMENTS]        │
│  650    420    164           │ │  42% Tarde                   │
│  [▓▓]  [▓▓]   [▓]           │ │                              │
│                              │ │                              │
│ ┌──────────────────────────┐ │ │ ┌──────────────────────────┐ │
│ │ 🧠 IA: DEMO V2 52% total │ │ │ │ 🧠 IA: 💡 42% prefiere   │ │
│ │    considerar balanceo   │ │ │ │    tarde - programar más │ │
│ └──────────────────────────┘ │ │ └──────────────────────────┘ │
└──────────────────────────────┘ └──────────────────────────────┘
```

---

## 🧪 Testing Scenarios Included

### Scenario 1: Critical Alert
**Insight:** Satisfacción del Cliente (42.1%)
- **Relevance:** 98% (highest after volume)
- **Type:** ALERT (red)
- **Color:** Red card
- **Badge:** ⚠️ Alerta

**Purpose:** Test how critical alerts are displayed

---

### Scenario 2: Excellent Performance
**Insight:** Tasa de Conversión (28.3%)
- **Relevance:** 95%
- **Type:** Metric
- **Color:** Green
- **Description:** ✅ "Excelente tasa"

**Purpose:** Test positive metric display

---

### Scenario 3: Growing Trend
**Insight:** Tendencia de Crecimiento (+12.5%)
- **Relevance:** 90%
- **Type:** TREND
- **Badge:** 📈 Tendencia
- **Chart:** Area chart with upward slope

**Purpose:** Test trend detection and visualization

---

### Scenario 4: Recommendation
**Insight:** Mejor Horario para Contactar (Tarde)
- **Relevance:** 75%
- **Type:** RECOMMENDATION
- **Color:** Purple
- **Badge:** ✨ Recomendación

**Purpose:** Test recommendation display

---

## 📊 Chart Data Details

### Area Chart (Call Trend)
```javascript
21 data points showing growth from 35 to 85 calls/day
Pattern: Upward trend with natural variations
Demonstrates: Time series visualization
```

### Donut Charts (3 total)
```javascript
1. Sentiment: 4 segments (Positive, Negative, Neutral, Unknown)
2. Conversion: 4 segments (status categories)
3. Contact Time: 4 segments (time preferences)
Demonstrates: Proportion visualization
```

### Bar Charts (2 total)
```javascript
1. Disconnect Reasons: 5 bars (5 categories)
2. Agent Performance: 3 bars (3 agents)
Demonstrates: Comparison visualization
```

---

## 🎯 What Each Element Tests

### Relevance Scores (✨ XX%)
- Tests: Sorting algorithm
- Range: 70-100%
- Display: Top right of each card

### Color Coding
- 🔴 Red: Tests alert display
- 🟢 Green: Tests success display
- 🟡 Yellow: Tests warning display
- 🟣 Purple: Tests recommendation display
- 🔵 Blue: Tests neutral display

### Type Badges
- ⚠️ **Alerta**: Tests red badge
- ✨ **Recomendación**: Tests purple badge
- 📈 **Tendencia**: Tests blue badge

### AI Interpretations
- Tests purple gradient box below charts
- Tests icon + text layout
- Tests interpretation quality

---

## 🧪 How to Test

### Step 1: Enable Mock Data
```typescript
// Line 92 in dashboard-ia/page.tsx
const FORCE_MOCK_DATA = true
```

### Step 2: Start Server
```bash
npm run dev
```

### Step 3: Open Dashboard
```
http://localhost:3000/clientes/techcorp/dashboard-ia
```

### Step 4: Open Console (F12)
Expected output:
```
🔥 DASHBOARD IA - MOCK DATA MODE ENABLED
🔄 Loading mock IA data...
✅ Mock IA data loaded
  📊 Insights: 8
  📈 Charts: 6
  🎯 Relevance scores: [
    { titulo: 'Total de Llamadas', relevancia: 100 },
    { titulo: 'Satisfacción del Cliente', relevancia: 98 },
    { titulo: 'Tasa de Conversión', relevancia: 95 },
    { titulo: 'Tendencia de Crecimiento', relevancia: 90 },
    { titulo: 'Duración Promedio', relevancia: 85 },
    { titulo: 'Costo Total', relevancia: 85 },
    { titulo: 'Agente Más Efectivo', relevancia: 80 },
    { titulo: 'Mejor Horario para Contactar', relevancia: 75 }
  ]
```

---

## ✅ Visual Checklist

When testing, verify you see:

### Insights Section:
- [ ] Purple "✨ IA Activada" badge at top
- [ ] 8 insight cards total
- [ ] Cards sorted by relevance (100%, 98%, 95%,... 75%)
- [ ] 1 RED card (Satisfacción - Alert)
- [ ] 1 PURPLE card (Mejor Horario - Recommendation)
- [ ] 1 card with 📈 Tendencia badge
- [ ] Each card has ✨ relevance % in top right
- [ ] Each card has category in top left

### Charts Section:
- [ ] 6 charts total
- [ ] 1 Area chart with blue gradient (trending up)
- [ ] 2 Bar charts with colored bars
- [ ] 3 Donut charts with legends
- [ ] Each chart has ✨ relevance % in top right
- [ ] Each chart has purple "🧠 IA:" box below
- [ ] AI interpretations are readable and make sense

---

## 🎨 Color Testing

### Verify Color Coding:
- **Blue Cards** (4): Total, Duración, Agente
- **Red Card** (1): Satisfacción - ALERT
- **Green Cards** (2): Conversión, Costo, Tendencia
- **Purple Card** (1): Mejor Horario - RECOMMENDATION

### Verify Icons:
- 📞 Phone (Total)
- ❤️ Heart (Satisfacción)
- 🎯 Target (Conversión)
- 📈 TrendingUp (Tendencia)
- ⏱️ Clock (Duración, Horario)
- 💰 DollarSign (Costo)
- 👥 Users (Agente)

---

## 🔧 Modify Mock Data

### Change Insight Values

**File:** `app/clientes/[clienteId]/dashboard-ia/page.tsx`

Find the `loadMockIAData()` function and modify:

```typescript
{
  id: 'total-calls',
  titulo: 'Total de Llamadas',
  valor: '2,500', // ← Change this value
  descripcion: 'Your custom description',
  tipo: 'metric',
  relevancia: 100, // ← Change relevance
  categoria: 'Volumen',
  icono: 'Phone',
  color: 'blue' // ← Change color
}
```

### Add New Insight

```typescript
// Add to insights array
{
  id: 'my-custom-insight',
  titulo: 'My Custom Metric',
  valor: '123',
  descripcion: 'Custom description',
  tipo: 'recommendation', // metric | alert | trend | recommendation
  relevancia: 88,
  categoria: 'Custom',
  icono: 'Activity',
  color: 'purple'
}
```

### Change Chart Data

```typescript
// Find chart and modify data array
{
  id: 'call-trend',
  titulo: 'Tendencia de Llamadas',
  data: [
    { fecha: '01/10', llamadas: 50 }, // ← Modify these
    { fecha: '02/10', llamadas: 60 },
    // Add more data points
  ],
  relevancia: 85,
  insight: 'Your custom AI insight text'
}
```

---

## 🎯 Testing Different Scenarios

### Test 1: All Good Performance
Set mock data to show all green:
```typescript
// Satisfaction high
valor: '78.5%'
color: 'green'

// Conversion high
valor: '32.1%'
color: 'green'
```

### Test 2: Multiple Alerts
Set mock data to show multiple red cards:
```typescript
// Low satisfaction
tipo: 'alert'
color: 'red'

// Low conversion
tipo: 'alert'
color: 'red'

// High costs
tipo: 'alert'
color: 'red'
```

### Test 3: Growth Scenario
```typescript
// Show trending up
tipo: 'trend'
valor: '+25.3%'
insight: '📈 Crecimiento acelerado'
```

### Test 4: Decline Scenario
```typescript
// Show trending down
tipo: 'trend'
valor: '-15.2%'
color: 'red'
insight: '📉 Reducción significativa'
```

---

## 📝 Console Output Reference

### Successful Load:
```
🔥 DASHBOARD IA - MOCK DATA MODE ENABLED
🔄 Loading mock IA data...
✅ Mock IA data loaded
  📊 Insights: 8
  📈 Charts: 6
  🎯 Relevance scores: [... array of 8 items ...]
```

### No Errors Expected:
- ❌ Should see ZERO red error messages
- ⚠️ Should see ZERO warnings (unless testing error states)

---

## 🔄 Toggle Between Mock and Real Data

### For Testing (Mock Data):
```typescript
// Line 92
const FORCE_MOCK_DATA = true  // ✅ Use mock data
```

**When to use:**
- Testing UI without database
- Demonstrating features
- Development without data
- Quick prototyping

### For Production (Real Data):
```typescript
const FORCE_MOCK_DATA = false  // ❌ Use real database
```

**When to use:**
- Production deployment
- Real data analysis
- After populating `llamadas_data` table
- Client presentations with actual data

---

## 🎉 Mock Data Benefits

✅ **Test immediately** - No database setup needed  
✅ **See all features** - All insight types included  
✅ **Realistic scenario** - Mix of good/bad metrics  
✅ **All chart types** - Area, bar, donut  
✅ **AI interpretations** - See how they look  
✅ **Color coding** - Test visual hierarchy  
✅ **Responsive** - Test on all devices  

---

## 🚀 Quick Test NOW

```bash
# 1. Server should be running
npm run dev

# 2. Navigate to dashboard
http://localhost:3000/clientes/techcorp/dashboard-ia

# 3. Open console (F12)
# Look for: 🔥 DASHBOARD IA - MOCK DATA MODE ENABLED

# 4. Visual check:
# - 8 insight cards (sorted by relevance)
# - 1 red alert card
# - 1 purple recommendation card
# - 6 charts with AI interpretations
```

---

## ✅ Success Indicators

Dashboard mock data is working when you see:

- [x] Console: `🔥 DASHBOARD IA - MOCK DATA MODE ENABLED`
- [x] Console: `✅ Mock IA data loaded`
- [x] 8 insight cards on page
- [x] Cards sorted: 100%, 98%, 95%, 90%, 85%, 85%, 80%, 75%
- [x] 1 red card (Satisfacción)
- [x] 1 purple card (Mejor Horario)
- [x] 6 charts with data
- [x] Each chart has "🧠 IA:" box
- [x] Area chart shows growing trend
- [x] Donut charts have legends
- [x] No console errors

---

**Mock data is now ready for testing! Just enable the flag and reload!** 🧪✨

---

**Last Updated**: 2025-10-10  
**Version**: 1.0 (With Mock Data)  
**Mock Insights**: 8 (all types included)  
**Mock Charts**: 6 (3 chart types)  
**Realistic**: Yes (includes alerts, trends, recommendations)

