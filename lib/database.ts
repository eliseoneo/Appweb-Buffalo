import { Pool } from 'pg'

// Database connection pool
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Increased to 10 seconds
    })

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }

  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  const start = Date.now()
  
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('🔍 Database query executed', { text: text.substring(0, 100), duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('❌ Database query error:', error)
    throw error
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()')
    console.log('✅ Database connection successful:', result.rows[0])
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}
