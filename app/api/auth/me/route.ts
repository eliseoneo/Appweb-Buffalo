import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get('auth-token')?.value

    console.log('🔍 Token recibido:', token)

    if (!token) {
      console.log('❌ Sin token')
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar token simple
    if (token === 'admin-token-123') {
      console.log('✅ Token admin válido')
      return NextResponse.json({
        success: true,
        user: {
          id: 1,
          username: 'admin',
          tipo_usuario: 'admin',
          activo: true
        }
      })
    }

    if (token === 'cliente-token-123') {
      console.log('✅ Token cliente válido')
      return NextResponse.json({
        success: true,
        user: {
          id: 2,
          username: 'cliente',
          tipo_usuario: 'cliente',
          activo: true
        }
      })
    }

    console.log('❌ Token inválido:', token)
    return NextResponse.json(
      { success: false, message: 'Token inválido' },
      { status: 401 }
    )

  } catch (error) {
    console.error('❌ Error en /api/auth/me:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno' },
      { status: 500 }
    )
  }
}