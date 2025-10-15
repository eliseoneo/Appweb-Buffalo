# Dashboard Base - Call Analytics

Modern, elegant, and professional dashboard for visualizing call analytics data from n8n-normalized agent calls.

---

## 📊 Overview

This dashboard provides a comprehensive view of the 8 most critical KPIs (Key Performance Indicators) from a total of 20 available metrics. It's designed for executive-level insights and operational monitoring.

### Featured KPIs

1. **Total de Llamadas** (KPI #1) - Total call volume with trends
2. **Tasa de Respuesta** (KPI #14) - Call answer rate percentage
3. **Costo Total** (KPI #3) - Total spending on calls
4. **Evolución de Llamadas** (KPI #4) - Daily call trend over 30 days
5. **Sentimiento del Usuario** (KPI #7) - Emotional distribution
6. **Motivos de Desconexión** (KPI #6) - Why calls ended
7. **Rendimiento por Agente** (KPI #8) - Agent/model performance
8. **Costo por Conversión** (KPI #16) - Campaign efficiency

---

## 🎨 Design Features

### Modern UI/UX
- ✅ Clean, professional corporate design
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Gradient backgrounds
- ✅ Smooth animations and transitions
- ✅ Interactive charts with tooltips
- ✅ Color-coded visualizations

### Color Palette
- **Primary Blue:** `#3b82f6` - Calls, main data
- **Success Green:** `#10b981` - Conversions, positive metrics
- **Purple:** `#8b5cf6` - Costs, financial data
- **Orange:** `#f59e0b` - Warnings, attention items
- **Red:** `#ef4444` - Negative sentiment, critical items
- **Gray:** `#6b7280` - Neutral, background

---

## 📁 Structure

```
app/n8n-dashboard/
├── page.tsx                     # Main dashboard page
├── components/
│   ├── StatCard.tsx            # KPI statistic cards
│   ├── CallEvolutionChart.tsx  # Line chart for trends
│   ├── DonutChart.tsx          # Pie/donut charts
│   └── BarChartComponent.tsx   # Horizontal/vertical bars
├── data/
│   └── synthetic-data.ts       # Sample data for demo
└── README.md                   # This file
```

---

## 🚀 Usage

### View the Dashboard

```bash
# Development mode
npm run dev

# Navigate to:
http://localhost:3000/n8n-dashboard
```

### With Real Data

Replace synthetic data with actual normalized data from n8n:

```typescript
// In page.tsx, import your API or data source
import { fetchNormalizedData } from '@/lib/api';

// Use useEffect to load real data
useEffect(() => {
  fetchNormalizedData().then(data => {
    setDashboardData(data);
  });
}, []);
```

---

## 📊 Component Breakdown

### 1. StatCard Component

**Purpose:** Display single KPI values with trends

**Props:**
- `title` - KPI name
- `value` - Main value (number or string)
- `subtitle` - Additional context
- `trend` - up/down/neutral
- `trendValue` - Trend description
- `icon` - SVG icon
- `color` - Theme color

**Example:**
```tsx
<StatCard
  title="Total de Llamadas"
  value={2847}
  subtitle="892 llamadas este mes"
  trend="up"
  trendValue="+16.6% vs mes anterior"
  color="blue"
/>
```

### 2. CallEvolutionChart Component

**Purpose:** Show time-series data for calls and conversions

**Props:**
- `data` - Array of { date, calls, conversions }

**Features:**
- Dual-line chart
- 30-day view
- Interactive tooltips
- Responsive sizing

### 3. DonutChart Component

**Purpose:** Display categorical distribution (sentiment, reasons)

**Props:**
- `title` - Chart title
- `subtitle` - Description
- `data` - Array of { name, value, percentage, color }

**Features:**
- Inner radius (donut style)
- Custom legend with percentages
- Color-coded segments

### 4. BarChartComponent

**Purpose:** Compare values across categories

**Props:**
- `title` - Chart title
- `subtitle` - Description
- `data` - Array of data objects
- `dataKeys` - Keys to display with names and colors
- `layout` - horizontal or vertical

**Features:**
- Flexible layout
- Multiple data series support
- Rounded corners

---

## 🎯 Data Integration

### Synthetic Data (Current)

Located in `data/synthetic-data.ts`:
- 2,847 total calls
- 30 days of evolution data
- 3 agents/models
- 4 campaigns
- Realistic distributions

### Real Data Integration

**Step 1: Create API Endpoint**
```typescript
// app/api/dashboard-data/route.ts
export async function GET() {
  const data = await fetchFromDatabase();
  return Response.json(data);
}
```

**Step 2: Update Dashboard Page**
```typescript
"use client";
import { useEffect, useState } from 'react';

export default function DashboardBase() {
  const [data, setData] = useState(syntheticData);
  
  useEffect(() => {
    fetch('/api/dashboard-data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  // ... rest of component
}
```

**Step 3: Connect to n8n**
```typescript
// Fetch from n8n workflow
const response = await fetch('https://your-n8n-instance.com/webhook/dashboard-data');
const normalizedData = await response.json();
```

---

## 📈 Available Charts

### 1. Line Chart
- **Use:** Time series, trends
- **Best for:** Call evolution, cost over time
- **Data:** Sequential time-based data

### 2. Donut Chart
- **Use:** Proportions, distributions
- **Best for:** Sentiment, disconnect reasons
- **Data:** Categorical percentages

### 3. Bar Chart (Horizontal)
- **Use:** Comparisons
- **Best for:** Agent performance, campaigns
- **Data:** Discrete categories

### 4. Bar Chart (Vertical)
- **Use:** Rankings, values
- **Best for:** Cost per conversion, ROI
- **Data:** Numeric comparisons

---

## 🎨 Customization

### Change Colors

Edit in components:
```typescript
const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  // Add your colors
  custom: 'bg-custom-50 text-custom-600'
};
```

### Add New KPIs

1. Add data to `synthetic-data.ts`
2. Import in `page.tsx`
3. Add StatCard or chart component
4. Style as needed

### Modify Layout

```tsx
{/* Change grid columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Your components */}
</div>
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 768px (1 column)
- **Tablet:** 768px - 1024px (2 columns)
- **Desktop:** > 1024px (3 columns)

### Mobile Optimizations
- Stacked layouts
- Reduced chart heights
- Simplified legends
- Touch-friendly interactions

---

## 🔧 Dependencies

```json
{
  "recharts": "^2.x.x",    // Chart library
  "react": "^18.x.x",       // React framework
  "next": "^14.x.x"         // Next.js
}
```

Install if missing:
```bash
npm install recharts
```

---

## 🌟 Features Highlight

### Real-time Indicator
- Green pulsing dot showing "En vivo" (Live)
- Updates automatically with new data

### Time Period Selector
- Dropdown to filter data by period
- Options: Today, 7 days, 30 days, month, all time

### Interactive Elements
- Hover effects on cards
- Clickable chart elements
- Tooltips with detailed info
- Animated transitions

### Performance
- Lazy loading charts
- Optimized re-renders
- Efficient data updates

---

## 🎓 Best Practices

### 1. Data Updates
```typescript
// Refresh every 5 minutes
useEffect(() => {
  const interval = setInterval(fetchData, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

### 2. Error Handling
```typescript
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Failed to load dashboard data:', error);
  // Show error state
}
```

### 3. Loading States
```typescript
{loading ? (
  <div>Loading dashboard...</div>
) : (
  <DashboardContent data={data} />
)}
```

---

## 🚀 Next Steps

1. **Connect to Real Data** - Replace synthetic data with n8n output
2. **Add More KPIs** - Implement remaining 12 KPIs
3. **Add Filters** - Date range, agent, campaign filters
4. **Export Reports** - PDF/Excel export functionality
5. **Drill-down Views** - Click charts to see detailed data
6. **Alerts** - Set thresholds and notifications
7. **Comparison Mode** - Compare periods side-by-side

---

## 📸 Screenshots

### Desktop View
![Desktop Dashboard](./screenshots/desktop-view.png)

### Mobile View
![Mobile Dashboard](./screenshots/mobile-view.png)

### Chart Details
![Interactive Charts](./screenshots/chart-details.png)

---

## 💡 Tips

1. **Performance** - Use React.memo() for chart components
2. **Data Caching** - Implement SWR or React Query
3. **Accessibility** - Add ARIA labels to charts
4. **Testing** - Test with different data volumes
5. **Documentation** - Keep KPI definitions updated

---

## 🆘 Troubleshooting

### Charts Not Rendering
- Check if recharts is installed: `npm install recharts`
- Verify data format matches component props
- Check console for errors

### Styling Issues
- Ensure Tailwind CSS is configured
- Check for conflicting CSS
- Verify responsive classes

### Data Not Loading
- Check API endpoints
- Verify data normalization
- Test with synthetic data first

---

## 📚 Resources

- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [KPI Definitions](../../documentation/KPI-DEFINITIONS.md)
- [Data Normalization Guide](../../documentation/NORMALIZATION-GUIDE.md)

---

**Built with:** React, Next.js, TypeScript, Recharts, Tailwind CSS  
**Version:** 1.0  
**Last Updated:** October 2025

