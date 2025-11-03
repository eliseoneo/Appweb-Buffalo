import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

// GET /api/clientes - get all clientes with their partnership relationships
export async function GET() {
  try {
    const result = await query(
      `SELECT 
        c.id,
        c.nombre_empresa,
        c.logo_empresa,
        c.activo,
        c.fecha_creacion,
        c.created_at,
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

    const clientes = result.rows.map(row => ({
      id: row.id,
      nombreEmpresa: row.nombre_empresa,
      usuario: row.username,
      tipo: row.partnership_id ? 'Partnership' as const : 'Directo' as const,
      estado: row.activo ? 'Activo' as const : 'Inactivo' as const,
      fechaCreacion: row.fecha_creacion || row.created_at,
      logo: row.logo_empresa || '',
      partnership: row.partnership_nombre || undefined,
      partnership_id: row.partnership_id || undefined,
      colorPrincipal: '#00C896', // Default color
      verticales: [],
      webhooks: []
    }))

    return NextResponse.json({ success: true, clientes })
  } catch (error) {
    console.error('❌ Error fetching clientes:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

