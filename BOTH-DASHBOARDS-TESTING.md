# 🧪 Both Dashboards - Complete Testing Guide

## 🎯 Overview

You now have **TWO dashboards**, both with **MOCK DATA MODE** for easy testing!

---

## 📊 Dashboard Comparison

| Feature | Dashboard KPIs 📊 | Dashboard IA 🧠 |
|---------|-------------------|-----------------|
| **Mock Data** | ✅ Yes | ✅ Yes |
| **Toggle Constant** | `FORCE_MOCK_DATA` (line 78) | `FORCE_MOCK_DATA` (line 92) |
| **Mock Insights** | 13 predefined KPIs | 8 AI-selected insights |
| **Mock Charts** | 10 charts (all types) | 6 charts (high-impact) |
| **Purpose** | Complete analysis | Smart selection |
| **Best for Testing** | UI/Charts testing | AI algorithm testing |

---

## 🔥 Enable Mock Data for BOTH

### Dashboard KPIs
**File:** `app/clientes/[clienteId]/dashboard-kpis/page.tsx`  
**Line:** 78

```typescript
const FORCE_MOCK_DATA = true  // ✅ Enable mock data
```

### Dashboard IA
**File:** `app/clientes/[clienteId]/dashboard-ia/page.tsx`  
**Line:** 92

```typescript
const FORCE_MOCK_DATA = true  // ✅ Enable mock data
```

---

## 🧪 Testing Both Dashboards

### Step 1: Enable Mock Mode in Both

**Dashboard KPIs** (line 78):
```typescript
const FORCE_MOCK_DATA = true
```

**Dashboard IA** (line 92):
```typescript
const FORCE_MOCK_DATA = true
```

### Step 2: Start Server
```bash
npm run dev
```

### Step 3: Test Dashboard KPIs
```
http://localhost:3000/clientes/techcorp/dashboard-kpis
```

**Console should show:**
```
🔥 FORCE MOCK DATA MODE ENABLED
🔄 Loading mock KPIs data...
✅ Mock KPIs loaded: 13 KPIs
```

**Visual check:**
- 3 individual metric cards
- 10 charts (2 line, 1 vertical bar, 4 donut, 3 horizontal bar)

### Step 4: Test Dashboard IA
```
http://localhost:3000/clientes/techcorp/dashboard-ia
```

**Console should show:**
```
🔥 DASHBOARD IA - MOCK DATA MODE ENABLED
🔄 Loading mock IA data...
✅ Mock IA data loaded
  📊 Insights: 8
  📈 Charts: 6
```

**Visual check:**
- 8 insight cards (sorted by relevance)
- 6 charts (1 area, 2 bar, 3 donut)
- Purple "IA Activada" badge
- AI interpretations below charts

---

## 📊 Mock Data Summary

### Dashboard KPIs Mock Data

**13 KPIs Total:**
- 3 Individual metrics (cards)
- 2 Line charts (time series)
- 1 Vertical bar chart
- 4 Donut charts
- 3 Horizontal bar charts

**Purpose:** Show ALL predefined KPIs

**Data Characteristics:**
- Comprehensive coverage
- All categories included
- Realistic values
- Multiple data points per chart

---

### Dashboard IA Mock Data

**8 Insights + 6 Charts:**

**Insights Include:**
- 5 Standard metrics
- 1 RED Alert (satisfaction issue)
- 1 PURPLE Recommendation (best time)
- 1 GREEN Trend (growth)

**Charts Include:**
- 1 Area chart (30-day trend, growing)
- 2 Bar charts (comparisons)
- 3 Donut charts (distributions)

**Purpose:** Show AI-selected, prioritized insights

**Data Characteristics:**
- Relevance-scored (70-100%)
- Mix of good/bad scenarios
- Realistic business situation
- AI interpretations included

---

## 🎯 What to Test in Each

### Dashboard KPIs Testing Focus

1. **All Chart Types Render**
   - Individual cards with icons
   - Line charts with data
   - Vertical bars
   - Horizontal bars
   - Donut charts with legends

2. **Data Display**
   - Numbers formatted correctly
   - Charts show data points
   - Tooltips work on hover
   - Legends are visible

3. **Error Handling**
   - No crashes if data missing
   - Error cards display properly
   - Other charts continue rendering

---

### Dashboard IA Testing Focus

1. **Relevance Sorting**
   - Cards ordered 100% → 75%
   - Highest relevance first
   - ✨ badges show correctly

2. **Color Coding**
   - Red cards for alerts
   - Green for excellent
   - Purple for recommendations
   - Blue for neutral

3. **AI Interpretations**
   - Purple gradient boxes
   - 🧠 icon present
   - Text is readable
   - Makes business sense

4. **Type Badges**
   - ⚠️ Alerta (red)
   - ✨ Recomendación (purple)
   - 📈 Tendencia (blue)

---

## 🔄 Console Output Comparison

### Dashboard KPIs Console:
```
🔥 FORCE MOCK DATA MODE ENABLED
🔄 Loading mock KPIs data...
✅ Mock KPIs loaded: 13 KPIs
📊 KPI types: [array of 13 items]
  ➡️ Evolution chart: 7 data items [...]
  ➡️ Sentiment chart: 4 data items [...]
  (10 total data arrays)
📊 Individual KPIs to render: 3
📈 Chart KPIs to render: 10
🎨 renderKPI called for: ... (13 total)
```

### Dashboard IA Console:
```
🔥 DASHBOARD IA - MOCK DATA MODE ENABLED
🔄 Loading mock IA data...
✅ Mock IA data loaded
  📊 Insights: 8
  📈 Charts: 6
  🎯 Relevance scores: [array of 8 items with scores]
```

---

## ✅ Complete Testing Checklist

### Pre-Testing:
- [ ] Both constants set to `true`
- [ ] Server running (`npm run dev`)
- [ ] Browser console open (F12)

### Dashboard KPIs:
- [ ] Yellow warning "Mostrando datos de ejemplo"
- [ ] 13 visualizations total (3 cards + 10 charts)
- [ ] All charts have data
- [ ] Console shows "13 KPIs loaded"

### Dashboard IA:
- [ ] Purple "IA Activada" badge
- [ ] 8 insight cards sorted by relevance
- [ ] 6 charts with AI interpretations
- [ ] 1 red alert, 1 purple recommendation
- [ ] Console shows "8 Insights, 6 Charts"

### Both Dashboards:
- [ ] No red errors in console
- [ ] Charts are interactive (hover tooltips)
- [ ] Refresh button works
- [ ] Responsive on mobile/tablet/desktop

---

## 🚀 Production Deployment

### When Ready for Production

**Dashboard KPIs** (line 78):
```typescript
const FORCE_MOCK_DATA = false  // Use real data
```

**Dashboard IA** (line 92):
```typescript
const FORCE_MOCK_DATA = false  // Use real data
```

Then:
1. Ensure `llamadas_data` table has data
2. Test both dashboards load real data
3. Verify calculations are correct
4. Deploy!

---

## 📋 Quick Command Reference

### Enable Mock Data Both Dashboards:
```bash
# Edit both files, set FORCE_MOCK_DATA = true
# Lines 78 and 92 respectively

# Then restart
npm run dev
```

### Test Dashboard KPIs:
```
http://localhost:3000/clientes/techcorp/dashboard-kpis
# Should see: 13 KPIs with mock data
```

### Test Dashboard IA:
```
http://localhost:3000/clientes/techcorp/dashboard-ia
# Should see: 8 insights + 6 charts with AI interpretations
```

### Disable Mock Data:
```typescript
// Set to false in both files
const FORCE_MOCK_DATA = false

// Restart server
npm run dev
```

---

## 🎨 Visual Comparison

### Dashboard KPIs (Mock Mode)
```
┌─────────────────────────────────────────────┐
│ ⚠️ Mostrando datos de ejemplo              │
└─────────────────────────────────────────────┘

3 CARDS
10 CHARTS (comprehensive)
- 2 line charts
- 1 vertical bar
- 4 donut charts  
- 3 horizontal bars

All data predefined
User interprets
```

### Dashboard IA (Mock Mode)
```
┌─────────────────────────────────────────────┐
│ ✨ IA Activada    [Actualizar]             │
└─────────────────────────────────────────────┘

8 INSIGHT CARDS (sorted by relevance)
6 CHARTS (high-impact)
- 1 area chart (trend)
- 2 bar charts
- 3 donut charts

With AI interpretations
Color-coded alerts
Smart recommendations
```

---

## 🎯 When to Use Each Dashboard

### Daily Workflow:
```
Morning Check (2 min):
  → Dashboard IA (mock OFF)
  → See alerts and recommendations
  
Weekly Review (15 min):
  → Dashboard KPIs (mock OFF)
  → Full analysis of all metrics
```

### Development/Testing:
```
UI Testing:
  → Both dashboards (mock ON)
  → Test all chart types
  → Verify responsive design
  
Algorithm Testing:
  → Dashboard IA (mock ON)
  → Test relevance sorting
  → Test color coding
  → Test AI interpretations
```

---

## 🎉 Summary

You now have:

✅ **Dashboard KPIs** with 13 KPIs + mock data  
✅ **Dashboard IA** with 8 insights + mock data  
✅ **Toggle constants** in both for easy switching  
✅ **Complete mock scenarios** in both  
✅ **Realistic test data** with all scenarios  
✅ **Console debugging** in both  
✅ **Error handling** in both  

**Both dashboards are fully testable without any database!** 🎉

---

## 🚀 Test Both NOW!

### Quick Test Script:
```bash
# 1. Ensure both FORCE_MOCK_DATA = true
# 2. Start server
npm run dev

# 3. Open Dashboard KPIs
http://localhost:3000/clientes/techcorp/dashboard-kpis
# Verify: 13 KPIs with data

# 4. Open Dashboard IA  
http://localhost:3000/clientes/techcorp/dashboard-ia
# Verify: 8 insights + 6 charts with AI interpretations

# 5. Check console (F12) for both
# Should see: 🔥 MOCK DATA MODE ENABLED
```

**Enjoy testing both dashboards!** 🧪✨

---

**Created**: 2025-10-10  
**Dashboards Ready**: 2/2  
**Mock Data**: Complete for both  
**Status**: ✅ Ready for testing

