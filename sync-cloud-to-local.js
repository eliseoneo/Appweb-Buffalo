#!/usr/bin/env node

/**
 * Sync data from cloud PostgreSQL database to local PostgreSQL database
 * One-way sync: Cloud -> Local
 * 
 * This script will:
 * 1. Connect to both cloud and local databases
 * 2. Get all tables from cloud database
 * 3. Create those tables in local database (if they don't exist)
 * 4. Sync all data from cloud to local
 * 
 * Usage: node sync-cloud-to-local.js
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

// Configuration
const CLOUD_CONNECTION_STRING = process.env.DATABASE_URL_CLOUD
const LOCAL_CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard'

// Tables to exclude from sync (system tables, etc.)
const EXCLUDE_SCHEMAS = ['information_schema', 'pg_catalog', 'pg_toast', 'pg_temp']
const EXCLUDE_TABLES = [] // Add specific tables to exclude if needed

async function syncCloudToLocal() {
  console.log('🔄 Buffalo AI - Cloud to Local Database Sync')
  console.log('============================================')
  console.log('')

  // Validate environment variables
  if (!CLOUD_CONNECTION_STRING) {
    console.log('❌ DATABASE_URL_CLOUD not found in .env.local file.')
    console.log('   Please add DATABASE_URL_CLOUD to your .env.local file')
    return
  }

  console.log('🔗 Connection Info:')
  console.log(`   Cloud DB: ${CLOUD_CONNECTION_STRING.replace(/:[^:@]+@/, ':***@')}`)
  console.log(`   Local DB: ${LOCAL_CONNECTION_STRING.replace(/:[^:@]+@/, ':***@')}`)
  console.log('')

  // Create connection pools
  const cloudPool = new Pool({
    connectionString: CLOUD_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    query_timeout: 30000
  })

  const localPool = new Pool({
    connectionString: LOCAL_CONNECTION_STRING,
    ssl: false,
    connectionTimeoutMillis: 10000,
    query_timeout: 30000
  })

  let cloudClient = null
  let localClient = null

  try {
    // Connect to both databases
    console.log('🔌 Connecting to cloud database...')
    cloudClient = await cloudPool.connect()
    console.log('✅ Connected to cloud database')

    console.log('🔌 Connecting to local database...')
    localClient = await localPool.connect()
    console.log('✅ Connected to local database')
    console.log('')

    // Get all tables from cloud database
    console.log('📋 Fetching tables from cloud database...')
    const tablesResult = await cloudClient.query(`
      SELECT 
        schemaname,
        tablename,
        tableowner
      FROM pg_tables 
      WHERE schemaname NOT IN (${EXCLUDE_SCHEMAS.map(s => `'${s}'`).join(', ')})
        ${EXCLUDE_TABLES.length > 0 ? `AND tablename NOT IN (${EXCLUDE_TABLES.map(t => `'${t}'`).join(', ')})` : ''}
      ORDER BY schemaname, tablename
    `)

    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found in cloud database')
      return
    }

    console.log(`✅ Found ${tablesResult.rows.length} tables to sync`)
    console.log('')

    // Group tables by schema
    const tablesBySchema = {}
    tablesResult.rows.forEach(table => {
      if (!tablesBySchema[table.schemaname]) {
        tablesBySchema[table.schemaname] = []
      }
      tablesBySchema[table.schemaname].push(table.tablename)
    })

    let totalSynced = 0
    let totalErrors = 0

    // Sync each schema and its tables
    for (const [schema, tables] of Object.entries(tablesBySchema)) {
      console.log(`📁 Schema: ${schema}`)
      console.log('─'.repeat(50))

      // Create schema in local if it doesn't exist
      try {
        await localClient.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`)
      } catch (error) {
        console.log(`   ⚠️  Could not create schema ${schema}: ${error.message}`)
      }

      // Sync each table
      for (const tableName of tables) {
        try {
          const startTime = Date.now()
          
          // Get table structure from cloud
          const columnsResult = await cloudClient.query(`
            SELECT 
              column_name, 
              data_type, 
              character_maximum_length,
              numeric_precision,
              numeric_scale,
              is_nullable,
              column_default,
              udt_name
            FROM information_schema.columns 
            WHERE table_schema = $1 AND table_name = $2
            ORDER BY ordinal_position
          `, [schema, tableName])

          // Get primary key information
          const pkResult = await cloudClient.query(`
            SELECT a.attname
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = $1::regclass AND i.indisprimary
          `, [`${schema}.${tableName}`])

          const primaryKeys = pkResult.rows.map(row => row.attname)

          // Build CREATE TABLE statement
          const columnDefs = columnsResult.rows.map(col => {
            let def = `${col.column_name} `
            
            // Handle data type properly
            if (col.data_type === 'ARRAY') {
              // For ARRAY types, udt_name is like '_text', '_int4', etc.
              // Convert to proper PostgreSQL syntax: text[], integer[], etc.
              const baseType = col.udt_name.replace(/^_/, '')
              const typeMapping = {
                'int4': 'integer',
                'int8': 'bigint',
                'int2': 'smallint',
                'float4': 'real',
                'float8': 'double precision',
                'bool': 'boolean',
                'varchar': 'character varying',
                'bpchar': 'character',
                'timestamptz': 'timestamp with time zone',
                'timetz': 'time with time zone'
              }
              def += (typeMapping[baseType] || baseType) + '[]'
            } else if (col.data_type === 'USER-DEFINED') {
              // For custom types, use udt_name as-is
              def += col.udt_name
            } else {
              def += col.data_type
              
              // Add length/precision
              if (col.character_maximum_length) {
                def += `(${col.character_maximum_length})`
              } else if (col.numeric_precision && col.numeric_scale !== null) {
                def += `(${col.numeric_precision},${col.numeric_scale})`
              }
            }
            
            if (col.is_nullable === 'NO') {
              def += ' NOT NULL'
            }
            
            if (col.column_default) {
              def += ` DEFAULT ${col.column_default}`
            }
            
            return def
          }).join(',\n  ')

          let createTableSQL = `CREATE TABLE IF NOT EXISTS ${schema}.${tableName} (\n  ${columnDefs}`
          
          if (primaryKeys.length > 0) {
            createTableSQL += `,\n  PRIMARY KEY (${primaryKeys.join(', ')})`
          }
          
          createTableSQL += '\n)'

          // Create table in local database
          await localClient.query(createTableSQL)

          // Get row count from cloud
          const countResult = await cloudClient.query(`SELECT COUNT(*) as count FROM ${schema}.${tableName}`)
          const rowCount = parseInt(countResult.rows[0].count)

          if (rowCount > 0) {
            // Delete existing data in local table
            await localClient.query(`TRUNCATE TABLE ${schema}.${tableName} CASCADE`)

            // Copy data from cloud to local
            const dataResult = await cloudClient.query(`SELECT * FROM ${schema}.${tableName}`)
            
            if (dataResult.rows.length > 0) {
              const columns = columnsResult.rows.map(col => col.column_name)
              const placeholders = dataResult.rows.map((_, rowIndex) => {
                const rowPlaceholders = columns.map((_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`)
                return `(${rowPlaceholders.join(', ')})`
              }).join(', ')
              
              const values = dataResult.rows.flatMap(row => columns.map(col => row[col]))
              
              const insertSQL = `
                INSERT INTO ${schema}.${tableName} (${columns.join(', ')})
                VALUES ${placeholders}
              `
              
              await localClient.query(insertSQL, values)
            }
          }

          const duration = Date.now() - startTime
          console.log(`   ✅ ${tableName}: ${rowCount} rows synced (${(duration / 1000).toFixed(2)}s)`)
          totalSynced++

        } catch (error) {
          console.log(`   ❌ ${tableName}: Error - ${error.message}`)
          totalErrors++
        }
      }

      console.log('')
    }

    // Summary
    console.log('📊 Sync Summary')
    console.log('═'.repeat(50))
    console.log(`   ✅ Tables synced: ${totalSynced}`)
    console.log(`   ❌ Errors: ${totalErrors}`)
    console.log(`   📁 Total tables processed: ${tablesResult.rows.length}`)
    console.log('')
    console.log('🎉 Sync completed!')

  } catch (error) {
    console.log(`❌ Sync failed: ${error.message}`)
    console.log('')
    console.log('🔧 Troubleshooting tips:')
    console.log('• Verify both cloud and local database connections')
    console.log('• Check database permissions')
    console.log('• Ensure network connectivity to cloud database')
    console.log('• Check if local PostgreSQL is running')
    
  } finally {
    // Cleanup connections
    if (cloudClient) {
      try {
        cloudClient.release()
      } catch (e) {
        // Ignore
      }
    }
    if (localClient) {
      try {
        localClient.release()
      } catch (e) {
        // Ignore
      }
    }
    
    try {
      await cloudPool.end()
      await localPool.end()
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Run the sync
syncCloudToLocal()

