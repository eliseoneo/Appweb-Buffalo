import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/database'
import fs from 'fs'
import path from 'path'
import vm from 'vm'

type IngestSource =
  | { type: 'file'; filePath: string }
  | { type: 'webhook'; url: string }

function sanitizeTableName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function pickRecords(payload: any): any[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.example_data?.registros_ejemplo)) {
    return payload.example_data.registros_ejemplo
  }
  if (Array.isArray(payload?.data)) {
    return payload.data
  }
  
  // Check if this is a mapper file with database_schema
  if (payload?.database_schema?.columnas && Array.isArray(payload.database_schema.columnas)) {
    // Create a record from the default values
    const record: any = {}
    for (const columna of payload.database_schema.columnas) {
      if (columna.nombre && columna.default !== undefined) {
        record[columna.nombre] = columna.default
      }
    }
    // Return single record if it has data
    if (Object.keys(record).length > 0) {
      return [record]
    }
  }
  
  return [payload]
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pool = getPool()
  const client = await pool.connect()

  try {
    const { id } = params
    const body = await request.json().catch(() => ({}))
    const testPath = body?.testPath as string | undefined

    // 1) Load client to get nombre_empresa and webhook_url
    const res = await client.query(
      `SELECT id, nombre_empresa, webhook_url 
       FROM clientes 
       WHERE id = $1`,
      [id]
    )
    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cliente no encontrado' },
        { status: 404 }
      )
    }
    const cliente = res.rows[0] as {
      id: number
      nombre_empresa: string
      webhook_url: string | null
    }

    // 2) Decide source
    let source: IngestSource | null = null
    if (testPath && typeof testPath === 'string' && testPath.length > 0) {
      source = { type: 'file', filePath: testPath }
    } else if (cliente.webhook_url) {
      source = { type: 'webhook', url: cliente.webhook_url }
    } else {
      return NextResponse.json(
        { success: false, message: 'No hay fuente de datos (testPath o webhook_url)' },
        { status: 400 }
      )
    }

    // 3) Read payload
    let payload: any
    if (source.type === 'file') {
      const abs = path.isAbsolute(source.filePath)
        ? source.filePath
        : path.join(process.cwd(), source.filePath)
      const raw = fs.readFileSync(abs, 'utf-8')
      // Attempt strict JSON parse first; if it fails, try a lenient parser
      try {
        payload = JSON.parse(raw)
      } catch (err) {
        // Fallback: try to sanitize common non-JSON artifacts (comments, single quotes, unquoted keys, trailing commas)
        const sanitized = sanitizeLooseJson(raw)
        try {
          payload = JSON.parse(sanitized)
        } catch (err2) {
          // Final fallback: evaluate as JS object in a sandbox (for local test files only)
          try {
            const script = new vm.Script(`(function(){ return (${sanitized}); })()`)
            payload = script.runInNewContext({}, { timeout: 1000 })
          } catch (err3) {
            console.error('❌ Failed to parse JSON file (even after sanitize):', err3)
            return NextResponse.json(
              { success: false, message: 'No se pudo parsear el archivo de prueba (formato no válido)', error: String(err3).slice(0, 400) },
              { status: 400 }
            )
          }
        }
      }
    } else {
      const response = await fetch(source.url, { cache: 'no-store' })
      if (!response.ok) {
        return NextResponse.json(
          { success: false, message: `Error al llamar al webhook: ${response.status}` },
          { status: 502 }
        )
      }
      payload = await response.json()
    }

    // 4) Determine table name (prefer mapper schema name)
    const fromMapperName =
      payload?.database_schema?.tabla_principal ||
      payload?.metadata?.tabla_nombre ||
      payload?.example_data?.tabla_ejemplo ||
      cliente.nombre_empresa
    const tableBase = sanitizeTableName(fromMapperName || 'cliente_data')
    const tableName = tableBase

    // 5) Ensure table exists (generic payload store with JSONB)
    // Transaction 1: Table setup (separate transaction for DDL)
    await client.query('BEGIN')
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id SERIAL PRIMARY KEY,
          cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
          payload JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      // In case the table already existed without our columns, ensure required columns exist
      await client.query(`ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS cliente_id INTEGER`)
      await client.query(`ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS payload JSONB`)
      await client.query(`ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
      
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      // Table setup failed, but we'll try to continue with inserts anyway
      console.warn('⚠️ Table setup warning:', error)
    }
    
    // Transaction 2: Try to add constraint (separate transaction to avoid blocking inserts)
    try {
      await client.query('BEGIN')
      await client.query(`ALTER TABLE ${tableName} ADD CONSTRAINT fk_${tableName}_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE`)
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      // ignore if constraint already exists or cannot be added
    }

    // Transaction 3: Store field mapping and kpis mapping if present in payload
    if (payload?.field_mapping || payload?.kpis_mapping) {
      try {
        await client.query('BEGIN')
        // Create metadata table if it doesn't exist
        await client.query(`
          CREATE TABLE IF NOT EXISTS cliente_table_metadata (
            id SERIAL PRIMARY KEY,
            cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
            table_name VARCHAR(255) NOT NULL,
            field_mapping JSONB,
            kpis_mapping JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(cliente_id, table_name)
          )
        `)
        
        // Upsert metadata
        await client.query(`
          INSERT INTO cliente_table_metadata (cliente_id, table_name, field_mapping, kpis_mapping, updated_at)
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
          ON CONFLICT (cliente_id, table_name)
          DO UPDATE SET
            field_mapping = EXCLUDED.field_mapping,
            kpis_mapping = EXCLUDED.kpis_mapping,
            updated_at = CURRENT_TIMESTAMP
        `, [
          cliente.id,
          tableName,
          payload.field_mapping ? JSON.stringify(payload.field_mapping) : null,
          payload.kpis_mapping ? JSON.stringify(payload.kpis_mapping) : null
        ])
        await client.query('COMMIT')
        console.log(`✅ Stored field mapping for table ${tableName}`)
      } catch (metaError) {
        await client.query('ROLLBACK')
        console.warn('⚠️ Failed to store metadata (continuing):', metaError)
      }
    }

    // Transaction 4: Insert records (separate transaction for DML)
    await client.query('BEGIN')
    const records = pickRecords(payload)
    let inserted = 0
    for (const rec of records) {
      await client.query(
        `INSERT INTO ${tableName} (cliente_id, payload) VALUES ($1, $2::jsonb)`,
        [cliente.id, JSON.stringify(rec)]
      )
      inserted++
    }
    await client.query('COMMIT')

    return NextResponse.json({
      success: true,
      message: 'Datos cargados correctamente',
      table: tableName,
      inserted,
      source: source.type
    })
  } catch (error: any) {
    await (async () => {
      try {
        await client.query('ROLLBACK')
      } catch {}
    })()
    console.error('❌ Error en ingest:', error)
    return NextResponse.json(
      { success: false, message: 'Error al cargar datos', error: error?.message || String(error) },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// Best-effort sanitation for loosely formatted JSON (comments, single quotes, unquoted keys, trailing commas)
function sanitizeLooseJson(input: string): string {
  let s = input
  // Remove BOM
  s = s.replace(/^\uFEFF/, '')
  // Remove C-style and line comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, '')
  s = s.replace(/(^|[^:])\/\/.*$/gm, '$1')
  // Remove trailing commas before } or ]
  s = s.replace(/,\s*(?=[}\]])/g, '')
  // Quote unquoted object keys (support unicode letters and hyphen)
  // e.g. { foo:1, Situación_laboral: 'x', empresa-test09: 1 } -> {"foo":1,"Situación_laboral":"x","empresa-test09":1}
  s = s.replace(/([{\s,])([A-Za-z_\p{L}][A-Za-z0-9_\p{L}\-]*)(?=\s*:)/gu, '$1"$2"')
  // Replace single-quoted strings with double-quoted (basic conversion)
  s = s.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (_m, p1: string) => {
    const inner = p1.replace(/"/g, '\\"')
    return `"${inner}"`
  })
  // Convert True/False/None/NaN/undefined to JSON counterparts
  s = s.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null')
  s = s.replace(/\bNaN\b/g, 'null').replace(/\bundefined\b/g, 'null')
  // Escape unescaped quotes that appear inside string literals (e.g., textual "Ejemplo": ... inside a value)
  s = escapeInnerQuotesInStrings(s)
  return s
}

// Escapes inner double-quotes that appear inside an already opened JSON string
// Heuristic: when inside a string and we see an unescaped ", if the next non-space
// character is a letter, digit, {, [, or ':' (indicative of embedded snippet), we escape it.
function escapeInnerQuotesInStrings(source: string): string {
  let res = ''
  let inStr = false
  let escape = false
  const n = source.length

  for (let i = 0; i < n; i++) {
    const ch = source[i]
    if (!inStr) {
      if (ch === '"') {
        inStr = true
        res += ch
        continue
      }
      res += ch
      continue
    }
    // inside string
    if (escape) {
      res += ch
      escape = false
      continue
    }
    if (ch === '\\') {
      res += ch
      escape = true
      continue
    }
    if (ch === '"') {
      // look ahead for next non-space char
      let j = i + 1
      while (j < n && /\s/.test(source[j])) j++
      const next = source[j]
      // if next char looks like continuation of text (letter/digit/{/[),
      // then treat current quote as inner text and escape it.
      // Do NOT escape when next is ':' -> that's a normal key terminator in JSON.
      if (next && /[A-Za-z0-9{\[]/.test(next)) {
        res += '\\"'
        continue
      }
      // otherwise, end of string
      inStr = false
      res += '"'
      continue
    }
    res += ch
  }
  return res
}


