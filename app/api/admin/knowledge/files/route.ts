import { NextResponse } from 'next/server'
import { readdir, stat, mkdir } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = String(searchParams.get('clienteId') || '').trim()
    if (!clienteId) {
      return NextResponse.json({ success: false, message: 'clienteId es requerido' }, { status: 400 })
    }

    const baseRoot = process.env.KNOWLEDGE_BASE_DIR || (process.platform === 'win32' ? 'C:\\\\TestMapperBufalo' : path.join(process.cwd(), 'uploads', 'knowledge'))
    const baseDir = path.join(baseRoot, clienteId)

    // Ensure directory exists (create if missing for testing convenience)
    await mkdir(baseDir, { recursive: true })

    let files: string[] = []
    try {
      files = await readdir(baseDir)
    } catch {
      files = []
    }

    const items = await Promise.all(files.map(async (fname) => {
      const fpath = path.join(baseDir, fname)
      const info = await stat(fpath)
      if (!info.isFile()) {
        return null
      }
      return {
        name: fname,
        size: info.size,
        modifiedAt: info.mtime.toISOString(),
        path: fpath
      }
    }))

    const list = (items.filter(Boolean) as any[]).sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
    return NextResponse.json({ success: true, count: list.length, files: list })
  } catch (error) {
    console.error('❌ List knowledge files error:', error)
    return NextResponse.json({ success: false, message: 'Error al listar archivos' }, { status: 500 })
  }
}


