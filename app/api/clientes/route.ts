import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

// GET /api/clientes - get clientes; supports optional pagination and search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const pageParam = searchParams.get('page')
    const pageSizeParam = searchParams.get('pageSize')

    const isPaginated = !!(pageParam || pageSizeParam || q)
    const page = Math.max(1, parseInt(pageParam || '1', 10))
    const pageSizeRaw = parseInt(pageSizeParam || '50', 10)
    const pageSize = Math.min(200, Math.max(1, Number.isFinite(pageSizeRaw) ? pageSizeRaw : 50))
    const offset = (page - 1) * pageSize

    const where: string[] = []
    const params: any[] = []
    if (q) {
      const like = `%${q}%`
      const i1 = params.push(like)
      const i2 = params.push(like)
      const i3 = params.push(like)
      where.push(`(c.nombre_empresa ILIKE $${i1} OR u.username ILIKE $${i2} OR p.nombre ILIKE $${i3})`)
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    if (isPaginated) {
      const countSql = `
        SELECT COUNT(*) AS total
        FROM clientes c
        JOIN usuarios u ON c.usuario_id = u.id
        LEFT JOIN partnerships p ON c.partnership_id = p.id
        ${whereSql}
      `
      const countRes = await query(countSql, params)
      const total = Number(countRes.rows?.[0]?.total || 0)

      const p2 = params.slice()
      p2.push(pageSize)
      const limitIndex = p2.length
      p2.push(offset)
      const offsetIndex = p2.length

      const sql = `
        SELECT 
          c.id,
          c.nombre_empresa,
          c.logo_empresa,
          c.activo,
          c.fecha_creacion,
          c.created_at,
          c.personalizacion,
          u.username,
          p.id as partnership_id,
          p.nombre as partnership_nombre
        FROM clientes c
        JOIN usuarios u ON c.usuario_id = u.id
        LEFT JOIN partnerships p ON c.partnership_id = p.id
        ${whereSql}
        ORDER BY 
          CASE WHEN c.partnership_id IS NULL THEN 0 ELSE 1 END,
          p.nombre NULLS LAST,
          c.nombre_empresa
        LIMIT $${limitIndex} OFFSET $${offsetIndex}
      `
      const result = await query(sql, p2)

      const clientes = result.rows.map(row => {
        const personalizacion = row.personalizacion || {}
        const colors = personalizacion.color || []
        const colorPrincipal = colors.length > 0 ? colors[0] : '#00C896'
        return {
          id: row.id,
          nombreEmpresa: row.nombre_empresa,
          usuario: row.username,
          tipo: row.partnership_id ? 'Partnership' as const : 'Directo' as const,
          estado: row.activo ? 'Activo' as const : 'Inactivo' as const,
          fechaCreacion: row.fecha_creacion || row.created_at,
          logo: row.logo_empresa || '',
          partnership: row.partnership_nombre || undefined,
          partnership_id: row.partnership_id || undefined,
          personalizacion,
          colorPrincipal,
          verticales: [],
          webhooks: []
        }
      })

      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      return NextResponse.json({ success: true, clientes, page, pageSize, total, totalPages })
    } else {
      const result = await query(
        `SELECT 
          c.id,
          c.nombre_empresa,
          c.logo_empresa,
          c.activo,
          c.fecha_creacion,
          c.created_at,
          c.personalizacion,
          u.username,
          p.id as partnership_id,
          p.nombre as partnership_nombre
        FROM clientes c
        JOIN usuarios u ON c.usuario_id = u.id
        LEFT JOIN partnerships p ON c.partnership_id = p.id
        ORDER BY 
          CASE WHEN c.partnership_id IS NULL THEN 0 ELSE 1 END,
          p.nombre NULLS LAST,
          c.nombre_empresa`
      )

      const clientes = result.rows.map(row => {
        const personalizacion = row.personalizacion || {}
        const colors = personalizacion.color || []
        const colorPrincipal = colors.length > 0 ? colors[0] : '#00C896'
        
        return {
          id: row.id,
          nombreEmpresa: row.nombre_empresa,
          usuario: row.username,
          tipo: row.partnership_id ? 'Partnership' as const : 'Directo' as const,
          estado: row.activo ? 'Activo' as const : 'Inactivo' as const,
          fechaCreacion: row.fecha_creacion || row.created_at,
          logo: row.logo_empresa || '',
          partnership: row.partnership_nombre || undefined,
          partnership_id: row.partnership_id || undefined,
          personalizacion,
          colorPrincipal,
          verticales: [],
          webhooks: []
        }
      })

      return NextResponse.json({ success: true, clientes })
    }
  } catch (error) {
    console.error('❌ Error fetching clientes:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

