#!/usr/bin/env node

/**
 * Test cloud PostgreSQL database connection using DATABASE_URL_CLOUD from .env.local
 * Usage: 
 *   node test-cloud-env.js                    # Console output only
 *   node test-cloud-env.js --export           # Console + export to files
 *   node test-cloud-env.js -e                 # Console + export to files (short)
 * 
 * Exports:
 *   - database-structure-{timestamp}.txt      # Human-readable text format
 *   - database-structure-{timestamp}.json     # Structured JSON format
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Export functionality
let exportData = {
  timestamp: new Date().toISOString(),
  database: {},
  schemas: [],
  tables: [],
  views: [],
  functions: [],
  indexes: [],
  constraints: [],
  sequences: [],
  triggers: []
}

let consoleOutput = []

function logToBoth(message) {
  console.log(message)
  consoleOutput.push(message)
}

// Database structure analysis functions
async function showDatabaseStructure(client, exportToFile = false) {
  if (exportToFile) {
    logToBoth('🏗️  Database Structure Analysis')
    logToBoth('================================')
    logToBoth('')
  } else {
    console.log('🏗️  Database Structure Analysis')
    console.log('================================')
    console.log('')
  }
  
  // Show all schemas first
  await showAllSchemas(client, exportToFile)
  
  // Show all tables with details
  await showTablesStructure(client, exportToFile)
  
  // Show views
  await showViewsStructure(client, exportToFile)
  
  // Show functions and procedures
  await showFunctionsStructure(client, exportToFile)
  
  // Show indexes
  await showIndexesStructure(client, exportToFile)
  
  // Show constraints
  await showConstraintsStructure(client, exportToFile)
  
  // Show sequences
  await showSequencesStructure(client, exportToFile)
  
  // Show triggers
  await showTriggersStructure(client, exportToFile)
}

async function exportToFiles() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  
  // Export to TXT file
  const txtContent = consoleOutput.join('\n')
  const txtFilename = `database-structure-${timestamp}.txt`
  fs.writeFileSync(txtFilename, txtContent, 'utf8')
  logToBoth(`📄 Exported to: ${txtFilename}`)
  
  // Export to JSON file
  const jsonFilename = `database-structure-${timestamp}.json`
  fs.writeFileSync(jsonFilename, JSON.stringify(exportData, null, 2), 'utf8')
  logToBoth(`📄 Exported to: ${jsonFilename}`)
  
  logToBoth('')
}

async function showAllSchemas(client, exportToFile = false) {
  if (exportToFile) {
    logToBoth('🗂️  All Database Schemas:')
    logToBoth('-------------------------')
  } else {
    console.log('🗂️  All Database Schemas:')
    console.log('-------------------------')
  }
  
  const schemasResult = await client.query(`
    SELECT 
      schema_name,
      schema_owner,
      CASE 
        WHEN schema_name = 'information_schema' THEN 'System'
        WHEN schema_name = 'pg_catalog' THEN 'System'
        WHEN schema_name = 'pg_toast' THEN 'System'
        WHEN schema_name = 'postgres' THEN 'PostgreSQL Default'
        WHEN schema_name = 'pg_temp_1' THEN 'Temporary'
        WHEN schema_name = 'pg_toast_temp_1' THEN 'Temporary'
        ELSE 'User'
      END as schema_type
    FROM information_schema.schemata
    ORDER BY 
      CASE 
        WHEN schema_name = 'public' THEN 1
        WHEN schema_name = 'postgres' THEN 2
        WHEN schema_name LIKE 'pg_%' THEN 4
        ELSE 3
      END,
      schema_name
  `)
  
  if (schemasResult.rows.length === 0) {
    if (exportToFile) {
      logToBoth('   No schemas found')
      logToBoth('')
    } else {
      console.log('   No schemas found')
      console.log('')
    }
    return
  }
  
  for (const schema of schemasResult.rows) {
    const typeIcon = schema.schema_type === 'System' ? '🔧' : 
                    schema.schema_type === 'Temporary' ? '⏰' : 
                    schema.schema_type === 'PostgreSQL Default' ? '🐘' : '👤'
    
    if (exportToFile) {
      logToBoth(`   ${typeIcon} ${schema.schema_name}`)
      logToBoth(`      Owner: ${schema.schema_owner}`)
      logToBoth(`      Type: ${schema.schema_type}`)
    } else {
      console.log(`   ${typeIcon} ${schema.schema_name}`)
      console.log(`      Owner: ${schema.schema_owner}`)
      console.log(`      Type: ${schema.schema_type}`)
    }
    
    // Count objects in each schema
    try {
      const countsResult = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${schema.schema_name}') as tables,
          (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = '${schema.schema_name}') as views,
          (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = '${schema.schema_name}') as functions,
          (SELECT COUNT(*) FROM information_schema.sequences WHERE sequence_schema = '${schema.schema_name}') as sequences
      `)
      
      const counts = countsResult.rows[0]
      const schemaType = schema.schema_name === 'postgres' ? ' (PostgreSQL default)' : ''
      
      // Add to export data
      exportData.schemas.push({
        name: schema.schema_name,
        owner: schema.schema_owner,
        type: schema.schema_type,
        objects: {
          tables: counts.tables,
          views: counts.views,
          functions: counts.functions,
          sequences: counts.sequences
        }
      })
      
      if (exportToFile) {
        logToBoth(`      Objects: ${counts.tables} tables, ${counts.views} views, ${counts.functions} functions, ${counts.sequences} sequences${schemaType}`)
      } else {
        console.log(`      Objects: ${counts.tables} tables, ${counts.views} views, ${counts.functions} functions, ${counts.sequences} sequences${schemaType}`)
      }
    } catch (error) {
      if (exportToFile) {
        logToBoth(`      Objects: Error counting - ${error.message}`)
      } else {
        console.log(`      Objects: Error counting - ${error.message}`)
      }
    }
    
    if (exportToFile) {
      logToBoth('')
    } else {
      console.log('')
    }
  }
}

async function showTablesStructure(client) {
  console.log('📋 Tables Structure (User Schemas + postgres):')
  console.log('----------------------------------------------')
  
  const tablesResult = await client.query(`
    SELECT 
      schemaname,
      tablename,
      tableowner,
      hasindexes,
      hasrules,
      hastriggers,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
    FROM pg_tables 
    WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    ORDER BY schemaname, pg_total_relation_size(schemaname||'.'||tablename) DESC
  `)
  
  if (tablesResult.rows.length === 0) {
    console.log('   No tables found in user schemas (including postgres schema)')
    console.log('')
    return
  }
  
  let currentSchema = ''
  for (const table of tablesResult.rows) {
    if (currentSchema !== table.schemaname) {
      currentSchema = table.schemaname
      console.log(`   📁 Schema: ${table.schemaname}`)
    }
    
    console.log(`      📊 ${table.tablename}`)
    console.log(`         Owner: ${table.tableowner}`)
    console.log(`         Size: ${table.size}`)
    console.log(`         Indexes: ${table.hasindexes ? 'Yes' : 'No'}`)
    console.log(`         Rules: ${table.hasrules ? 'Yes' : 'No'}`)
    console.log(`         Triggers: ${table.hastriggers ? 'Yes' : 'No'}`)
    
    // Show columns for this table
    const columnsResult = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns 
      WHERE table_schema = '${table.schemaname}' 
        AND table_name = '${table.tablename}'
      ORDER BY ordinal_position
    `)
    
    if (columnsResult.rows.length > 0) {
      console.log(`      Columns:`)
      columnsResult.rows.forEach(col => {
        let typeInfo = col.data_type
        if (col.character_maximum_length) {
          typeInfo += `(${col.character_maximum_length})`
        } else if (col.numeric_precision) {
          typeInfo += `(${col.numeric_precision}`
          if (col.numeric_scale) typeInfo += `,${col.numeric_scale}`
          typeInfo += `)`
        }
        
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : ''
        console.log(`        - ${col.column_name}: ${typeInfo} ${nullable}${defaultVal}`)
      })
    }
    
    // Show row count
    try {
      const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.schemaname}.${table.tablename}`)
      console.log(`         Rows: ${countResult.rows[0].count}`)
    } catch (error) {
      console.log(`         Rows: Error - ${error.message}`)
    }
    
    console.log('')
  }
}

async function showViewsStructure(client) {
  console.log('👁️  Views Structure (All Schemas):')
  console.log('-----------------------------------')
  
  const viewsResult = await client.query(`
    SELECT 
      schemaname,
      viewname,
      viewowner,
      definition
    FROM pg_views 
    WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    ORDER BY schemaname, viewname
  `)
  
  if (viewsResult.rows.length === 0) {
    console.log('   No views found in user schemas')
    console.log('')
    return
  }
  
  let currentSchema = ''
  viewsResult.rows.forEach(view => {
    if (currentSchema !== view.schemaname) {
      currentSchema = view.schemaname
      console.log(`   📁 Schema: ${view.schemaname}`)
    }
    
    console.log(`      📺 ${view.viewname}`)
    console.log(`         Owner: ${view.viewowner}`)
    console.log(`         Definition: ${view.definition.substring(0, 100)}${view.definition.length > 100 ? '...' : ''}`)
    console.log('')
  })
}

async function showFunctionsStructure(client) {
  console.log('⚙️  Functions & Procedures:')
  console.log('--------------------------')
  
  const functionsResult = await client.query(`
    SELECT 
      routine_name,
      routine_type,
      data_type as return_type,
      routine_definition
    FROM information_schema.routines 
    WHERE routine_schema = 'public'
    ORDER BY routine_name
  `)
  
  if (functionsResult.rows.length === 0) {
    console.log('   No functions found')
    console.log('')
    return
  }
  
  functionsResult.rows.forEach(func => {
    console.log(`   🔧 ${func.routine_name}`)
    console.log(`      Type: ${func.routine_type}`)
    console.log(`      Returns: ${func.return_type}`)
    if (func.routine_definition) {
      console.log(`      Definition: ${func.routine_definition.substring(0, 100)}${func.routine_definition.length > 100 ? '...' : ''}`)
    }
    console.log('')
  })
}

async function showIndexesStructure(client) {
  console.log('🔍 Indexes Structure:')
  console.log('--------------------')
  
  const indexesResult = await client.query(`
    SELECT 
      schemaname,
      tablename,
      indexname,
      indexdef
    FROM pg_indexes 
    WHERE schemaname = 'public'
    ORDER BY tablename, indexname
  `)
  
  if (indexesResult.rows.length === 0) {
    console.log('   No indexes found')
    console.log('')
    return
  }
  
  let currentTable = ''
  indexesResult.rows.forEach(index => {
    if (currentTable !== index.tablename) {
      currentTable = index.tablename
      console.log(`   📊 Table: ${index.tablename}`)
    }
    console.log(`      🔍 ${index.indexname}`)
    console.log(`         ${index.indexdef}`)
  })
  console.log('')
}

async function showConstraintsStructure(client) {
  console.log('🔗 Constraints Structure:')
  console.log('-------------------------')
  
  const constraintsResult = await client.query(`
    SELECT 
      tc.table_name,
      tc.constraint_name,
      tc.constraint_type,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc 
    LEFT JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.table_schema = 'public'
    ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name
  `)
  
  if (constraintsResult.rows.length === 0) {
    console.log('   No constraints found')
    console.log('')
    return
  }
  
  let currentTable = ''
  constraintsResult.rows.forEach(constraint => {
    if (currentTable !== constraint.table_name) {
      currentTable = constraint.table_name
      console.log(`   📊 Table: ${constraint.table_name}`)
    }
    
    let constraintInfo = `      🔗 ${constraint.constraint_name} (${constraint.constraint_type})`
    if (constraint.column_name) {
      constraintInfo += ` on ${constraint.column_name}`
    }
    if (constraint.foreign_table_name) {
      constraintInfo += ` → ${constraint.foreign_table_name}.${constraint.foreign_column_name}`
    }
    console.log(constraintInfo)
  })
  console.log('')
}

async function showSequencesStructure(client) {
  console.log('🔢 Sequences Structure:')
  console.log('----------------------')
  
  const sequencesResult = await client.query(`
    SELECT 
      sequence_name,
      data_type,
      start_value,
      minimum_value,
      maximum_value,
      increment,
      cycle_option
    FROM information_schema.sequences 
    WHERE sequence_schema = 'public'
    ORDER BY sequence_name
  `)
  
  if (sequencesResult.rows.length === 0) {
    console.log('   No sequences found')
    console.log('')
    return
  }
  
  sequencesResult.rows.forEach(seq => {
    console.log(`   🔢 ${seq.sequence_name}`)
    console.log(`      Type: ${seq.data_type}`)
    console.log(`      Start: ${seq.start_value}`)
    console.log(`      Min: ${seq.minimum_value}`)
    console.log(`      Max: ${seq.maximum_value}`)
    console.log(`      Increment: ${seq.increment}`)
    console.log(`      Cycle: ${seq.cycle_option}`)
    console.log('')
  })
}

async function showTriggersStructure(client) {
  console.log('⚡ Triggers Structure:')
  console.log('--------------------')
  
  const triggersResult = await client.query(`
    SELECT 
      trigger_name,
      event_manipulation,
      event_object_table,
      action_timing,
      action_statement
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name
  `)
  
  if (triggersResult.rows.length === 0) {
    console.log('   No triggers found')
    console.log('')
    return
  }
  
  let currentTable = ''
  triggersResult.rows.forEach(trigger => {
    if (currentTable !== trigger.event_object_table) {
      currentTable = trigger.event_object_table
      console.log(`   📊 Table: ${trigger.event_object_table}`)
    }
    console.log(`      ⚡ ${trigger.trigger_name}`)
    console.log(`         Event: ${trigger.event_manipulation}`)
    console.log(`         Timing: ${trigger.action_timing}`)
    console.log(`         Action: ${trigger.action_statement}`)
  })
  console.log('')
}

async function testCloudDatabaseFromEnv(exportToFile = false) {
  if (exportToFile) {
    logToBoth('☁️ Cloud PostgreSQL Database Tester (from .env.local)')
    logToBoth('====================================================')
    logToBoth('')
  } else {
    console.log('☁️ Cloud PostgreSQL Database Tester (from .env.local)')
    console.log('====================================================')
    console.log('')
  }
  
  const connectionString = process.env.DATABASE_URL_CLOUD
  
  if (!connectionString) {
    if (exportToFile) {
      logToBoth('❌ DATABASE_URL_CLOUD not found in .env.local file.')
      logToBoth('')
      logToBoth('Please add to your .env.local file:')
      logToBoth('DATABASE_URL_CLOUD="postgresql://user:pass@host:5432/db?sslmode=require"')
      logToBoth('')
    } else {
      console.log('❌ DATABASE_URL_CLOUD not found in .env.local file.')
      console.log('')
      console.log('Please add to your .env.local file:')
      console.log('DATABASE_URL_CLOUD="postgresql://user:pass@host:5432/db?sslmode=require"')
      console.log('')
    }
    return
  }
  
  if (exportToFile) {
    logToBoth('📡 Using DATABASE_URL_CLOUD from .env.local')
    logToBoth('🔗 Connection string: ' + connectionString.replace(/:[^:@]+@/, ':***@'))
    logToBoth('')
  } else {
    console.log('📡 Using DATABASE_URL_CLOUD from .env.local')
    console.log('🔗 Connection string:', connectionString.replace(/:[^:@]+@/, ':***@'))
    console.log('')
  }
  
  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    query_timeout: 15000
  })

  try {
    console.log('🔄 Connecting to cloud database...')
    const start = Date.now()
    const client = await pool.connect()
    const duration = Date.now() - start
    
    console.log(`✅ Connection successful! (${(duration/1000).toFixed(2)} seconds)`)
    console.log('')
    
    // Get basic database info
    console.log('📊 Database Information:')
    const dbInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as version,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port,
        pg_size_pretty(pg_database_size(current_database())) as database_size
    `)
    
    const info = dbInfo.rows[0]
    
    // Populate database info for export
    exportData.database = {
      name: info.database_name,
      user: info.current_user,
      server: `${info.server_ip}:${info.server_port}`,
      version: info.version.split(',')[0],
      size: info.database_size,
      current_time: new Date().toISOString()
    }
    
    if (exportToFile) {
      logToBoth(`   Database: ${info.database_name}`)
      logToBoth(`   User: ${info.current_user}`)
      logToBoth(`   Server: ${info.server_ip}:${info.server_port}`)
      logToBoth(`   Version: ${info.version.split(',')[0]}`)
      logToBoth(`   Size: ${info.database_size}`)
      logToBoth(`   Current time: ${new Date().toISOString()}`)
      logToBoth('')
    } else {
      console.log(`   Database: ${info.database_name}`)
      console.log(`   User: ${info.current_user}`)
      console.log(`   Server: ${info.server_ip}:${info.server_port}`)
      console.log(`   Version: ${info.version.split(',')[0]}`)
      console.log(`   Size: ${info.database_size}`)
      console.log(`   Current time: ${new Date().toISOString()}`)
      console.log('')
    }

    // Check for Buffalo AI specific tables
    console.log('🎯 Buffalo AI Tables Check:')
    const buffaloTables = ['usuarios', 'clientes', 'tb_dinamico', 'metricas', 'funcionalidades']
    
    for (const tableName of buffaloTables) {
      try {
        const existsResult = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = '${tableName}'
          ) as exists
        `)
        
        if (existsResult.rows[0].exists) {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`)
          console.log(`   ✅ ${tableName}: ${countResult.rows[0].count} rows`)
        } else {
          console.log(`   ❌ ${tableName}: Not found`)
        }
      } catch (error) {
        console.log(`   ⚠️  ${tableName}: Error - ${error.message}`)
      }
    }
    console.log('')

    // Test a simple query
    console.log('🔍 Testing basic query...')
    const testResult = await client.query('SELECT NOW() as current_time, 1+1 as test_calculation')
    console.log(`   Current time: ${testResult.rows[0].current_time}`)
    console.log(`   Test calculation: ${testResult.rows[0].test_calculation}`)
    console.log('')

    // Check what database we're connected to and list all databases
    console.log('🔍 Database Connection Details...')
    try {
      const dbInfo = await client.query(`
        SELECT 
          current_database() as current_db,
          current_user as current_user,
          inet_server_addr() as server_ip,
          inet_server_port() as server_port
      `)
      
      console.log(`   Current database: ${dbInfo.rows[0].current_db}`)
      console.log(`   Connected as: ${dbInfo.rows[0].current_user}`)
      console.log(`   Server: ${dbInfo.rows[0].server_ip}:${dbInfo.rows[0].server_port}`)
      
      // List all available databases
      const allDbs = await client.query(`
        SELECT datname, pg_size_pretty(pg_database_size(datname)) as size
        FROM pg_database 
        WHERE datistemplate = false
        ORDER BY datname
      `)
      
      console.log(`   Available databases:`)
      allDbs.rows.forEach(db => {
        const isCurrent = db.datname === dbInfo.rows[0].current_db ? ' (CURRENT)' : ''
        console.log(`     - ${db.datname}${isCurrent} (${db.size})`)
      })
    } catch (error) {
      console.log(`   ⚠️  Error getting database info: ${error.message}`)
    }
    console.log('')

    // Check specifically for the crear_kpis table mentioned in the image
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
      } else {
        console.log(`   ❌ crear_kpis table not found in any schema`)
      }
    } catch (error) {
      console.log(`   ⚠️  Error checking crear_kpis table: ${error.message}`)
    }
    console.log('')

    // Show comprehensive database structure
    await showDatabaseStructure(client, exportToFile)

    client.release()
    await pool.end()
    
    if (exportToFile) {
      logToBoth('🎉 Cloud database test complete!')
      logToBoth('')
      logToBoth('📝 Summary:')
      logToBoth('   ✅ Connection successful')
      logToBoth('   ✅ Database accessible')
      logToBoth('   ✅ Basic queries working')
      logToBoth('   ✅ Database structure analyzed')
      logToBoth('')
      logToBoth('💡 Next steps:')
      logToBoth('   1. If any Buffalo AI tables are missing, run the database setup script')
      logToBoth('   2. Your application can now use this cloud database')
      logToBoth('   3. Update your main DATABASE_URL to use this connection if needed')
      logToBoth('   4. Review the database structure to understand the current schema')
      
      // Export to files
      await exportToFiles()
    } else {
      console.log('🎉 Cloud database test complete!')
      console.log('')
      console.log('📝 Summary:')
      console.log('   ✅ Connection successful')
      console.log('   ✅ Database accessible')
      console.log('   ✅ Basic queries working')
      console.log('   ✅ Database structure analyzed')
      console.log('')
      console.log('💡 Next steps:')
      console.log('   1. If any Buffalo AI tables are missing, run the database setup script')
      console.log('   2. Your application can now use this cloud database')
      console.log('   3. Update your main DATABASE_URL to use this connection if needed')
      console.log('   4. Review the database structure to understand the current schema')
    }
    
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`)
    console.log('')
    console.log('🔧 Troubleshooting tips:')
    console.log('• Check your .env.local file has DATABASE_URL_CLOUD set correctly')
    console.log('• Verify database credentials in the connection string')
    console.log('• Ensure SSL is properly configured')
    console.log('• Check network connectivity')
    console.log('• Verify database permissions')
    console.log('• Make sure the database exists and is running')
    
    try {
      await pool.end()
    } catch (endError) {
      // Ignore cleanup errors
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const exportToFile = args.includes('--export') || args.includes('-e')

// Run the test
testCloudDatabaseFromEnv(exportToFile)
