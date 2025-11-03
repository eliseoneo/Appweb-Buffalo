import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

// GET /api/clientes/stats - get statistics about clientes
export async function GET() {
  try {
    // Get stats from database
    // Clientes Directos: clientes without partnership_id (or partnership_id is null)
    const directosResult = await query(
      `SELECT COUNT(*) as count 
       FROM clientes c
       WHERE c.partnership_id IS NULL`
    )

    // Activos: clientes with activo = true
    const activosResult = await query(
      `SELECT COUNT(*) as count 
       FROM clientes c
       WHERE c.activo = true`
    )

    // Inactivos: clientes with activo = false
    const inactivosResult = await query(
      `SELECT COUNT(*) as count 
       FROM clientes c
       WHERE c.activo = false`
    )

    // Partnerships: count from partnerships table
    const partnershipsResult = await query(
      `SELECT COUNT(*) as count 
       FROM partnerships`
    )

    return NextResponse.json({
      success: true,
      stats: {
        directos: parseInt(directosResult.rows[0].count),
        partnerships: parseInt(partnershipsResult.rows[0].count),
        activos: parseInt(activosResult.rows[0].count),
        inactivos: parseInt(inactivosResult.rows[0].count)
      }
    })
  } catch (error) {
    console.error('❌ Error fetching clientes stats:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}

