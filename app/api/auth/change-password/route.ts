import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { verifyToken } from '@/lib/auth'
import { verifyPassword, hashPassword } from '@/lib/auth'

/**
 * POST /api/auth/change-password
 * Changes the password for the authenticated user
 * 
 * Body:
 * - currentPassword: string (required)
 * - newPassword: string (required)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    // Get request body
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Contraseña actual y nueva contraseña son requeridas' },
        { status: 400 }
      )
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Get user from database
    const userResult = await query(
      'SELECT id, username, password_hash, activo FROM usuarios WHERE id = $1',
      [decoded.id]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const user = userResult.rows[0]

    if (!user.activo) {
      return NextResponse.json(
        { success: false, message: 'Usuario inactivo' },
        { status: 403 }
      )
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password_hash)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Contraseña actual incorrecta' },
        { status: 401 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password in database
    await query(
      'UPDATE usuarios SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, user.id]
    )

    console.log(`✅ Contraseña actualizada para usuario: ${user.username}`)

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    })

  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/auth/update-user-password
 * Admin endpoint to update any user's password
 * 
 * Body:
 * - userId: number (required)
 * - newPassword: string (required)
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    // Only admins can update other users' passwords
    if (decoded.tipo_usuario !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Solo administradores pueden actualizar contraseñas de otros usuarios' },
        { status: 403 }
      )
    }

    // Get request body
    const { userId, newPassword } = await request.json()

    if (!userId || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario y nueva contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Check if target user exists
    const userResult = await query(
      'SELECT id, username FROM usuarios WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password in database
    await query(
      'UPDATE usuarios SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    )

    console.log(`✅ Contraseña actualizada por admin ${decoded.username} para usuario ID: ${userId}`)

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    })

  } catch (error) {
    console.error('❌ Error al actualizar contraseña:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

