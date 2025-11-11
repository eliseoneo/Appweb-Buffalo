import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')
    const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10) || 200, 1000)

    const params: any[] = []
    let where = ''
    if (clienteId) {
      params.push(clienteId)
      where = `WHERE m.cliente_id = $1`
    }

    const sql = `
      SELECT 
        m.id,
        m.cliente_id,
        c.nombre_empresa as cliente_nombre,
        m.aplicacion_id,
        m.tipo_metrica,
        m.valor,
        m.fecha_metrica,
        m.metadata
      FROM metricas m
      LEFT JOIN clientes c ON c.id = m.cliente_id
      ${where}
      ORDER BY m.fecha_metrica DESC
      LIMIT ${limit}
    `

    const res = await query(sql, params)
    return NextResponse.json({ success: true, data: res.rows })
  } catch (error) {
    console.error('❌ Error fetching metricas:', error)
    return NextResponse.json({ success: false, message: 'Error al obtener métricas' }, { status: 500 })
  }
}


