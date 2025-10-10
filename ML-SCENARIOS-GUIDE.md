# 🤖 ML Scenarios - Complete Guide

## 🎯 Overview

The Dashboard IA now includes a **ML Scenario Simulator** that lets you test how the dashboard adapts to different machine learning model responses!

---

## ✨ What Was Added

### 1. **ML Scenarios File** (`app/api/kpis/ia-insights/ml-scenarios.ts`)
   - 6 pre-built scenarios
   - Different ML model responses
   - Realistic business situations
   - Dynamic data generation

### 2. **Scenario Switcher UI** (Bottom of Dashboard IA)
   - 6 clickable scenario buttons
   - Real-time switching
   - Visual feedback
   - Current scenario indicator

### 3. **Dynamic Reordering**
   - Insights automatically reorder by relevance
   - Most important appears first
   - Colors adapt to status
   - Charts prioritize by ML score

---

## 🎮 6 ML Scenarios Available

### 1. 🟢 **Excellent** - Everything Going Well
**ML Model:** RandomForest  
**Confidence:** 92%  
**Prediction:** "Rendimiento superior continuará"

**Insights:**
- 🟢 Satisfaction: 85.2% (100% relevance)
- 🟢 Conversion: 35.8% (98% relevance)
- 🟢 Growth: +24.5% (95% relevance)
- 🟢 Cost: €0.78 (85% relevance)
- 💡 Recommendation: Continue current strategy

**Characteristics:**
- All metrics green
- High ML confidence scores
- Positive predictions
- Maintenance recommendations

**When to Use:**
- Demo best-case scenario
- Training sessions
- Goal-setting presentations

---

### 2. 🔵 **Balanced** - Normal Operations
**ML Model:** RandomForest  
**Confidence:** 79%  
**Prediction:** "Operaciones normales - optimizaciones menores"

**Insights:**
- 🔵 Total Calls: 1,234 (100% relevance)
- 🟢 Satisfaction: 68.5% (90% relevance)
- 🔵 Conversion: 18.2% (88% relevance)
- 💡 Optimize conversion: +5-7% potential
- 🔵 Cost: €0.98 (80% relevance)

**Characteristics:**
- Mix of blue and green
- Moderate ML scores
- Stable predictions
- Incremental improvements suggested

**When to Use:**
- Typical day-to-day scenario
- Standard operations demo
- Baseline comparison

---

### 3. 🟡 **Warning** - Needs Attention
**ML Model:** GradientBoosting  
**Confidence:** 85%  
**Prediction:** "Requiere atención - métricas en descenso"

**Insights:**
- 🟡 Satisfaction: 58.3% (100% relevance) - Below target
- 🟡 Conversion: 14.2% (98% relevance) - Declining
- 🟡 Cost: €1.45 (95% relevance) - Rising
- 🟡 Duration: 3:12 (88% relevance) - Shorter engagement
- 💡 Optimize timing recommendation (85% relevance)

**Characteristics:**
- Yellow warnings predominate
- Higher relevance for issues
- Downward trend predictions
- Multiple recommendations

**When to Use:**
- Show early warning detection
- Demo intervention planning
- Training on alert response

---

### 4. 🔴 **Critical** - Immediate Action Required
**ML Model:** DeepLearning-LSTM  
**Confidence:** 94%  
**Prediction:** "🚨 ALERTA CRÍTICA - Intervención ejecutiva inmediata"

**Insights:**
- 🔴 Satisfaction: 32.1% (100% relevance) - CRITICAL
- 🔴 Conversion: 4.8% (100% relevance) - CRITICAL
- 🔴 Churn: 68.5% (98% relevance) - Alarming
- 🔴 Duration: 0:42 (97% relevance) - Too short
- 🚨 Emergency Action: URGENT (100% relevance)

**Characteristics:**
- All red alerts
- Maximum relevance scores
- Crisis predictions
- Emergency recommendations

**When to Use:**
- Crisis management training
- Escalation procedure demos
- Worst-case scenario planning

---

### 5. 🟢 **Growth** - Scaling Opportunity
**ML Model:** XGBoost  
**Confidence:** 92%  
**Prediction:** "Oportunidad de crecimiento - escalar rápido"

**Insights:**
- 🚀 Growth Opportunity: +45.2% (100% relevance)
- 💡 Scale Recommendation: +3 agents (98% relevance)
- 🟢 Market Demand: High (96% relevance)
- 🟢 Conversion Stable: 26.8% (92% relevance)
- 📊 Volume: 3,890 (90% relevance)

**Characteristics:**
- Green growth indicators
- High confidence predictions
- Scaling recommendations
- Capacity warnings

**When to Use:**
- Expansion planning
- Hiring justification
- Growth strategy demos

---

### 6. 🟠 **Decline** - Intervention Needed
**ML Model:** NeuralNetwork  
**Confidence:** 91%  
**Prediction:** "Declive continuo predicho - acción correctiva urgente"

**Insights:**
- 🔴 Volume Decline: -28.4% (100% relevance)
- 🔍 Market Analysis: Needs review (98% relevance)
- 🟡 Satisfaction: 51.2% (95% relevance)
- 🟡 Volume: 782 calls (92% relevance)

**Characteristics:**
- Red and orange warnings
- Declining trends
- Root cause analysis
- Strategic recommendations

**When to Use:**
- Turnaround planning
- Market loss analysis
- Recovery strategy demos

---

## 🎨 How the Dashboard Adapts

### Scenario: Excellent
```
[All Green Cards - High Scores]
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 🟢 100%     │ │ 🟢 98%      │ │ 🟢 95%      │
│ Satisfac    │ │ Conversion  │ │ Growth      │
│ 85.2%       │ │ 35.8%       │ │ +24.5%      │
└─────────────┘ └─────────────┘ └─────────────┘
[Charts show upward trends, positive predictions]
```

### Scenario: Critical
```
[All Red Alerts - Maximum Priority]
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 🔴 100% ⚠️  │ │ 🔴 100% ⚠️  │ │ 🔴 98% ⚠️   │
│ Satisfac    │ │ Conversion  │ │ Churn       │
│ 32.1% 🚨    │ │ 4.8% 🚨     │ │ 68.5% 🚨    │
│ CRÍTICO     │ │ CRÍTICO     │ │ CRÍTICO     │
│ [⚠️ Alerta] │ │ [⚠️ Alerta] │ │ [⚠️ Alerta] │
└─────────────┘ └─────────────┘ └─────────────┘
[Charts show downward crashes, crisis predictions]
```

### Scenario: Growth
```
[Green Growth Indicators]
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 🚀 100%     │ │ 💡 98%      │ │ 🟢 96%      │
│ Opportunity │ │ Scale +3    │ │ Demand      │
│ +45.2%      │ │ agents      │ │ High        │
│ [📈Tendenc] │ │ [✨Recomen] │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
[Charts show explosive growth, scaling needs]
```

---

## 🧪 How to Use the Simulator

### Step 1: Open Dashboard IA
```
http://localhost:3000/clientes/techcorp/dashboard-ia
```

### Step 2: Scroll to Bottom

You'll see:
```
┌────────────────────────────────────────────┐
│  ⚡ Simulador de Modelo ML                 │
│  Prueba diferentes escenarios...           │
│                                            │
│  Escenario actual: balanced                │
└────────────────────────────────────────────┘

[Excelente] [Balanceado] [Advertencia] [Crítico] [Crecimiento] [Declive]
   🟢          🔵           🟡            🔴         🟢             🟠
```

### Step 3: Click a Scenario Button

**What Happens:**
1. Dashboard shows loading spinner (0.6 seconds)
2. All insights reload with new scenario data
3. Insights reorder by new relevance scores
4. Colors change based on new statuses
5. Charts update with new data
6. AI interpretations update
7. Button highlights to show active scenario

### Step 4: Compare Different Scenarios

Click through all 6 scenarios to see:
- How ML prioritizes different issues
- How relevance scores change
- How colors adapt (green → yellow → red)
- How insights reorder dynamically
- How AI interpretations change

---

## 🎯 Scenario Comparison Matrix

| Scenario | Top Priority | Relevance Range | Primary Color | Alerts Count | Recommendations |
|----------|-------------|-----------------|---------------|--------------|-----------------|
| **Excellent** | Satisfaction 85% | 78-100% | 🟢 Green | 0 | Maintain |
| **Balanced** | Total Calls | 75-100% | 🔵 Blue | 0 | Optimize |
| **Warning** | Satisfaction 58% | 78-100% | 🟡 Yellow | 3 | Multiple |
| **Critical** | Multiple ALERTS | 75-100% | 🔴 Red | 5 | Emergency |
| **Growth** | Opportunity +45% | 75-100% | 🟢 Green | 1 (capacity) | Scale up |
| **Decline** | Volume -28% | 80-100% | 🔴 Red | 2 | Investigate |

---

## 🔄 How ML Reordering Works

### Algorithm:
```javascript
1. Load scenario data
2. Each insight has relevancia score (0-100%)
3. Sort insights by relevancia (descending)
4. Display highest relevance first
5. Color-code by status
6. Add type badges (alert/recommendation/trend)
```

### Example: Excellent → Critical

**Before (Excellent):**
```
1. Satisfaction 85.2% (100%) 🟢
2. Conversion 35.8% (98%) 🟢
3. Growth +24.5% (95%) 🟢
```

**After (Critical):**
```
1. Satisfaction 32.1% (100%) 🔴 ALERT
2. Conversion 4.8% (100%) 🔴 ALERT
3. Churn 68.5% (98%) 🔴 ALERT
4. Emergency Action (100%) 🔴 RECOMMENDATION
```

**Notice:**
- Same metric (Satisfaction) goes from position 1 → position 1
- BUT: Relevance stays 100%, color changes 🟢→🔴
- New critical insights appear
- Less important metrics disappear

---

## 📊 Charts Also Adapt

### Excellent Scenario:
```
Chart 1: Sentiment (100% relevance)
  - 85% positive 🟢
  - AI: "Mantener estrategia"

Chart 2: Growth Forecast (95% relevance)
  - Upward trend
  - AI: "+18% próxima semana"
```

### Critical Scenario:
```
Chart 1: Sentiment CRISIS (100% relevance)
  - 68% negative 🔴
  - AI: "INTERVENCIÓN URGENTE"

Chart 2: Satisfaction Collapse (100% relevance)
  - Sharp decline from 70% to 32%
  - AI: "Caída del 54% - colapso total predicho"
```

---

## 🎯 What Each Scenario Teaches

### Excellent → Learn:
- How dashboard looks when everything is good
- Where to maintain focus
- What "normal" looks like at peak

### Balanced → Learn:
- Typical daily operations
- Standard relevance distribution
- Normal optimization opportunities

### Warning → Learn:
- Early warning detection
- Multiple yellow flags
- When to start planning interventions

### Critical → Learn:
- Crisis management prioritization
- Emergency response procedures
- Multiple simultaneous alerts
- Executive escalation triggers

### Growth → Learn:
- Opportunity identification
- Scaling decision support
- Capacity planning needs
- ROI projections

### Decline → Learn:
- Market loss detection
- Root cause prioritization
- Turnaround strategy needs
- Competitive analysis triggers

---

## 🧪 Testing Workflow

### Test 1: Static Scenario
```bash
1. Open Dashboard IA
2. Current scenario: "balanced"
3. See 5 insights, 2 charts
4. All normal operations
```

### Test 2: Switch to Critical
```bash
1. Scroll to bottom
2. Click "Crítico" button
3. Watch dashboard reload (0.6s)
4. See priorities change:
   - 5+ red alerts appear at top
   - Charts show crisis data
   - AI interpretations show emergency
```

### Test 3: Switch to Excellent
```bash
1. Click "Excelente" button
2. Watch dashboard reload
3. See priorities change:
   - Green metrics at top
   - Positive trends
   - Maintenance recommendations
```

### Test 4: Cycle Through All
```bash
1. Click each button in order
2. Observe how dashboard adapts
3. Note relevance reordering
4. Check color changes
5. Read AI interpretation changes
```

---

## 🎨 Visual Changes by Scenario

### Color Distribution

| Scenario | Red | Yellow | Green | Purple | Blue |
|----------|-----|--------|-------|--------|------|
| **Excellent** | 0 | 0 | 5 | 1 | 1 |
| **Balanced** | 0 | 0 | 2 | 1 | 2 |
| **Warning** | 0 | 4 | 0 | 2 | 0 |
| **Critical** | 5 | 0 | 0 | 1 | 1 |
| **Growth** | 0 | 0 | 4 | 1 | 1 |
| **Decline** | 2 | 2 | 0 | 1 | 0 |

---

## 🔧 How to Add Custom Scenario

### Step 1: Edit ml-scenarios.ts

Add new scenario in the `scenarios` object:

```typescript
myCustomScenario: {
  insights: [
    {
      id: 'custom-1',
      titulo: 'My Custom Metric',
      valor: '123',
      descripcion: 'Custom description with ML insight',
      tipo: 'metric',
      relevancia: 95,
      categoria: 'Custom',
      icono: 'Activity',
      color: 'blue',
      mlScore: 0.90,
      mlPrediction: 'ML prediction text'
    }
    // Add more insights...
  ],
  charts: [
    {
      id: 'custom-chart',
      titulo: 'Custom Chart',
      descripcion: 'Chart description',
      tipo: 'bar',
      data: [
        { nombre: 'Category 1', valor: 100 },
        { nombre: 'Category 2', valor: 150 }
      ],
      relevancia: 90,
      insight: '🤖 ML: Custom insight about this chart',
      mlScore: 0.88
    }
  ],
  mlMetadata: {
    model: 'CustomModel',
    confidence: 0.85,
    lastTraining: new Date().toISOString(),
    predictions: 'Custom prediction',
    recommendation: 'Custom recommendation'
  }
}
```

### Step 2: Update Type Definition

Add to `MLScenario` type:

```typescript
export type MLScenario = 'excellent' | 'warning' | 'critical' | 'growth' | 'decline' | 'balanced' | 'myCustomScenario'
```

### Step 3: Add Button in Dashboard

Add to scenario switcher grid (line ~787):

```typescript
<button
  onClick={() => changeScenario('myCustomScenario')}
  disabled={currentScenario === 'myCustomScenario' || isLoading}
  className="px-4 py-3 rounded-lg border-2 ..."
>
  <div className="flex flex-col items-center gap-1">
    <YourIcon className="h-5 w-5" />
    <span>Custom</span>
    <span className="text-xs opacity-75">Description</span>
  </div>
</button>
```

---

## 🤖 ML Confidence Scores

Each insight includes an `mlScore` (0-1) representing ML model confidence:

```typescript
mlScore: 0.95  // 95% confident in this insight
mlScore: 0.75  // 75% confident
mlScore: 0.60  // 60% confident (lower confidence)
```

### How It's Used:
- **High confidence (> 0.90):** Show prominently, take action
- **Medium confidence (0.75-0.90):** Monitor closely
- **Low confidence (< 0.75):** Informational only

### Display:
Currently not shown in UI, but available in data for future use.

**Future enhancement:** Show confidence indicator on cards

---

## 📈 Trend Pattern Generation

The `generateGrowthTrendData()` function creates realistic trend data:

```typescript
generateGrowthTrendData(
  days: 30,           // Number of days
  startValue: 80,     // Starting value
  endValue: 150,      // Ending value
  pattern: 'up'       // 'up', 'down', or 'stable'
)
```

**Patterns:**
- **'up':** Linear growth with ±10% variation
- **'down':** Linear decline with ±10% variation
- **'stable':** Flat line with ±5% variation

**Example Output:**
```javascript
[
  { fecha: '01/10', llamadas: 82 },   // Start ~80
  { fecha: '02/10', llamadas: 89 },   // Growing
  { fecha: '03/10', llamadas: 95 },   // Growing
  ...
  { fecha: '30/10', llamadas: 148 }   // End ~150
]
```

---

## 🎯 Use Cases

### Use Case 1: Client Demo
```
1. Start with "Balanced" - Show normal operations
2. Switch to "Excellent" - Show goals/targets
3. Switch to "Warning" - Show early detection
4. Back to "Balanced" - Show how to maintain
```

### Use Case 2: Training Session
```
1. "Balanced" - This is normal
2. "Warning" - These are yellow flags
3. "Critical" - This requires escalation
4. Practice: What would you do in each?
```

### Use Case 3: Algorithm Testing
```
1. Click through all scenarios
2. Verify reordering works
3. Check color logic
4. Validate relevance scores
5. Test AI interpretations
```

### Use Case 4: Stakeholder Presentation
```
1. "Excellent" - Show ideal state
2. "Growth" - Show expansion opportunity
3. "Critical" - Show risk prevention
4. Demonstrate adaptive dashboard
```

---

## 📊 Console Output by Scenario

### Excellent:
```
🔄 Switching to ML scenario: excellent
✅ Mock IA data loaded with ML scenario: excellent
  📊 Insights: 7
  📈 Charts: 3
  🎯 Relevance scores: [100, 98, 95, 90, 85, 82, 78]
  🤖 ML Confidence: 0.92
```

### Critical:
```
🔄 Switching to ML scenario: critical
✅ Mock IA data loaded with ML scenario: critical
  📊 Insights: 6
  📈 Charts: 3
  🎯 Relevance scores: [100, 100, 98, 97, 100, 75]
  🤖 ML Confidence: 0.94
```

---

## 🚀 Quick Test Script

```bash
# 1. Ensure mock mode is ON
# dashboard-ia/page.tsx line 92:
const FORCE_MOCK_DATA = true

# 2. Start server
npm run dev

# 3. Open dashboard
http://localhost:3000/clientes/techcorp/dashboard-ia

# 4. Test scenarios:
# - Click "Excelente" → See all green
# - Click "Crítico" → See all red alerts
# - Click "Crecimiento" → See growth opportunity
# - Click "Declive" → See decline warnings
# - Click "Advertencia" → See yellow warnings
# - Click "Balanceado" → See normal operations

# 5. Watch console for ML scenario logs
```

---

## ✅ What This Demonstrates

### For Business Users:
✅ How AI adapts to different situations  
✅ How priorities change dynamically  
✅ What alerts look like  
✅ What recommendations appear when  
✅ How to interpret different scenarios  

### For Developers:
✅ Dynamic insight reordering  
✅ Relevance-based sorting  
✅ Color coding logic  
✅ Type classification system  
✅ Chart data adaptation  
✅ AI interpretation generation  

### For Stakeholders:
✅ Value of AI-driven dashboards  
✅ Proactive alert detection  
✅ Automatic prioritization  
✅ Actionable recommendations  
✅ Crisis management capability  

---

## 🎉 Key Features

✅ **6 Pre-built Scenarios** - Cover all business situations  
✅ **Dynamic Reordering** - Most important always on top  
✅ **Instant Switching** - See changes immediately  
✅ **Realistic Data** - Based on actual patterns  
✅ **ML Predictions** - Includes forecast text  
✅ **Visual Feedback** - Active button highlighted  
✅ **Console Logging** - Track what's happening  
✅ **No Database Needed** - Pure frontend simulation  

---

## 🔮 Future Enhancements

### Phase 2:
- Add ML confidence display on cards
- Show model name used
- Display last training date
- Add prediction timeline

### Phase 3:
- Connect to real ML model API
- Train model on historical data
- Auto-detect which scenario matches reality
- Predictive alerts

---

## 📝 Summary

You now have a **complete ML scenario simulation system** that:

✅ **Simulates 6 different ML responses**  
✅ **Dynamically reorders insights** by relevance  
✅ **Adapts colors and priorities** automatically  
✅ **Shows how ML guides attention** to what matters  
✅ **Demonstrates value of AI** in decision-making  
✅ **Works without database** for demos  

**Perfect for testing, training, and demonstrating the power of ML-driven dashboards!** 🤖✨

---

**Files Modified:**
- `app/clientes/[clienteId]/dashboard-ia/page.tsx` - Added scenario switcher
- `app/api/kpis/ia-insights/ml-scenarios.ts` - New scenarios file

**Test it now:** Click different scenarios and watch the dashboard adapt! 🎮

---

**Created**: 2025-10-10  
**Scenarios**: 6 complete scenarios  
**Status**: ✅ Ready to test

