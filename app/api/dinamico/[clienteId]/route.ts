import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { clienteId: string } }
) {
  try {
    const { clienteId } = params

    console.log('🔍 Fetching dynamic data for cliente:', clienteId)

    // Fetch all dynamic data for the client
    const result = await query(
      `SELECT section_id, data_type, data_key, data_value, updated_at 
       FROM tb_dinamico 
       WHERE cliente_id = $1 
       ORDER BY section_id, data_type, data_key`,
      [clienteId]
    )

    if (result.rows.length === 0) {
      console.log('⚠️ No dynamic data found for cliente:', clienteId)
      return NextResponse.json(
        { success: false, message: 'No dynamic data found for this client' },
        { status: 404 }
      )
    }

    // Reconstruct the JSON structure from database rows
    const dynamicData: {
      pageConfig: any;
      sections: any[];
      config: any;
    } = {
      pageConfig: {},
      sections: [],
      config: {}
    }

    // Group data by section
    const sectionsMap = new Map<string, any>()

    for (const row of result.rows) {
      const { section_id, data_type, data_key, data_value } = row

      if (data_type === 'pageConfig') {
        dynamicData.pageConfig = { ...dynamicData.pageConfig, ...data_value }
      } else if (data_type === 'config') {
        dynamicData.config = { ...dynamicData.config, ...data_value }
      } else if (data_type === 'section') {
        if (!sectionsMap.has(section_id)) {
          sectionsMap.set(section_id, { id: section_id, metrics: [], charts: [] })
        }
        const section = sectionsMap.get(section_id)
        if (data_key === 'info') {
          section.title = data_value.title
          section.description = data_value.description
          section.lastUpdated = data_value.lastUpdated
        } else if (data_key === 'layout') {
          section.layout = data_value
        }
      } else if (data_type === 'metric') {
        if (!sectionsMap.has(section_id)) {
          sectionsMap.set(section_id, { id: section_id, metrics: [], charts: [] })
        }
        const section = sectionsMap.get(section_id)
        section.metrics.push(data_value)
      } else if (data_type === 'chart') {
        if (!sectionsMap.has(section_id)) {
          sectionsMap.set(section_id, { id: section_id, metrics: [], charts: [] })
        }
        const section = sectionsMap.get(section_id)
        section.charts.push(data_value)
      }
    }

    // Convert sections map to array
    dynamicData.sections = Array.from(sectionsMap.values())

    console.log('✅ Dynamic data fetched successfully:', {
      clienteId,
      sectionsCount: dynamicData.sections.length,
      totalRows: result.rows.length
    })

    return NextResponse.json({
      success: true,
      data: dynamicData,
      meta: {
        clienteId,
        sectionsCount: dynamicData.sections.length,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Error fetching dynamic data:', error)
    return NextResponse.json(
      { success: false, message: 'Error fetching dynamic data', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Update dynamic data
export async function PUT(
  request: NextRequest,
  { params }: { params: { clienteId: string } }
) {
  try {
    const { clienteId } = params
    const body = await request.json()

    console.log('🔄 Updating dynamic data for cliente:', clienteId)

    // This would be used to update dynamic data
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Dynamic data update endpoint ready',
      clienteId
    })

  } catch (error) {
    console.error('❌ Error updating dynamic data:', error)
    return NextResponse.json(
      { success: false, message: 'Error updating dynamic data' },
      { status: 500 }
    )
  }
}
