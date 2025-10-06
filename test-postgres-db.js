#!/usr/bin/env node

/**
 * Test connection to the postgres database specifically
 * Usage: node test-postgres-db.js
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function testPostgresDatabase() {
  console.log('🐘 PostgreSQL Database Tester (postgres database)')
  console.log('================================================')
  console.log('')
  
  const connectionString = process.env.DATABASE_URL_CLOUD
  
  if (!connectionString) {
    console.log('❌ DATABASE_URL_CLOUD not found in .env.local file.')
    return
  }
  
  // Modify connection string to connect to postgres database instead of evolutionapi
  const postgresConnectionString = connectionString.replace(/\/evolutionapi\?/, '/postgres?')
  
  console.log('📡 Connecting to postgres database...')
  console.log('🔗 Connection string:', postgresConnectionString.replace(/:[^:@]+@/, ':***@'))
  console.log('')
  
  const pool = new Pool({
    connectionString: postgresConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    query_timeout: 15000
  })

  try {
    console.log('🔄 Connecting to postgres database...')
    const start = Date.now()
    const client = await pool.connect()
    const duration = Date.now() - start
    
    console.log(`✅ Connection successful! (${(duration/1000).toFixed(2)} seconds)`)
    console.log('')
    
    // Get database info
    console.log('📊 Database Information:')
    const dbInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as version,
        pg_size_pretty(pg_database_size(current_database())) as database_size
    `)
    
    const info = dbInfo.rows[0]
    console.log(`   Database: ${info.database_name}`)
    console.log(`   User: ${info.current_user}`)
    console.log(`   Version: ${info.version.split(',')[0]}`)
    console.log(`   Size: ${info.database_size}`)
    console.log('')

    // Check for crear_kpis table specifically
    console.log('🔍 Checking for crear_kpis table...')
    try {
      const crearKpisCheck = await client.query(`
        SELECT 
          schemaname,
          tablename,
          tableowner,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE tablename = 'crear_kpis'
      `)
      
      if (crearKpisCheck.rows.length > 0) {
        console.log(`   ✅ Found crear_kpis table in schema: ${crearKpisCheck.rows[0].schemaname}`)
        console.log(`   Owner: ${crearKpisCheck.rows[0].tableowner}`)
        console.log(`   Size: ${crearKpisCheck.rows[0].size}`)
        
        // Get row count
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${crearKpisCheck.rows[0].schemaname}.${crearKpisCheck.rows[0].tablename}`)
        console.log(`   Rows: ${countResult.rows[0].count}`)
        
        // Get column info
        const columnsResult = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_schema = '${crearKpisCheck.rows[0].schemaname}' 
            AND table_name = '${crearKpisCheck.rows[0].tablename}'
          ORDER BY ordinal_position
        `)
        
        console.log(`   Columns:`)
        columnsResult.rows.forEach(col => {
          console.log(`     - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`)
        })
        
        // Get sample data
        console.log(`   Sample data:`)
        const sampleData = await client.query(`SELECT * FROM ${crearKpisCheck.rows[0].schemaname}.${crearKpisCheck.rows[0].tablename} LIMIT 2`)
        sampleData.rows.forEach((row, index) => {
          console.log(`     Row ${index + 1}:`)
          Object.keys(row).forEach(key => {
            const value = Array.isArray(row[key]) ? `[${row[key].length} items]` : row[key]
            console.log(`       ${key}: ${value}`)
          })
        })
      } else {
        console.log(`   ❌ crear_kpis table not found in any schema`)
      }
    } catch (error) {
      console.log(`   ⚠️  Error checking crear_kpis table: ${error.message}`)
    }
    console.log('')

    // List all tables in postgres database
    console.log('📋 All Tables in postgres Database:')
    console.log('-----------------------------------')
    const tablesResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        tableowner,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
      FROM pg_tables 
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schemaname, tablename
    `)
    
    if (tablesResult.rows.length === 0) {
      console.log('   No tables found in user schemas')
    } else {
      let currentSchema = ''
      tablesResult.rows.forEach(table => {
        if (currentSchema !== table.schemaname) {
          currentSchema = table.schemaname
          console.log(`   📁 Schema: ${table.schemaname}`)
        }
        console.log(`      📊 ${table.tablename} (${table.size})`)
      })
    }
    console.log('')

    client.release()
    await pool.end()
    
    console.log('🎉 postgres database test complete!')
    
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`)
    console.log('')
    console.log('🔧 Troubleshooting tips:')
    console.log('• Check if the postgres database exists')
    console.log('• Verify database permissions')
    console.log('• Check network connectivity')
    
    try {
      await pool.end()
    } catch (endError) {
      // Ignore cleanup errors
    }
  }
}

// Run the test
testPostgresDatabase()
