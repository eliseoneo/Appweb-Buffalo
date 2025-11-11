import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId') || '13' // Default to cliente 13 for n8n-dashboard
    
    // Prefer explicit mapping on clientes.tabla_cliente
    await query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tabla_cliente VARCHAR(250)`)
    const tRes = await query(`SELECT tabla_cliente FROM clientes WHERE id = $1`, [clienteId])
    let tableName: string | null = tRes.rows?.[0]?.tabla_cliente || null

    if (!tableName) {
      // Discover candidate tables
      const tablesResult = await query(`
        SELECT DISTINCT c1.table_name
        FROM information_schema.columns c1
        WHERE c1.table_schema = 'public'
          AND c1.column_name = 'cliente_id'
          AND EXISTS (
            SELECT 1
            FROM information_schema.columns c2
            WHERE c2.table_schema = 'public'
              AND c2.table_name = c1.table_name
              AND c2.column_name = 'payload'
              AND c2.data_type = 'jsonb'
          )
        ORDER BY c1.table_name
      `)
      
      // Check each table to find one with data for this client
      for (const row of tablesResult.rows) {
        try {
          const checkResult = await query(`
            SELECT COUNT(*) as count
            FROM ${row.table_name}
            WHERE cliente_id = $1
          `, [clienteId])
          
          if (parseInt(checkResult.rows[0].count) > 0) {
            tableName = row.table_name
            // Persist mapping for faster future lookups
            try {
              await query(`UPDATE clientes SET tabla_cliente = $1 WHERE id = $2`, [tableName, clienteId])
            } catch {}
            break
          }
        } catch (e) {
          // Table might not exist or have wrong structure, continue
          continue
        }
      }
    }
    
    if (!tableName) {
      return NextResponse.json({ error: 'No data found for client' }, { status: 404 })
    }
    
    // Get data from the table
    const dataResult = await query(`
      SELECT payload
      FROM ${tableName}
      WHERE cliente_id = $1
    `, [clienteId])
    
    if (dataResult.rows.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 })
    }
    
    // Aggregate data from all records
    let totalCalls = 0
    let totalTime = 0
    let totalConversations = 0
    const sentimentAggregated: Record<string, number> = {}
    const disconnectAggregated: Record<string, number> = {}
    const dateAggregated: Record<string, number> = {}
    
    for (const row of dataResult.rows) {
      const payload = row.payload
      
      // Aggregate basic metrics
      if (payload.total_llamada_realizada) {
        totalCalls += payload.total_llamada_realizada
      }
      if (payload.total_tiempo_llamada) {
        totalTime += payload.total_tiempo_llamada
      }
      if (payload.total_conversacion_sostenidas) {
        totalConversations += payload.total_conversacion_sostenidas
      }
      
      // Aggregate sentiment data
      if (payload.listado_sentimiento_usuario && typeof payload.listado_sentimiento_usuario === 'object') {
        for (const [sentiment, count] of Object.entries(payload.listado_sentimiento_usuario)) {
          sentimentAggregated[sentiment] = (sentimentAggregated[sentiment] || 0) + (count as number)
        }
      }
      
      // Aggregate disconnect reasons
      if (payload.listado_motivo_desconexion && typeof payload.listado_motivo_desconexion === 'object') {
        for (const [reason, count] of Object.entries(payload.listado_motivo_desconexion)) {
          disconnectAggregated[reason] = (disconnectAggregated[reason] || 0) + (count as number)
        }
      }
      
      // Aggregate dates
      if (payload.listado_fecha_hora && typeof payload.listado_fecha_hora === 'object') {
        for (const [date, count] of Object.entries(payload.listado_fecha_hora)) {
          dateAggregated[date] = (dateAggregated[date] || 0) + (count as number)
        }
      }
    }
    
    // Calculate derived metrics
    const avgCallDuration = totalCalls > 0 ? totalTime / totalCalls : 0
    const responseRate = totalCalls > 0 ? (totalConversations / totalCalls) * 100 : 0
    const avgCostPerCall = 0.05 // Mock cost per call
    const totalCost = totalCalls * avgCostPerCall
    
    // Format sentiment data
    const sentimentTotal = Object.values(sentimentAggregated).reduce((sum, val) => sum + val, 0)
    const sentimentData = Object.entries(sentimentAggregated).map(([name, value]) => ({
      name,
      value,
      percentage: sentimentTotal > 0 ? (value / sentimentTotal) * 100 : 0,
      color: name === 'Positivo' ? '#10b981' : name === 'Negativo' ? '#ef4444' : '#6b7280'
    }))
    
    // Format disconnect reasons data
    const disconnectTotal = Object.values(disconnectAggregated).reduce((sum, val) => sum + val, 0)
    const disconnectReasonsData = Object.entries(disconnectAggregated).map(([name, value]) => ({
      name,
      value,
      percentage: disconnectTotal > 0 ? (value / disconnectTotal) * 100 : 0,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
        Object.keys(disconnectAggregated).indexOf(name) % 5
      ]
    }))
    
    // Format call evolution data
    const callEvolutionData = Object.entries(dateAggregated)
      .map(([date, calls]) => ({
        date,
        calls,
        conversions: Math.floor(calls * 0.18) // Mock 18% conversion rate
      }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number)
        const [dayB, monthB] = b.date.split('/').map(Number)
        if (monthA !== monthB) return monthA - monthB
        return dayA - dayB
      })
    
    // Mock agent performance data
    const agentPerformanceData = [
      { agent: 'GPT-4', calls: Math.floor(totalCalls * 0.4), conversions: Math.floor(totalCalls * 0.4 * 0.22), conversionRate: 22 },
      { agent: 'Claude', calls: Math.floor(totalCalls * 0.35), conversions: Math.floor(totalCalls * 0.35 * 0.18), conversionRate: 18 },
      { agent: 'Gemini', calls: Math.floor(totalCalls * 0.25), conversions: Math.floor(totalCalls * 0.25 * 0.15), conversionRate: 15 }
    ]
    
    // Mock cost per conversion data
    const costPerConversionData = [
      { campaign: 'Formación', cost: totalCost * 0.5, conversions: totalConversations * 0.5, costPerConversion: (totalCost * 0.5) / (totalConversations * 0.5) },
      { campaign: 'Consultoría', cost: totalCost * 0.3, conversions: totalConversations * 0.3, costPerConversion: (totalCost * 0.3) / (totalConversations * 0.3) },
      { campaign: 'Software', cost: totalCost * 0.2, conversions: totalConversations * 0.2, costPerConversion: (totalCost * 0.2) / (totalConversations * 0.2) }
    ]
    
    // Build response
    const response = {
      totalCallsData: {
        total: totalCalls,
        thisMonth: totalCalls, // Mock: all calls are this month
        lastMonth: Math.floor(totalCalls * 0.85), // Mock: 15% growth
        percentageChange: 15
      },
      responseRateData: {
        answeredCalls: totalConversations,
        totalCalls,
        responseRate: Math.round(responseRate),
        trend: 'up'
      },
      totalCostData: {
        totalCost,
        averageCostPerCall: avgCostPerCall,
        thisMonth: totalCost,
        lastMonth: totalCost * 0.85,
        percentageChange: 15
      },
      sentimentData,
      disconnectReasonsData,
      callEvolutionData,
      agentPerformanceData,
      costPerConversionData,
      // Additional metrics
      avgCallDuration: Math.round(avgCallDuration),
      avgWaitTime: 4.2, // Mock
      recontactRate: 15.3, // Mock
      interviewRate: 19.5 // Mock
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching n8n dashboard data:', error)
    return NextResponse.json(
      { error: 'Error al cargar los datos' },
      { status: 500 }
    )
  }
}
