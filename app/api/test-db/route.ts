import { NextRequest, NextResponse } from 'next/server'
import { testConnection, query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing database connection...')

    // Test basic connection
    const isConnected = await testConnection()
    
    if (!isConnected) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Test tb_dinamico table
    const result = await query(
      'SELECT COUNT(*) as total, COUNT(DISTINCT cliente_id) as clients FROM tb_dinamico'
    )

    const stats = result.rows[0]

    // Get sample data
    const sampleResult = await query(
      'SELECT cliente_id, section_id, data_type, data_key FROM tb_dinamico LIMIT 5'
    )

    console.log('✅ Database test successful:', stats)

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connection: 'OK',
        tableStats: stats,
        sampleData: sampleResult.rows
      }
    })

  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database test failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
