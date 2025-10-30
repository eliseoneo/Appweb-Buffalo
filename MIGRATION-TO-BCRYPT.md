# 🔐 Migration to bcrypt Password Hashing

This document explains how to migrate from hardcoded passwords to bcrypt-hashed passwords stored in the database.

## ✅ What Has Changed

1. **Authentication System**: 
   - Moved from hardcoded usernames/passwords to database-backed authentication
   - Passwords are now hashed using bcrypt before storage
   - JWT tokens replaced simple hardcoded tokens

2. **Security Improvements**:
   - Passwords are hashed with bcrypt (10 salt rounds)
   - JWT tokens for better security and session management
   - Database validation for all authentication

## 🚀 Migration Steps

### Step 1: Install Dependencies (if not already installed)

```bash
npm install
```

### Step 2: Hash Existing User Passwords

Run the password hashing script to update all existing users in the database:

```bash
# Hash all users with password 'admin123' (default)
npm run db:hash-passwords

# Or hash a specific user with a specific password
node scripts/hash-user-passwords.js admin NewSecurePassword123

# Or hash all users with a custom password
node scripts/hash-user-passwords.js "" NewPasswordForAllUsers
```

### Step 3: Update Environment Variables

Make sure your `.env.local` has a strong JWT secret:

```env
JWT_SECRET="your-strong-random-secret-key-here-change-in-production"
DATABASE_URL="postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard"
```

### Step 4: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try logging in with existing credentials:
   - Username: `admin`
   - Password: `admin123` (or the password you set)

3. Verify that authentication works correctly

## 📝 API Endpoints

### Change Password (for logged-in users)

**POST** `/api/auth/change-password`

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-secure-password"
}
```

### Update User Password (admin only)

**PUT** `/api/auth/change-password`

```json
{
  "userId": 1,
  "newPassword": "new-secure-password"
}
```

## 🗄️ Database Structure

The `usuarios` table structure:

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt hash
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('admin', 'cliente')) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security Notes

1. **Password Requirements**:
   - Minimum 6 characters
   - Consider implementing stronger requirements in production

2. **bcrypt Configuration**:
   - Salt rounds: 10 (good balance between security and performance)
   - Can be increased to 12-14 for production if needed

3. **JWT Tokens**:
   - Expire after 24 hours
   - Stored in httpOnly cookies
   - Include user ID, username, and user type

4. **Environment Variables**:
   - Never commit `.env.local` to version control
   - Use strong, random JWT secrets in production
   - Rotate secrets periodically

## 🐛 Troubleshooting

### Issue: "Credenciales inválidas" after migration

**Solution**: Run the password hashing script:
```bash
npm run db:hash-passwords
```

### Issue: Token validation fails

**Solution**: 
1. Check that `JWT_SECRET` is set in `.env.local`
2. Clear browser cookies and try logging in again

### Issue: Database connection errors

**Solution**: 
1. Verify `DATABASE_URL` in `.env.local`
2. Ensure PostgreSQL is running
3. Check database permissions for `buffalo_user`

## 📚 Next Steps

1. **Remove hardcoded credentials** from:
   - Documentation files
   - README.md
   - Any other places where passwords are documented

2. **Implement password policies** (optional):
   - Minimum length requirements
   - Complexity requirements
   - Password expiration

3. **Add rate limiting** for login attempts (optional)

4. **Add two-factor authentication** (optional, for production)

## ✅ Verification

After migration, verify:

- [ ] Users can log in with database credentials
- [ ] Passwords are hashed in the database
- [ ] Users can change their own passwords
- [ ] Admins can update other users' passwords
- [ ] JWT tokens work correctly
- [ ] Middleware properly validates tokens
- [ ] Old hardcoded tokens no longer work

