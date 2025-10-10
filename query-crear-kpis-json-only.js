#!/usr/bin/env node

/**
 * Query crear_kpis table and output ONLY JSON (no formatting)
 * Usage: node query-crear-kpis-json-only.js
 * Save to file: node query-crear-kpis-json-only.js > data.json
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function queryCrearKpisJsonOnly() {
  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard'

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: false,
    connectionTimeoutMillis: 10000
  })

  try {
    const client = await pool.connect()
    
    // Query all data
    const dataResult = await client.query('SELECT * FROM crear_kpis ORDER BY id')
    
    // Output only JSON
    console.log(JSON.stringify(dataResult.rows, null, 2))

    client.release()
    await pool.end()

  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

queryCrearKpisJsonOnly()

