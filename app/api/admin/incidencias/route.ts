import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')
    const estado = searchParams.get('estado')
    const q = searchParams.get('q') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSizeRaw = parseInt(searchParams.get('pageSize') || '20', 10)
    const pageSize = Math.min(100, Math.max(1, Number.isFinite(pageSizeRaw) ? pageSizeRaw : 20))
    const offset = (page - 1) * pageSize

    const params: any[] = []
    const where: string[] = []
    if (clienteId) {
      params.push(Number(clienteId))
      where.push(`i.cliente_id = $${params.length}`)
    }
    if (estado) {
      params.push(estado)
      where.push(`i.estado = $${params.length}`)
    }
    if (q) {
      const like = `%${q}%`
      // Use separate params for each ILIKE to avoid reusing index confusion
      const p1 = params.push(like)
      const p2 = params.push(like)
      const p3 = params.push(like)
      const p4 = params.push(like)
      where.push(`(c.nombre_empresa ILIKE $${p1} OR i.descripcion ILIKE $${p2} OR i.estado ILIKE $${p3} OR i.prioridad ILIKE $${p4})`)
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const countSql = `
      SELECT COUNT(*) AS total
      FROM incidencias i
      JOIN clientes c ON c.id = i.cliente_id
      ${whereSql}
    `
    const countRes = await query(countSql, params)
    const total = Number(countRes.rows?.[0]?.total || 0)

    // Add limit/offset params
    const paginatedParams = params.slice()
    paginatedParams.push(pageSize)
    const limitIndex = paginatedParams.length
    paginatedParams.push(offset)
    const offsetIndex = paginatedParams.length

    const sql = `
      SELECT 
        i.id,
        i.cliente_id,
        c.nombre_empresa AS cliente_nombre,
        i.fecha_crea_incidencia,
        i.estado,
        i.descripcion,
        i.prioridad,
        i.fecha_resolucion,
        i.fecha_postergado,
        i.datos_solucion,
        i.tiempo_aplicado_solucion,
        i.contacto_crea_incidencia,
        i.created_at,
        i.updated_at
      FROM incidencias i
      JOIN clientes c ON c.id = i.cliente_id
      ${whereSql}
      ORDER BY i.fecha_crea_incidencia DESC, i.id DESC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}
    `
    const res = await query(sql, paginatedParams)
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    return NextResponse.json({ success: true, data: res.rows, page, pageSize, total, totalPages })
  } catch (err) {
    console.error('❌ GET /api/admin/incidencias error:', err)
    return NextResponse.json({ success: false, message: 'Error al obtener incidencias' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      clienteId,
      estado,
      descripcion,
      prioridad,
      fechaResolucion,
      fechaPostergado,
      datosSolucion,
      tiempoAplicadoSolucion,
      contactoCreaIncidencia
    } = body || {}

    if (!clienteId || !estado || !descripcion) {
      return NextResponse.json({ success: false, message: 'clienteId, estado y descripcion son obligatorios' }, { status: 400 })
    }

    const sql = `
      INSERT INTO incidencias (
        cliente_id, estado, descripcion, prioridad, 
        fecha_resolucion, fecha_postergado, datos_solucion, 
        tiempo_aplicado_solucion, contacto_crea_incidencia, fecha_crea_incidencia
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
      )
      RETURNING id
    `
    const params = [
      Number(clienteId),
      String(estado),
      String(descripcion),
      prioridad ?? null,
      fechaResolucion ?? null,
      fechaPostergado ?? null,
      datosSolucion ?? null,
      tiempoAplicadoSolucion ?? null,
      contactoCreaIncidencia ?? null
    ]

    const res = await query(sql, params)
    return NextResponse.json({ success: true, id: res.rows[0]?.id })
  } catch (err) {
    console.error('❌ POST /api/admin/incidencias error:', err)
    return NextResponse.json({ success: false, message: 'Error al crear incidencia' }, { status: 500 })
  }
}


