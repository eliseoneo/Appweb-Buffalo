import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      console.log('❌ Sin token')
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const decoded = verifyToken(token)
    
    if (!decoded) {
      console.log('❌ Token inválido o expirado')
      return NextResponse.json(
        { success: false, message: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    // Get user from database to ensure it still exists and is active
    const userResult = await query(
      `SELECT 
        u.id,
        u.username,
        u.tipo_usuario,
        u.activo,
        c.id as cliente_id
       FROM usuarios u
       LEFT JOIN clientes c ON c.usuario_id = u.id
       WHERE u.id = $1`,
      [decoded.id]
    )

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado en la base de datos')
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0]

    if (!user.activo) {
      console.log('❌ Usuario inactivo')
      return NextResponse.json(
        { success: false, message: 'Usuario inactivo' },
        { status: 401 }
      )
    }

    // Build user response
    const userResponse: any = {
      id: user.id,
      username: user.username,
      tipo_usuario: user.tipo_usuario,
      activo: user.activo,
    }

    // Add cliente_id if user is a client
    if (user.tipo_usuario === 'cliente' && user.cliente_id) {
      userResponse.cliente_id = user.cliente_id
    }

    console.log('✅ Usuario autenticado:', user.username)
    return NextResponse.json({
      success: true,
      user: userResponse,
    })

  } catch (error) {
    console.error('❌ Error en /api/auth/me:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno' },
      { status: 500 }
    )
  }
}