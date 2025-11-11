import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/database'
import { hashPassword } from '@/lib/auth'

// GET /api/clientes/[id] - get a specific cliente
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('🔍 Fetching cliente with ID:', id, 'Type:', typeof id)
    
    const pool = getPool()
    
    // Try to query by ID
    // Since clientes.id is SERIAL (INTEGER), we should query as integer
    let result
    
    // Check if id is a valid number
    const idAsNumber = parseInt(String(id), 10)
    const isValidNumber = !isNaN(idAsNumber) && String(idAsNumber) === String(id)
    
    if (isValidNumber) {
      console.log('🔍 Querying as INTEGER:', idAsNumber)
      result = await pool.query(
        `SELECT 
          c.id,
          c.nombre_empresa,
          c.logo_empresa,
          c.activo,
          c.personalizacion,
          c.webhook_url,
          u.username,
          p.id as partnership_id,
          p.nombre as partnership_nombre
         FROM clientes c
         JOIN usuarios u ON c.usuario_id = u.id
         LEFT JOIN partnerships p ON c.partnership_id = p.id
         WHERE c.id = $1`,
        [idAsNumber]
      )
    } else {
      // If not a valid number, try as text (for UUIDs if they exist)
      console.log('🔍 Querying as TEXT:', String(id))
      result = await pool.query(
        `SELECT 
          c.id,
          c.nombre_empresa,
          c.logo_empresa,
          c.activo,
          c.personalizacion,
          c.webhook_url,
          u.username,
          p.id as partnership_id,
          p.nombre as partnership_nombre
         FROM clientes c
         JOIN usuarios u ON c.usuario_id = u.id
         LEFT JOIN partnerships p ON c.partnership_id = p.id
         WHERE c.id::text = $1`,
        [String(id)]
      )
    }
    
    console.log('📊 Query result:', result.rows.length, 'rows found')
    if (result.rows.length > 0) {
      console.log('✅ Cliente encontrado:', result.rows[0].id, result.rows[0].nombre_empresa)
    } else {
      console.log('❌ No se encontró cliente con ID:', id)
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    const row = result.rows[0]
    const personalizacion = row.personalizacion || {}
    const colors = personalizacion.color || []
    const colorPrincipal = colors.length > 0 ? colors[0] : '#00C896'

    return NextResponse.json({
      success: true,
      cliente: {
        id: row.id,
        nombreEmpresa: row.nombre_empresa,
        usuario: row.username,
        tipo: row.partnership_id ? 'Partnership' as const : 'Directo' as const,
        estado: row.activo ? 'Activo' as const : 'Inactivo' as const,
        logo: row.logo_empresa || '',
        partnership: row.partnership_nombre || undefined,
        partnership_id: row.partnership_id || undefined,
        webhook_url: row.webhook_url || null,
        personalizacion: personalizacion,
        colorPrincipal: colorPrincipal
      }
    })
  } catch (error) {
    console.error('❌ Error fetching cliente:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener el cliente' },
      { status: 500 }
    )
  }
}

// PUT /api/clientes/[id] - update a cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await getPool().connect()
  
  try {
    await client.query('BEGIN')
    
    const { id } = params
    const body = await request.json()

    // Get current cliente to preserve data
    const currentResult = await client.query(
      'SELECT usuario_id, personalizacion FROM clientes WHERE id = $1',
      [id]
    )

    if (currentResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json(
        { success: false, message: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    const currentCliente = currentResult.rows[0]
    const currentPersonalizacion = currentCliente.personalizacion || {}

    // Update personalizacion with new colors
    const updatedPersonalizacion = {
      ...currentPersonalizacion,
      color: body.coloresPrincipales || currentPersonalizacion.color || ['#00C896', '#0066CC', '#FF6B6B']
    }

    // Update cliente
    await client.query(
      `UPDATE clientes 
       SET nombre_empresa = $1, 
           logo_empresa = $2,
           personalizacion = $3
       WHERE id = $4`,
      [
        body.nombreEmpresa,
        body.logo || null,
        updatedPersonalizacion,
        id
      ]
    )

    // Update usuario if username or password changed
    if (body.usuario || body.password) {
      if (body.password && body.password.trim()) {
        // Hash new password
        const passwordHash = await hashPassword(body.password)
        await client.query(
          'UPDATE usuarios SET username = COALESCE($1, username), password_hash = $2 WHERE id = $3',
          [body.usuario || null, passwordHash, currentCliente.usuario_id]
        )
      } else if (body.usuario) {
        // Only update username
        await client.query(
          'UPDATE usuarios SET username = $1 WHERE id = $2',
          [body.usuario, currentCliente.usuario_id]
        )
      }
    }

    await client.query('COMMIT')

    return NextResponse.json({
      success: true,
      message: 'Cliente actualizado exitosamente'
    })

  } catch (error: any) {
    await client.query('ROLLBACK')
    console.error('❌ Error updating cliente:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al actualizar el cliente',
        error: error.message 
      },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

