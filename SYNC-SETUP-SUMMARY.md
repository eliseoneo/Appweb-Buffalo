# 📦 Cloud to Local Database Sync - Setup Complete

## ✅ Created Files

### Core Sync Scripts
1. **`sync-cloud-to-local.js`** - Basic sync script (fast, simple)
2. **`sync-cloud-to-local-advanced.js`** - Advanced sync with foreign keys, indexes
3. **`test-sync-setup.js`** - Test script to verify configuration

### Platform-Specific Launchers
4. **`sync-cloud-to-local.bat`** - Windows batch file (double-click to run)
5. **`sync-cloud-to-local.ps1`** - PowerShell script with interactive menu

### Documentation
6. **`SYNC-DATABASE-GUIDE.md`** - Complete guide with all details
7. **`QUICK-SYNC.md`** - Quick start guide
8. **`SYNC-SETUP-SUMMARY.md`** - This file

### Updated Files
9. **`package.json`** - Added npm scripts for easy access
10. **`README.md`** - Added database sync section

---

## 🚀 Quick Start

### 1. Configure Environment

Add to `.env.local`:
```env
DATABASE_URL_CLOUD="postgresql://user:password@host:5432/database"
DATABASE_URL="postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard"
```

### 2. Test Setup

```bash
npm run db:test-setup
```

### 3. Run Sync

**Windows (easiest):**
- Double-click `sync-cloud-to-local.bat`

**Command line:**
```bash
npm run db:sync
```

---

## 📋 Available Commands

### NPM Scripts (Recommended)

| Command | Description |
|---------|-------------|
| `npm run db:test-setup` | ✅ Verify configuration before sync |
| `npm run db:sync` | 🔄 Basic sync (recommended first time) |
| `npm run db:sync-advanced` | ⚙️ Advanced sync (foreign keys, indexes) |
| `npm run db:sync-dry-run` | 👀 Preview changes without applying |
| `npm run db:sync-structure` | 📐 Sync structure only (no data) |

### Direct Node.js

```bash
# Basic sync
node sync-cloud-to-local.js

# Advanced sync
node sync-cloud-to-local-advanced.js

# Advanced with options
node sync-cloud-to-local-advanced.js --schema=public
node sync-cloud-to-local-advanced.js --table=usuarios
node sync-cloud-to-local-advanced.js --dry-run
node sync-cloud-to-local-advanced.js --skip-data
```

### Windows Launchers

```powershell
# Batch file (double-click or run)
.\sync-cloud-to-local.bat

# PowerShell with menu
.\sync-cloud-to-local.ps1
```

---

## 🎯 Features

### Basic Sync Script
- ✅ Creates all tables from cloud database
- ✅ Copies all data
- ✅ Handles multiple schemas
- ✅ Progress reporting
- ✅ Error handling
- ⚠️ May need manual foreign key setup

### Advanced Sync Script
- ✅ All features from basic sync
- ✅ Handles foreign keys properly
- ✅ Preserves indexes
- ✅ Manages sequences
- ✅ Batch processing for large tables
- ✅ Dry run mode
- ✅ Selective sync (schema/table)
- ✅ Structure-only mode

### Test Setup Script
- ✅ Verifies environment variables
- ✅ Tests cloud database connection
- ✅ Tests local database connection
- ✅ Checks write permissions
- ✅ Validates required packages
- ✅ Provides troubleshooting tips

---

## 📊 What Gets Synced

### ✅ Included
- Table structures (columns, types, constraints)
- Primary keys
- NOT NULL constraints
- DEFAULT values
- All data (rows)
- Multiple schemas

### ⚙️ Advanced Sync Also Handles
- Foreign key relationships
- Indexes
- Sequences
- Custom data types

### ⚠️ Not Synced
- Views
- Functions/Procedures
- Triggers
- Materialized views
- User permissions

---

## 🔧 Configuration Options

### Exclude Schemas

Edit in sync scripts:
```javascript
const EXCLUDE_SCHEMAS = ['information_schema', 'pg_catalog', 'pg_toast', 'pg_temp']
```

### Exclude Tables

Edit in sync scripts:
```javascript
const EXCLUDE_TABLES = ['temp_table', 'migration_history']
```

### Batch Size (Advanced Sync)

For large tables, adjust batch size:
```javascript
const batchSize = 100 // Increase or decrease as needed
```

### Connection Timeouts

Adjust in scripts if needed:
```javascript
connectionTimeoutMillis: 15000,
query_timeout: 60000
```

---

## 🔍 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "DATABASE_URL_CLOUD not found" | Add to `.env.local` |
| "Connection timeout" | Check cloud DB URL and firewall |
| "Local database not running" | Run `docker-compose up -d` |
| "Permission denied" | Grant permissions to buffalo_user |
| "Table already exists" | Normal, script handles this |

### Testing Connections

```bash
# Test cloud database
node test-postgres-db.js

# Test both databases
npm run db:test-setup
```

### Logs and Debugging

All scripts provide detailed output:
- ✅ Success messages in green
- ❌ Errors in red
- ℹ️ Info messages
- 📊 Progress indicators
- 🎉 Summary at the end

---

## 📁 File Structure

```
Buffalo-IA-Clean/
├── sync-cloud-to-local.js          # Basic sync script
├── sync-cloud-to-local-advanced.js # Advanced sync script
├── test-sync-setup.js              # Configuration test
├── sync-cloud-to-local.bat         # Windows batch launcher
├── sync-cloud-to-local.ps1         # PowerShell launcher
├── SYNC-DATABASE-GUIDE.md          # Complete guide
├── QUICK-SYNC.md                   # Quick reference
├── SYNC-SETUP-SUMMARY.md           # This file
└── .env.local                      # Your configuration
```

---

## 🎓 Best Practices

1. **Always test first**: Run `npm run db:test-setup`
2. **Use dry run**: Preview with `npm run db:sync-dry-run`
3. **Backup local data**: Before syncing (if you have local changes)
4. **Start with basic**: Use basic sync first time
5. **Monitor output**: Check for errors during sync
6. **Verify results**: Query tables after sync
7. **Schedule wisely**: Don't sync during peak hours

---

## 🔒 Security Notes

- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use read-only cloud credentials if possible
- ✅ Don't share database credentials
- ✅ Secure your local database
- ✅ Review sync logs regularly

---

## 📚 Documentation

- **Quick Start**: [QUICK-SYNC.md](QUICK-SYNC.md)
- **Full Guide**: [SYNC-DATABASE-GUIDE.md](SYNC-DATABASE-GUIDE.md)
- **Database Setup**: [DATABASE-SETUP.md](DATABASE-SETUP.md)
- **Database Scripts**: [database/README.md](database/README.md)

---

## 💡 Tips

### For Development
```bash
# Quick daily sync
npm run db:sync

# After schema changes in cloud
npm run db:sync-structure
```

### For Testing
```bash
# Preview changes
npm run db:sync-dry-run

# Test with one table
node sync-cloud-to-local-advanced.js --table=usuarios --dry-run
```

### For Production Setup
```bash
# Full sync with foreign keys
npm run db:sync-advanced
```

---

## ✨ Next Steps

1. ✅ Configure `.env.local` with DATABASE_URL_CLOUD
2. ✅ Run `npm run db:test-setup` to verify
3. ✅ Run `npm run db:sync-dry-run` to preview
4. ✅ Run `npm run db:sync` to sync
5. ✅ Verify data in local database
6. ✅ Start your application with `npm run dev`

---

## 🆘 Need Help?

If you encounter issues:
1. Check [SYNC-DATABASE-GUIDE.md](SYNC-DATABASE-GUIDE.md)
2. Run `npm run db:test-setup` for diagnostics
3. Review error messages carefully
4. Check database logs
5. Verify network connectivity

---

**Setup complete! Ready to sync! 🎉**

