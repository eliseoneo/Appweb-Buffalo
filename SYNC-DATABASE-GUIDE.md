# 🔄 Cloud to Local Database Sync Guide

This guide explains how to sync data from your cloud PostgreSQL database to your local PostgreSQL database (one-way sync: cloud → local).

## 📋 Prerequisites

1. **Node.js installed** (v16 or higher)
2. **Local PostgreSQL running** (via Docker or native installation)
3. **Environment variables configured** in `.env.local`:
   ```env
   DATABASE_URL_CLOUD="postgresql://user:password@host:port/database"
   DATABASE_URL="postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard"
   ```

## 🚀 Quick Start

### Windows (PowerShell)

```powershell
.\sync-cloud-to-local.ps1
```

This will show you a menu with options:
1. **Basic Sync** - Fast and simple
2. **Advanced Sync** - Handles foreign keys and indexes properly
3. **Dry Run** - See what would be synced without making changes
4. **Structure Only** - Sync table structures without data

### Linux/Mac (Bash)

```bash
# Make script executable
chmod +x sync-cloud-to-local.js

# Run basic sync
node sync-cloud-to-local.js

# Or run advanced sync
node sync-cloud-to-local-advanced.js
```

## 📝 Sync Scripts

### 1. Basic Sync (`sync-cloud-to-local.js`)

**Use this when:**
- You want a quick sync
- Tables are simple (no complex foreign keys)
- You want to sync all tables

**Features:**
- ✅ Creates tables with proper structure
- ✅ Syncs all data
- ✅ Handles multiple schemas
- ✅ Shows progress for each table

**Usage:**
```bash
node sync-cloud-to-local.js
```

### 2. Advanced Sync (`sync-cloud-to-local-advanced.js`)

**Use this when:**
- You have complex table relationships
- You need fine-grained control
- You want to sync specific schemas/tables

**Features:**
- ✅ Handles foreign keys properly
- ✅ Preserves indexes
- ✅ Manages sequences correctly
- ✅ Batch inserts for large datasets
- ✅ Dry-run mode
- ✅ Selective sync (schema/table filtering)

**Usage:**
```bash
# Sync everything
node sync-cloud-to-local-advanced.js

# Sync specific schema
node sync-cloud-to-local-advanced.js --schema=public

# Sync specific table
node sync-cloud-to-local-advanced.js --table=usuarios

# Dry run (no changes)
node sync-cloud-to-local-advanced.js --dry-run

# Structure only (no data)
node sync-cloud-to-local-advanced.js --skip-data

# Combine options
node sync-cloud-to-local-advanced.js --schema=public --table=clientes --dry-run
```

## 🔧 Configuration

### Environment Variables

Create or update your `.env.local` file:

```env
# Cloud database (source)
DATABASE_URL_CLOUD="postgresql://user:password@cloud-host.com:5432/database_name"

# Local database (destination)
DATABASE_URL="postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard"
```

### Excluding Tables/Schemas

Edit the sync script to exclude specific tables or schemas:

```javascript
// In sync-cloud-to-local.js or sync-cloud-to-local-advanced.js

// Exclude these schemas
const EXCLUDE_SCHEMAS = ['information_schema', 'pg_catalog', 'pg_toast', 'pg_temp']

// Exclude these tables
const EXCLUDE_TABLES = ['temp_table', 'migration_history']
```

## 📊 What Gets Synced?

### ✅ Included:
- Table structures (columns, data types)
- Primary keys
- Data (all rows)
- NOT NULL constraints
- DEFAULT values
- Multiple schemas

### ⚠️ Limitations (Basic Sync):
- Foreign keys may need manual adjustment
- Indexes are not copied
- Triggers are not copied
- Views are not copied
- Functions are not copied

### ✅ Advanced Sync Also Handles:
- Foreign key relationships
- Indexes (partially)
- Sequences
- Custom data types

## 🔍 Troubleshooting

### Error: "DATABASE_URL_CLOUD not found"

**Solution:** Add `DATABASE_URL_CLOUD` to your `.env.local` file:
```env
DATABASE_URL_CLOUD="postgresql://user:pass@host:port/db"
```

### Error: "Connection timeout"

**Possible causes:**
1. Cloud database is not accessible
2. Firewall blocking connection
3. Wrong credentials

**Solutions:**
- Check your cloud database URL
- Verify credentials
- Check firewall settings
- Try increasing timeout in the script

### Error: "Permission denied"

**Solution:** Make sure your local database user has proper permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE buffalo_dashboard TO buffalo_user;
GRANT ALL ON SCHEMA public TO buffalo_user;
```

### Error: "Table already exists"

**Solution:** The script uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen. If it does:
```sql
-- Drop the table and try again
DROP TABLE IF EXISTS schema_name.table_name CASCADE;
```

### Large Tables Taking Too Long

**Solution:** Use the advanced sync with batch processing:
```bash
# Adjust batch size in sync-cloud-to-local-advanced.js
const batchSize = 100 // Increase or decrease as needed
```

## 📈 Performance Tips

1. **Run sync during off-peak hours** - Less impact on cloud database
2. **Use local network** - Faster if both databases are local
3. **Exclude unnecessary tables** - Only sync what you need
4. **Increase batch size** - For large tables (in advanced sync)
5. **Use --skip-data** - If you only need structure

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Keep it in `.gitignore`
2. **Use read-only credentials** - For cloud database if possible
3. **Secure your local database** - Use strong passwords
4. **Limit sync frequency** - Don't sync too often
5. **Monitor sync logs** - Check for errors

## 🔄 Automated Sync (Optional)

### Windows Task Scheduler

1. Open Task Scheduler
2. Create new task
3. Set trigger (e.g., daily at 2 AM)
4. Set action: `powershell.exe -File "C:\path\to\sync-cloud-to-local.ps1"`

### Linux/Mac Cron

```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * cd /path/to/project && node sync-cloud-to-local.js >> sync.log 2>&1
```

## 📞 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Review this guide
3. Check database logs
4. Verify environment variables
5. Test connection to both databases:
   ```bash
   node test-postgres-db.js
   ```

## 🎯 Common Use Cases

### Use Case 1: Fresh Local Setup
```bash
# First time setup
node sync-cloud-to-local-advanced.js
```

### Use Case 2: Daily Sync
```bash
# Quick daily update
node sync-cloud-to-local.js
```

### Use Case 3: Sync Specific Data
```bash
# Only sync usuarios table
node sync-cloud-to-local-advanced.js --schema=public --table=usuarios
```

### Use Case 4: Test Before Sync
```bash
# Check what will be synced
node sync-cloud-to-local-advanced.js --dry-run
```

### Use Case 5: Structure Update Only
```bash
# Update structure without data
node sync-cloud-to-local-advanced.js --skip-data
```

---

## 📝 Notes

- The sync is **one-way only** (cloud → local)
- Local changes will be **overwritten**
- Always backup before syncing
- Test with `--dry-run` first
- Monitor the sync logs

**Happy Syncing! 🚀**

