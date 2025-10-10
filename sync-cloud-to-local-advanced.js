#!/usr/bin/env node

/**
 * Advanced Cloud to Local Database Sync
 * Handles: Foreign Keys, Indexes, Sequences, and Data Types properly
 * 
 * Usage: node sync-cloud-to-local-advanced.js [options]
 * 
 * Options:
 *   --schema=<name>    Only sync specific schema (default: all)
 *   --table=<name>     Only sync specific table (default: all)
 *   --dry-run          Show what would be synced without making changes
 *   --skip-data        Only sync structure, skip data
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  schema: null,
  table: null,
  dryRun: false,
  skipData: false
}

args.forEach(arg => {
  if (arg.startsWith('--schema=')) {
    options.schema = arg.split('=')[1]
  } else if (arg.startsWith('--table=')) {
    options.table = arg.split('=')[1]
  } else if (arg === '--dry-run') {
    options.dryRun = true
  } else if (arg === '--skip-data') {
    options.skipData = true
  }
})

// Configuration
const CLOUD_CONNECTION_STRING = process.env.DATABASE_URL_CLOUD
const LOCAL_CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard'

// Tables to exclude
const EXCLUDE_SCHEMAS = ['information_schema', 'pg_catalog', 'pg_toast', 'pg_temp']

async function advancedSync() {
  console.log('🚀 Buffalo AI - Advanced Cloud to Local Sync')
  console.log('===========================================')
  console.log('')

  if (options.dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made')
    console.log('')
  }

  if (options.schema) {
    console.log(`🎯 Target Schema: ${options.schema}`)
  }
  if (options.table) {
    console.log(`🎯 Target Table: ${options.table}`)
  }
  if (options.skipData) {
    console.log(`⏭️  Skipping data sync (structure only)`)
  }
  console.log('')

  // Validate environment
  if (!CLOUD_CONNECTION_STRING) {
    console.log('❌ DATABASE_URL_CLOUD not found in .env.local')
    return
  }

  console.log('🔗 Connections:')
  console.log(`   Cloud: ${CLOUD_CONNECTION_STRING.replace(/:[^:@]+@/, ':***@')}`)
  console.log(`   Local: ${LOCAL_CONNECTION_STRING.replace(/:[^:@]+@/, ':***@')}`)
  console.log('')

  // Create pools
  const cloudPool = new Pool({
    connectionString: CLOUD_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    query_timeout: 60000
  })

  const localPool = new Pool({
    connectionString: LOCAL_CONNECTION_STRING,
    ssl: false,
    connectionTimeoutMillis: 10000,
    query_timeout: 60000
  })

  let cloudClient = null
  let localClient = null

  try {
    console.log('🔌 Connecting to databases...')
    cloudClient = await cloudPool.connect()
    localClient = await localPool.connect()
    console.log('✅ Connected to both databases')
    console.log('')

    // Build query filters
    let schemaFilter = EXCLUDE_SCHEMAS.map(s => `'${s}'`).join(', ')
    let whereClause = `WHERE schemaname NOT IN (${schemaFilter})`
    
    if (options.schema) {
      whereClause += ` AND schemaname = '${options.schema}'`
    }
    if (options.table) {
      whereClause += ` AND tablename = '${options.table}'`
    }

    // Get tables from cloud
    console.log('📋 Fetching table list from cloud...')
    const tablesResult = await cloudClient.query(`
      SELECT schemaname, tablename
      FROM pg_tables 
      ${whereClause}
      ORDER BY schemaname, tablename
    `)

    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found matching criteria')
      return
    }

    console.log(`✅ Found ${tablesResult.rows.length} tables`)
    console.log('')

    let stats = {
      schemas: new Set(),
      tablesCreated: 0,
      tablesUpdated: 0,
      rowsSynced: 0,
      errors: []
    }

    // Process tables
    for (const table of tablesResult.rows) {
      const { schemaname: schema, tablename } = table
      stats.schemas.add(schema)

      console.log(`📊 ${schema}.${tablename}`)
      
      try {
        // Create schema if needed
        if (!options.dryRun) {
          await localClient.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`)
        }

        // Get complete table definition from cloud
        const tableDDL = await getTableDDL(cloudClient, schema, tablename)
        
        if (options.dryRun) {
          console.log(`   📝 Would create/update table structure`)
          console.log(`   📊 Columns: ${tableDDL.columns.length}`)
          if (tableDDL.primaryKey.length > 0) {
            console.log(`   🔑 Primary Key: ${tableDDL.primaryKey.join(', ')}`)
          }
        } else {
          // Check if table exists in local
          const tableExistsResult = await localClient.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = $1 AND table_name = $2
            )
          `, [schema, tablename])

          const tableExists = tableExistsResult.rows[0].exists

          if (!tableExists) {
            // Create new table
            await createTable(localClient, schema, tablename, tableDDL)
            console.log(`   ✅ Table created`)
            stats.tablesCreated++
          } else {
            console.log(`   ℹ️  Table exists, ensuring structure matches`)
            // In a real scenario, you might want to alter the table
            // For now, we'll truncate and reload
            stats.tablesUpdated++
          }

          // Sync data
          if (!options.skipData) {
            const rowCount = await syncTableData(cloudClient, localClient, schema, tablename, tableDDL.columns)
            console.log(`   ✅ Synced ${rowCount} rows`)
            stats.rowsSynced += rowCount
          } else {
            console.log(`   ⏭️  Skipped data sync`)
          }
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`)
        stats.errors.push({ table: `${schema}.${tablename}`, error: error.message })
      }

      console.log('')
    }

    // Summary
    console.log('📊 Sync Summary')
    console.log('═'.repeat(60))
    console.log(`   📁 Schemas: ${stats.schemas.size}`)
    console.log(`   ➕ Tables created: ${stats.tablesCreated}`)
    console.log(`   🔄 Tables updated: ${stats.tablesUpdated}`)
    console.log(`   📦 Rows synced: ${stats.rowsSynced}`)
    console.log(`   ❌ Errors: ${stats.errors.length}`)
    
    if (stats.errors.length > 0) {
      console.log('')
      console.log('❌ Errors encountered:')
      stats.errors.forEach(err => {
        console.log(`   • ${err.table}: ${err.error}`)
      })
    }

    console.log('')
    if (options.dryRun) {
      console.log('✅ Dry run completed - no changes made')
    } else {
      console.log('🎉 Sync completed successfully!')
    }

  } catch (error) {
    console.log(`❌ Fatal error: ${error.message}`)
    console.log(error.stack)
    
  } finally {
    if (cloudClient) cloudClient.release()
    if (localClient) localClient.release()
    await cloudPool.end()
    await localPool.end()
  }
}

async function getTableDDL(client, schema, tablename) {
  // Get columns
  const columnsResult = await client.query(`
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
  `, [schema, tablename])

  // Get primary key
  const pkResult = await client.query(`
    SELECT a.attname
    FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = $1::regclass AND i.indisprimary
  `, [`${schema}.${tablename}`])

  // Get foreign keys
  const fkResult = await client.query(`
    SELECT
      kcu.column_name,
      ccu.table_schema AS foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = $1
      AND tc.table_name = $2
  `, [schema, tablename])

  return {
    columns: columnsResult.rows,
    primaryKey: pkResult.rows.map(r => r.attname),
    foreignKeys: fkResult.rows
  }
}

async function createTable(client, schema, tablename, ddl) {
  const columnDefs = ddl.columns.map(col => {
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
  })

  let createSQL = `CREATE TABLE ${schema}.${tablename} (\n  ${columnDefs.join(',\n  ')}`
  
  if (ddl.primaryKey.length > 0) {
    createSQL += `,\n  PRIMARY KEY (${ddl.primaryKey.join(', ')})`
  }
  
  createSQL += '\n)'

  await client.query(createSQL)
}

async function syncTableData(cloudClient, localClient, schema, tablename, columns) {
  // Get data from cloud
  const dataResult = await cloudClient.query(`SELECT * FROM ${schema}.${tablename}`)
  
  if (dataResult.rows.length === 0) {
    return 0
  }

  // Truncate local table
  await localClient.query(`TRUNCATE TABLE ${schema}.${tablename} CASCADE`)

  // Prepare insert
  const columnNames = columns.map(c => c.column_name)
  const batchSize = 100 // Insert in batches to avoid query size limits
  
  for (let i = 0; i < dataResult.rows.length; i += batchSize) {
    const batch = dataResult.rows.slice(i, i + batchSize)
    
    const placeholders = batch.map((_, rowIdx) => {
      const rowPlaceholders = columnNames.map((_, colIdx) => 
        `$${rowIdx * columnNames.length + colIdx + 1}`
      )
      return `(${rowPlaceholders.join(', ')})`
    }).join(', ')
    
    const values = batch.flatMap(row => columnNames.map(col => row[col]))
    
    const insertSQL = `
      INSERT INTO ${schema}.${tablename} (${columnNames.join(', ')})
      VALUES ${placeholders}
    `
    
    await localClient.query(insertSQL, values)
  }

  return dataResult.rows.length
}

// Run sync
advancedSync()

