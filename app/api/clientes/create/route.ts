import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/database'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const client = await getPool().connect()
  
  try {
    await client.query('BEGIN')

    // Ensure new column exists
    await client.query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tabla_cliente VARCHAR(250)`)
    await client.query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS archivo_mapper VARCHAR(500)`)
    
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
    
    // Determine webhook_url from 'Webhook Dashboard' fields
    const webhooksObj = (body.webhooks as any) || {}
    const dashboardWebhookUrl =
      (typeof webhooksObj.webhookLlamadasDashboard === 'string' && webhooksObj.webhookLlamadasDashboard.trim() !== '' ? webhooksObj.webhookLlamadasDashboard.trim() : null) ??
      (typeof webhooksObj.webhookTextoDashboard === 'string' && webhooksObj.webhookTextoDashboard.trim() !== '' ? webhooksObj.webhookTextoDashboard.trim() : null) ??
      (typeof webhooksObj['webhookDashboard'] === 'string' && webhooksObj['webhookDashboard'].trim() !== '' ? webhooksObj['webhookDashboard'].trim() : null)

    // Determine default table name for this cliente (sanitized from nombreEmpresa)
    const defaultTablaCliente =
      (body.nombreEmpresa || 'cliente_data')
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]+/g, '_')
        .replace(/^_+|_+$/g, '')

    const clienteResult = await client.query(
      `INSERT INTO clientes (usuario_id, nombre_empresa, logo_empresa, tipo_cliente, partnership_id, personalizacion, webhook_url, activo, tabla_cliente, archivo_mapper)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        usuarioId,
        body.nombreEmpresa,
        body.logoUrl || null,
        tipoClienteDb,
        partnershipId,
        body.personalizacion || null, // JSONB column accepts JavaScript objects directly
        dashboardWebhookUrl,
        true,
        body.tablaCliente || defaultTablaCliente,
        body.archivoMapper || null
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

      // Build per-vertical webhook configuration (key/value)
      const prefixMap: { [key: string]: string } = {
        llamadas: 'webhookLlamadas',
        texto: 'webhookTexto',
        automatizaciones: 'webhookAutomatizaciones'
      }

      for (const [verticalKey, verticalValue] of Object.entries(body.verticales)) {
        if (!verticalValue) continue

        const funcionalidadNombre = verticalMapping[verticalKey]
        if (!funcionalidadNombre) continue

        // Get funcionalidad_id by nombre
        const funcionalidadResult = await client.query(
          'SELECT id FROM funcionalidades WHERE nombre = $1',
          [funcionalidadNombre]
        )
        
        if (funcionalidadResult.rows.length > 0) {
          const funcionalidadId = funcionalidadResult.rows[0].id
          
          // Collect config for this vertical
          const prefix = prefixMap[verticalKey] || ''
          const conf: any = {}
          for (const [k, v] of Object.entries(webhooksObj)) {
            if (typeof v !== 'string' || v.trim() === '') continue
            // Include keys that match this vertical prefix, and generic JSON fields
            if ((prefix && k.startsWith(prefix)) || k === 'webhookJson' || k === `${prefix}Json` || k.toLowerCase() === 'webhook-json') {
              conf[k] = v
            }
          }

          await client.query(
            `INSERT INTO cliente_funcionalidades (cliente_id, funcionalidad_id, habilitado, fecha_habilitacion, configuracion)
             VALUES ($1, $2, $3, NOW(), $4::jsonb)
             ON CONFLICT (cliente_id, funcionalidad_id) DO UPDATE
             SET habilitado = EXCLUDED.habilitado,
                 configuracion = EXCLUDED.configuracion`,
            [clienteId, funcionalidadId, true, JSON.stringify(conf)]
          )
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

    // Step 5: Create table for cliente if columnasPostgres are provided
    if (body.columnasPostgres && body.columnasPostgres.length > 0) {
      try {
        console.log('📊 Creando tabla para cliente...')
        // Use the tabla_cliente we saved for the cliente
        let tablaNombre = (body.tablaCliente || defaultTablaCliente)
        
        // Use unquoted sanitized name (valid SQL identifier)
        const tablaNombreQuoted = tablaNombre
        
        // Build CREATE TABLE SQL
        let createTableSQL = `CREATE TABLE IF NOT EXISTS ${tablaNombreQuoted} (\n`
        
        // Add cliente_id column first
        createTableSQL += `  cliente_id INTEGER NOT NULL`
        
        // Add other columns
        body.columnasPostgres.forEach((col: any, index: number) => {
          createTableSQL += ',\n'
          
          // Sanitize column name (quote if needed)
          const colName = col.nombre.includes('-') || /[^a-z0-9_]/i.test(col.nombre) 
            ? `"${col.nombre}"` 
            : col.nombre
          
          // Get type - ensure it's properly formatted
          let colType = col.tipo || 'VARCHAR(255)'
          
          // Ensure VARCHAR has length if not specified
          if (colType.toUpperCase().startsWith('VARCHAR') && !colType.includes('(')) {
            colType = 'VARCHAR(255)'
          }
          
          const notNull = col.nullable === false ? ' NOT NULL' : ''
          const defaultValue = col.default ? ` DEFAULT '${col.default.replace(/'/g, "''")}'` : ''
          
          createTableSQL += `  ${colName} ${colType}${notNull}${defaultValue}`
        })
        
        // Add foreign key constraint (sanitize constraint name)
        const constraintName = `fk_${tablaNombre.replace(/[^a-z0-9_]/g, '_')}_cliente`
        createTableSQL += `,\n  CONSTRAINT ${constraintName} FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE\n`
        createTableSQL += `);\n`
        
        // Execute CREATE TABLE (log for troubleshooting)
        console.log('🧱 CREATE TABLE SQL:\n' + createTableSQL)
        await client.query(createTableSQL)
        console.log(`✅ Tabla ${tablaNombreQuoted} creada exitosamente`)

        // Apply comments separately (safer than inline comments)
        try {
          const safeCompany = (body.nombreEmpresa || '').replace(/'/g, "''")
          await client.query(`COMMENT ON TABLE ${tablaNombreQuoted} IS 'Tabla generada automáticamente para cliente: ${safeCompany} (${clienteId})';`)
          for (const col of body.columnasPostgres) {
            if (col.descripcion) {
              const colName = col.nombre.includes('-') || /[^a-z0-9_]/i.test(col.nombre) ? `\"${col.nombre}\"` : col.nombre
              const desc = (col.descripcion as string).replace(/'/g, "''")
              await client.query(`COMMENT ON COLUMN ${tablaNombreQuoted}.${colName} IS '${desc}';`)
            }
          }
        } catch (commentErr) {
          console.warn('⚠️ Comentarios no aplicados:', commentErr)
        }
        
        // Create indexes (sanitize index names)
        const idxNameCliente = `idx_${tablaNombre.replace(/[^a-z0-9_]/g, '_')}_cliente_id`
        await client.query(`CREATE INDEX IF NOT EXISTS ${idxNameCliente} ON ${tablaNombreQuoted}(cliente_id);`)
        
        // Create index on fecha_hora if column exists
        const hasFechaHora = body.columnasPostgres.some((col: any) => 
          col.nombre.toLowerCase().includes('fecha') || col.nombre.toLowerCase().includes('hora')
        )
        if (hasFechaHora) {
          const fechaCol = body.columnasPostgres.find((col: any) => 
            col.nombre.toLowerCase().includes('fecha') || col.nombre.toLowerCase().includes('hora')
          )
          if (fechaCol) {
            const idxNameCreated = `idx_${tablaNombre.replace(/[^a-z0-9_]/g, '_')}_created`
            await client.query(`CREATE INDEX IF NOT EXISTS ${idxNameCreated} ON ${tablaNombreQuoted}(${fechaCol.nombre});`)
          }
        }
        
        // Create stored procedure (sanitize procedure name)
        const procedureName = `sp_insertar_${tablaNombre.replace(/[^a-z0-9_]/g, '_')}`
        let storedProcedureSQL = `CREATE OR REPLACE FUNCTION ${procedureName}(\n`
        
        // Add p_cliente_id parameter first
        storedProcedureSQL += `  p_cliente_id INTEGER`
        if (body.columnasPostgres.length > 0) {
          storedProcedureSQL += ','
        }
        storedProcedureSQL += '\n'
        
        // Add other parameters
        body.columnasPostgres.forEach((col: any, index: number) => {
          storedProcedureSQL += `  p_${col.nombre} ${col.tipo}`
          if (index < body.columnasPostgres.length - 1) {
            storedProcedureSQL += ','
          }
          storedProcedureSQL += '\n'
        })
        
        storedProcedureSQL += `) RETURNS UUID AS $$\n`
        storedProcedureSQL += `DECLARE\n`
        storedProcedureSQL += `  v_id UUID;\n`
        storedProcedureSQL += `BEGIN\n`
        storedProcedureSQL += `  v_id := gen_random_uuid();\n\n`
        storedProcedureSQL += `  INSERT INTO ${tablaNombreQuoted} (\n`
        storedProcedureSQL += `    cliente_id`
        if (body.columnasPostgres.length > 0) {
          storedProcedureSQL += ','
        }
        storedProcedureSQL += '\n'
        
        body.columnasPostgres.forEach((col: any, index: number) => {
          storedProcedureSQL += `    ${col.nombre}`
          if (index < body.columnasPostgres.length - 1) {
            storedProcedureSQL += ','
          }
          storedProcedureSQL += '\n'
        })
        
        storedProcedureSQL += `  ) VALUES (\n`
        storedProcedureSQL += `    p_cliente_id`
        if (body.columnasPostgres.length > 0) {
          storedProcedureSQL += ','
        }
        storedProcedureSQL += '\n'
        
        body.columnasPostgres.forEach((col: any, index: number) => {
          storedProcedureSQL += `    p_${col.nombre}`
          if (index < body.columnasPostgres.length - 1) {
            storedProcedureSQL += ','
          }
          storedProcedureSQL += '\n'
        })
        
        storedProcedureSQL += `  );\n\n`
        storedProcedureSQL += `  RETURN v_id;\n`
        storedProcedureSQL += `END;\n`
        storedProcedureSQL += `$$ LANGUAGE plpgsql;`
        
        // Execute stored procedure creation
        await client.query(storedProcedureSQL)
        console.log(`✅ Stored procedure ${procedureName} creado exitosamente`)
        
      } catch (tableError: any) {
        console.error('❌ Error creando tabla:', tableError)
        // Don't fail the entire transaction if table creation fails
        // Just log the error
        console.warn('⚠️ Continuando sin crear la tabla (error no crítico)')
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
