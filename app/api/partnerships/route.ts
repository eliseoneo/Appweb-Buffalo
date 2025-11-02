import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

// GET /api/partnerships - list partnerships
export async function GET() {
  try {
    const result = await query(
      'SELECT id, nombre, slug, created_at, updated_at FROM partnerships ORDER BY created_at DESC'
    )
    return NextResponse.json({ success: true, partnerships: result.rows })
  } catch (error) {
    console.error('❌ Error listing partnerships:', error)
    return NextResponse.json({ success: false, message: 'Error al listar partnerships' }, { status: 500 })
  }
}

// POST /api/partnerships - create partnership { nombre: string }
export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json()

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Nombre es requerido' }, { status: 400 })
    }

    const cleanNombre = nombre.trim()
    const slug = cleanNombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const insert = await query(
      'INSERT INTO partnerships (nombre, slug) VALUES ($1, $2) RETURNING id, nombre, slug, created_at, updated_at',
      [cleanNombre, slug]
    )

    return NextResponse.json({ success: true, partnership: insert.rows[0] }, { status: 201 })
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ success: false, message: 'El partnership ya existe' }, { status: 409 })
    }
    console.error('❌ Error creating partnership:', error)
    return NextResponse.json({ success: false, message: 'Error al crear partnership' }, { status: 500 })
  }
}

// DELETE /api/partnerships?id=123 - delete partnership by id or nombre
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const nombre = searchParams.get('nombre')

    if (!id && !nombre) {
      return NextResponse.json({ success: false, message: 'ID o nombre es requerido' }, { status: 400 })
    }

    let deleteQuery
    let params: any[]

    if (id) {
      deleteQuery = 'DELETE FROM partnerships WHERE id = $1 RETURNING id, nombre'
      params = [id]
    } else {
      deleteQuery = 'DELETE FROM partnerships WHERE nombre = $1 RETURNING id, nombre'
      params = [nombre]
    }

    const result = await query(deleteQuery, params)

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Partnership no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Partnership eliminado', partnership: result.rows[0] })
  } catch (error) {
    console.error('❌ Error deleting partnership:', error)
    return NextResponse.json({ success: false, message: 'Error al eliminar partnership' }, { status: 500 })
  }
}


