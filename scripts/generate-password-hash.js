/**
 * Script to generate a bcrypt hash for a password
 * This is useful when you need to manually insert/update passwords in SQL queries
 * 
 * Usage: node scripts/generate-password-hash.js [password]
 * 
 * Example:
 *   node scripts/generate-password-hash.js mypassword123
 * 
 * Output: The bcrypt hash that can be used in SQL INSERT/UPDATE statements
 */

require('dotenv').config({ path: '.env.local' })
const bcrypt = require('bcryptjs')

async function generateHash(password) {
  if (!password) {
    console.error('❌ Error: Password is required')
    console.log('\n📖 Usage: node scripts/generate-password-hash.js <password>')
    console.log('   Example: node scripts/generate-password-hash.js admin123\n')
    process.exit(1)
  }

  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  
  console.log('\n🔐 Password Hash Generator')
  console.log('='.repeat(50))
  console.log(`\n📝 Password: ${password}`)
  console.log(`\n🔑 Hash: ${hash}`)
  console.log('\n📋 SQL Example:')
  console.log(`   INSERT INTO usuarios (username, password_hash, tipo_usuario) VALUES`)
  console.log(`   ('username', '${hash}', 'admin');`)
  console.log('\n' + '='.repeat(50) + '\n')
  
  return hash
}

const password = process.argv[2]

generateHash(password).catch((error) => {
  console.error('❌ Error generating hash:', error)
  process.exit(1)
})

