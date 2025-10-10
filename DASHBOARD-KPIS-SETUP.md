# 📊 Dashboard KPIs - Complete Setup

## ✅ Files Created

### 1. Dashboard Page
- **`app/clientes/[clienteId]/dashboard-kpis/page.tsx`** (500+ lines)
  - Full-featured KPI dashboard
  - Dynamic chart rendering based on KPI definitions
  - Supports 5 chart types: individual, line, vertical bars, horizontal bars, donut
  - Real-time data updates
  - Mock data fallback for testing
  - Built with Recharts

### 2. API Routes

#### **`app/api/kpis/definitions/route.ts`**
- Fetches KPI definitions from `crear_kpis` table
- Parses JSON strings from `kpis` field
- Returns array of KPI definitions with:
  - titulo
  - descripcion
  - tipo_grafico
  - num_inputs
  - inputs
  - ejemplo

#### **`app/api/kpis/data/route.ts`** (250+ lines)
- Fetches actual data from `llamadas_data` table
- Calculates KPIs based on definitions:
  - Total calls count
  - Average call duration
  - Total cost
  - Daily call evolution
  - Disconnect reasons distribution
  - User sentiment distribution
  - Agent performance
  - Interview status
  - Employment status
  - Work experience
  - Education level
  - Contact time preferences
- Handles missing table gracefully
- Returns formatted data ready for charts

### 3. Configuration Updates

#### **`types/cliente.ts`**
- Added `dashboard-kpis` module definition:
```typescript
'dashboard-kpis': {
  id: 'dashboard-kpis',
  nombre: 'Dashboard KPIs',
  icono: 'BarChart3',
  descripcion: 'Dashboard de KPIs basado en datos de llamadas',
  ruta: '/dashboard-kpis'
}
```

#### **`config/clientes.json`**
- Added `dashboard-kpis` to all clients
- Placed in "Agentes de Llamadas" navigation group
- Appears after main dashboard, before prueba

---

## 🎯 Features

### 📈 Chart Types Supported

1. **Individual** - Single metric cards with icons
   - Total calls
   - Average duration
   - Total cost
   
2. **Line Charts** - Time series data
   - Daily call evolution
   - Average duration over time

3. **Vertical Bar Charts** - Category comparisons
   - Disconnect reasons
   - Education levels

4. **Horizontal Bar Charts** - Rankings
   - Agent performance
   - Work experience distribution

5. **Donut Charts** - Proportions
   - User sentiment
   - Interview status
   - Employment status
   - Contact preferences

### 🔄 Dynamic Features

- ✅ Auto-loads KPI definitions from database
- ✅ Calculates real KPIs from `llamadas_data` table
- ✅ Refresh button for manual updates
- ✅ Loading states with spinners
- ✅ Error handling with fallback to mock data
- ✅ Responsive grid layout
- ✅ Consistent styling with client theme
- ✅ Tooltips on charts
- ✅ Color-coded metrics

---

## 📊 Data Flow

```
Database: crear_kpis (kpis field)
         ↓
API: /api/kpis/definitions
         ↓
Dashboard: Loads KPI definitions
         ↓
Database: llamadas_data table
         ↓
API: /api/kpis/data
         ↓
Dashboard: Calculates and displays KPIs
         ↓
Charts rendered with Recharts
```

---

## 🚀 How to Use

### Step 1: Access the Dashboard

Navigate to any client and click "Dashboard KPIs" in the sidebar:

```
https://your-domain.com/clientes/techcorp/dashboard-kpis
```

### Step 2: The Dashboard Will Automatically:

1. Load KPI definitions from `crear_kpis.kpis`
2. Fetch data from `llamadas_data` table
3. Calculate metrics
4. Render charts

### Step 3: Refresh Data

Click the "Actualizar" button to refresh all metrics.

---

## 📋 All 13 KPIs Included (from crear_kpis)

Based on the first record in `crear_kpis` table - **ALL 13 KPIs are now implemented**:

### Individual Metrics (3 KPIs - Cards with Icons):
1. ✅ **Número total de llamadas** - Total call count
2. ✅ **Duración media de las llamadas** - Average call duration (MM:SS format)
3. ✅ **Costo total de las llamadas** - Total cost in euros (€ formatted)

### Line Charts (2 KPIs - Time Series):
4. ✅ **Evolución del número de llamadas por día** - Daily call volume evolution
5. ✅ **Evolución de la duración media de las llamadas por día** - Daily duration average trend

### Vertical Bar Charts (1 KPI - Categories):
6. ✅ **Distribución de motivos de desconexión** - Disconnect reasons distribution
   - Categories: usuario cuelga, agente cuelga, no hay respuesta, ocupado, tiempo maximo

### Donut Charts (4 KPIs - Proportions):
7. ✅ **Sentimiento del usuario en las llamadas** - User sentiment distribution
   - Categories: Positive, Negative, Neutral, Unknown
8. ✅ **Estado de interés en entrevista** - Interview interest status
   - Categories: Calificado > Quiere entrevista, Sin interes, No se puede contactar, no se ha proporcionado esta info
9. ✅ **Situación laboral de los usuarios contactados** - Employment status
   - Categories: Sí, No, NULL, no se ha proporcionado esta info
10. ✅ **Preferencia de turno de contacto** - Contact time preferences
    - Categories: Tarde, Mañana, Mediodía, NULL

### Horizontal Bar Charts (3 KPIs - Rankings):
11. ✅ **Distribución de agentes por número de llamadas** - Agent performance ranking
    - Agents: DEMO V2 PLANETA, Si llaman a EAE, Llamar mas tarde al lead
12. ✅ **Antigüedad laboral de los usuarios contactados** - Work experience distribution
    - Categories: <1 año, 1 año – 3 años, 3 años – 10 años, >10 años, no se ha proporcionado esta info
13. ✅ **Nivel de estudios de los usuarios contactados** - Education level distribution
    - Categories: Estudios superiores, Bachillerato, Estudios secundarios, Sin estudios oficiales, no se ha proporcionado esta info

---

### 🎨 Chart Type Summary:
- **3** Individual metric cards (big numbers with icons)
- **2** Line charts (trends over time)
- **1** Vertical bar chart (category comparison)
- **4** Donut charts (proportions/percentages)
- **3** Horizontal bar charts (rankings)

---

## 🛠️ Requirements

### Database Tables Required:

1. **`crear_kpis`** - Must exist with `kpis` field (TEXT ARRAY)
   - Contains JSON strings with KPI definitions
   
2. **`llamadas_data`** - Optional, but required for real data
   - If missing, dashboard shows mock data
   - Create using: `npm run db:create-llamadas`

### Environment:

- PostgreSQL database running
- `.env.local` configured with `DATABASE_URL`
- Next.js app running

---

## 🎨 UI Components

### Metric Cards:
```tsx
- Icon (Phone, Clock, DollarSign, etc.)
- Title
- Value (formatted)
- Unit (optional)
- Description (tooltip)
- Color-coded background
```

### Charts:
```tsx
- Title
- Description
- Recharts component (Line, Bar, Pie)
- Custom tooltips
- Legends
- Responsive sizing (300px height)
- Color palette (blue, green, orange, red, purple)
```

### Layout:
- 3-column grid for metric cards (responsive)
- 2-column grid for charts (responsive)
- Clean white cards with shadows
- Consistent spacing and typography

---

## 🔧 Customization

### Adding New KPIs:

1. **Add to Database**:
   ```sql
   -- Add JSON string to kpis array in crear_kpis
   UPDATE crear_kpis 
   SET kpis = array_append(kpis, 
     '{"titulo":"My KPI","descripcion":"...","tipo_grafico":"individual","num_inputs":1,"inputs":["column_name"],"ejemplo":"..."}'
   )
   WHERE id = 'your-record-id';
   ```

2. **Add Calculation Logic** (if needed):
   Edit `app/api/kpis/data/route.ts` and add case in `calculateKPI()`:
   ```typescript
   case 'My KPI':
     // Your SQL query here
     return { valor: result }
   ```

3. **Refresh Dashboard** - New KPI appears automatically!

### Changing Chart Colors:

Edit the `COLORS` arrays in `page.tsx`:
```typescript
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
```

### Changing Chart Height:

Find `ResponsiveContainer` and adjust:
```typescript
<ResponsiveContainer width="100%" height={300}> {/* Change this */}
```

---

## 🧪 Testing

### Test with Mock Data:

1. The dashboard automatically shows mock data if:
   - `llamadas_data` table doesn't exist
   - API endpoints fail
   - Database connection issues

2. Mock data includes all KPI types for visual testing

### Test with Real Data:

1. Create `llamadas_data` table:
   ```bash
   npm run db:create-llamadas
   ```

2. Insert sample data into `llamadas_data`

3. Refresh the dashboard to see real metrics

---

## 📝 Example Queries

### Get all KPI definitions:
```bash
GET /api/kpis/definitions
```

Response:
```json
[
  {
    "titulo": "Número total de llamadas",
    "descripcion": "Muestra el número total de llamadas...",
    "tipo_grafico": "individual",
    "num_inputs": 1,
    "inputs": ["id"],
    "ejemplo": "Un número grande..."
  }
]
```

### Get KPI data:
```bash
GET /api/kpis/data?clienteId=techcorp
```

Response:
```json
[
  {
    "titulo": "Número total de llamadas",
    "descripcion": "...",
    "tipo": "individual",
    "valor": "1,234"
  },
  {
    "titulo": "Sentimiento del usuario",
    "descripcion": "...",
    "tipo": "donut",
    "valor": 0,
    "data": [
      { "nombre": "Positive", "valor": 520 },
      { "nombre": "Negative", "valor": 180 }
    ]
  }
]
```

---

## 🚨 Troubleshooting

### Dashboard shows "Mostrando datos de ejemplo"

**Cause**: Database connection issue or `llamadas_data` table missing

**Solution**:
1. Check database connection in `.env.local`
2. Create table: `npm run db:create-llamadas`
3. Verify table exists: `psql -c "\dt llamadas_data"`

### Charts don't display

**Cause**: Missing Recharts dependency or data format issue

**Solution**:
1. Verify Recharts is installed (it should be)
2. Check browser console for errors
3. Verify data structure in API response

### KPIs show 0 or "No data"

**Cause**: `llamadas_data` table is empty

**Solution**:
1. Insert sample data into `llamadas_data`
2. Or use mock data for testing (works automatically)

### Navigation link doesn't appear

**Cause**: Module not added to client config

**Solution**:
1. Check `config/clientes.json`
2. Verify `dashboard-kpis` is in `modulos` array
3. Verify it's in a `grupos` array
4. Restart Next.js dev server

---

## 📖 Related Documentation

- **`database/LLAMADAS-TABLE-DOCUMENTATION.md`** - Complete column reference
- **`database/CREATE-LLAMADAS-README.md`** - How to create the table
- **`LLAMADAS-TABLE-SETUP-SUMMARY.md`** - Quick reference

---

## 🎉 Summary

You now have a **fully functional, database-driven KPI dashboard** that:

✅ Automatically loads KPI definitions from database  
✅ Calculates metrics from real call data  
✅ Renders 5 different chart types  
✅ Handles errors gracefully with mock data  
✅ Integrates seamlessly with existing navigation  
✅ Follows project styling and patterns  
✅ Is fully responsive and production-ready  

**Ready to use!** Navigate to any client → Dashboard KPIs

---

**Created**: 2025-10-10  
**Data Source**: `crear_kpis` table (kpis field) + `llamadas_data` table  
**Total Files**: 5 files created, 2 files updated  
**Total Lines**: ~1000+ lines of code

