import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/database'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const client = await getPool().connect()
  
  try {
    await client.query('BEGIN')
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.usuario || !body.password || !body.nombreEmpresa) {
      await client.query('ROLLBACK')
      return NextResponse.json(
        { success: false, message: 'Campos obligatorios faltantes: usuario, password, nombreEmpresa' },
        { status: 400 }
      )
    }

    // Validate password minimum length
    if (body.password.length < 6) {
      await client.query('ROLLBACK')
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Step 1: Insert into usuarios
    // Hash password securely using bcrypt (password is NOT stored in plain text)
    console.log('🔐 Cifrando contraseña usando bcrypt...')
    const passwordHash = await hashPassword(body.password)
    console.log('✅ Contraseña cifrada exitosamente (hash generado)')
    
    const usuarioResult = await client.query(
      `INSERT INTO usuarios (username, password_hash, tipo_usuario, activo)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [body.usuario, passwordHash, 'cliente', true]
    )
    const usuarioId = usuarioResult.rows[0].id
    console.log(`✅ Usuario creado con ID: ${usuarioId}`)

    // Step 2: Insert into clientes (includes personalizacion from Step 2)
    // Map tipoCliente from form to database values
    let tipoClienteDb = 'empresa' // default
    let partnershipId = null
    
    if (body.tipoCliente) {
      if (body.tipoCliente === 'Directo') {
        tipoClienteDb = 'empresa'
        partnershipId = null
      } else if (body.tipoCliente.startsWith('Partnership:')) {
        // For partnerships, get partnership_id
        tipoClienteDb = 'empresa'
        if (body.partnership_id) {
          partnershipId = body.partnership_id
          console.log(`✅ Partnership ID recibido: ${partnershipId}`)
        } else {
          // Fallback: query partnerships table by nombre
          const partnershipName = body.tipoCliente.replace('Partnership: ', '').trim()
          const partnershipResult = await client.query(
            'SELECT id FROM partnerships WHERE nombre = $1',
            [partnershipName]
          )
          if (partnershipResult.rows.length > 0) {
            partnershipId = partnershipResult.rows[0].id
            console.log(`✅ Partnership ID encontrado por nombre: ${partnershipName} -> ${partnershipId}`)
          } else {
            console.warn(`⚠️ Partnership no encontrado: ${partnershipName}`)
          }
        }
      } else if (['startup', 'empresa', 'freelancer', 'otro'].includes(body.tipoCliente)) {
        tipoClienteDb = body.tipoCliente
      }
    }
    
    const clienteResult = await client.query(
      `INSERT INTO clientes (usuario_id, nombre_empresa, logo_empresa, tipo_cliente, partnership_id, personalizacion, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        usuarioId,
        body.nombreEmpresa,
        body.logoUrl || null,
        tipoClienteDb,
        partnershipId,
        body.personalizacion || null, // JSONB column accepts JavaScript objects directly
        true
      ]
    )
    const clienteId = clienteResult.rows[0].id

    // Step 3: Insert into cliente_funcionalidades
    if (body.verticales) {
      // Map vertical names to funcionalidades table names
      const verticalMapping: { [key: string]: string } = {
        llamadas: 'llamadas',
        texto: 'chat',
        automatizaciones: 'automatizacion'
      }

      for (const [verticalKey, verticalValue] of Object.entries(body.verticales)) {
        if (verticalValue) {
          const funcionalidadNombre = verticalMapping[verticalKey]
          if (funcionalidadNombre) {
            // Get funcionalidad_id by nombre
            const funcionalidadResult = await client.query(
              'SELECT id FROM funcionalidades WHERE nombre = $1',
              [funcionalidadNombre]
            )
            
            if (funcionalidadResult.rows.length > 0) {
              const funcionalidadId = funcionalidadResult.rows[0].id
              
              await client.query(
                `INSERT INTO cliente_funcionalidades (cliente_id, funcionalidad_id, habilitado, fecha_habilitacion)
                 VALUES ($1, $2, $3, NOW())
                 ON CONFLICT (cliente_id, funcionalidad_id) DO UPDATE
                 SET habilitado = $3, fecha_habilitacion = NOW()`,
                [clienteId, funcionalidadId, true]
              )
            }
          }
        }
      }
    }

    // Step 4: Insert into aplicaciones from webhooks
    if (body.webhooks) {
      // Helper function to extract webhook name and type
      const extractWebhookInfo = (key: string, url: string) => {
        if (!url) return null
        
        let tipoAplicacion = 'llamadas'
        let nombre = 'Webhook Dashboard'
        
        if (key.includes('Llamadas')) {
          tipoAplicacion = 'llamadas'
          if (key.includes('Dashboard')) nombre = 'Llamadas Dashboard'
          else if (key.includes('Probar')) nombre = 'Llamadas Probar'
          else if (key.includes('Campaña')) nombre = 'Llamadas Campaña'
          else if (key.includes('Database')) nombre = 'Llamadas Database'
        } else if (key.includes('Texto')) {
          tipoAplicacion = 'chat'
          if (key.includes('Dashboard')) nombre = 'Texto Dashboard'
          else if (key.includes('Database')) nombre = 'Texto Database'
        } else if (key.includes('Automatizaciones')) {
          tipoAplicacion = 'automatizacion'
          if (key.includes('Dashboard')) nombre = 'Automatizaciones Dashboard'
        }
        
        return { tipoAplicacion, nombre, url }
      }

      // Insert each webhook as an aplicacion
      for (const [key, url] of Object.entries(body.webhooks)) {
        if (url && typeof url === 'string' && url.trim()) {
          const info = extractWebhookInfo(key, url as string)
          if (info) {
            await client.query(
              `INSERT INTO aplicaciones (cliente_id, tipo_aplicacion, nombre, url_acceso, estado)
               VALUES ($1, $2, $3, $4, $5)`,
              [clienteId, info.tipoAplicacion, info.nombre, info.url, 'activa']
            )
          }
        }
      }
    }

    // Step 5: Update aplicaciones Dashboard rows with columnasPostgres
    if (body.columnasPostgres && body.columnasPostgres.length > 0) {
      // Find all Dashboard aplicaciones for this cliente
      const dashboardApps = await client.query(
        `SELECT id, nombre FROM aplicaciones 
         WHERE cliente_id = $1 AND nombre LIKE '%Dashboard%'`,
        [clienteId]
      )

      // Update each Dashboard aplicacion with columnasPostgres in configuracion
      for (const app of dashboardApps.rows) {
        await client.query(
          `UPDATE aplicaciones 
           SET configuracion = $1, descripcion = $2
           WHERE id = $3`,
          [
            { columnasPostgres: body.columnasPostgres }, // JSONB column accepts JavaScript objects directly
            `Configuración con ${body.columnasPostgres.length} columnas PostgreSQL`,
            app.id
          ]
        )
      }
    }

    // Step 6: Insert into kpis
    if (body.kpisGenerados) {
      const kpisData = body.kpisGenerados
      
      // Extract json_kpis and json_mapper
      const jsonKpis = kpisData.kpis || kpisData.kpis_tabla ? {
        total_kpis: kpisData.total_kpis || (kpisData.kpis ? kpisData.kpis.length : 0),
        kpis: kpisData.kpis || [],
        kpis_tabla: kpisData.kpis_tabla || []
      } : null

      // For json_mapper, use the mapperJSON from request body if available, otherwise construct it
      let jsonMapper = null
      if (body.mapperJSON) {
        // Use mapper JSON from frontend (created by crearMapperNormalizado)
        jsonMapper = body.mapperJSON
        console.log('✅ Usando mapperJSON del request body')
      } else if (body.columnasPostgres && kpisData.kpis) {
        // Fallback: construct basic mapper from columnasPostgres and kpis
        jsonMapper = {
          columnas: body.columnasPostgres.map((col: any) => ({
            nombre: col.nombre,
            tipo: col.tipo,
            descripcion: col.descripcion
          })),
          kpis: kpisData.kpis.map((kpi: any) => ({
            titulo: kpi.titulo,
            tipo_grafico: kpi.tipo_grafico,
            inputs: kpi.inputs || []
          }))
        }
        console.log('⚠️ Mapper JSON construido desde columnasPostgres y kpis (fallback)')
      }

      // Query aplicaciones table to get aplicacion_id for this cliente
      let aplicacionId = null
      const aplicacionResult = await client.query(
        `SELECT id FROM aplicaciones 
         WHERE cliente_id = $1 
         ORDER BY CASE WHEN nombre LIKE '%Dashboard%' THEN 0 ELSE 1 END, id
         LIMIT 1`,
        [clienteId]
      )
      
      if (aplicacionResult.rows.length > 0) {
        aplicacionId = aplicacionResult.rows[0].id
        console.log(`✅ Aplicacion ID encontrado: ${aplicacionId} para cliente ${clienteId}`)
      } else {
        console.warn(`⚠️ No se encontró aplicacion para cliente ${clienteId}, aplicacion_id será NULL`)
      }

      if (jsonKpis || jsonMapper) {
        await client.query(
          `INSERT INTO kpis (cliente_id, aplicacion_id, json_kpis, json_mapper, fecha_creacion)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            clienteId,
            aplicacionId,
            jsonKpis || null, // JSONB column accepts JavaScript objects directly
            jsonMapper || null // JSONB column accepts JavaScript objects directly
          ]
        )
        console.log(`✅ KPI insertado con cliente_id: ${clienteId}, aplicacion_id: ${aplicacionId || 'NULL'}`)
      }
    }

    await client.query('COMMIT')

    return NextResponse.json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: {
        cliente_id: clienteId,
        usuario_id: usuarioId
      }
    })

  } catch (error: any) {
    await client.query('ROLLBACK')
    console.error('❌ Error creating cliente:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al crear el cliente',
        error: error.message 
      },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
