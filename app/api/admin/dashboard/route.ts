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
    // Total calls processed (if llamadas_data table exists, otherwise use metricas)
    let callsProcessed = 0
    try {
      const callsResult = await query(
        `SELECT COUNT(*) as count 
         FROM metricas 
         WHERE tipo_metrica LIKE '%llamada%' OR tipo_metrica LIKE '%call%'`
      )
      callsProcessed = parseInt(callsResult.rows[0]?.count || '0')
    } catch (error) {
      // If metricas doesn't have call data, try to get from llamadas_data if it exists
      try {
        const llamadasResult = await query(
          `SELECT COUNT(*) as count 
           FROM llamadas_data 
           WHERE llamada_realizada = true`
        )
        callsProcessed = parseInt(llamadasResult.rows[0]?.count || '0')
      } catch (e) {
        // Table might not exist, use default
        callsProcessed = 0
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
          callsProcessed
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

