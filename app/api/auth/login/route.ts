import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log('🔐 Intento de login:', { username, password })

    // Credenciales simples
    if (username === 'admin' && password === 'admin123') {
      console.log('✅ Login admin exitoso')
      
      const response = NextResponse.json({
        success: true,
        message: 'Login exitoso',
        user: {
          id: 1,
          username: 'admin',
          tipo_usuario: 'admin',
          activo: true
        }
      })

      // Cookie simple
      response.cookies.set('auth-token', 'admin-token-123', {
        httpOnly: true,
        maxAge: 24 * 60 * 60
      })

      return response
    }

    if (username === 'cliente' && password === 'admin123') {
      console.log('✅ Login cliente exitoso')
      
      const response = NextResponse.json({
        success: true,
        message: 'Login exitoso',
        user: {
          id: 2,
          username: 'cliente',
          tipo_usuario: 'cliente',
          cliente_id: 'techcorp', // ID del cliente por defecto
          activo: true
        }
      })

      response.cookies.set('auth-token', 'cliente-token-123', {
        httpOnly: true,
        maxAge: 24 * 60 * 60
      })

      return response
    }

    console.log('❌ Credenciales inválidas')
    return NextResponse.json(
      { success: false, message: 'Credenciales inválidas' },
      { status: 401 }
    )

  } catch (error) {
    console.error('❌ Error en login:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno' },
      { status: 500 }
    )
  }
}