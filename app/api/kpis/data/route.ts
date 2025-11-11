import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

// Helper function to get field mapping for a client's table
async function getFieldMapping(clienteId: string, tableName: string): Promise<{ fieldMapping: any, kpisMapping: any } | null> {
  try {
    const result = await query(`
      SELECT field_mapping, kpis_mapping
      FROM cliente_table_metadata
      WHERE cliente_id = $1 AND table_name = $2
    `, [clienteId, tableName])
    
    if (result.rows.length > 0) {
      return {
        fieldMapping: result.rows[0].field_mapping,
        kpisMapping: result.rows[0].kpis_mapping
      }
    }
    return null
  } catch (error) {
    console.error('Error getting field mapping:', error)
    return null
  }
}

// Helper function to find client's table name
async function findClientTable(clienteId: string): Promise<string | null> {
  try {
    // Find all tables that have both cliente_id and payload (JSONB) columns
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
    
    // Check each table to see if it has data for this client
    for (const row of tablesResult.rows) {
      const tableName = row.table_name
      try {
        const verifyResult = await query(`
          SELECT COUNT(*) as count
          FROM ${tableName}
          WHERE cliente_id = $1
        `, [clienteId])
        
        if (parseInt(verifyResult.rows[0].count) > 0) {
          console.log(`✅ Found table ${tableName} with data for cliente ${clienteId}`)
          return tableName
        }
      } catch (err) {
        // Table might not exist or have wrong structure, skip it
        console.warn(`⚠️ Error checking table ${tableName}:`, err)
        continue
      }
    }
    
    console.log(`⚠️ No table found with data for cliente ${clienteId}`)
    return null
  } catch (error) {
    console.error('Error finding client table:', error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')

    if (!clienteId) {
      return NextResponse.json(
        { error: 'clienteId es requerido' },
        { status: 400 }
      )
    }

    // Find the client's table
    const tableName = await findClientTable(clienteId)
    
    if (!tableName) {
      console.log(`⚠️ No table found for cliente ${clienteId}`)
      return NextResponse.json([])
    }

    console.log(`✅ Using table: ${tableName} for cliente ${clienteId}`)

    // Get field mapping for this client's table
    const mapping = await getFieldMapping(clienteId, tableName)
    console.log(`📋 Field mapping available:`, !!mapping)

    // Fetch KPI definitions first to know what to calculate
    const kpisResult = await query(`
      SELECT kpis 
      FROM public.crear_kpis 
      WHERE kpis IS NOT NULL
      LIMIT 1
    `)

    // If we have kpis_mapping from the mapper file, use that instead of crear_kpis
    let kpiDefinitions: any[] = []
    if (mapping?.kpisMapping?.kpis) {
      // Use kpis from mapper file
      kpiDefinitions = mapping.kpisMapping.kpis.filter((kpi: any) => kpi.activo !== false)
      console.log(`✅ Using ${kpiDefinitions.length} KPIs from mapper file`)
    } else if (kpisResult.rows.length > 0 && kpisResult.rows[0].kpis) {
      // Fallback to crear_kpis table
      const kpisArray = kpisResult.rows[0].kpis
      kpiDefinitions = kpisArray.map((kpiString: string) => {
        try {
          return JSON.parse(kpiString)
        } catch (e) {
          return null
        }
      }).filter((kpi: any) => kpi !== null)
      console.log(`✅ Using ${kpiDefinitions.length} KPIs from crear_kpis table`)
    }

    if (kpiDefinitions.length === 0) {
      return NextResponse.json([])
    }

    // Calculate KPIs based on client's table
    const kpisWithData = await Promise.all(
      kpiDefinitions.map(async (kpi: any) => {
        try {
          const kpiData = await calculateKPI(kpi, tableName, clienteId, mapping)
          return {
            titulo: kpi.titulo || kpi.kpi_titulo,
            descripcion: kpi.descripcion || '',
            tipo: kpi.tipo_grafico || 'individual',
            ...kpiData
          }
        } catch (error) {
          console.error(`Error calculating KPI ${kpi.titulo || kpi.kpi_titulo}:`, error)
          return {
            titulo: kpi.titulo || kpi.kpi_titulo,
            descripcion: kpi.descripcion || '',
            tipo: kpi.tipo_grafico || 'individual',
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

// Helper function to get field name from mapping
function getFieldNameFromMapping(kpiDef: any, mapping: { fieldMapping: any, kpisMapping: any } | null): string | null {
  if (!mapping?.kpisMapping?.kpis) return null
  
  // Find the KPI in the mapping
  const kpiMapping = mapping.kpisMapping.kpis.find((k: any) => 
    k.kpi_id === kpiDef.kpi_id || 
    k.titulo === kpiDef.titulo ||
    k.kpi_titulo === kpiDef.titulo
  )
  
  if (kpiMapping?.columnas_origen && kpiMapping.columnas_origen.length > 0) {
    return kpiMapping.columnas_origen[0] // Use first column
  }
  
  return null
}

// Helper function to calculate KPI based on definition
// Now queries from client-specific table with JSONB payload column
async function calculateKPI(
  kpiDef: any, 
  tableName: string, 
  clienteId: string, 
  mapping: { fieldMapping: any, kpisMapping: any } | null
): Promise<any> {
  const { titulo, tipo_grafico, inputs, kpi_id, kpi_titulo } = kpiDef
  const kpiTitle = titulo || kpi_titulo || ''

  try {
    // Get row count first (from JSONB payload column)
    const countResult = await query(`
      SELECT COUNT(*) as count 
      FROM ${tableName}
      WHERE cliente_id = $1
    `, [clienteId])
    const totalRows = parseInt(countResult.rows[0].count)

    if (totalRows === 0) {
      // No data available, return empty/zero values
      if (tipo_grafico === 'individual') {
        return { valor: 0 }
      } else {
        return { valor: 0, data: [] }
      }
    }

    // Get the actual field name from mapping
    const fieldName = getFieldNameFromMapping(kpiDef, mapping)
    if (!fieldName) {
      console.warn(`⚠️ No field mapping found for KPI: ${kpiTitle}`)
      // Fallback to old hardcoded logic
      return calculateKPIFallback(kpiDef, tableName, clienteId, tipo_grafico)
    }

    console.log(`📊 Calculating KPI "${kpiTitle}" using field "${fieldName}"`)

    // Get field type from mapping to know how to process it
    const fieldMapping = mapping?.fieldMapping?.columna_kpi_relations?.find(
      (col: any) => col.columna_nombre === fieldName
    )
    const fieldType = fieldMapping?.tipo_dato || 'VARCHAR'

    // Handle based on chart type and field type
    if (tipo_grafico === 'individual') {
      // Individual metrics - get single value
      if (fieldType === 'INTEGER' || fieldType === 'NUMERIC') {
        const result = await query(`
          SELECT AVG((payload->>$2)::numeric) as avg_value,
                 SUM((payload->>$2)::numeric) as sum_value
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>$2 IS NOT NULL
        `, [clienteId, fieldName])
        
        const avgValue = parseFloat(result.rows[0]?.avg_value) || 0
        const sumValue = parseFloat(result.rows[0]?.sum_value) || 0
        
        // For "Total" metrics, use sum; for "Average" metrics, use avg
        if (kpiTitle.toLowerCase().includes('total') || kpiTitle.toLowerCase().includes('número')) {
          return { valor: sumValue.toLocaleString('es-ES') }
        } else {
          // Format duration if it's a time field
          if (fieldName.includes('tiempo') || fieldName.includes('duracion')) {
            const minutes = Math.floor(sumValue / 60)
            const seconds = Math.floor(sumValue % 60)
            return { valor: `${minutes}:${seconds.toString().padStart(2, '0')}`, unidad: 'minutos' }
          }
          return { valor: avgValue.toLocaleString('es-ES') }
        }
      } else {
        // For other types, just count records
        return { valor: totalRows.toLocaleString('es-ES') }
      }
    } else if (tipo_grafico === 'linea') {
      // Line chart - need date-based data
      if (fieldType === 'JSONB' && fieldName.includes('fecha_hora')) {
        // Handle JSONB object like {"19/09/2025": 10, "20/09/2025": 8}
        // Aggregate across all records
        const result = await query(`
          SELECT payload->>$2 as field_data
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>$2 IS NOT NULL
        `, [clienteId, fieldName])
        
        // Aggregate all JSONB objects
        const aggregated: Record<string, number> = {}
        for (const row of result.rows) {
          let fieldData = row.field_data
          // Parse if it's a string
          if (typeof fieldData === 'string') {
            try {
              fieldData = JSON.parse(fieldData)
            } catch (e) {
              console.warn('Failed to parse JSONB field:', e)
              continue
            }
          }
          if (typeof fieldData === 'object' && !Array.isArray(fieldData)) {
            for (const [key, value] of Object.entries(fieldData)) {
              aggregated[key] = (aggregated[key] || 0) + (typeof value === 'number' ? value : parseInt(String(value)) || 0)
            }
          }
        }
        
        if (Object.keys(aggregated).length > 0) {
          const data = Object.entries(aggregated).map(([fecha, llamadas]) => ({
            fecha,
            llamadas
          })).sort((a, b) => {
            // Sort by date (simple string comparison for DD/MM/YYYY format)
            const [dayA, monthA] = a.fecha.split('/').map(Number)
            const [dayB, monthB] = b.fecha.split('/').map(Number)
            if (monthA !== monthB) return monthA - monthB
            return dayA - dayB
          })
          return { valor: 0, data }
        }
      }
      return { valor: 0, data: [] }
    } else if (tipo_grafico === 'donut' || tipo_grafico === 'poligono') {
      // Donut/Pie chart - need distribution data
      if (fieldType === 'JSONB') {
        // Handle JSONB object like {"Positivo": 12, "Negativo": 3, "Neutral": 25}
        // Aggregate across all records
        const result = await query(`
          SELECT payload->>$2 as field_data
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>$2 IS NOT NULL
        `, [clienteId, fieldName])
        
        // Aggregate all JSONB objects
        const aggregated: Record<string, number> = {}
        for (const row of result.rows) {
          let fieldData = row.field_data
          // Parse if it's a string
          if (typeof fieldData === 'string') {
            try {
              fieldData = JSON.parse(fieldData)
            } catch (e) {
              console.warn('Failed to parse JSONB field:', e)
              continue
            }
          }
          if (typeof fieldData === 'object' && !Array.isArray(fieldData)) {
            for (const [key, value] of Object.entries(fieldData)) {
              aggregated[key] = (aggregated[key] || 0) + (typeof value === 'number' ? value : parseInt(String(value)) || 0)
            }
          }
        }
        
        if (Object.keys(aggregated).length > 0) {
          const data = Object.entries(aggregated).map(([nombre, valor]) => ({
            nombre,
            valor
          })).sort((a, b) => b.valor - a.valor)
          return { valor: 0, data }
        }
      }
      return { valor: 0, data: [] }
    } else if (tipo_grafico === 'barras_vertical' || tipo_grafico === 'barras_horizontal') {
      // Bar chart - similar to donut
      if (fieldType === 'JSONB') {
        // Aggregate across all records
        const result = await query(`
          SELECT payload->>$2 as field_data
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>$2 IS NOT NULL
        `, [clienteId, fieldName])
        
        // Aggregate all JSONB objects
        const aggregated: Record<string, number> = {}
        for (const row of result.rows) {
          let fieldData = row.field_data
          // Parse if it's a string
          if (typeof fieldData === 'string') {
            try {
              fieldData = JSON.parse(fieldData)
            } catch (e) {
              console.warn('Failed to parse JSONB field:', e)
              continue
            }
          }
          if (typeof fieldData === 'object' && !Array.isArray(fieldData)) {
            for (const [key, value] of Object.entries(fieldData)) {
              aggregated[key] = (aggregated[key] || 0) + (typeof value === 'number' ? value : parseInt(String(value)) || 0)
            }
          }
        }
        
        if (Object.keys(aggregated).length > 0) {
          const data = Object.entries(aggregated).map(([nombre, valor]) => ({
            nombre,
            valor
          })).sort((a, b) => b.valor - a.valor)
          return { valor: 0, data }
        }
      }
      return { valor: 0, data: [] }
    }

    // Fallback for unknown chart types
    return { valor: 0, data: [] }
  } catch (error) {
    console.error(`Error in calculateKPI for ${kpiTitle}:`, error)
    
    // Return safe defaults
    if (tipo_grafico === 'individual') {
      return { valor: 0 }
    } else {
      return { valor: 0, data: [] }
    }
  }
}

// Fallback function for KPIs without mapping (old hardcoded logic)
async function calculateKPIFallback(
  kpiDef: any,
  tableName: string,
  clienteId: string,
  tipo_grafico: string
): Promise<any> {
  const { titulo } = kpiDef

  try {
    // Get row count
    const countResult = await query(`
      SELECT COUNT(*) as count 
      FROM ${tableName}
      WHERE cliente_id = $1
    `, [clienteId])
    const totalRows = parseInt(countResult.rows[0].count)

    switch (titulo) {
      case 'Número total de llamadas':
        return { valor: totalRows.toLocaleString('es-ES') }

      case 'Duración media de las llamadas':
        const avgResult = await query(`
          SELECT AVG((payload->>'duracion_ms')::numeric) as avg 
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'duracion_ms' IS NOT NULL
        `, [clienteId])
        const avgSeconds = parseFloat(avgResult.rows[0].avg) || 0
        const minutes = Math.floor(avgSeconds / 60)
        const seconds = Math.floor(avgSeconds % 60)
        return { valor: `${minutes}:${seconds.toString().padStart(2, '0')}`, unidad: 'minutos' }

      case 'Costo total de las llamadas':
        const costResult = await query(`
          SELECT SUM((payload->>'coste_total')::numeric) as total 
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'coste_total' IS NOT NULL
        `, [clienteId])
        const totalCost = parseFloat(costResult.rows[0].total) || 0
        return { valor: `€${totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }

      case 'Evolución del número de llamadas por día':
        const dailyResult = await query(`
          SELECT 
            TO_CHAR((payload->>'fecha_inicio')::timestamp, 'DD/MM') as fecha,
            COUNT(*) as llamadas
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'fecha_inicio' IS NOT NULL
          GROUP BY TO_CHAR((payload->>'fecha_inicio')::timestamp, 'DD/MM'), (payload->>'fecha_inicio')::timestamp
          ORDER BY (payload->>'fecha_inicio')::timestamp
          LIMIT 30
        `, [clienteId])
        return { valor: 0, data: dailyResult.rows }

      case 'Distribución de motivos de desconexión':
        const disconnectResult = await query(`
          SELECT 
            payload->>'razon_desconexion' as nombre,
            COUNT(*) as valor
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'razon_desconexion' IS NOT NULL
          GROUP BY payload->>'razon_desconexion'
          ORDER BY valor DESC
        `, [clienteId])
        return { valor: 0, data: disconnectResult.rows }

      case 'Sentimiento del usuario en las llamadas':
        const sentimentResult = await query(`
          SELECT 
            payload->>'sentimiento' as nombre,
            COUNT(*) as valor
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'sentimiento' IS NOT NULL
          GROUP BY payload->>'sentimiento'
          ORDER BY valor DESC
        `, [clienteId])
        return { valor: 0, data: sentimentResult.rows }

      case 'Distribución de agentes por número de llamadas':
        const agentResult = await query(`
          SELECT 
            payload->>'agent_name' as nombre,
            COUNT(*) as valor
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'agent_name' IS NOT NULL
          GROUP BY payload->>'agent_name'
          ORDER BY valor DESC
          LIMIT 10
        `, [clienteId])
        return { valor: 0, data: agentResult.rows }

      case 'Estado de interés en entrevista':
        const interviewResult = await query(`
          SELECT 
            payload->>'entrevista' as nombre,
            COUNT(*) as valor
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'entrevista' IS NOT NULL AND payload->>'entrevista' != ''
          GROUP BY payload->>'entrevista'
          ORDER BY valor DESC
        `, [clienteId])
        return { valor: 0, data: interviewResult.rows }

      case 'Situación laboral de los usuarios contactados':
        const laboralResult = await query(`
          SELECT 
            payload->>'Situacion_laboral' as nombre,
            COUNT(*) as valor
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'Situacion_laboral' IS NOT NULL AND payload->>'Situacion_laboral' != ''
          GROUP BY payload->>'Situacion_laboral'
          ORDER BY valor DESC
        `, [clienteId])
        return { valor: 0, data: laboralResult.rows }

      case 'Antigüedad laboral de los usuarios contactados':
        const antiguedadResult = await query(`
          SELECT 
            payload->>'Antigüedad_laboral' as nombre,
            COUNT(*) as valor
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'Antigüedad_laboral' IS NOT NULL AND payload->>'Antigüedad_laboral' != ''
          GROUP BY payload->>'Antigüedad_laboral'
          ORDER BY valor DESC
        `, [clienteId])
        return { valor: 0, data: antiguedadResult.rows }

      case 'Nivel de estudios de los usuarios contactados':
        const estudiosResult = await query(`
          SELECT 
            payload->>'nivel_estudios' as nombre,
            COUNT(*) as valor
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'nivel_estudios' IS NOT NULL AND payload->>'nivel_estudios' != ''
          GROUP BY payload->>'nivel_estudios'
          ORDER BY valor DESC
        `, [clienteId])
        return { valor: 0, data: estudiosResult.rows }

      case 'Preferencia de turno de contacto':
        const turnoResult = await query(`
          SELECT 
            payload->>'turno_contacto' as nombre,
            COUNT(*) as valor
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'turno_contacto' IS NOT NULL AND payload->>'turno_contacto' != ''
          GROUP BY payload->>'turno_contacto'
          ORDER BY valor DESC
        `, [clienteId])
        return { valor: 0, data: turnoResult.rows }

      case 'Evolución de la duración media de las llamadas por día':
        const avgDailyResult = await query(`
          SELECT 
            TO_CHAR((payload->>'fecha_inicio')::timestamp, 'DD/MM') as fecha,
            AVG((payload->>'duracion_ms')::numeric) as llamadas
          FROM ${tableName}
          WHERE cliente_id = $1 AND payload->>'fecha_inicio' IS NOT NULL AND payload->>'duracion_ms' IS NOT NULL
          GROUP BY TO_CHAR((payload->>'fecha_inicio')::timestamp, 'DD/MM'), (payload->>'fecha_inicio')::timestamp
          ORDER BY (payload->>'fecha_inicio')::timestamp
          LIMIT 30
        `, [clienteId])
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

