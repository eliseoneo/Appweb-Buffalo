import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone_e164, clienteId } = body

    // Validaciones básicas
    if (!name || !phone_e164 || !clienteId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Faltan campos obligatorios: name, phone_e164, clienteId' 
        },
        { status: 400 }
      )
    }

    // Validar formato del teléfono
    if (!phone_e164.match(/^\+34\d{9}$/)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Formato de teléfono inválido. Debe ser +34XXXXXXXXX' 
        },
        { status: 400 }
      )
    }

    // Validar nombre
    if (name.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'El nombre debe tener al menos 2 caracteres' 
        },
        { status: 400 }
      )
    }

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simular diferentes respuestas para testing
    const random = Math.random()
    
    if (random > 0.85) {
      // 15% de probabilidad de error simulado
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error simulado del sistema. Inténtalo de nuevo.' 
        },
        { status: 500 }
      )
    }

    // Log del lead recibido (en producción esto iría a una base de datos)
    console.log('🎯 Lead de prueba recibido:', {
      timestamp: new Date().toISOString(),
      clienteId,
      leadData: {
        name: name.trim(),
        phone_e164,
        source: 'test_form'
      }
    })

    // Respuesta de éxito
    return NextResponse.json({
      success: true,
      message: 'Lead enviado correctamente al agente de llamadas',
      data: {
        leadId: `lead_${Date.now()}`,
        clienteId,
        name: name.trim(),
        phone_e164,
        createdAt: new Date().toISOString(),
        status: 'pending_call'
      }
    })

  } catch (error) {
    console.error('Error en endpoint llamadas-test:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}

// Manejar método no permitido
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Método no permitido. Usa POST.' 
    },
    { status: 405 }
  )
}
