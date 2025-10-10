# ⚡ Algorithm Quick Reference Card

## 🎯 Current Algorithm

**Type:** Rule-Based Scoring  
**File:** `app/api/kpis/ia-insights/route.ts`  
**Speed:** < 500ms  
**Cost:** Free  
**ML:** No (pure JavaScript + SQL)

---

## 🔧 Quick Changes

### Change Alert Threshold
```typescript
// Line ~70-75
const relevancia = negativoPct > 30 ? 98 : 85
//                              ↑ Change this number
```

### Change Number of Insights Shown
```typescript
// Line ~330
insights.slice(0, 8)  // Change 8 to 4, 10, 12, etc.
charts.slice(0, 6)    // Change 6 to 4, 8, 10, etc.
```

### Change Conversion Alert
```typescript
// Line ~140
if (conversionRate < 10) {  // Change 10 to 15, 20, etc.
  tipo = 'alert'
}
```

---

## 📊 Current Insights & Thresholds

| Insight | Threshold | Relevance | Alert If |
|---------|-----------|-----------|----------|
| **Satisfaction** | negativePct > 30% | 98 | Yes (red) |
| **Satisfaction** | positivePct > 70% | 95 | No (green) |
| **Conversion** | rate < 10% | 98 | Yes (red) |
| **Conversion** | rate > 25% | 95 | No (green) |
| **Duration** | < 60 seconds | 95 | Yes (red) |
| **Duration** | > 300 seconds | 80 | No (green) |
| **Cost** | > €1.00/call | 85 | Watch (yellow) |
| **Trend** | change > 10% | 90 | Highlight |

---

## 🚀 Add New Insight (5 Steps)

### 1. Write SQL Query
```typescript
const myResult = await query(`
  SELECT COUNT(*) as count 
  FROM llamadas_data 
  WHERE my_condition
`)
```

### 2. Calculate Metric
```typescript
const myValue = parseInt(myResult.rows[0].count)
const myPercentage = (myValue / totalLlamadas) * 100
```

### 3. Determine Relevance
```typescript
const relevancia = myPercentage > 50 ? 90 : 75
```

### 4. Set Type & Color
```typescript
const tipo = myPercentage > 80 ? 'alert' : 'metric'
const color = myPercentage > 80 ? 'red' : 'green'
```

### 5. Push to Array
```typescript
insights.push({
  id: 'my-insight',
  titulo: 'My Custom Insight',
  valor: `${myPercentage.toFixed(1)}%`,
  descripcion: 'Custom description',
  tipo,
  relevancia,
  categoria: 'Custom',
  icono: 'Activity',
  color
})
```

---

## 🧮 Relevance Formula

```
Final Relevance = Base Score + Threshold Modifier

Where:
  Base Score = 75-100 (by metric importance)
  Threshold Modifier = 0-20 (if threshold crossed)
  
Example:
  Satisfaction base = 85
  If negative > 30%: +13
  Final = 98 ✅
```

---

## 🎨 Color Rules

```typescript
// Green = Excellent
positivePct > 70 → color: 'green'
conversionRate > 25 → color: 'green'

// Red = Alert
negativePct > 30 → color: 'red'
conversionRate < 10 → color: 'red'
avgDuration < 60 → color: 'red'

// Yellow = Warning
In between thresholds → color: 'yellow'

// Purple = Recommendation
Always for recommendations → color: 'purple'

// Blue = Neutral
Standard metrics → color: 'blue'
```

---

## 📈 Type Rules

```typescript
// 'alert' - Requires attention
negativePct > 30
conversionRate < 10
avgDuration < 60

// 'recommendation' - Optimization opportunity
Best contact time
Cost reduction tips
Strategy suggestions

// 'trend' - Directional change
Growth > 10%
Decline > 10%

// 'metric' - Standard KPI
Everything else
```

---

## 🔄 Upgrade Paths

### Level 1: Current (Rule-Based) ✅
```
No changes needed
Modify thresholds as needed
```

### Level 2: Add Statistics
```bash
npm install mathjs
# Add Z-score, std dev calculations
```

### Level 3: Add Simple ML
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-node
# Add linear regression, simple classifiers
```

### Level 4: External AI
```bash
# Add OpenAI or Hugging Face
# Generate text insights with GPT
```

---

## 📝 Files to Modify

### Main Algorithm:
```
app/api/kpis/ia-insights/route.ts
  Lines 60-330: All calculations
  Line 330: Sorting & selection
```

### Thresholds Only:
```
Search for these in ia-insights/route.ts:
  - "negativoPct > 30"    (satisfaction alert)
  - "conversionRate < 10" (conversion alert)
  - "avgSeconds < 60"     (duration alert)
  - "avgCost > 1"         (cost warning)
  - "trend > 10"          (significant trend)
```

### Configuration:
```
Create: config/ia-thresholds.json
Load: import thresholds from '@/config/ia-thresholds.json'
Use: if (value > thresholds.satisfaction.alert)
```

---

## ⚡ Quick Test After Changes

```bash
# 1. Modify algorithm in ia-insights/route.ts
# 2. Save file
# 3. Restart server
npm run dev

# 4. Test with real data
# Set FORCE_MOCK_DATA = false (line 92)

# 5. Open dashboard
http://localhost:3000/clientes/techcorp/dashboard-ia

# 6. Check console for new calculations
# 7. Verify insights reflect your changes
```

---

## 🎯 Most Common Customizations

### 1. Make Alerts More/Less Sensitive
```typescript
// More sensitive (alert sooner)
negativoPct > 25 ? 'alert' : 'metric'

// Less sensitive (alert later)
negativoPct > 40 ? 'alert' : 'metric'
```

### 2. Change Insight Priority
```typescript
// Boost conversion importance
const relevancia = 98  // Instead of 95

// Reduce cost importance  
const relevancia = 70  // Instead of 85
```

### 3. Add Custom Categories
```typescript
categoria: 'Quality Assurance'  // Custom category
categoria: 'Team Performance'   // Custom category
categoria: 'Customer Success'   // Custom category
```

---

## ✅ Summary

**Current Algorithm:**
- 📍 Location: `app/api/kpis/ia-insights/route.ts`
- 🧮 Type: Rule-based scoring with SQL aggregations
- ⚡ Speed: Fast (< 500ms)
- 🔧 Customization: Easy (change thresholds)
- 🚀 Status: Production ready

**To Modify:**
1. Open `app/api/kpis/ia-insights/route.ts`
2. Find the insight you want to change
3. Modify threshold values
4. Save and restart server
5. Test!

**To Upgrade:**
1. Start with statistical analysis (easy)
2. Add ML if needed (advanced)
3. Keep rule-based as fallback

**File to edit:** `app/api/kpis/ia-insights/route.ts`  
**Main section:** Lines 60-330  
**Difficulty:** Easy to Medium

---

**The algorithm is simple, fast, and easy to customize!** 🚀

