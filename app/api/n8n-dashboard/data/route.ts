import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')

    if (!clienteId) {
      return NextResponse.json({ error: 'clienteId es requerido' }, { status: 400 })
    }
    
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
    const waitTimeAggregated: Record<string, number> = {}
    
    for (const row of dataResult.rows) {
      const payload = row.payload
      
      // Aggregate basic metrics from normalized fields
      if (payload.total_llamadas_realizadas != null) {
        const v = typeof payload.total_llamadas_realizadas === 'string'
          ? parseFloat(payload.total_llamadas_realizadas)
          : Number(payload.total_llamadas_realizadas)
        totalCalls += isNaN(v) ? 0 : v
      }
      if (payload.total_tiempo_llamadas_segundos != null) {
        const v = typeof payload.total_tiempo_llamadas_segundos === 'string'
          ? parseFloat(payload.total_tiempo_llamadas_segundos)
          : Number(payload.total_tiempo_llamadas_segundos)
        totalTime += isNaN(v) ? 0 : v
      }
      if (payload.total_conversacion_sostenidas_segundo != null) {
        if (typeof payload.total_conversacion_sostenidas_segundo === 'object' && payload.total_conversacion_sostenidas_segundo !== null) {
          const val = (payload.total_conversacion_sostenidas_segundo as any).valor
          const v = typeof val === 'string' ? parseFloat(val) : Number(val)
          totalConversations += isNaN(v) ? 0 : v
        } else {
          const v = typeof payload.total_conversacion_sostenidas_segundo === 'string'
            ? parseFloat(payload.total_conversacion_sostenidas_segundo)
            : Number(payload.total_conversacion_sostenidas_segundo)
          totalConversations += isNaN(v) ? 0 : v
        }
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
      
      // Aggregate dates (from total_llamadas_fecha)
      if (payload.total_llamadas_fecha && typeof payload.total_llamadas_fecha === 'object') {
        for (const [date, count] of Object.entries(payload.total_llamadas_fecha)) {
          dateAggregated[date] = (dateAggregated[date] || 0) + (count as number)
        }
      }

      // Aggregate wait time per date (from total_tiempo_espera_fecha)
      if (payload.total_tiempo_espera_fecha && typeof payload.total_tiempo_espera_fecha === 'object') {
        for (const [date, sec] of Object.entries(payload.total_tiempo_espera_fecha)) {
          const v = typeof sec === 'string' ? parseFloat(sec) : Number(sec)
          waitTimeAggregated[date] = (waitTimeAggregated[date] || 0) + (isNaN(v) ? 0 : v)
        }
      }
    }
    
    // Calculate derived metrics
    const avgCallDuration = totalCalls > 0 ? totalTime / totalCalls : 0

    // Derive answered calls from disconnect reasons (exclude no-answer types)
    const answeredCalls =
      Object.entries(disconnectAggregated).reduce((sum, [reason, count]) => {
        const r = reason.toLowerCase()
        const isNoAnswer = r.includes('no hay respuesta') || r.includes('ocupado')
        return sum + (isNoAnswer ? 0 : (count as number))
      }, 0) || 0

    const responseRate = totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0
    const avgCostPerCall = 0.05 // Mock cost per call
    const totalCost = totalCalls * avgCostPerCall

    // Average wait time from aggregated per-date values
    const waitValues = Object.values(waitTimeAggregated)
    const avgWaitTime = waitValues.length > 0
      ? (waitValues.reduce((a, b) => a + b, 0) / waitValues.length)
      : 0
    
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
        answeredCalls,
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
      avgWaitTime: Math.round(avgWaitTime * 100) / 100,
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
