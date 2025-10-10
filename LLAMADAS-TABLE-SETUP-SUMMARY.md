# 📞 Llamadas Table Setup - Complete Summary

## ✅ Files Created

### 1. SQL Script
- **`database/create-llamadas-table.sql`**
  - Complete CREATE TABLE statement
  - 28 columns extracted from `columnas` field
  - 4 performance indexes
  - SQL comments for all columns
  - Primary key on `id` field

### 2. JavaScript Runner
- **`run-create-llamadas-table.js`**
  - Executes the SQL script
  - Supports local and cloud databases
  - Validates table creation
  - Shows detailed progress and errors
  - Verifies indexes and structure

### 3. Windows Batch File
- **`create-llamadas-table.bat`**
  - Easy double-click execution
  - Windows-friendly interface
  - Supports local/cloud parameters

### 4. Documentation
- **`database/LLAMADAS-TABLE-DOCUMENTATION.md`**
  - Complete column reference (all 28 columns)
  - Data types and descriptions
  - Possible values for categorical fields
  - Usage examples and queries
  - Index documentation

- **`database/CREATE-LLAMADAS-README.md`**
  - Step-by-step usage guide
  - Multiple execution methods
  - Troubleshooting tips
  - Next steps and examples

### 5. NPM Scripts (Updated)
- **`package.json`** - Added two new scripts:
  - `npm run db:create-llamadas` - Create in local DB
  - `npm run db:create-llamadas-cloud` - Create in cloud DB

---

## 🚀 How to Use

### Quick Start (Choose one method):

```bash
# Method 1: NPM (Recommended)
npm run db:create-llamadas

# Method 2: Node.js directly
node run-create-llamadas-table.js

# Method 3: Windows batch file
create-llamadas-table.bat

# Method 4: Manual SQL
psql -U buffalo_user -d buffalo_dashboard -f database/create-llamadas-table.sql
```

---

## 📊 Table Overview

**Table Name**: `llamadas_data`

**Total Columns**: 28

**Primary Key**: `id` (VARCHAR 255)

**Categories**:
- 🆔 Identifiers (2 columns)
- 👤 Agent Information (2 columns)
- ⏱️ Timing Metrics (3 columns)
- 📞 Call Status (2 columns)
- 💰 Costs (4 columns)
- 🔧 Technical Metrics (6 columns)
- 🎯 Lead Information (2 columns)
- 📊 Lead Qualification (6 columns)
- 📝 Additional Info (2 columns)

**Indexes Created**:
1. `idx_llamadas_fecha_inicio` - For date filtering
2. `idx_llamadas_agent_name` - For agent filtering
3. `idx_llamadas_sentimiento` - For sentiment analysis
4. `idx_llamadas_entrevista` - For conversion tracking

---

## 📋 Sample Data Structure

The table was designed based on this structure from `crear_kpis.columnas[0]`:

```json
{
  "nombre": "id",
  "tipo": "VARCHAR(255)",
  "descripcion": "Identificador único de la llamada..."
}
```

Example call ID: `CALL_1756982566330_9jpc9pg2v_kyn23tpqc_613062`

---

## 🎯 Key Columns for Analysis

### Most Important for KPIs:
1. **id** - Count total calls
2. **duracion_ms** - Average call duration
3. **coste_total** - Total costs
4. **fecha_inicio** - Time series analysis
5. **sentimiento** - Customer satisfaction
6. **agent_name** - Agent performance
7. **entrevista** - Conversion rate
8. **razon_desconexion** - Call quality metrics

### Demographic Profiling:
- **Situacion_laboral** - Employment status
- **Antigüedad_laboral** - Work experience
- **nivel_estudios** - Education level
- **turno_contacto** - Contact preferences

---

## 💡 Next Steps

### 1. Create the Table
```bash
npm run db:create-llamadas
```

### 2. Verify Creation
```sql
SELECT COUNT(*) FROM llamadas_data;
\d llamadas_data
```

### 3. Load Data
You'll need to parse the JSON strings from `crear_kpis.columnas` and insert them.

### 4. Test Queries
```sql
-- Get agent statistics
SELECT 
  agent_name,
  COUNT(*) as calls,
  AVG(duracion_ms) as avg_duration,
  SUM(coste_total) as total_cost
FROM llamadas_data
GROUP BY agent_name;
```

### 5. Create Views (Optional)
```sql
CREATE VIEW v_qualified_leads AS
SELECT *
FROM llamadas_data
WHERE entrevista = 'Calificado > Quiere entrevista'
  AND sentimiento IN ('Positive', 'Neutral');
```

---

## 📖 Documentation Reference

- **Column Details**: `database/LLAMADAS-TABLE-DOCUMENTATION.md`
- **Usage Guide**: `database/CREATE-LLAMADAS-README.md`
- **SQL Source**: `database/create-llamadas-table.sql`

---

## ⚠️ Important Notes

1. **Column Name Quirks**:
   - `"lead name"` - Has a space, needs quotes in SQL
   - `"latency:total"` - Has a colon, needs quotes in SQL
   - `"Situacion_laboral"` - Capital S, needs quotes
   - `"Antigüedad_laboral"` - Capital A and tilde, needs quotes

2. **Data Type Note**:
   - `duracion_ms` is named "ms" but the description says **seconds**

3. **NULL Values**:
   - Some fields use literal "NULL" string for missing data
   - Others use actual SQL NULL

4. **Standard Values**:
   - `"no se ha proporcionado esta info"` is a standard value for missing info

---

## 🛠️ Troubleshooting

### Table Already Exists?
The script uses `CREATE TABLE IF NOT EXISTS` - it won't fail.

To recreate:
```sql
DROP TABLE llamadas_data CASCADE;
-- Then run the script again
```

### Can't Connect?
```bash
# Local: Start PostgreSQL
docker-compose up -d

# Test connection
npm run db:test

# Check .env.local
# Verify DATABASE_URL is set
```

### Permission Issues?
```sql
GRANT CREATE ON SCHEMA public TO your_user;
GRANT ALL ON TABLE llamadas_data TO your_user;
```

---

## 📞 Support

For script help:
```bash
node run-create-llamadas-table.js --help
```

For SQL errors, check:
- PostgreSQL logs
- Database permissions
- Column name escaping (use quotes for special chars)

---

**Created**: 2025-10-10  
**Source**: `crear_kpis` table, field `columnas`, record ID: `01dcd33b-bb67-4cba-a0f4-518752c83381`  
**Total Files**: 5 files created, 1 file updated (package.json)

