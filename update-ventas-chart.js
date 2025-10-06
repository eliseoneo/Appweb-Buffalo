#!/usr/bin/env node

/**
 * Script to update "Evolución de Ventas" chart values for specific months
 * Usage: node update-ventas-chart.js [month] [value]
 * Example: node update-ventas-chart.js Jun 150000
 */

const { Pool } = require('pg')

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

async function updateVentasChart(month, value) {
  const client = await pool.connect()
  
  try {
    // Validate month
    if (!validMonths.includes(month)) {
      console.error('❌ Invalid month. Valid months are:', validMonths.join(', '))
      return
    }

    // Validate value
    const numericValue = parseInt(value)
    if (isNaN(numericValue)) {
      console.error('❌ Invalid value. Must be a number.')
      return
    }

    console.log(`🔄 Updating ${month} value to ${numericValue.toLocaleString()}€...`)
    
    // Find the month index
    const monthIndex = validMonths.indexOf(month)
    
    // Update the specific month value in the chart data
    const updateQuery = `
      UPDATE tb_dinamico 
      SET data_value = jsonb_set(data_value, '{data,${monthIndex},value}', $1::jsonb)
      WHERE cliente_id = 'techcorp' 
        AND section_id = 'ventas' 
        AND data_type = 'chart' 
        AND data_key = 'ventas-tiempo'
    `
    
    const result = await client.query(updateQuery, [numericValue.toString()])
    
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
    console.log(`📊 ${month}: ${numericValue.toLocaleString()}€`)
    console.log('🕒 Timestamp updated to:', new Date().toISOString())
    
    // Show current chart data
    await showCurrentChartData(client)
    
  } catch (error) {
    console.error('❌ Error updating chart data:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

async function showCurrentChartData(client) {
  try {
    const query = `
      SELECT data_value->'data' as chart_data
      FROM tb_dinamico 
      WHERE cliente_id = 'techcorp' 
        AND section_id = 'ventas' 
        AND data_type = 'chart' 
        AND data_key = 'ventas-tiempo'
    `
    
    const result = await client.query(query)
    
    if (result.rows.length > 0) {
      const chartData = result.rows[0].chart_data
      console.log('\n📈 Current chart data:')
      chartData.forEach(item => {
        console.log(`   ${item.name}: ${parseInt(item.value).toLocaleString()}€`)
      })
    }
  } catch (error) {
    console.error('Error fetching current chart data:', error)
  }
}

// Get command line arguments
const args = process.argv.slice(2)

if (args.length !== 2) {
  console.log('Usage: node update-ventas-chart.js [month] [value]')
  console.log('Example: node update-ventas-chart.js Jun 150000')
  console.log('Valid months:', validMonths.join(', '))
  process.exit(1)
}

const [month, value] = args

// Run the update
updateVentasChart(month, value)
