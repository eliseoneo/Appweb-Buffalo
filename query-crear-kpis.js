#!/usr/bin/env node

/**
 * Query crear_kpis table from local database and display as JSON
 * Usage: node query-crear-kpis.js
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function queryCrearKpis() {
  console.log('📊 Querying crear_kpis table from local database')
  console.log('='.repeat(60))
  console.log('')

  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard'

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: false,
    connectionTimeoutMillis: 10000
  })

  try {
    const client = await pool.connect()
    
    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'crear_kpis'
      )
    `)

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Table "crear_kpis" does not exist in local database')
      console.log('')
      console.log('💡 Tip: Run sync first:')
      console.log('   npm run db:sync')
      client.release()
      await pool.end()
      return
    }

    // Get table structure
    console.log('📋 Table Structure:')
    console.log('─'.repeat(60))
    const structureResult = await client.query(`
      SELECT 
        column_name,
        data_type,
        udt_name,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'crear_kpis'
      ORDER BY ordinal_position
    `)

    structureResult.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : ''
      console.log(`   ${col.column_name}: ${col.data_type} (${col.udt_name}) ${nullable}${defaultVal}`)
    })
    console.log('')

    // Get row count
    const countResult = await client.query('SELECT COUNT(*) as count FROM crear_kpis')
    const rowCount = parseInt(countResult.rows[0].count)
    
    console.log(`📈 Total Rows: ${rowCount}`)
    console.log('')

    if (rowCount === 0) {
      console.log('⚠️  Table is empty (no data to display)')
      client.release()
      await pool.end()
      return
    }

    // Query all data
    console.log('📊 Data (JSON format):')
    console.log('─'.repeat(60))
    const dataResult = await client.query('SELECT * FROM crear_kpis ORDER BY id')
    
    // Pretty print JSON
    console.log(JSON.stringify(dataResult.rows, null, 2))
    console.log('')

    // Also show summary
    console.log('─'.repeat(60))
    console.log(`✅ Retrieved ${dataResult.rows.length} rows`)
    
    // Show sample if many rows
    if (dataResult.rows.length > 5) {
      console.log('')
      console.log('📌 First row sample:')
      console.log(JSON.stringify(dataResult.rows[0], null, 2))
    }

    client.release()
    await pool.end()
    
    console.log('')
    console.log('🎉 Query complete!')

  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    console.log('')
    
    if (error.message.includes('does not exist')) {
      console.log('💡 Possible solutions:')
      console.log('   1. Run database sync: npm run db:sync')
      console.log('   2. Check if table name is correct')
      console.log('   3. Verify local database is running')
    } else if (error.message.includes('connect')) {
      console.log('💡 Possible solutions:')
      console.log('   1. Start PostgreSQL: docker-compose up -d')
      console.log('   2. Check DATABASE_URL in .env.local')
      console.log('   3. Verify PostgreSQL is running')
    }
    
    try {
      await pool.end()
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Run query
queryCrearKpis()

