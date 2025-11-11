import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

interface Params {
  params: { id: string }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const id = Number(params.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ success: false, message: 'ID inválido' }, { status: 400 })
    }

    const body = await request.json()
    const {
      estado,
      datosSolucion,
      tiempoAplicadoSolucion,
      fechaResolucion,
      fechaPostergado
    } = body || {}

    if (!estado) {
      return NextResponse.json({ success: false, message: 'estado es requerido' }, { status: 400 })
    }

    // If closing the issue, ensure fecha_resolucion is set to NOW() when not provided
    const sql = `
      UPDATE incidencias
      SET
        estado = $2::varchar,
        datos_solucion = COALESCE($3::text, datos_solucion),
        tiempo_aplicado_solucion = COALESCE($4::integer, tiempo_aplicado_solucion),
        fecha_resolucion = COALESCE(
          $5::timestamp,
          CASE WHEN $6::varchar IN ('resuelta','cerrada') THEN NOW() ELSE fecha_resolucion END
        ),
        fecha_postergado = COALESCE(
          $7::timestamp,
          CASE WHEN $8::varchar = 'postergada' THEN NOW() ELSE fecha_postergado END
        ),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `
    const paramsArr = [
      id,
      String(estado),
      datosSolucion ?? null,
      tiempoAplicadoSolucion ?? null,
      fechaResolucion ?? null,
      String(estado),
      fechaPostergado ?? null,
      String(estado),
    ]

    const res = await query(sql, paramsArr)
    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, message: 'Incidencia no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ PUT /api/admin/incidencias/[id] error:', err)
    return NextResponse.json({ success: false, message: 'Error al actualizar incidencia' }, { status: 500 })
  }
}


