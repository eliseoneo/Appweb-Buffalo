import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log('🔐 Intento de login:', { username })

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Query user from database
    const userResult = await query(
      `SELECT 
        u.id,
        u.username,
        u.password_hash,
        u.tipo_usuario,
        u.activo,
        c.id as cliente_id
       FROM usuarios u
       LEFT JOIN clientes c ON c.usuario_id = u.id
       WHERE u.username = $1`,
      [username]
    )

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado:', username)
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0]

    if (!user.activo) {
      console.log('❌ Usuario inactivo:', username)
      return NextResponse.json(
        { success: false, message: 'Usuario inactivo' },
        { status: 401 }
      )
    }

    // Trim password hash in case there are any whitespace issues
    const passwordHash = user.password_hash?.trim()

    if (!passwordHash) {
      console.log('❌ Password hash no encontrado para:', username)
      return NextResponse.json(
        { success: false, message: 'Error de autenticación' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, passwordHash)
    
    if (!isPasswordValid) {
      console.log('❌ Contraseña incorrecta para:', username)
      console.log('🔍 Debug - Hash recibido:', user.password_hash?.substring(0, 20) + '...')
      console.log('🔍 Debug - Hash length:', user.password_hash?.length)
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Update last access time
    await query(
      'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )

    console.log('✅ Login exitoso para:', username)

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      tipo_usuario: user.tipo_usuario,
    })

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

    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: userResponse,
    })

    // Set JWT token in cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return response

  } catch (error) {
    console.error('❌ Error en login:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}