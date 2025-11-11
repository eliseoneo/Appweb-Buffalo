import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

// Helper: try to find client's data table (reuses logic pattern from other routes)
async function findClientTable(clienteId: string): Promise<string | null> {
  // Prefer explicit mapping on clientes.tabla_cliente
  try {
    await query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tabla_cliente VARCHAR(250)`)
    const tRes = await query(`SELECT tabla_cliente FROM clientes WHERE id = $1`, [clienteId])
    const tabla = tRes.rows?.[0]?.tabla_cliente as string | null
    if (tabla) {
      const existsRes = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        ) AS exists`,
        [tabla]
      )
      if (existsRes.rows?.[0]?.exists) {
        return tabla
      }
    }
  } catch {}

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

  for (const row of tablesResult.rows) {
    const tableName = row.table_name as string
    try {
      const verifyResult = await query(`
        SELECT COUNT(*) as count
        FROM ${tableName}
        WHERE cliente_id = $1
      `, [clienteId])
      if (parseInt(verifyResult.rows[0].count) > 0) {
        return tableName
      }
    } catch {
      continue
    }
  }
  return null
}

// Aggregate helper: safe number parse
function toNum(v: any): number {
  if (v === null || v === undefined) return 0
  if (typeof v === 'number') return isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const n = parseFloat(v)
    return isNaN(n) ? 0 : n
  }
  return 0
}

// Compute summary metrics for a client from its payload-based table
async function computeClientSummary(tableName: string, clienteId: string) {
  // Fetch payloads (bounded to a reasonable amount if needed; here we assume low volume for dev)
  const rows = await query(`
    SELECT payload
    FROM ${tableName}
    WHERE cliente_id = $1
  `, [clienteId])

  let totalCalls = 0
  let totalConvSec = 0
  const disconnectAggregated: Record<string, number> = {}
  const sentimentAggregated: Record<string, number> = {}
  const waitTimeAggregated: Record<string, number> = {}
  let totalWaitEntries = 0

  for (const r of rows.rows) {
    const p = r.payload || {}

    // total_llamadas_realizadas
    if (p.total_llamadas_realizadas != null) {
      totalCalls += toNum(p.total_llamadas_realizadas)
    }

    // total_conversacion_sostenidas_segundo (object with valor or scalar)
    if (p.total_conversacion_sostenidas_segundo != null) {
      if (typeof p.total_conversacion_sostenidas_segundo === 'object') {
        totalConvSec += toNum(p.total_conversacion_sostenidas_segundo?.valor)
      } else {
        totalConvSec += toNum(p.total_conversacion_sostenidas_segundo)
      }
    }

    // listado_motivo_desconexion
    if (p.listado_motivo_desconexion && typeof p.listado_motivo_desconexion === 'object') {
      for (const [reason, count] of Object.entries(p.listado_motivo_desconexion)) {
        disconnectAggregated[reason] = (disconnectAggregated[reason] || 0) + toNum(count)
      }
    }

    // listado_sentimiento_usuario
    if (p.listado_sentimiento_usuario && typeof p.listado_sentimiento_usuario === 'object') {
      for (const [sent, count] of Object.entries(p.listado_sentimiento_usuario)) {
        sentimentAggregated[sent] = (sentimentAggregated[sent] || 0) + toNum(count)
      }
    }

    // total_tiempo_espera_fecha (per-date seconds)
    if (p.total_tiempo_espera_fecha && typeof p.total_tiempo_espera_fecha === 'object') {
      for (const [date, sec] of Object.entries(p.total_tiempo_espera_fecha)) {
        waitTimeAggregated[date] = (waitTimeAggregated[date] || 0) + toNum(sec)
        totalWaitEntries += 1
      }
    }
  }

  // Derive answered calls from disconnect reasons (exclude: No hay respuesta, Ocupado)
  const noAnswer = (disconnectAggregated['No hay respuesta'] || 0) + (disconnectAggregated['no hay respuesta'] || 0)
  const busy = (disconnectAggregated['Ocupado'] || 0) + (disconnectAggregated['ocupado'] || 0)
  const countedCalls = Object.values(disconnectAggregated).reduce((a, b) => a + b, 0)

  // Prefer totalCalls from payload; if not present, use countedCalls
  if (totalCalls <= 0 && countedCalls > 0) {
    totalCalls = countedCalls
  }

  const answeredCalls = Math.max(0, countedCalls - (noAnswer + busy))
  const responseRate = totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0

  // Sentiment positive percent
  const sentTotal = Object.values(sentimentAggregated).reduce((a, b) => a + b, 0)
  const pos = (sentimentAggregated['Positivo'] || 0) + (sentimentAggregated['positivo'] || 0)
  const positivePct = sentTotal > 0 ? (pos / sentTotal) * 100 : 0

  // Average wait time (seconds)
  const avgWaitTime = totalWaitEntries > 0
    ? Object.values(waitTimeAggregated).reduce((a, b) => a + b, 0) / totalWaitEntries
    : 0

  // Scoring and status
  const score = Math.round((responseRate * 0.6) + (positivePct * 0.4)) // 0..100
  let status: 'good' | 'warning' | 'bad' = 'bad'
  if (responseRate >= 85 && positivePct >= 70) status = 'good'
  else if (responseRate >= 50 && positivePct >= 45) status = 'warning'
  else status = 'bad'

  return {
    totalCalls,
    answeredCalls,
    responseRate: Math.round(responseRate),
    positivePct: Math.round(positivePct),
    avgWaitTime: Math.round(avgWaitTime * 100) / 100,
    totalConvSec: Math.round(totalConvSec),
    sentimentAggregated,
    disconnectAggregated,
    score,
    status
  }
}

export async function POST() {
  try {
    // Get all clients
    const cRes = await query(`SELECT id FROM clientes ORDER BY id`)
    const clientes = cRes.rows.map(r => String(r.id))

    const results: any[] = []

    for (const clienteId of clientes) {
      const tableName = await findClientTable(clienteId)
      if (!tableName) {
        results.push({ clienteId, inserted: false, reason: 'no_table' })
        continue
      }

      const summary = await computeClientSummary(tableName, clienteId)

      // Insert into metricas: tipo_metrica = 'resumen_cliente', valor = score, metadata = summary JSON
      await query(`
        INSERT INTO metricas (cliente_id, aplicacion_id, tipo_metrica, valor, fecha_metrica, metadata)
        VALUES ($1, NULL, 'resumen_cliente', $2, NOW(), $3)
      `, [clienteId, summary.score, summary])

      results.push({ clienteId, tableName, inserted: true, score: summary.score, status: summary.status })
    }

    return NextResponse.json({ success: true, processed: results.length, results })
  } catch (error) {
    console.error('❌ Error generating client summaries:', error)
    return NextResponse.json({ success: false, message: 'Error al generar resúmenes' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // Optional preview endpoint: returns the latest resumen_cliente per client
  try {
    const res = await query(`
      SELECT DISTINCT ON (cliente_id)
        id, cliente_id, tipo_metrica, valor, fecha_metrica, metadata
      FROM metricas
      WHERE tipo_metrica = 'resumen_cliente'
      ORDER BY cliente_id, fecha_metrica DESC
    `)
    return NextResponse.json({ success: true, data: res.rows })
  } catch (error) {
    console.error('❌ Error fetching summaries:', error)
    return NextResponse.json({ success: false, message: 'Error al obtener resúmenes' }, { status: 500 })
  }
}


