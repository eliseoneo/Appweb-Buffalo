/**
 * Script to hash existing user passwords in the database
 * This should be run once after migrating from hardcoded passwords
 * 
 * Usage: node scripts/hash-user-passwords.js [username] [newPassword]
 * 
 * If username is provided, it will hash the password for that specific user.
 * If not provided, it will hash 'admin123' for all existing users.
 */

require('dotenv').config({ path: '.env.local' })
const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables')
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function hashPassword(password) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

async function updateUserPassword(username, password) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    
    // Check if user exists
    const userCheck = await client.query(
      'SELECT id, username FROM usuarios WHERE username = $1',
      [username]
    )
    
    if (userCheck.rows.length === 0) {
      console.log(`❌ Usuario '${username}' no encontrado`)
      return false
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Update password
    await client.query(
      'UPDATE usuarios SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2',
      [passwordHash, username]
    )
    
    await client.query('COMMIT')
    console.log(`✅ Contraseña actualizada para '${username}'`)
    return true
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(`❌ Error actualizando contraseña para '${username}':`, error)
    return false
  } finally {
    client.release()
  }
}

async function hashAllUsersPasswords(password = 'admin123') {
  const client = await pool.connect()
  try {
    // Get all users
    const usersResult = await client.query('SELECT username FROM usuarios')
    
    if (usersResult.rows.length === 0) {
      console.log('❌ No hay usuarios en la base de datos')
      return
    }
    
    console.log(`\n📝 Hasheando contraseñas para ${usersResult.rows.length} usuario(s)...`)
    console.log(`🔑 Contraseña a usar: ${password}\n`)
    
    let successCount = 0
    for (const user of usersResult.rows) {
      const success = await updateUserPassword(user.username, password)
      if (success) successCount++
    }
    
    console.log(`\n✅ Proceso completado: ${successCount}/${usersResult.rows.length} usuarios actualizados`)
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

async function main() {
  const args = process.argv.slice(2)
  const username = args[0]
  const password = args[1] || 'admin123'
  
  console.log('🔐 Buffalo AI - Hash User Passwords Script')
  console.log('==========================================\n')
  
  if (username) {
    // Update specific user
    console.log(`🎯 Actualizando contraseña para usuario: ${username}`)
    await updateUserPassword(username, password)
  } else {
    // Update all users
    console.log('🎯 Actualizando contraseñas para todos los usuarios')
    await hashAllUsersPasswords(password)
  }
  
  await pool.end()
}

main().catch(console.error)

