#!/usr/bin/env node

/**
 * Test sync setup before running actual sync
 * Verifies both cloud and local database connections
 * 
 * Usage: node test-sync-setup.js
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function testSetup() {
  console.log('🧪 Testing Sync Setup')
  console.log('=====================')
  console.log('')

  let passed = 0
  let failed = 0

  // Test 1: Check environment variables
  console.log('1️⃣  Checking environment variables...')
  const cloudUrl = process.env.DATABASE_URL_CLOUD
  const localUrl = process.env.DATABASE_URL || 'postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard'

  if (!cloudUrl) {
    console.log('   ❌ DATABASE_URL_CLOUD not found in .env.local')
    failed++
  } else {
    console.log('   ✅ DATABASE_URL_CLOUD configured')
    console.log(`      ${cloudUrl.replace(/:[^:@]+@/, ':***@')}`)
    passed++
  }

  console.log(`   ℹ️  DATABASE_URL (local): ${localUrl.replace(/:[^:@]+@/, ':***@')}`)
  console.log('')

  if (!cloudUrl) {
    console.log('⚠️  Cannot proceed without DATABASE_URL_CLOUD')
    return
  }

  // Test 2: Connect to cloud database
  console.log('2️⃣  Testing cloud database connection...')
  const cloudPool = new Pool({
    connectionString: cloudUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
  })

  try {
    const startTime = Date.now()
    const cloudClient = await cloudPool.connect()
    const duration = Date.now() - startTime

    const result = await cloudClient.query('SELECT current_database() as db, current_user as user, version() as version')
    const info = result.rows[0]

    console.log(`   ✅ Connected successfully (${(duration / 1000).toFixed(2)}s)`)
    console.log(`      Database: ${info.db}`)
    console.log(`      User: ${info.user}`)
    console.log(`      Version: ${info.version.split(',')[0]}`)

    // Get table count
    const tablesResult = await cloudClient.query(`
      SELECT COUNT(*) as count 
      FROM pg_tables 
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    `)
    console.log(`      Tables: ${tablesResult.rows[0].count}`)

    cloudClient.release()
    await cloudPool.end()
    passed++
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`)
    failed++
    try {
      await cloudPool.end()
    } catch (e) {
      // Ignore
    }
  }
  console.log('')

  // Test 3: Connect to local database
  console.log('3️⃣  Testing local database connection...')
  const localPool = new Pool({
    connectionString: localUrl,
    ssl: false,
    connectionTimeoutMillis: 10000
  })

  try {
    const startTime = Date.now()
    const localClient = await localPool.connect()
    const duration = Date.now() - startTime

    const result = await localClient.query('SELECT current_database() as db, current_user as user, version() as version')
    const info = result.rows[0]

    console.log(`   ✅ Connected successfully (${(duration / 1000).toFixed(2)}s)`)
    console.log(`      Database: ${info.db}`)
    console.log(`      User: ${info.user}`)
    console.log(`      Version: ${info.version.split(',')[0]}`)

    // Get table count
    const tablesResult = await localClient.query(`
      SELECT COUNT(*) as count 
      FROM pg_tables 
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    `)
    console.log(`      Tables: ${tablesResult.rows[0].count}`)

    // Check write permissions
    try {
      await localClient.query('CREATE TEMP TABLE test_write_permission (id int)')
      await localClient.query('DROP TABLE test_write_permission')
      console.log(`      ✅ Write permissions verified`)
    } catch (error) {
      console.log(`      ⚠️  Write permission issue: ${error.message}`)
    }

    localClient.release()
    await localPool.end()
    passed++
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`)
    console.log(`      Make sure PostgreSQL is running locally`)
    console.log(`      Docker: docker-compose up -d`)
    console.log(`      Or check if service is running`)
    failed++
    try {
      await localPool.end()
    } catch (e) {
      // Ignore
    }
  }
  console.log('')

  // Test 4: Check Node.js modules
  console.log('4️⃣  Checking required Node.js modules...')
  try {
    require('pg')
    console.log('   ✅ pg module installed')
    passed++
  } catch (error) {
    console.log('   ❌ pg module not installed')
    console.log('      Run: npm install pg')
    failed++
  }
  console.log('')

  // Summary
  console.log('📊 Test Summary')
  console.log('═'.repeat(50))
  console.log(`   ✅ Passed: ${passed}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log('')

  if (failed === 0) {
    console.log('🎉 All tests passed! Ready to sync.')
    console.log('')
    console.log('Next steps:')
    console.log('   • Run: node sync-cloud-to-local.js (basic sync)')
    console.log('   • Or:  node sync-cloud-to-local-advanced.js (advanced sync)')
    console.log('   • Or:  .\\sync-cloud-to-local.bat (Windows menu)')
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues above.')
    console.log('')
    console.log('Common solutions:')
    console.log('   • Add DATABASE_URL_CLOUD to .env.local')
    console.log('   • Start PostgreSQL: docker-compose up -d')
    console.log('   • Install dependencies: npm install pg dotenv')
  }
}

// Run tests
testSetup()

