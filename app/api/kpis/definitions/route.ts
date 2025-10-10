import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET() {
  try {
    // Fetch KPI definitions from crear_kpis table
    const result = await query(`
      SELECT kpis 
      FROM public.crear_kpis 
      WHERE kpis IS NOT NULL
      LIMIT 1
    `)

    if (result.rows.length === 0 || !result.rows[0].kpis) {
      return NextResponse.json([], { status: 200 })
    }

    // Parse the JSON strings in the kpis array
    const kpisArray = result.rows[0].kpis
    const parsedKpis = kpisArray.map((kpiString: string) => {
      try {
        return JSON.parse(kpiString)
      } catch (e) {
        console.error('Error parsing KPI string:', kpiString, e)
        return null
      }
    }).filter((kpi: any) => kpi !== null)

    return NextResponse.json(parsedKpis)
  } catch (error) {
    console.error('Error fetching KPI definitions:', error)
    return NextResponse.json(
      { error: 'Error al cargar las definiciones de KPIs' },
      { status: 500 }
    )
  }
}

