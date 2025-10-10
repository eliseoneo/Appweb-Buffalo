import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

interface Insight {
  id: string
  titulo: string
  valor: string | number
  descripcion: string
  tipo: 'metric' | 'trend' | 'alert' | 'recommendation'
  relevancia: number // 0-100
  categoria: string
  icono: string
  color: string
}

interface ChartInsight {
  id: string
  titulo: string
  descripcion: string
  tipo: 'line' | 'bar' | 'donut' | 'area'
  data: any[]
  relevancia: number
  insight: string
}

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
      return NextResponse.json({ 
        insights: [],
        charts: [],
        message: 'Tabla llamadas_data no existe. Usando datos de ejemplo.'
      })
    }

    // Get row count
    const countResult = await query('SELECT COUNT(*) as count FROM llamadas_data')
    const totalLlamadas = parseInt(countResult.rows[0].count)

    if (totalLlamadas === 0) {
      return NextResponse.json({ 
        insights: [],
        charts: [],
        message: 'No hay datos en llamadas_data'
      })
    }

    // AI-driven insights selection
    const insights: Insight[] = []
    const charts: ChartInsight[] = []

    // 1. INSIGHT: Total calls (always relevant)
    insights.push({
      id: 'total-calls',
      titulo: 'Total de Llamadas',
      valor: totalLlamadas.toLocaleString('es-ES'),
      descripcion: 'Volumen total de llamadas procesadas',
      tipo: 'metric',
      relevancia: 100,
      categoria: 'Volumen',
      icono: 'Phone',
      color: 'blue'
    })

    // 2. INSIGHT: Sentiment analysis (high relevance)
    const sentimentResult = await query(`
      SELECT 
        sentimiento,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / ${totalLlamadas}, 2) as porcentaje
      FROM llamadas_data
      WHERE sentimiento IS NOT NULL AND sentimiento != ''
      GROUP BY sentimiento
      ORDER BY count DESC
    `)

    if (sentimentResult.rows.length > 0) {
      const positivo = sentimentResult.rows.find((r: any) => r.sentimiento === 'Positive')
      const negativo = sentimentResult.rows.find((r: any) => r.sentimiento === 'Negative')
      
      const positivoPct = positivo ? parseFloat(positivo.porcentaje) : 0
      const negativoPct = negativo ? parseFloat(negativo.porcentaje) : 0
      
      // Calculate relevance based on sentiment distribution
      const relevancia = positivoPct > 60 ? 95 : (negativoPct > 30 ? 98 : 85)
      
      insights.push({
        id: 'sentiment-score',
        titulo: 'Satisfacción del Cliente',
        valor: `${positivoPct.toFixed(1)}%`,
        descripcion: negativoPct > 30 
          ? '⚠️ Alto nivel de sentimiento negativo detectado'
          : positivoPct > 70 
            ? '✅ Excelente satisfacción del cliente'
            : 'Sentimiento mayormente positivo',
        tipo: negativoPct > 30 ? 'alert' : 'metric',
        relevancia,
        categoria: 'Calidad',
        icono: 'Heart',
        color: positivoPct > 70 ? 'green' : (negativoPct > 30 ? 'red' : 'yellow')
      })

      // Add sentiment chart
      charts.push({
        id: 'sentiment-chart',
        titulo: 'Distribución de Sentimiento',
        descripcion: 'Análisis de satisfacción del cliente',
        tipo: 'donut',
        data: sentimentResult.rows.map((r: any) => ({
          nombre: r.sentimiento,
          valor: parseInt(r.count)
        })),
        relevancia: 90,
        insight: positivoPct > 70 
          ? 'Excelente nivel de satisfacción'
          : negativoPct > 30 
            ? 'Requiere atención inmediata'
            : 'Nivel aceptable de satisfacción'
      })
    }

    // 3. INSIGHT: Conversion rate (interview interest)
    const conversionResult = await query(`
      SELECT 
        CASE 
          WHEN entrevista LIKE '%Quiere entrevista%' THEN 'Convertido'
          WHEN entrevista LIKE '%Sin interes%' THEN 'No Interesado'
          ELSE 'Otros'
        END as estado,
        COUNT(*) as count
      FROM llamadas_data
      WHERE entrevista IS NOT NULL AND entrevista != ''
      GROUP BY estado
    `)

    if (conversionResult.rows.length > 0) {
      const convertidos = conversionResult.rows.find((r: any) => r.estado === 'Convertido')
      const total = conversionResult.rows.reduce((sum: number, r: any) => sum + parseInt(r.count), 0)
      const conversionRate = convertidos ? (parseInt(convertidos.count) / total * 100) : 0
      
      insights.push({
        id: 'conversion-rate',
        titulo: 'Tasa de Conversión',
        valor: `${conversionRate.toFixed(1)}%`,
        descripcion: conversionRate > 25 
          ? '🎯 Excelente tasa de conversión a entrevistas'
          : conversionRate < 10 
            ? '⚠️ Baja conversión, revisar estrategia'
            : 'Tasa de conversión dentro del promedio',
        tipo: conversionRate < 10 ? 'alert' : 'metric',
        relevancia: 95,
        categoria: 'Conversión',
        icono: 'Target',
        color: conversionRate > 25 ? 'green' : (conversionRate < 10 ? 'red' : 'yellow')
      })
    }

    // 4. INSIGHT: Average call duration
    const avgDurationResult = await query(`
      SELECT AVG(duracion_ms) as avg_duration
      FROM llamadas_data
      WHERE duracion_ms IS NOT NULL AND duracion_ms > 0
    `)

    if (avgDurationResult.rows.length > 0) {
      const avgSeconds = avgDurationResult.rows[0].avg_duration || 0
      const avgMinutes = Math.floor(avgSeconds / 60)
      const avgRemainderSeconds = Math.floor(avgSeconds % 60)
      
      insights.push({
        id: 'avg-duration',
        titulo: 'Duración Promedio',
        valor: `${avgMinutes}:${avgRemainderSeconds.toString().padStart(2, '0')}`,
        descripcion: avgSeconds > 300 
          ? 'Llamadas largas - buena interacción'
          : avgSeconds < 60 
            ? '⚠️ Llamadas muy cortas - posible problema'
            : 'Duración óptima de llamada',
        tipo: avgSeconds < 60 ? 'alert' : 'metric',
        relevancia: 80,
        categoria: 'Eficiencia',
        icono: 'Clock',
        color: avgSeconds > 180 ? 'green' : (avgSeconds < 60 ? 'red' : 'blue')
      })
    }

    // 5. CHART: Call volume trend (last 30 days)
    const trendResult = await query(`
      SELECT 
        TO_CHAR(fecha_inicio, 'DD/MM') as fecha,
        COUNT(*) as llamadas
      FROM llamadas_data
      WHERE fecha_inicio IS NOT NULL
        AND fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY TO_CHAR(fecha_inicio, 'DD/MM'), fecha_inicio
      ORDER BY fecha_inicio
    `)

    if (trendResult.rows.length > 0) {
      // Calculate trend
      const firstWeek = trendResult.rows.slice(0, 7).reduce((sum: number, r: any) => sum + parseInt(r.llamadas), 0) / 7
      const lastWeek = trendResult.rows.slice(-7).reduce((sum: number, r: any) => sum + parseInt(r.llamadas), 0) / 7
      const trend = ((lastWeek - firstWeek) / firstWeek * 100)
      
      charts.push({
        id: 'call-trend',
        titulo: 'Tendencia de Llamadas',
        descripcion: 'Evolución del volumen en los últimos 30 días',
        tipo: 'area',
        data: trendResult.rows,
        relevancia: 85,
        insight: trend > 10 
          ? `📈 Crecimiento del ${trend.toFixed(1)}% - Tendencia positiva`
          : trend < -10 
            ? `📉 Reducción del ${Math.abs(trend).toFixed(1)}% - Requiere atención`
            : '➡️ Volumen estable'
      })
    }

    // 6. CHART: Top disconnect reasons
    const disconnectResult = await query(`
      SELECT 
        razon_desconexion as nombre,
        COUNT(*) as valor
      FROM llamadas_data
      WHERE razon_desconexion IS NOT NULL AND razon_desconexion != ''
      GROUP BY razon_desconexion
      ORDER BY valor DESC
      LIMIT 5
    `)

    if (disconnectResult.rows.length > 0) {
      const topReason = disconnectResult.rows[0]
      const topReasonPct = (parseInt(topReason.valor) / totalLlamadas * 100)
      
      charts.push({
        id: 'disconnect-reasons',
        titulo: 'Principales Motivos de Desconexión',
        descripcion: 'Análisis de por qué terminan las llamadas',
        tipo: 'bar',
        data: disconnectResult.rows,
        relevancia: 80,
        insight: topReason.nombre.includes('cuelga') 
          ? `${topReason.nombre} representa ${topReasonPct.toFixed(1)}% de desconexiones`
          : `Principal causa: ${topReason.nombre}`
      })
    }

    // 7. RECOMMENDATION: Best time to call
    const turnoResult = await query(`
      SELECT 
        turno_contacto as nombre,
        COUNT(*) as valor
      FROM llamadas_data
      WHERE turno_contacto IS NOT NULL 
        AND turno_contacto != '' 
        AND turno_contacto != 'NULL'
      GROUP BY turno_contacto
      ORDER BY valor DESC
      LIMIT 1
    `)

    if (turnoResult.rows.length > 0) {
      const bestTime = turnoResult.rows[0].nombre
      insights.push({
        id: 'best-time',
        titulo: 'Mejor Horario para Contactar',
        valor: bestTime,
        descripcion: `La mayoría de contactos prefieren ${bestTime}`,
        tipo: 'recommendation',
        relevancia: 75,
        categoria: 'Optimización',
        icono: 'Clock',
        color: 'purple'
      })
    }

    // 8. INSIGHT: Cost efficiency
    const costResult = await query(`
      SELECT 
        SUM(coste_total) as total_cost,
        AVG(coste_total) as avg_cost
      FROM llamadas_data
      WHERE coste_total IS NOT NULL AND coste_total > 0
    `)

    if (costResult.rows.length > 0 && costResult.rows[0].total_cost) {
      const totalCost = parseFloat(costResult.rows[0].total_cost)
      const avgCost = parseFloat(costResult.rows[0].avg_cost)
      
      insights.push({
        id: 'total-cost',
        titulo: 'Costo Total',
        valor: `€${totalCost.toFixed(2)}`,
        descripcion: `Costo promedio por llamada: €${avgCost.toFixed(2)}`,
        tipo: 'metric',
        relevancia: 85,
        categoria: 'Costos',
        icono: 'DollarSign',
        color: avgCost > 1 ? 'red' : (avgCost > 0.5 ? 'yellow' : 'green')
      })
    }

    // Sort by relevance
    insights.sort((a, b) => b.relevancia - a.relevancia)
    charts.sort((a, b) => b.relevancia - a.relevancia)

    return NextResponse.json({
      insights: insights.slice(0, 8), // Top 8 insights
      charts: charts.slice(0, 6), // Top 6 charts
      totalLlamadas,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching IA insights:', error)
    return NextResponse.json(
      { 
        error: 'Error al generar insights con IA',
        insights: [],
        charts: []
      },
      { status: 500 }
    )
  }
}

