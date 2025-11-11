import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

// GET /api/admin/dashboard - get dashboard statistics
export async function GET() {
  try {
    // Get active clients count
    const activeClientsResult = await query(
      `SELECT COUNT(*) as count 
       FROM clientes 
       WHERE activo = true`
    )

    // Get total applications count
    const applicationsResult = await query(
      `SELECT COUNT(*) as count 
       FROM aplicaciones`
    )

    // Get total metrics count
    const metricsResult = await query(
      `SELECT COUNT(*) as count 
       FROM metricas`
    )

    // Get clients added this month
    const clientsThisMonthResult = await query(
      `SELECT COUNT(*) as count 
       FROM clientes 
       WHERE activo = true 
       AND DATE_TRUNC('month', fecha_creacion) = DATE_TRUNC('month', CURRENT_DATE)`
    )

    // Get applications added this week
    const appsThisWeekResult = await query(
      `SELECT COUNT(*) as count 
       FROM aplicaciones 
       WHERE DATE_TRUNC('week', fecha_creacion) = DATE_TRUNC('week', CURRENT_DATE)`
    )

    // Get metrics added today
    const metricsTodayResult = await query(
      `SELECT COUNT(*) as count 
       FROM metricas 
       WHERE DATE(fecha_metrica) = CURRENT_DATE`
    )

    // Get recent activity from logs_auditoria (last 10 activities)
    const recentActivityResult = await query(
      `SELECT 
        la.accion,
        la.tabla_afectada,
        la.fecha_accion,
        u.username,
        c.nombre_empresa
       FROM logs_auditoria la
       LEFT JOIN usuarios u ON la.usuario_id = u.id
       LEFT JOIN clientes c ON la.cliente_id = c.id
       ORDER BY la.fecha_accion DESC
       LIMIT 10`
    )

    // Get performance metrics
    // Aggregate from latest resumen_cliente per active client
    let callsProcessed = 0
    let avgResponseRate = 0
    let avgWaitTimeSec = 0
    try {
      const perfRes = await query(`
        WITH latest AS (
          SELECT DISTINCT ON (m.cliente_id)
            m.cliente_id,
            m.metadata,
            m.fecha_metrica
          FROM metricas m
          JOIN clientes c ON c.id = m.cliente_id
          WHERE c.activo = TRUE
            AND m.tipo_metrica = 'resumen_cliente'
          ORDER BY m.cliente_id, m.fecha_metrica DESC
        )
        SELECT 
          COALESCE(AVG((latest.metadata->>'responseRate')::numeric), 0) AS avg_rr,
          COALESCE(AVG((latest.metadata->>'avgWaitTime')::numeric), 0) AS avg_wait,
          COALESCE(SUM((latest.metadata->>'totalCalls')::numeric), 0) AS total_calls
        FROM latest
      `)
      avgResponseRate = parseFloat(perfRes.rows[0]?.avg_rr) || 0
      avgWaitTimeSec = parseFloat(perfRes.rows[0]?.avg_wait) || 0
      callsProcessed = Math.round(parseFloat(perfRes.rows[0]?.total_calls) || 0)

      // Fallback if no resumen data found
      if (callsProcessed === 0 && avgResponseRate === 0 && avgWaitTimeSec === 0) {
        const callsResult = await query(
          `SELECT COUNT(*) as count 
           FROM metricas 
           WHERE tipo_metrica LIKE '%llamada%' OR tipo_metrica LIKE '%call%'`
        )
        callsProcessed = parseInt(callsResult.rows[0]?.count || '0')
      }
    } catch (error) {
      // Fallback path
      try {
        const callsResult = await query(
          `SELECT COUNT(*) as count 
           FROM metricas 
           WHERE tipo_metrica LIKE '%llamada%' OR tipo_metrica LIKE '%call%'`
        )
        callsProcessed = parseInt(callsResult.rows[0]?.count || '0')
        avgResponseRate = 0
        avgWaitTimeSec = 0
      } catch (e) {
        callsProcessed = 0
        avgResponseRate = 0
        avgWaitTimeSec = 0
      }
    }

    // Format recent activity
    const recentActivity = recentActivityResult.rows.map(row => {
      const fecha = new Date(row.fecha_accion)
      const now = new Date()
      const diffMs = now.getTime() - fecha.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      let timeAgo = ''
      if (diffHours < 1) {
        timeAgo = 'Hace menos de una hora'
      } else if (diffHours < 24) {
        timeAgo = `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
      } else if (diffDays === 1) {
        timeAgo = 'Ayer'
      } else if (diffDays < 7) {
        timeAgo = `Hace ${diffDays} días`
      } else {
        timeAgo = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
      }

      // Format action description
      let actionDescription = row.accion
      if (row.tabla_afectada) {
        if (row.tabla_afectada === 'clientes' && row.nombre_empresa) {
          actionDescription = `${row.accion} "${row.nombre_empresa}"`
        } else if (row.tabla_afectada === 'aplicaciones') {
          actionDescription = `Aplicación ${row.accion.toLowerCase()}`
        }
      }

      return {
        action: actionDescription,
        timeAgo,
        user: row.username || 'Sistema',
        color: getActivityColor(row.accion)
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          activeClients: parseInt(activeClientsResult.rows[0].count),
          applications: parseInt(applicationsResult.rows[0].count),
          metrics: parseInt(metricsResult.rows[0].count),
          reports: parseInt(metricsResult.rows[0].count) // Using metrics as reports for now
        },
        changes: {
          clientsThisMonth: parseInt(clientsThisMonthResult.rows[0].count),
          appsThisWeek: parseInt(appsThisWeekResult.rows[0].count),
          metricsToday: parseInt(metricsTodayResult.rows[0].count)
        },
        recentActivity,
        performance: {
          callsProcessed,
          avgResponseRate,
          avgWaitTimeSec
        }
      }
    })
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener estadísticas del dashboard' },
      { status: 500 }
    )
  }
}

// Helper function to get activity color based on action type
function getActivityColor(action: string): string {
  const actionLower = action.toLowerCase()
  if (actionLower.includes('crear') || actionLower.includes('creado')) {
    return 'green'
  } else if (actionLower.includes('actualizar') || actionLower.includes('actualizado')) {
    return 'blue'
  } else if (actionLower.includes('eliminar') || actionLower.includes('eliminado')) {
    return 'red'
  } else if (actionLower.includes('configurar') || actionLower.includes('configuracion')) {
    return 'purple'
  } else {
    return 'yellow'
  }
}

