#!/usr/bin/env node

/**
 * Update DATABASE_url_cloud with the specific IP address
 */

const fs = require('fs')
const path = require('path')

async function updateEnvWithIP() {
  console.log('🔧 Updating .env.local with IP 89.117.57.168')
  console.log('==============================================')
  console.log('')

  const envPath = path.join(process.cwd(), '.env.local')
  
  // Check if .env.local exists
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found')
    console.log('Please create the file manually or run setup-cloud-env.js first')
    return
  }

  let envContent = fs.readFileSync(envPath, 'utf8')
  console.log('✅ Found .env.local file')
  console.log('')

  // Show current DATABASE_url_cloud if it exists
  const currentMatch = envContent.match(/^DATABASE_url_cloud=(.*)$/m)
  if (currentMatch) {
    console.log('Current DATABASE_url_cloud:')
    console.log(`   ${currentMatch[1].replace(/:[^:@]+@/, ':***@')}`)
    console.log('')
  }

  // Create new connection string with the IP
  const newConnectionString = 'postgresql://username:password@89.117.57.168:5432/database?sslmode=require'
  
  console.log('New DATABASE_url_cloud will be:')
  console.log(`   ${newConnectionString.replace(/:[^:@]+@/, ':***@')}`)
  console.log('')
  console.log('⚠️  Note: You need to replace "username" and "password" with your actual credentials')
  console.log('⚠️  Also replace "database" with your actual database name')
  console.log('')

  // Update the content
  let updatedContent = envContent

  // Remove existing DATABASE_url_cloud if it exists
  updatedContent = updatedContent.replace(/^DATABASE_url_cloud=.*$/m, '')

  // Add the new DATABASE_url_cloud
  if (updatedContent.trim() && !updatedContent.endsWith('\n')) {
    updatedContent += '\n'
  }
  updatedContent += `DATABASE_url_cloud=${newConnectionString}\n`

  // Write updated .env.local
  try {
    fs.writeFileSync(envPath, updatedContent)
    console.log('✅ Updated .env.local file')
    console.log('')
    console.log('📝 Next steps:')
    console.log('1. Edit .env.local and replace the placeholder values:')
    console.log('   - username: your actual database username')
    console.log('2. password: your actual database password') 
    console.log('3. database: your actual database name')
    console.log('')
    console.log('4. Then run: node test-cloud-postgres.js')
    
  } catch (error) {
    console.log(`❌ Error writing .env.local file: ${error.message}`)
  }
}

// Run the update
updateEnvWithIP().catch(console.error)

