/**
 * Script to update cliente id 5 with hexadecimal color values
 * Colors from image:
 * - Color 1: #1ea986
 * - Color 2: #35699c
 * - Color 3: #be6a6a
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function updateClienteColors() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })
  const client = await pool.connect()
  
  try {
    console.log('🔄 Updating cliente id 5 with color values...')
    
    // Get current personalizacion to preserve other fields
    const currentResult = await client.query(
      'SELECT personalizacion FROM clientes WHERE id = $1',
      [5]
    )
    
    if (currentResult.rows.length === 0) {
      console.error('❌ Cliente with id 5 not found')
      return
    }
    
    const currentPersonalizacion = currentResult.rows[0].personalizacion || {}
    
    // Update personalizacion with color array (preserve other fields)
    const updatedPersonalizacion = {
      ...currentPersonalizacion,
      color: ['#1ea986', '#35699c', '#be6a6a']
    }
    
    // Update the database
    await client.query(
      `UPDATE clientes 
       SET personalizacion = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [updatedPersonalizacion, 5]
    )
    
    console.log('✅ Cliente id 5 updated successfully!')
    console.log('📊 Updated personalizacion:', JSON.stringify(updatedPersonalizacion, null, 2))
    
    // Verify the update
    const verifyResult = await client.query(
      'SELECT id, nombre_empresa, personalizacion FROM clientes WHERE id = $1',
      [5]
    )
    
    if (verifyResult.rows.length > 0) {
      console.log('\n📋 Verification:')
      console.log('   ID:', verifyResult.rows[0].id)
      console.log('   Nombre:', verifyResult.rows[0].nombre_empresa)
      console.log('   Color array:', verifyResult.rows[0].personalizacion?.color)
      console.log('   Full personalizacion:', JSON.stringify(verifyResult.rows[0].personalizacion, null, 2))
    }
    
  } catch (error) {
    console.error('❌ Error updating cliente:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run the update
updateClienteColors()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })

