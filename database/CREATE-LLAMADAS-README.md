# Creating the llamadas_data Table

This guide explains how to create the `llamadas_data` table in your PostgreSQL database.

## 📋 Files Included

1. **`create-llamadas-table.sql`** - SQL script with table definition
2. **`LLAMADAS-TABLE-DOCUMENTATION.md`** - Complete documentation of all columns
3. **`../run-create-llamadas-table.js`** - Node.js script to execute the SQL
4. **`../create-llamadas-table.bat`** - Windows batch file for easy execution

---

## 🚀 Quick Start

### Option 1: Using npm scripts (Recommended)

```bash
# Create table in LOCAL database
npm run db:create-llamadas

# Create table in CLOUD database
npm run db:create-llamadas-cloud
```

### Option 2: Using Node.js directly

```bash
# Create in local database
node run-create-llamadas-table.js local

# Create in cloud database
node run-create-llamadas-table.js cloud
```

### Option 3: Using batch file (Windows)

```cmd
# Double-click the file or run:
create-llamadas-table.bat

# For cloud database:
create-llamadas-table.bat cloud
```

### Option 4: Manual SQL execution

Connect to your PostgreSQL database and run:

```bash
psql -U buffalo_user -d buffalo_dashboard -f database/create-llamadas-table.sql
```

---

## 📦 Requirements

1. **PostgreSQL database** - Running locally or accessible in the cloud
2. **Environment variables** - Set in `.env.local`:
   - `DATABASE_URL` - Local database connection string
   - `DATABASE_URL_CLOUD` - Cloud database connection string
3. **Node.js dependencies** - Run `npm install` if not already done

---

## 🔍 What the Script Does

The `run-create-llamadas-table.js` script will:

1. ✅ Connect to the specified database (local or cloud)
2. ✅ Check if the table already exists
3. ✅ Execute the SQL script to create the table
4. ✅ Create 4 indexes for performance:
   - `idx_llamadas_fecha_inicio` - on `fecha_inicio`
   - `idx_llamadas_agent_name` - on `agent_name`
   - `idx_llamadas_sentimiento` - on `sentimiento`
   - `idx_llamadas_entrevista` - on `entrevista`
5. ✅ Add SQL comments to document columns
6. ✅ Verify the table was created successfully
7. ✅ Display table structure and statistics

---

## 📊 Table Structure

The `llamadas_data` table includes **28 columns**:

### Key Columns:
- **id** (VARCHAR) - Primary key, unique call identifier
- **agent_name** (VARCHAR) - Agent or context name
- **duracion_ms** (INTEGER) - Call duration in seconds
- **fecha_inicio** / **fecha_final** (TIMESTAMP) - Call start/end times
- **sentimiento** (VARCHAR) - User sentiment (Positive, Negative, Neutral, Unknown)
- **coste_total** (DECIMAL) - Total cost in euros
- **entrevista** (VARCHAR) - Interview interest status
- **Situacion_laboral** (VARCHAR) - Employment status
- **nivel_estudios** (VARCHAR) - Education level
- And 19 more columns...

For complete details, see: **`LLAMADAS-TABLE-DOCUMENTATION.md`**

---

## 🛠️ Troubleshooting

### Error: Table already exists

The SQL uses `CREATE TABLE IF NOT EXISTS`, so it won't fail if the table exists. 

To recreate the table:
```sql
DROP TABLE llamadas_data;
-- Then run the create script again
```

### Error: Connection failed (Local)

```bash
# Check if PostgreSQL is running
docker ps

# Start PostgreSQL if not running
docker-compose up -d

# Test connection
npm run db:test
```

### Error: Connection failed (Cloud)

- Verify `DATABASE_URL_CLOUD` in `.env.local`
- Check network connectivity
- Verify firewall rules allow database access

### Error: Permission denied

Your database user needs `CREATE TABLE` privileges:

```sql
GRANT CREATE ON SCHEMA public TO buffalo_user;
```

---

## 📝 Next Steps

After creating the table:

1. **Insert data** - Load data from the `columnas` field of `crear_kpis` table
2. **Test queries** - Run sample queries to verify the table
3. **Create views** - Build views for common analytics queries
4. **Set up backups** - Configure regular backups for the table

### Example Query

```sql
-- Get call statistics by agent
SELECT 
  agent_name,
  COUNT(*) as total_calls,
  AVG(duracion_ms) as avg_duration_seconds,
  SUM(coste_total) as total_cost,
  COUNT(CASE WHEN sentimiento = 'Positive' THEN 1 END) as positive_calls,
  COUNT(CASE WHEN entrevista = 'Calificado > Quiere entrevista' THEN 1 END) as qualified_leads
FROM llamadas_data
WHERE fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY agent_name
ORDER BY total_calls DESC;
```

---

## 📖 Documentation

- **Full column documentation**: `LLAMADAS-TABLE-DOCUMENTATION.md`
- **SQL script**: `create-llamadas-table.sql`
- **Database setup guide**: `../DATABASE-SETUP.md`

---

## 🆘 Help

For help with the script:

```bash
node run-create-llamadas-table.js --help
```

---

**Generated**: 2025-10-10  
**Source**: Created from `crear_kpis` table, `columnas` field (record ID: 01dcd33b-bb67-4cba-a0f4-518752c83381)

