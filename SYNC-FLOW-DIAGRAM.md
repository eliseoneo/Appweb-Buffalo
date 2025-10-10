# 🔄 Database Sync Flow Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Buffalo IA - Database Sync                   │
│                   One-Way: Cloud → Local Only                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Architecture Diagram

```
┌──────────────────┐
│   .env.local     │
│  Configuration   │
└────────┬─────────┘
         │
         ├── DATABASE_URL_CLOUD ────────────┐
         │                                  │
         └── DATABASE_URL ──────┐           │
                               │           │
                               ▼           ▼
                    ┌─────────────┐  ┌──────────────┐
                    │   Local DB  │  │   Cloud DB   │
                    │ PostgreSQL  │  │  PostgreSQL  │
                    │             │  │              │
                    │ (Dest) ◄────────── (Source)  │
                    └─────────────┘  └──────────────┘
                          ▲                 │
                          │                 │
                          │   Data Flow     │
                          └─────────────────┘
```

---

## 🔄 Sync Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      START SYNC PROCESS                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Load Configuration                                     │
│  • Read .env.local                                             │
│  • Get DATABASE_URL_CLOUD                                      │
│  • Get DATABASE_URL (local)                                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Connect to Databases                                   │
│  • Connect to Cloud DB (source)                                │
│  • Connect to Local DB (destination)                           │
│  • Verify connections                                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Fetch Table List from Cloud                           │
│  • Query pg_tables                                             │
│  • Exclude system schemas                                      │
│  • Filter by schema/table (if specified)                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: For Each Table                                         │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  4a. Get Table Structure (DDL)                         │   │
│  │  • Columns, types, constraints                         │   │
│  │  • Primary keys                                        │   │
│  │  • Foreign keys (advanced mode)                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                     │                                           │
│                     ▼                                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  4b. Create Schema (if needed)                         │   │
│  │  • CREATE SCHEMA IF NOT EXISTS                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                     │                                           │
│                     ▼                                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  4c. Create/Update Table in Local                      │   │
│  │  • CREATE TABLE IF NOT EXISTS                          │   │
│  │  • With all columns and constraints                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                     │                                           │
│                     ▼                                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  4d. Sync Data (unless --skip-data)                    │   │
│  │  • TRUNCATE local table                                │   │
│  │  • Fetch all rows from cloud                           │   │
│  │  • INSERT into local (in batches)                      │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Summary & Cleanup                                      │
│  • Show statistics                                             │
│  • Report errors                                               │
│  • Close connections                                           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SYNC COMPLETE                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Decision Tree: Which Sync to Use?

```
                         Need to sync?
                              │
                              ▼
                    ┌─────────────────┐
                    │  First time?    │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                   YES               NO
                    │                 │
                    ▼                 ▼
          ┌──────────────────┐  ┌──────────────┐
          │ Complex DB with  │  │ Quick daily  │
          │ foreign keys?    │  │ update?      │
          └────────┬─────────┘  └───────┬──────┘
                   │                    │
          ┌────────┴────────┐          │
          │                 │          │
         YES               NO          │
          │                 │          │
          ▼                 ▼          ▼
    ┌──────────┐     ┌──────────┐  ┌──────────┐
    │ Advanced │     │  Basic   │  │  Basic   │
    │  Sync    │     │  Sync    │  │  Sync    │
    └──────────┘     └──────────┘  └──────────┘
         │                 │          │
         │                 │          │
         └─────────────────┴──────────┘
                      │
                      ▼
              Want to preview?
                      │
              ┌───────┴────────┐
              │                │
             YES              NO
              │                │
              ▼                ▼
        ┌──────────┐    ┌──────────┐
        │ --dry-run│    │   Run    │
        └──────────┘    └──────────┘
```

---

## 🛠️ Tool Selection Matrix

```
┌─────────────────────┬──────────┬──────────┬──────────┐
│ Feature             │ Basic    │ Advanced │ Test     │
├─────────────────────┼──────────┼──────────┼──────────┤
│ Speed               │ ★★★★★    │ ★★★☆☆    │ ★★★★★    │
│ Foreign Keys        │ ☐        │ ★★★★★    │ N/A      │
│ Indexes             │ ☐        │ ★★★★☆    │ N/A      │
│ Dry Run             │ ☐        │ ★★★★★    │ ★★★★★    │
│ Selective Sync      │ ☐        │ ★★★★★    │ N/A      │
│ Error Handling      │ ★★★★☆    │ ★★★★★    │ ★★★★★    │
│ Large Tables        │ ★★★☆☆    │ ★★★★★    │ N/A      │
│ Ease of Use         │ ★★★★★    │ ★★★☆☆    │ ★★★★★    │
└─────────────────────┴──────────┴──────────┴──────────┘

★ = Rating (5 stars max)
☐ = Not available
N/A = Not applicable
```

---

## 📦 File Structure

```
Buffalo-IA-Clean/
│
├── 🔧 Sync Scripts
│   ├── sync-cloud-to-local.js          (Basic)
│   ├── sync-cloud-to-local-advanced.js (Advanced)
│   └── test-sync-setup.js              (Test)
│
├── 🪟 Windows Launchers
│   ├── sync-cloud-to-local.bat         (Batch)
│   └── sync-cloud-to-local.ps1         (PowerShell)
│
├── 📚 Documentation
│   ├── QUICK-SYNC.md                   (Quick Start)
│   ├── SYNC-DATABASE-GUIDE.md          (Complete Guide)
│   ├── SYNC-SETUP-SUMMARY.md           (Summary)
│   ├── SETUP-CHECKLIST.md              (Checklist)
│   ├── DATABASE-SYNC-COMPLETE.md       (Completion)
│   └── SYNC-FLOW-DIAGRAM.md            (This file)
│
├── ⚙️ Configuration
│   ├── .env.local                      (Your config)
│   ├── env.template                    (Template)
│   └── package.json                    (NPM scripts)
│
└── 📁 Database
    ├── setup-completo.sql              (Local setup)
    └── README.md                       (DB docs)
```

---

## 🎬 Usage Scenarios

### Scenario 1: Fresh Local Setup
```
Developer → test-sync-setup.js → Advanced Sync → Local DB Ready
   ↓             (verify)           (first time)        ↓
.env.local                                        npm run dev
```

### Scenario 2: Daily Development
```
Developer → Basic Sync → Local DB Updated → Continue Work
   ↓           (fast)          ↓                  ↓
Start Day                   Fresh Data      npm run dev
```

### Scenario 3: Schema Updates
```
Schema Change in Cloud → Structure Sync → Local Schema Updated
         ↓                   (--skip-data)          ↓
    Detected                                  Test Changes
```

### Scenario 4: Troubleshooting
```
Issue Reported → Test Setup → Identify Problem → Fix → Retry Sync
      ↓            (diagnose)        ↓           ↓        ↓
  Sync Failed                    .env.local   Config   Success
```

---

## 🔐 Data Flow with Security

```
┌──────────────────────────────────────────────────────────┐
│                     CLOUD DATABASE                       │
│                    (Production Data)                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Tables: usuarios, clientes, metricas, etc.    │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ SSL/TLS Encrypted Connection
                   │ (rejectUnauthorized: false)
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│              SYNC SCRIPT (Node.js)                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  • Reads .env.local (not in git)              │    │
│  │  • Establishes connections                     │    │
│  │  • Fetches schema & data                       │    │
│  │  • Transforms & validates                      │    │
│  │  • Inserts into local DB                       │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Local Connection (no SSL)
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│                    LOCAL DATABASE                        │
│                   (Development Copy)                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Tables: usuarios, clientes, metricas, etc.    │    │
│  │  (Exact copy of cloud data)                    │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Command Reference

```bash
# Setup & Test
npm run db:test-setup       # Verify configuration

# Basic Sync (Recommended)
npm run db:sync             # Full sync

# Advanced Options
npm run db:sync-advanced    # With foreign keys
npm run db:sync-dry-run     # Preview only
npm run db:sync-structure   # Structure only

# Specific Targets
node sync-cloud-to-local-advanced.js --schema=public
node sync-cloud-to-local-advanced.js --table=usuarios
node sync-cloud-to-local-advanced.js --dry-run

# Windows
.\sync-cloud-to-local.bat   # GUI menu
.\sync-cloud-to-local.ps1   # PowerShell menu
```

---

## 🎯 Success Indicators

```
┌─────────────────────────────────────────────────────────┐
│  BEFORE SYNC                                            │
├─────────────────────────────────────────────────────────┤
│  ✅ .env.local configured                               │
│  ✅ Local PostgreSQL running                            │
│  ✅ Cloud DB accessible                                 │
│  ✅ npm run db:test-setup passes                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  DURING SYNC                                            │
├─────────────────────────────────────────────────────────┤
│  ✅ Connection successful                               │
│  ✅ Tables being created                                │
│  ✅ Data being copied                                   │
│  ✅ No error messages                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  AFTER SYNC                                             │
├─────────────────────────────────────────────────────────┤
│  ✅ All tables synced                                   │
│  ✅ Row counts match                                    │
│  ✅ Can query tables                                    │
│  ✅ npm run dev works                                   │
└─────────────────────────────────────────────────────────┘
```

---

**End of Flow Diagram** 🎉

For detailed instructions, see:
- [QUICK-SYNC.md](QUICK-SYNC.md) - Quick start
- [SYNC-DATABASE-GUIDE.md](SYNC-DATABASE-GUIDE.md) - Complete guide

