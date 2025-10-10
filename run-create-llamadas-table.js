#!/usr/bin/env node

/**
 * Create llamadas_data table in PostgreSQL database
 * Usage: node run-create-llamadas-table.js [local|cloud]
 * Default: local
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function createLlamadasTable() {
  console.log('📞 Creating llamadas_data Table')
  console.log('='.repeat(60))
  console.log('')

  // Determine which database to use
  const target = process.argv[2] || 'local'
  const isCloud = target === 'cloud'
  
  let connectionString
  let sslConfig
  
  if (isCloud) {
    connectionString = process.env.DATABASE_URL_CLOUD
    sslConfig = { rejectUnauthorized: false }
    console.log('🌐 Target: Cloud Database')
  } else {
    connectionString = process.env.DATABASE_URL || 'postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard'
    sslConfig = false
    console.log('💻 Target: Local Database')
  }
  
  if (!connectionString) {
    console.log('❌ Database connection string not found')
    console.log('')
    console.log('💡 Tips:')
    console.log('   - For local: Check DATABASE_URL in .env.local')
    console.log('   - For cloud: Check DATABASE_URL_CLOUD in .env.local')
    return
  }
  
  console.log('🔗 Connection:', connectionString.replace(/:[^:@]+@/, ':***@'))
  console.log('')

  // Read SQL file
  const sqlFilePath = path.join(__dirname, 'database', 'create-llamadas-table.sql')
  
  if (!fs.existsSync(sqlFilePath)) {
    console.log(`❌ SQL file not found: ${sqlFilePath}`)
    return
  }
  
  console.log('📄 Reading SQL file...')
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
  console.log(`   ✅ Loaded ${sqlContent.split('\n').length} lines`)
  console.log('')

  // Create pool
  const pool = new Pool({
    connectionString,
    ssl: sslConfig,
    connectionTimeoutMillis: 15000,
    query_timeout: 30000
  })

  try {
    console.log('🔄 Connecting to database...')
    const startConnect = Date.now()
    const client = await pool.connect()
    const connectDuration = Date.now() - startConnect
    console.log(`   ✅ Connected! (${(connectDuration/1000).toFixed(2)} seconds)`)
    console.log('')

    // Check if table already exists
    console.log('🔍 Checking if table already exists...')
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'llamadas_data'
      )
    `)
    
    const tableExists = tableCheck.rows[0].exists
    
    if (tableExists) {
      console.log('   ⚠️  Table "llamadas_data" already exists')
      console.log('')
      console.log('❓ What would you like to do?')
      console.log('   1. The SQL script uses "CREATE TABLE IF NOT EXISTS" so it will skip creation')
      console.log('   2. To recreate the table, manually drop it first:')
      console.log('      DROP TABLE llamadas_data;')
      console.log('')
      
      // Get existing table info
      const columnsResult = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'llamadas_data'
        ORDER BY ordinal_position
      `)
      
      console.log('📋 Existing table structure:')
      console.log(`   Total columns: ${columnsResult.rows.length}`)
      console.log('')
      console.log('   First 10 columns:')
      columnsResult.rows.slice(0, 10).forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        console.log(`     - ${col.column_name}: ${col.data_type} ${nullable}`)
      })
      if (columnsResult.rows.length > 10) {
        console.log(`     ... and ${columnsResult.rows.length - 10} more columns`)
      }
      console.log('')
    }

    // Execute SQL
    console.log('⚡ Executing SQL script...')
    const startExec = Date.now()
    
    try {
      await client.query(sqlContent)
      const execDuration = Date.now() - startExec
      console.log(`   ✅ SQL executed successfully! (${(execDuration/1000).toFixed(2)} seconds)`)
      console.log('')
    } catch (sqlError) {
      console.log(`   ❌ Error executing SQL: ${sqlError.message}`)
      console.log('')
      console.log('💡 Error details:')
      console.log(sqlError)
      client.release()
      await pool.end()
      return
    }

    // Verify table creation
    console.log('✅ Verifying table creation...')
    const verifyResult = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'llamadas_data'
      ORDER BY ordinal_position
    `)
    
    console.log(`   ✅ Table "llamadas_data" exists with ${verifyResult.rows.length} columns`)
    console.log('')

    // Verify indexes
    console.log('🔍 Checking indexes...')
    const indexResult = await client.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename = 'llamadas_data'
      ORDER BY indexname
    `)
    
    if (indexResult.rows.length > 0) {
      console.log(`   ✅ Found ${indexResult.rows.length} indexes:`)
      indexResult.rows.forEach(idx => {
        console.log(`      - ${idx.indexname}`)
      })
    } else {
      console.log('   ⚠️  No indexes found (might be normal if table existed)')
    }
    console.log('')

    // Get row count
    const countResult = await client.query('SELECT COUNT(*) as count FROM llamadas_data')
    const rowCount = parseInt(countResult.rows[0].count)
    console.log(`📊 Current row count: ${rowCount}`)
    console.log('')

    // Show table details
    console.log('📋 Table Details:')
    console.log('─'.repeat(60))
    console.log('   Columns:')
    verifyResult.rows.forEach((col, idx) => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
      console.log(`   ${(idx + 1).toString().padStart(2, ' ')}. ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${nullable}`)
    })
    console.log('')

    client.release()
    await pool.end()

    console.log('🎉 Table creation complete!')
    console.log('')
    console.log('📖 Next steps:')
    console.log('   1. Review the table documentation: database/LLAMADAS-TABLE-DOCUMENTATION.md')
    console.log('   2. Insert data into the table')
    console.log('   3. Run queries to test the table')
    console.log('')
    console.log('💡 Example query:')
    console.log('   SELECT agent_name, COUNT(*) as total')
    console.log('   FROM llamadas_data')
    console.log('   GROUP BY agent_name;')
    console.log('')

  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    console.log('')
    
    if (error.message.includes('connect')) {
      console.log('💡 Connection troubleshooting:')
      if (isCloud) {
        console.log('   - Check DATABASE_URL_CLOUD in .env.local')
        console.log('   - Verify cloud database is accessible')
        console.log('   - Check network connectivity')
      } else {
        console.log('   - Start PostgreSQL: docker-compose up -d')
        console.log('   - Check DATABASE_URL in .env.local')
        console.log('   - Verify PostgreSQL is running: docker ps')
      }
    } else if (error.message.includes('permission')) {
      console.log('💡 Permission troubleshooting:')
      console.log('   - Check database user permissions')
      console.log('   - Verify user has CREATE TABLE privileges')
    }
    
    try {
      await pool.end()
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Display usage if help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('')
  console.log('📞 Create llamadas_data Table Script')
  console.log('='.repeat(60))
  console.log('')
  console.log('Usage:')
  console.log('  node run-create-llamadas-table.js [target]')
  console.log('')
  console.log('Arguments:')
  console.log('  target    Database target: "local" or "cloud" (default: local)')
  console.log('')
  console.log('Examples:')
  console.log('  node run-create-llamadas-table.js          # Create in local DB')
  console.log('  node run-create-llamadas-table.js local    # Create in local DB')
  console.log('  node run-create-llamadas-table.js cloud    # Create in cloud DB')
  console.log('')
  console.log('Requirements:')
  console.log('  - .env.local file with database connection strings')
  console.log('  - database/create-llamadas-table.sql file')
  console.log('  - PostgreSQL database running (for local)')
  console.log('')
  process.exit(0)
}

// Run the script
createLlamadasTable()

