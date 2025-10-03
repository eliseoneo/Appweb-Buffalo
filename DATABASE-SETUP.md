# 🐘 PostgreSQL Docker Setup - Buffalo AI

## ✅ Setup Complete

The PostgreSQL database has been successfully set up in a Docker container!

### 📦 Container Details

- **Container Name:** `buffalo-postgres`
- **Image:** `postgres:16-alpine`
- **Status:** Running and healthy
- **Port:** `5432:5432`
- **Volume:** `buffalo-ia_postgres_data`

### 🔐 Database Credentials

**Main Database:**
- **Database:** `buffalo_dashboard`
- **User:** `buffalo_user`
- **Password:** `buffalo_password_2024`
- **Host:** `localhost`
- **Port:** `5432`

**PostgreSQL Admin:**
- **User:** `postgres`
- **Password:** `postgres_admin_2024`

### 🔗 Connection String

```
DATABASE_URL=postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard?schema=public
```

This connection string is already configured in your `.env.local` file.

### 📊 Database Structure

The setup includes:

- ✅ **8 Tables** created
  - usuarios (users)
  - clientes (clients)
  - funcionalidades (features)
  - cliente_funcionalidades (client permissions)
  - aplicaciones (applications)
  - metricas (metrics)
  - logs_auditoria (audit logs)
  - configuraciones_sistema (system configs)

- ✅ **2 Views** created
  - vista_clientes_completa
  - vista_metricas_cliente

- ✅ **3 Stored Procedures** created
  - update_updated_at_column()
  - sp_crear_cliente()
  - sp_habilitar_funcionalidad()

- ✅ **Demo Data** loaded
  - 3 users (1 admin + 2 clients)
  - 2 demo clients
  - 7 applications
  - 4 metrics records
  - 6 available features

### 👥 Demo Accounts

| Username | Password | Type |
|----------|----------|------|
| `admin` | `admin123` | Admin |
| `startup_demo` | `admin123` | Cliente Startup |
| `empresa_demo` | `admin123` | Cliente Empresa |

### 🚀 Docker Commands

**Start the container:**
```bash
docker-compose up -d
```

**Stop the container:**
```bash
docker-compose down
```

**View logs:**
```bash
docker logs buffalo-postgres
```

**Access PostgreSQL CLI:**
```bash
docker exec -it buffalo-postgres psql -U buffalo_user -d buffalo_dashboard
```

**Backup database:**
```bash
docker exec buffalo-postgres pg_dump -U buffalo_user buffalo_dashboard > backup.sql
```

**Restore database:**
```bash
docker exec -i buffalo-postgres psql -U buffalo_user -d buffalo_dashboard < backup.sql
```

### 🔍 Verify Setup

Test the connection:
```bash
docker exec buffalo-postgres psql -U buffalo_user -d buffalo_dashboard -c "SELECT COUNT(*) FROM usuarios;"
```

### 📝 Environment Variables

Your `.env.local` file contains all necessary configuration:

```env
DATABASE_URL=postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard?schema=public
JWT_SECRET=buffalo-ai-dashboard-2024-secret-key-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_COMPANY=Buffalo AI
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# PostgreSQL Docker Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_admin_2024
POSTGRES_DB=postgres
POSTGRES_PORT=5432
```

### ⚠️ Important Notes

1. The database is persistent - data is stored in the `buffalo-ia_postgres_data` volume
2. To completely reset the database, remove the volume:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```
3. Change passwords in production environments
4. The container starts automatically with Docker

### 🎯 Next Steps

1. ✅ Database setup complete
2. 🔄 Update your Next.js app to use the `DATABASE_URL`
3. 🔄 Implement authentication with the JWT_SECRET
4. 🔄 Connect your API routes to the database

---

**Setup Date:** October 2, 2025
**Status:** ✅ Operational

