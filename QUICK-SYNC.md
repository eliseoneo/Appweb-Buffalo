# 🚀 Quick Sync Guide

**Sync cloud database to local in 3 easy steps!**

## Step 1: Configure `.env.local`

Add your cloud database URL:

```env
DATABASE_URL_CLOUD="postgresql://user:password@host:5432/database"
DATABASE_URL="postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard"
```

## Step 2: Test Setup

```bash
npm run db:test-setup
```

This will verify:
- ✅ Environment variables
- ✅ Cloud database connection
- ✅ Local database connection
- ✅ Required packages

## Step 3: Run Sync

Choose your method:

### Windows

**Double-click:** `sync-cloud-to-local.bat`

Or PowerShell:
```powershell
.\sync-cloud-to-local.ps1
```

### Command Line

```bash
# Basic sync (recommended for first time)
npm run db:sync

# Advanced sync (handles foreign keys)
npm run db:sync-advanced

# Dry run (see what will be synced)
npm run db:sync-dry-run

# Structure only (no data)
npm run db:sync-structure
```

## 🎯 NPM Scripts Reference

| Command | What it does |
|---------|--------------|
| `npm run db:test-setup` | Test database connections |
| `npm run db:sync` | Basic sync (fast) |
| `npm run db:sync-advanced` | Advanced sync (thorough) |
| `npm run db:sync-dry-run` | Preview changes |
| `npm run db:sync-structure` | Sync structure only |

## 🔧 Advanced Options

### Sync specific schema
```bash
node sync-cloud-to-local-advanced.js --schema=public
```

### Sync specific table
```bash
node sync-cloud-to-local-advanced.js --table=usuarios
```

### Combine options
```bash
node sync-cloud-to-local-advanced.js --schema=public --table=clientes --dry-run
```

## ⚠️ Common Issues

### "DATABASE_URL_CLOUD not found"
**Fix:** Add `DATABASE_URL_CLOUD` to `.env.local`

### "Connection timeout"
**Fix:** Check cloud database URL and firewall settings

### "Local database not running"
**Fix:** Start PostgreSQL:
```bash
docker-compose up -d
```

### "Permission denied"
**Fix:** Grant permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE buffalo_dashboard TO buffalo_user;
```

## 📚 Need More Help?

See the full guide: [SYNC-DATABASE-GUIDE.md](SYNC-DATABASE-GUIDE.md)

---

**Happy Syncing! 🎉**

