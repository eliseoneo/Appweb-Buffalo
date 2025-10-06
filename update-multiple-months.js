#!/usr/bin/env node

/**
 * Script to update multiple months in "Evolución de Ventas" chart
 * Usage: node update-multiple-months.js
 * This script will prompt for each month's value
 */

const { Pool } = require('pg')
const readline = require('readline')

// Database connection configuration
function createPool() {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard?schema=public'
  
  console.log('🔗 Connecting to database...')
  console.log('📡 Database URL:', databaseUrl.replace(/:[^:@]+@/, ':***@')) // Hide password in logs

  try {
    return new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  } catch (error) {
    console.error('❌ Error creating database connection:', error.message)
    process.exit(1)
  }
}

const pool = createPool()

const validMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function updateMultipleMonths() {
  const client = await pool.connect()
  
  try {
    console.log('🔄 Updating "Evolución de Ventas" chart values...')
    console.log('Enter new values for each month (or press Enter to keep current value):\n')
    
    const newData = []
    
    // Get current data first
    const currentQuery = `
      SELECT data_value->'data' as chart_data
      FROM tb_dinamico 
      WHERE cliente_id = 'techcorp' 
        AND section_id = 'ventas' 
        AND data_type = 'chart' 
        AND data_key = 'ventas-tiempo'
    `
    
    const currentResult = await client.query(currentQuery)
    let currentData = []
    
    if (currentResult.rows.length > 0) {
      currentData = currentResult.rows[0].chart_data || []
    }
    
    // Prompt for each month
    for (let i = 0; i < validMonths.length; i++) {
      const month = validMonths[i]
      const currentValue = currentData[i]?.value || 'N/A'
      
      const input = await askQuestion(`${month} (current: ${currentValue}€): `)
      
      if (input.trim() === '') {
        // Keep current value
        newData.push({
          name: month,
          value: currentData[i]?.value || 0
        })
      } else {
        const newValue = parseInt(input)
        if (isNaN(newValue)) {
          console.log(`⚠️ Invalid value for ${month}, keeping current value`)
          newData.push({
            name: month,
            value: currentData[i]?.value || 0
          })
        } else {
          newData.push({
            name: month,
            value: newValue
          })
        }
      }
    }
    
    console.log('\n📊 New chart data:')
    newData.forEach(item => {
      console.log(`   ${item.name}: ${item.value.toLocaleString()}€`)
    })
    
    // Confirm update
    const confirm = await askQuestion('\nDo you want to update the chart with these values? (y/N): ')
    
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      // Update the entire chart data
      const updateQuery = `
        UPDATE tb_dinamico 
        SET data_value = jsonb_set(data_value, '{data}', $1::jsonb)
        WHERE cliente_id = 'techcorp' 
          AND section_id = 'ventas' 
          AND data_type = 'chart' 
          AND data_key = 'ventas-tiempo'
      `
      
      const result = await client.query(updateQuery, [JSON.stringify(newData)])
      
      if (result.rowCount === 0) {
        console.log('⚠️ No rows updated. Chart data might not exist for this client.')
        return
      }
      
      // Update the timestamp
      const timestampQuery = `
        UPDATE tb_dinamico 
        SET data_value = jsonb_set(data_value, '{lastUpdated}', to_jsonb(now()::text))
        WHERE cliente_id = 'techcorp' 
          AND data_type = 'section' 
          AND data_key = 'info'
      `
      
      await client.query(timestampQuery)
      
      console.log('✅ Chart data updated successfully!')
      console.log('🕒 Timestamp updated to:', new Date().toISOString())
    } else {
      console.log('❌ Update cancelled.')
    }
    
  } catch (error) {
    console.error('❌ Error updating chart data:', error)
  } finally {
    client.release()
    await pool.end()
    rl.close()
  }
}

// Run the update
updateMultipleMonths()
