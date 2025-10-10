# 🔧 Dashboard IA - Algorithm Customization Guide

## 🧮 Current Algorithm Type

### **Rule-Based Scoring Algorithm**

The Dashboard IA currently uses a **deterministic, rule-based algorithm** with:
- Statistical calculations (AVG, COUNT, percentages)
- Business rule thresholds
- Weighted relevance scoring

**NOT using:**
- ❌ Machine Learning models
- ❌ Neural networks
- ❌ External AI APIs
- ❌ Complex ML libraries

**Why this approach:**
- ✅ Fast execution (< 500ms)
- ✅ No ML infrastructure needed
- ✅ Fully explainable
- ✅ Easy to customize
- ✅ No training data required
- ✅ Works immediately

---

## 📍 Where the Algorithm Lives

### Main File:
**`app/api/kpis/ia-insights/route.ts`**

This file contains all the algorithm logic:
- Lines 20-340: Insight calculation functions
- Lines 60-340: Relevance scoring rules
- Lines 340+: Sorting and selection

---

## 🔧 How to Modify the Algorithm

### 1. **Change Relevance Thresholds**

#### Current Code (Lines 60-90):
```typescript
// Sentiment Analysis
const positivoPct = positivo ? parseFloat(positivo.porcentaje) : 0
const negativoPct = negativo ? parseFloat(negativo.porcentaje) : 0

// Calculate relevance based on sentiment distribution
const relevancia = positivoPct > 60 ? 95 : (negativoPct > 30 ? 98 : 85)
//                  ↑ Change these thresholds ↑
```

#### How to Change:
```typescript
// More strict (alerts only for severe issues)
const relevancia = positivoPct > 80 ? 95 : (negativoPct > 50 ? 98 : 85)

// More lenient (alerts for minor issues)
const relevancia = positivoPct > 50 ? 95 : (negativoPct > 20 ? 98 : 85)
```

---

### 2. **Change Alert Criteria**

#### Current Code (Lines 75-85):
```typescript
insights.push({
  titulo: 'Satisfacción del Cliente',
  valor: `${positivoPct.toFixed(1)}%`,
  descripcion: negativoPct > 30 
    ? '⚠️ Alto nivel de sentimiento negativo detectado'
    : positivoPct > 70 
      ? '✅ Excelente satisfacción del cliente'
      : 'Sentimiento mayormente positivo',
  tipo: negativoPct > 30 ? 'alert' : 'metric',
  //           ↑ Change this threshold
  color: positivoPct > 70 ? 'green' : (negativoPct > 30 ? 'red' : 'yellow')
})
```

#### Custom Alert Levels:
```typescript
// Three-tier system
tipo: negativoPct > 40 ? 'alert' :      // Critical (> 40%)
      negativoPct > 25 ? 'warning' :    // Warning (25-40%)
      'metric'                          // Normal (< 25%)

// Or use different metric
tipo: positivoPct < 50 ? 'alert' : 'metric'  // Alert if positive < 50%
```

---

### 3. **Add New Insight**

#### Example: Add "Calls per Agent" Insight

**Location:** `app/api/kpis/ia-insights/route.ts` (after line 250)

```typescript
// Calculate calls per agent average
const agentDistResult = await query(`
  SELECT 
    COUNT(DISTINCT agent_name) as num_agents,
    COUNT(*) as total_calls
  FROM llamadas_data
  WHERE agent_name IS NOT NULL
`)

if (agentDistResult.rows.length > 0) {
  const numAgents = parseInt(agentDistResult.rows[0].num_agents)
  const callsPerAgent = totalLlamadas / numAgents
  
  // Determine relevance based on distribution
  const relevancia = callsPerAgent > 500 ? 85 :  // One agent overloaded
                     callsPerAgent < 100 ? 80 :  // Underutilized
                     75                          // Balanced
  
  insights.push({
    id: 'calls-per-agent',
    titulo: 'Llamadas por Agente',
    valor: Math.round(callsPerAgent).toString(),
    descripcion: callsPerAgent > 500 
      ? '⚠️ Carga desbalanceada - redistribuir llamadas'
      : callsPerAgent < 100
        ? '💡 Agentes subutilizados - aumentar volumen'
        : '✅ Distribución balanceada entre agentes',
    tipo: callsPerAgent > 500 ? 'alert' : 
          callsPerAgent < 100 ? 'recommendation' : 
          'metric',
    relevancia,
    categoria: 'Eficiencia',
    icono: 'Users',
    color: callsPerAgent > 500 ? 'red' : 
           callsPerAgent < 100 ? 'purple' : 
           'green'
  })
}
```

---

### 4. **Add New Chart**

#### Example: Add "Hourly Distribution" Chart

```typescript
// Query hourly distribution
const hourlyResult = await query(`
  SELECT 
    EXTRACT(HOUR FROM fecha_inicio) as hora,
    COUNT(*) as llamadas
  FROM llamadas_data
  WHERE fecha_inicio IS NOT NULL
  GROUP BY EXTRACT(HOUR FROM fecha_inicio)
  ORDER BY hora
`)

if (hourlyResult.rows.length > 0) {
  const peakHour = hourlyResult.rows.reduce((max, row) => 
    parseInt(row.llamadas) > parseInt(max.llamadas) ? row : max
  )
  
  charts.push({
    id: 'hourly-distribution',
    titulo: 'Distribución por Hora del Día',
    descripcion: 'Patrón de llamadas a lo largo del día',
    tipo: 'bar',
    data: hourlyResult.rows.map(r => ({
      nombre: `${r.hora}:00`,
      valor: parseInt(r.llamadas)
    })),
    relevancia: 78,
    insight: `Hora pico: ${peakHour.hora}:00 con ${peakHour.llamadas} llamadas`
  })
}
```

---

### 5. **Modify Relevance Calculation**

#### Current System (Simple Weighted):
```typescript
const relevancia = base_score + impact_modifier
```

#### Enhanced System (Multiple Factors):
```typescript
function calculateRelevance(metric, data, context) {
  let score = 0
  
  // Factor 1: Business Impact (0-40 points)
  const businessImpact = {
    'conversion': 40,
    'satisfaction': 35,
    'cost': 35,
    'volume': 30,
    'duration': 25
  }
  score += businessImpact[metric] || 20
  
  // Factor 2: Data Quality (0-30 points)
  const completeness = (data.nonNull / data.total) * 100
  const qualityScore = completeness > 90 ? 30 :
                       completeness > 70 ? 20 :
                       completeness > 50 ? 10 : 5
  score += qualityScore
  
  // Factor 3: Actionability (0-30 points)
  const isActionable = metric.hasRecommendation || metric.showsTrend
  score += isActionable ? 30 : 15
  
  // Final score (0-100)
  return Math.min(100, score)
}
```

---

## 🚀 Upgrade to Advanced Algorithms

### Option 1: Statistical Anomaly Detection

Replace simple thresholds with statistical analysis:

```typescript
// Calculate Z-score for anomaly detection
function detectAnomaly(values) {
  const mean = values.reduce((a, b) => a + b) / values.length
  const variance = values.reduce((acc, val) => 
    acc + Math.pow(val - mean, 2), 0
  ) / values.length
  const stdDev = Math.sqrt(variance)
  
  return values.map(value => ({
    value,
    zScore: (value - mean) / stdDev,
    isAnomaly: Math.abs((value - mean) / stdDev) > 2
  }))
}

// Use in insights
const dailyCallCounts = [120, 115, 125, 118, 500, 122] // 500 is anomaly
const analysis = detectAnomaly(dailyCallCounts)

if (analysis.some(d => d.isAnomaly)) {
  insights.push({
    titulo: 'Anomalía Detectada',
    tipo: 'alert',
    relevancia: 95,
    descripcion: '⚠️ Pico inusual detectado'
  })
}
```

---

### Option 2: Time Series Forecasting

Add simple linear regression for trends:

```typescript
// Simple linear regression
function calculateTrend(data) {
  const n = data.length
  const sumX = data.reduce((sum, d, i) => sum + i, 0)
  const sumY = data.reduce((sum, d) => sum + d.value, 0)
  const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0)
  const sumX2 = data.reduce((sum, d, i) => sum + i * i, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  // Predict next value
  const prediction = slope * n + intercept
  
  return {
    slope,
    trend: slope > 0 ? 'growing' : 'declining',
    prediction,
    confidence: calculateR2(data, slope, intercept)
  }
}

// Use in charts
const trend = calculateTrend(last30DaysData)
charts.push({
  insight: `📈 Predicción para mañana: ${Math.round(trend.prediction)} llamadas`
})
```

---

### Option 3: Weighted Scoring with Decay

Make recent data more important:

```typescript
function calculateWeightedRelevance(metric, historicalData) {
  // Time decay: recent data is more important
  const weights = historicalData.map((_, index) => {
    const daysAgo = historicalData.length - index - 1
    return Math.exp(-daysAgo / 7) // Exponential decay, half-life 7 days
  })
  
  // Weighted average
  const weightedSum = historicalData.reduce((sum, data, i) => 
    sum + data.value * weights[i], 0
  )
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const weightedAvg = weightedSum / totalWeight
  
  // Use for relevance
  return calculateBaseRelevance(metric) + (weightedAvg > threshold ? 10 : 0)
}
```

---

### Option 4: Integration with External AI

Use OpenAI or similar for insights:

```typescript
// app/api/kpis/ia-insights/route.ts

async function generateAIInsight(data, metric) {
  const apiKey = process.env.OPENAI_API_KEY
  
  const prompt = `
    Analiza estos datos de llamadas:
    - Total: ${data.total}
    - Sentimiento positivo: ${data.positivePct}%
    - Conversión: ${data.conversionRate}%
    
    Genera un insight breve y accionable (máximo 100 caracteres).
  `
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50
    })
  })
  
  const result = await response.json()
  return result.choices[0].message.content
}

// Use in insights
const aiInsight = await generateAIInsight(calculatedData, 'satisfaction')
insights.push({
  descripcion: aiInsight // AI-generated description
})
```

---

### Option 5: Machine Learning Classification

Use TensorFlow.js for pattern classification:

```typescript
import * as tf from '@tensorflow/tfjs'

// Train simple classifier
async function trainSentimentPredictor(historicalData) {
  // Features: duration, disconnect_reason, agent
  const features = historicalData.map(call => [
    call.duration / 300,  // Normalized duration
    call.disconnect === 'user_hangup' ? 1 : 0,
    call.agent_id
  ])
  
  // Labels: sentiment (0=negative, 1=positive)
  const labels = historicalData.map(call => 
    call.sentiment === 'Positive' ? 1 : 0
  )
  
  // Create and train model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ units: 10, activation: 'relu', inputShape: [3] }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' })
    ]
  })
  
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' })
  await model.fit(tf.tensor2d(features), tf.tensor2d(labels), { epochs: 50 })
  
  return model
}

// Use for predictions
const prediction = model.predict(newCallFeatures)
```

---

## 📊 Current Algorithm Breakdown

### File Structure:
```
app/api/kpis/ia-insights/route.ts
│
├── GET() function
│   ├── Check if table exists (lines 20-40)
│   ├── Get total calls (lines 42-50)
│   │
│   ├── INSIGHT 1: Total Calls (lines 55-65)
│   │   └── Relevance: Always 100
│   │
│   ├── INSIGHT 2: Sentiment Analysis (lines 70-130)
│   │   ├── Query sentiment distribution
│   │   ├── Calculate positive/negative %
│   │   ├── Relevance: 85-98 based on thresholds
│   │   └── Type: 'alert' if negative > 30%
│   │
│   ├── INSIGHT 3: Conversion Rate (lines 135-175)
│   │   ├── Query conversion data
│   │   ├── Calculate conversion %
│   │   ├── Relevance: Always 95
│   │   └── Type: 'alert' if rate < 10%
│   │
│   ├── INSIGHT 4: Average Duration (lines 180-210)
│   │   ├── Calculate AVG(duracion_ms)
│   │   ├── Format as MM:SS
│   │   ├── Relevance: 80-95 based on duration
│   │   └── Type: 'alert' if < 60 seconds
│   │
│   ├── INSIGHT 5: Cost Analysis (lines 250-280)
│   │   └── Total and average cost
│   │
│   ├── INSIGHT 6: Best Contact Time (lines 285-310)
│   │   └── Type: Always 'recommendation'
│   │
│   ├── CHART 1: Call Trend (lines 215-245)
│   │   ├── Last 30 days volume
│   │   ├── Calculate growth %
│   │   └── Generate trend insight
│   │
│   ├── CHART 2-6: Other charts
│   │
│   ├── Sort by relevance (line 320)
│   │   └── insights.sort((a, b) => b.relevancia - a.relevancia)
│   │
│   └── Return top N (line 325)
│       └── insights.slice(0, 8), charts.slice(0, 6)
```

---

## 🔧 Customization Examples

### Example 1: Add "Repeat Calls" Insight

**Where:** After line 310 in `ia-insights/route.ts`

```typescript
// Detect repeat callers (same phone number)
const repeatResult = await query(`
  SELECT 
    COUNT(*) as total_calls,
    COUNT(DISTINCT phone_number) as unique_callers
  FROM llamadas_data
  WHERE phone_number IS NOT NULL
`)

if (repeatResult.rows.length > 0) {
  const total = parseInt(repeatResult.rows[0].total_calls)
  const unique = parseInt(repeatResult.rows[0].unique_callers)
  const repeatRate = ((total - unique) / total * 100)
  
  // High repeat rate = good customer retention
  const relevancia = repeatRate > 30 ? 88 : 75
  
  insights.push({
    id: 'repeat-rate',
    titulo: 'Tasa de Clientes Recurrentes',
    valor: `${repeatRate.toFixed(1)}%`,
    descripcion: repeatRate > 30 
      ? '✅ Alta fidelización de clientes'
      : '💡 Oportunidad de mejorar retención',
    tipo: repeatRate > 30 ? 'metric' : 'recommendation',
    relevancia,
    categoria: 'Retención',
    icono: 'Users',
    color: repeatRate > 30 ? 'green' : 'purple'
  })
}
```

---

### Example 2: Weighted Relevance Score

Replace simple scoring with multi-factor:

**Where:** Modify sentiment calculation (lines 70-130)

```typescript
// Multi-factor relevance calculation
function calculateSentimentRelevance(positivePct, negativePct, totalCalls) {
  let score = 85 // Base score
  
  // Factor 1: Sentiment distribution (0-15 points)
  if (negativePct > 40) score += 15      // Critical
  else if (negativePct > 30) score += 13 // High
  else if (positivePct > 70) score += 10 // Excellent
  
  // Factor 2: Sample size (0-5 points)
  if (totalCalls > 1000) score += 5
  else if (totalCalls > 500) score += 3
  else if (totalCalls > 100) score += 1
  
  // Factor 3: Business impact weight
  const businessWeight = 1.1 // Sentiment is critical
  score = Math.min(100, score * businessWeight)
  
  return Math.round(score)
}

// Use it
const relevancia = calculateSentimentRelevance(positivoPct, negativoPct, totalLlamadas)
```

---

### Example 3: Dynamic Thresholds

Use percentiles instead of fixed thresholds:

```typescript
// Calculate dynamic thresholds based on historical data
const historicalAvg = await query(`
  SELECT 
    AVG(daily_positive_pct) as avg_positive,
    STDDEV(daily_positive_pct) as std_positive
  FROM historical_sentiment_summary
`)

const avgPositive = parseFloat(historicalAvg.rows[0].avg_positive)
const stdPositive = parseFloat(historicalAvg.rows[0].std_positive)

// Dynamic threshold: 1 standard deviation below average
const alertThreshold = avgPositive - stdPositive

if (positivoPct < alertThreshold) {
  tipo = 'alert'
  descripcion = `⚠️ Satisfacción ${((avgPositive - positivoPct) / stdPositive).toFixed(1)} desviaciones estándar por debajo del promedio`
}
```

---

### Example 4: Trend Detection with Momentum

Add momentum calculation for better trend detection:

```typescript
// Calculate trend momentum
function calculateMomentum(timeSeries) {
  const recentSlope = (timeSeries[timeSeries.length - 1] - timeSeries[timeSeries.length - 7]) / 7
  const olderSlope = (timeSeries[14] - timeSeries[7]) / 7
  
  const acceleration = recentSlope - olderSlope
  
  if (acceleration > 5) {
    return {
      type: 'accelerating',
      insight: '🚀 Aceleración positiva - crecimiento acelerado'
    }
  } else if (acceleration < -5) {
    return {
      type: 'decelerating',
      insight: '⚠️ Desaceleración detectada'
    }
  } else if (recentSlope > 0) {
    return {
      type: 'growing',
      insight: '📈 Crecimiento constante'
    }
  } else {
    return {
      type: 'declining',
      insight: '📉 Tendencia a la baja'
    }
  }
}

// Use in trend chart
const momentum = calculateMomentum(last30DaysCalls)
charts.push({
  insight: momentum.insight
})
```

---

## 🧠 Upgrade to Machine Learning

### Option A: Use TensorFlow.js (Client-side ML)

**Install:**
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-node
```

**Implementation:**
```typescript
// app/api/kpis/ia-insights/ml-model.ts

import * as tf from '@tensorflow/tfjs-node'

export class CallInsightsML {
  private model: tf.LayersModel | null = null
  
  async trainModel(trainingData: any[]) {
    // Define model architecture
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'softmax' }) // 3 classes: good/warning/alert
      ]
    })
    
    this.model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    })
    
    // Convert data to tensors
    const features = tf.tensor2d(trainingData.map(d => d.features))
    const labels = tf.tensor2d(trainingData.map(d => d.label))
    
    // Train
    await this.model.fit(features, labels, {
      epochs: 100,
      validationSplit: 0.2
    })
  }
  
  async predictRelevance(callData: any) {
    if (!this.model) throw new Error('Model not trained')
    
    const features = tf.tensor2d([callData.features])
    const prediction = this.model.predict(features) as tf.Tensor
    const scores = await prediction.data()
    
    return {
      relevance: scores[0] * 100, // Convert to 0-100 scale
      class: scores.indexOf(Math.max(...scores))
    }
  }
}
```

---

### Option B: Use Pre-trained Models (Hugging Face)

**Install:**
```bash
npm install @huggingface/inference
```

**Implementation:**
```typescript
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

async function generateSmartInsight(data: any) {
  const prompt = `
    Analiza estos datos de llamadas y genera un insight de negocio:
    - Llamadas totales: ${data.total}
    - Sentimiento positivo: ${data.positivePct}%
    - Tasa de conversión: ${data.conversionRate}%
    
    Genera un insight en español, máximo 100 caracteres.
  `
  
  const result = await hf.textGeneration({
    model: 'gpt2',
    inputs: prompt,
    parameters: { max_new_tokens: 50 }
  })
  
  return result.generated_text
}
```

---

### Option C: Custom Scoring Model

Create a JSON-based scoring configuration:

**File:** `config/ia-scoring-rules.json`
```json
{
  "metrics": {
    "satisfaction": {
      "base_relevance": 85,
      "thresholds": {
        "critical": { "value": 30, "modifier": 13, "type": "alert" },
        "excellent": { "value": 70, "modifier": 10, "type": "metric" }
      },
      "weight": 1.2
    },
    "conversion": {
      "base_relevance": 95,
      "thresholds": {
        "poor": { "value": 10, "modifier": 3, "type": "alert" },
        "excellent": { "value": 25, "modifier": 0, "type": "metric" }
      },
      "weight": 1.3
    }
  }
}
```

**Load and use:**
```typescript
import scoringRules from '@/config/ia-scoring-rules.json'

function calculateRelevance(metric, value) {
  const rules = scoringRules.metrics[metric]
  let relevance = rules.base_relevance
  
  for (const [level, threshold] of Object.entries(rules.thresholds)) {
    if (shouldTrigger(value, threshold.value, threshold.comparison)) {
      relevance += threshold.modifier
    }
  }
  
  return Math.min(100, relevance * rules.weight)
}
```

---

## 🎯 Which Algorithm to Use?

### Current (Rule-Based) - DEFAULT ✅
**Use when:**
- Quick deployment needed
- No ML infrastructure
- Explainable decisions required
- Small to medium data sets
- Budget constraints

**Pros:** Fast, simple, explainable  
**Cons:** Fixed rules, no learning

---

### Statistical (Anomaly Detection)
**Use when:**
- Need to detect unusual patterns
- Have historical baseline data
- Want adaptive thresholds
- Medium to large datasets

**Pros:** Adaptive, objective  
**Cons:** Requires sufficient data

---

### ML-Based (TensorFlow/Hugging Face)
**Use when:**
- Large datasets (10K+ calls)
- Complex patterns to detect
- Budget for compute
- Need predictions
- Want continuous improvement

**Pros:** Learns patterns, predictive  
**Cons:** Complex setup, needs training

---

### Hybrid Approach (RECOMMENDED)
**Combine:**
- Rule-based for standard metrics (fast)
- Statistical for anomaly detection
- ML for predictions (optional)

**Example:**
```typescript
// Use rules for basic insights
const basicInsights = calculateRuleBasedInsights(data)

// Use stats for anomaly detection  
const anomalies = detectStatisticalAnomalies(data)

// Use ML for predictions (if available)
const predictions = ml_model ? await ml_model.predict(data) : null

// Combine all
return [...basicInsights, ...anomalies, ...predictions].sort(byRelevance)
```

---

## 🔄 How to Switch Algorithms

### Step 1: Keep Current (Rule-Based)

**No changes needed!** Current implementation works well.

To customize:
- Modify thresholds in `ia-insights/route.ts`
- Adjust relevance calculations
- Add new business rules

---

### Step 2: Add Statistical Anomaly Detection

**Install:**
```bash
npm install mathjs
```

**Add function:**
```typescript
import { mean, std } from 'mathjs'

function detectAnomalies(values: number[]) {
  const avg = mean(values)
  const stdDev = std(values)
  
  return values.map((val, index) => ({
    index,
    value: val,
    zScore: (val - avg) / stdDev,
    isAnomaly: Math.abs((val - avg) / stdDev) > 2
  })).filter(v => v.isAnomaly)
}
```

**Use it:**
```typescript
const dailyCalls = trendResult.rows.map(r => parseInt(r.llamadas))
const anomalies = detectAnomalies(dailyCalls)

if (anomalies.length > 0) {
  insights.push({
    titulo: 'Anomalía en Volumen',
    tipo: 'alert',
    relevancia: 92,
    descripcion: `⚠️ ${anomalies.length} días con volumen inusual detectados`
  })
}
```

---

### Step 3: Integrate External AI

**Add to `.env.local`:**
```
OPENAI_API_KEY=your_key_here
HUGGINGFACE_API_KEY=your_key_here
```

**Modify insights:**
```typescript
// Replace static descriptions with AI-generated
const aiDescription = await generateAIInsight(data, metric)

insights.push({
  descripcion: aiDescription // From GPT-4 or similar
})
```

---

## 📊 Algorithm Performance Comparison

| Algorithm | Speed | Accuracy | Cost | Setup | Learning |
|-----------|-------|----------|------|-------|----------|
| **Rule-Based** | ⚡⚡⚡ Fast | ⭐⭐⭐ Good | € Free | ✅ Easy | ❌ No |
| **Statistical** | ⚡⚡ Fast | ⭐⭐⭐⭐ Better | € Free | ✅ Easy | ❌ No |
| **ML (Local)** | ⚡ Medium | ⭐⭐⭐⭐⭐ Best | € Low | ⚠️ Medium | ✅ Yes |
| **ML (Cloud AI)** | ⚡⚡ Fast | ⭐⭐⭐⭐⭐ Best | €€ High | ✅ Easy | ✅ Yes |

---

## 🎯 Recommendation

### For Your Use Case:

**Start with:** Current rule-based algorithm ✅
- Already implemented
- Works immediately
- Easy to customize
- No additional costs

**Enhance with:** Statistical anomaly detection (Phase 2)
- Add mathjs library
- Implement Z-score analysis
- Detect unusual patterns
- Still fast and free

**Consider later:** ML integration (Phase 3)
- Only if you have 10K+ calls
- Budget for API costs
- Need predictions
- Want continuous learning

---

## 📝 Quick Modification Checklist

To modify the current algorithm:

1. **Change Thresholds:**
   - Edit `ia-insights/route.ts`
   - Find the metric you want to change
   - Modify the comparison values

2. **Add New Insight:**
   - Write SQL query for data
   - Calculate metric value
   - Determine relevance score
   - Push to insights array

3. **Change Number of Insights:**
   - Line ~330: `insights.slice(0, 8)`
   - Change 8 to desired number

4. **Modify Colors:**
   - Edit color assignment logic
   - Change from 'red'/'green'/etc.

5. **Test Changes:**
   - Restart server
   - Check console for errors
   - Verify insights display correctly

---

## 🎉 Summary

### Current Algorithm:
- ✅ **Type:** Rule-based with business logic
- ✅ **Location:** `app/api/kpis/ia-insights/route.ts`
- ✅ **Customization:** Easy (change thresholds, add insights)
- ✅ **Performance:** Fast (< 500ms)
- ✅ **Cost:** Free
- ✅ **Status:** Production ready

### Future Options:
- 📊 Statistical analysis (easy upgrade)
- 🧠 Machine Learning (advanced)
- 🌐 External AI APIs (GPT-4, etc.)
- 🔮 Predictive models

**Current algorithm is perfect for immediate use. Enhance later as needed!** 🚀

---

**File to Modify:** `app/api/kpis/ia-insights/route.ts`  
**Lines to Focus:** 60-330 (all insight calculations)  
**Difficulty:** Easy to Medium  
**Documentation:** This file + `DASHBOARD-IA-ALGORITHM.md`

