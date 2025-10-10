import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')

    // Check if llamadas_data table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'llamadas_data'
      )
    `)

    if (!tableCheck.rows[0].exists) {
      // Table doesn't exist yet, return empty data
      return NextResponse.json([])
    }

    // Fetch KPI definitions first to know what to calculate
    const kpisResult = await query(`
      SELECT kpis 
      FROM public.crear_kpis 
      WHERE kpis IS NOT NULL
      LIMIT 1
    `)

    if (kpisResult.rows.length === 0 || !kpisResult.rows[0].kpis) {
      return NextResponse.json([])
    }

    const kpisArray = kpisResult.rows[0].kpis
    const kpiDefinitions = kpisArray.map((kpiString: string) => {
      try {
        return JSON.parse(kpiString)
      } catch (e) {
        return null
      }
    }).filter((kpi: any) => kpi !== null)

    // Calculate KPIs based on llamadas_data
    const kpisWithData = await Promise.all(
      kpiDefinitions.map(async (kpi: any) => {
        try {
          const kpiData = await calculateKPI(kpi)
          return {
            titulo: kpi.titulo,
            descripcion: kpi.descripcion,
            tipo: kpi.tipo_grafico,
            ...kpiData
          }
        } catch (error) {
          console.error(`Error calculating KPI ${kpi.titulo}:`, error)
          return {
            titulo: kpi.titulo,
            descripcion: kpi.descripcion,
            tipo: kpi.tipo_grafico,
            valor: 0,
            data: []
          }
        }
      })
    )

    return NextResponse.json(kpisWithData)
  } catch (error) {
    console.error('Error fetching KPI data:', error)
    return NextResponse.json(
      { error: 'Error al cargar los datos de KPIs' },
      { status: 500 }
    )
  }
}

// Helper function to calculate KPI based on definition
async function calculateKPI(kpiDef: any): Promise<any> {
  const { titulo, tipo_grafico, inputs } = kpiDef

  try {
    // Get row count first
    const countResult = await query('SELECT COUNT(*) as count FROM llamadas_data')
    const totalRows = parseInt(countResult.rows[0].count)

    if (totalRows === 0) {
      // No data available, return empty/zero values
      if (tipo_grafico === 'individual') {
        return { valor: 0 }
      } else {
        return { valor: 0, data: [] }
      }
    }

    switch (titulo) {
      case 'Número total de llamadas':
        return { valor: totalRows.toLocaleString('es-ES') }

      case 'Duración media de las llamadas':
        const avgResult = await query('SELECT AVG(duracion_ms) as avg FROM llamadas_data WHERE duracion_ms IS NOT NULL')
        const avgSeconds = avgResult.rows[0].avg || 0
        const minutes = Math.floor(avgSeconds / 60)
        const seconds = Math.floor(avgSeconds % 60)
        return { valor: `${minutes}:${seconds.toString().padStart(2, '0')}`, unidad: 'minutos' }

      case 'Costo total de las llamadas':
        const costResult = await query('SELECT SUM(coste_total) as total FROM llamadas_data WHERE coste_total IS NOT NULL')
        const totalCost = costResult.rows[0].total || 0
        return { valor: `€${parseFloat(totalCost).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }

      case 'Evolución del número de llamadas por día':
        const dailyResult = await query(`
          SELECT 
            TO_CHAR(fecha_inicio, 'DD/MM') as fecha,
            COUNT(*) as llamadas
          FROM llamadas_data
          WHERE fecha_inicio IS NOT NULL
          GROUP BY TO_CHAR(fecha_inicio, 'DD/MM'), fecha_inicio
          ORDER BY fecha_inicio
          LIMIT 30
        `)
        return { valor: 0, data: dailyResult.rows }

      case 'Distribución de motivos de desconexión':
        const disconnectResult = await query(`
          SELECT 
            razon_desconexion as nombre,
            COUNT(*) as valor
          FROM llamadas_data
          WHERE razon_desconexion IS NOT NULL
          GROUP BY razon_desconexion
          ORDER BY valor DESC
        `)
        return { valor: 0, data: disconnectResult.rows }

      case 'Sentimiento del usuario en las llamadas':
        const sentimentResult = await query(`
          SELECT 
            sentimiento as nombre,
            COUNT(*) as valor
          FROM llamadas_data
          WHERE sentimiento IS NOT NULL
          GROUP BY sentimiento
          ORDER BY valor DESC
        `)
        return { valor: 0, data: sentimentResult.rows }

      case 'Distribución de agentes por número de llamadas':
        const agentResult = await query(`
          SELECT 
            agent_name as nombre,
            COUNT(*) as valor
          FROM llamadas_data
          WHERE agent_name IS NOT NULL
          GROUP BY agent_name
          ORDER BY valor DESC
          LIMIT 10
        `)
        return { valor: 0, data: agentResult.rows }

      case 'Estado de interés en entrevista':
        const interviewResult = await query(`
          SELECT 
            entrevista as nombre,
            COUNT(*) as valor
          FROM llamadas_data
          WHERE entrevista IS NOT NULL AND entrevista != ''
          GROUP BY entrevista
          ORDER BY valor DESC
        `)
        return { valor: 0, data: interviewResult.rows }

      case 'Situación laboral de los usuarios contactados':
        const laboralResult = await query(`
          SELECT 
            "Situacion_laboral" as nombre,
            COUNT(*) as valor
          FROM llamadas_data
          WHERE "Situacion_laboral" IS NOT NULL AND "Situacion_laboral" != ''
          GROUP BY "Situacion_laboral"
          ORDER BY valor DESC
        `)
        return { valor: 0, data: laboralResult.rows }

      case 'Antigüedad laboral de los usuarios contactados':
        const antiguedadResult = await query(`
          SELECT 
            "Antigüedad_laboral" as nombre,
            COUNT(*) as valor
          FROM llamadas_data
          WHERE "Antigüedad_laboral" IS NOT NULL AND "Antigüedad_laboral" != ''
          GROUP BY "Antigüedad_laboral"
          ORDER BY valor DESC
        `)
        return { valor: 0, data: antiguedadResult.rows }

      case 'Nivel de estudios de los usuarios contactados':
        const estudiosResult = await query(`
          SELECT 
            nivel_estudios as nombre,
            COUNT(*) as valor
          FROM llamadas_data
          WHERE nivel_estudios IS NOT NULL AND nivel_estudios != ''
          GROUP BY nivel_estudios
          ORDER BY valor DESC
        `)
        return { valor: 0, data: estudiosResult.rows }

      case 'Preferencia de turno de contacto':
        const turnoResult = await query(`
          SELECT 
            turno_contacto as nombre,
            COUNT(*) as valor
          FROM llamadas_data
          WHERE turno_contacto IS NOT NULL AND turno_contacto != ''
          GROUP BY turno_contacto
          ORDER BY valor DESC
        `)
        return { valor: 0, data: turnoResult.rows }

      case 'Evolución de la duración media de las llamadas por día':
        const avgDailyResult = await query(`
          SELECT 
            TO_CHAR(fecha_inicio, 'DD/MM') as fecha,
            AVG(duracion_ms) as llamadas
          FROM llamadas_data
          WHERE fecha_inicio IS NOT NULL AND duracion_ms IS NOT NULL
          GROUP BY TO_CHAR(fecha_inicio, 'DD/MM'), fecha_inicio
          ORDER BY fecha_inicio
          LIMIT 30
        `)
        return { valor: 0, data: avgDailyResult.rows }

      default:
        // Generic handling based on tipo_grafico
        if (tipo_grafico === 'individual') {
          return { valor: 0 }
        } else {
          return { valor: 0, data: [] }
        }
    }
  } catch (error) {
    console.error(`Error in calculateKPI for ${titulo}:`, error)
    
    // Return safe defaults
    if (tipo_grafico === 'individual') {
      return { valor: 0 }
    } else {
      return { valor: 0, data: [] }
    }
  }
}

