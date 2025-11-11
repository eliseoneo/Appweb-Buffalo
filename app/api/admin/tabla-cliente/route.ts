import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/database'

// POST /api/admin/tabla-cliente
// Body: { clienteId: number | string, tablaCliente: string }
export async function POST(request: NextRequest) {
  const client = await getPool().connect()
  try {
    const body = await request.json().catch(() => ({}))
    const rawClienteId = body?.clienteId
    const rawTabla = body?.tablaCliente

    if (!rawClienteId || !rawTabla) {
      return NextResponse.json(
        { success: false, message: 'Parametros requeridos: clienteId, tablaCliente' },
        { status: 400 }
      )
    }

    // Sanitize/normalize table name: lowercase, underscores, remove invalid chars
    const tablaCliente = String(rawTabla)
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]+/g, '_')
      .replace(/^_+|_+$/g, '')

    await client.query('BEGIN')
    // Ensure column exists
    await client.query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tabla_cliente VARCHAR(250)`)

    // Update value
    const idNum = parseInt(String(rawClienteId), 10)
    const isNumeric = !isNaN(idNum) && String(idNum) === String(rawClienteId)
    if (isNumeric) {
      await client.query(`UPDATE clientes SET tabla_cliente = $1 WHERE id = $2`, [tablaCliente, idNum])
    } else {
      await client.query(`UPDATE clientes SET tabla_cliente = $1 WHERE id::text = $2`, [tablaCliente, String(rawClienteId)])
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true, clienteId: rawClienteId, tablaCliente })
  } catch (error: any) {
    await client.query('ROLLBACK')
    console.error('❌ Error updating tabla_cliente:', error)
    return NextResponse.json({ success: false, message: error?.message || 'Error' }, { status: 500 })
  } finally {
    client.release()
  }
}


