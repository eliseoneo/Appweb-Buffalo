# ✅ Cloud to Local Database Sync - Setup Checklist

Use this checklist to ensure your database sync is properly configured.

---

## 📋 Pre-Setup Checklist

- [ ] Node.js 16+ installed (current: v20.16.0 ✅)
- [ ] PostgreSQL installed locally or via Docker
- [ ] Access to cloud database credentials
- [ ] Project dependencies installed (`npm install`)

---

## 🔧 Configuration Checklist

### 1. Environment Variables

- [ ] Create `.env.local` file in project root
- [ ] Add `DATABASE_URL` (local database)
- [ ] Add `DATABASE_URL_CLOUD` (cloud database)
- [ ] Add `JWT_SECRET` (for app authentication)
- [ ] Verify no syntax errors in `.env.local`

**Template available in:** `env.template`

### 2. Local Database Setup

- [ ] PostgreSQL is running
  - Docker: `docker-compose up -d`
  - Or check local service
- [ ] Database `buffalo_dashboard` exists
- [ ] User `buffalo_user` has proper permissions
- [ ] Can connect to local database

**Test with:**
```bash
psql -U buffalo_user -d buffalo_dashboard -h localhost
```

### 3. Cloud Database Access

- [ ] Have cloud database credentials
- [ ] Cloud database is accessible from your network
- [ ] No firewall blocking connection
- [ ] SSL/TLS settings configured if required

**Test with:**
```bash
npm run db:test-setup
```

---

## 🚀 Running Sync Checklist

### First Time Sync

- [ ] **Step 1**: Verify setup
  ```bash
  npm run db:test-setup
  ```
  Expected: All tests should pass ✅

- [ ] **Step 2**: Preview changes (dry run)
  ```bash
  npm run db:sync-dry-run
  ```
  Expected: See list of tables that will be synced

- [ ] **Step 3**: Run actual sync
  ```bash
  npm run db:sync
  ```
  Expected: Tables created and data synced successfully

- [ ] **Step 4**: Verify sync
  ```bash
  psql -U buffalo_user -d buffalo_dashboard -c "\dt"
  ```
  Expected: See all tables from cloud database

### Subsequent Syncs

- [ ] Backup local data (if you have local changes)
- [ ] Run sync
  ```bash
  npm run db:sync
  ```
- [ ] Verify data integrity
- [ ] Check for errors in output

---

## ✅ Verification Checklist

After sync completes:

- [ ] No error messages in console
- [ ] All expected tables exist
- [ ] Row counts match between cloud and local
- [ ] Can query tables without errors
- [ ] Application starts successfully (`npm run dev`)

**Verify with SQL:**
```sql
-- List all tables
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
ORDER BY schemaname, tablename;

-- Check row count for a table
SELECT COUNT(*) FROM public.usuarios;
```

---

## 🎯 Files Created Checklist

- [x] `sync-cloud-to-local.js` - Basic sync script
- [x] `sync-cloud-to-local-advanced.js` - Advanced sync script
- [x] `test-sync-setup.js` - Setup test script
- [x] `sync-cloud-to-local.bat` - Windows batch launcher
- [x] `sync-cloud-to-local.ps1` - PowerShell launcher
- [x] `SYNC-DATABASE-GUIDE.md` - Complete guide
- [x] `QUICK-SYNC.md` - Quick reference
- [x] `SYNC-SETUP-SUMMARY.md` - Setup summary
- [x] `SETUP-CHECKLIST.md` - This checklist
- [x] `env.template` - Environment template
- [x] `package.json` - Updated with npm scripts
- [x] `README.md` - Updated with sync info

---

## 🔍 Troubleshooting Checklist

If sync fails, check:

- [ ] `.env.local` exists and has correct format
- [ ] `DATABASE_URL_CLOUD` is correctly formatted
- [ ] Cloud database is accessible (ping/telnet)
- [ ] Local PostgreSQL is running
- [ ] No typos in connection strings
- [ ] Firewall not blocking connections
- [ ] Sufficient disk space for sync
- [ ] User has write permissions

**Get diagnostic info:**
```bash
npm run db:test-setup
```

---

## 📊 Success Criteria

Your setup is complete when:

✅ `npm run db:test-setup` shows all tests passing  
✅ `npm run db:sync-dry-run` shows expected tables  
✅ `npm run db:sync` completes without errors  
✅ Tables exist in local database  
✅ Data matches cloud database  
✅ Application runs with `npm run dev`  

---

## 🎓 Optional: Automation Setup

For regular syncing:

- [ ] Set up scheduled sync (cron/Task Scheduler)
- [ ] Configure sync monitoring
- [ ] Set up backup before sync
- [ ] Test rollback procedure
- [ ] Document sync schedule

**Windows Task Scheduler:**
```powershell
# Run daily at 2 AM
schtasks /create /tn "Buffalo DB Sync" /tr "powershell.exe -File C:\path\to\sync-cloud-to-local.ps1" /sc daily /st 02:00
```

**Linux/Mac Cron:**
```bash
# Edit crontab
crontab -e

# Add: Run daily at 2 AM
0 2 * * * cd /path/to/project && npm run db:sync >> sync.log 2>&1
```

---

## 📝 Notes

- **One-way sync only**: Cloud → Local (local changes will be overwritten)
- **Always backup**: Before syncing if you have local changes
- **Test first**: Use dry-run mode before actual sync
- **Monitor logs**: Check for errors and warnings
- **Security**: Never commit `.env.local` to git

---

## 🆘 Need Help?

1. ✅ Check this checklist
2. ✅ Read [QUICK-SYNC.md](QUICK-SYNC.md)
3. ✅ Review [SYNC-DATABASE-GUIDE.md](SYNC-DATABASE-GUIDE.md)
4. ✅ Run `npm run db:test-setup` for diagnostics
5. ✅ Check error messages in sync output

---

## 🎉 Ready to Sync!

Once all items are checked, you're ready to sync your database!

```bash
# Quick start
npm run db:test-setup  # Verify setup
npm run db:sync        # Sync!
```

**Good luck! 🚀**

