#!/usr/bin/env node

/**
 * Update DATABASE_URL_CLOUD with the specific IP address 89.117.57.168
 */

const fs = require('fs')
const path = require('path')

async function updateEnvWithIP() {
  console.log('🔧 Updating DATABASE_URL_CLOUD with IP 89.117.57.168')
  console.log('=====================================================')
  console.log('')

  const envPath = path.join(process.cwd(), '.env.local')
  
  // Check if .env.local exists
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found')
    return
  }

  let envContent = fs.readFileSync(envPath, 'utf8')
  console.log('✅ Found .env.local file')
  console.log('')

  // Show current DATABASE_URL_CLOUD if it exists
  const currentMatch = envContent.match(/^DATABASE_URL_CLOUD=(.*)$/m)
  if (currentMatch) {
    console.log('Current DATABASE_URL_CLOUD:')
    console.log(`   ${currentMatch[1].replace(/:[^:@]+@/, ':***@')}`)
    console.log('')
  }

  // Create new connection string with the IP
  const newConnectionString = 'postgresql://username:password@89.117.57.168:5432/database?sslmode=require'
  
  console.log('New DATABASE_URL_CLOUD will be:')
  console.log(`   ${newConnectionString.replace(/:[^:@]+@/, ':***@')}`)
  console.log('')
  console.log('⚠️  Note: You need to replace the placeholder values:')
  console.log('   - username: your actual database username')
  console.log('   - password: your actual database password')
  console.log('   - database: your actual database name')
  console.log('')

  // Update the content
  let updatedContent = envContent

  // Remove existing DATABASE_URL_CLOUD if it exists
  updatedContent = updatedContent.replace(/^DATABASE_URL_CLOUD=.*$/m, '')

  // Add the new DATABASE_URL_CLOUD
  if (updatedContent.trim() && !updatedContent.endsWith('\n')) {
    updatedContent += '\n'
  }
  updatedContent += `DATABASE_URL_CLOUD=${newConnectionString}\n`

  // Write updated .env.local
  try {
    fs.writeFileSync(envPath, updatedContent)
    console.log('✅ Updated DATABASE_URL_CLOUD in .env.local file')
    console.log('')
    console.log('📝 Next steps:')
    console.log('1. Edit .env.local and replace the placeholder values:')
    console.log('   - username: your actual database username')
    console.log('   - password: your actual database password') 
    console.log('   - database: your actual database name')
    console.log('')
    console.log('2. Then run: node test-cloud-postgres.js')
    
  } catch (error) {
    console.log(`❌ Error writing .env.local file: ${error.message}`)
  }
}

// Run the update
updateEnvWithIP().catch(console.error)
