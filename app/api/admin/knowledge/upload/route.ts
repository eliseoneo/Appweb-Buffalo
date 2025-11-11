import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const clienteId = String(form.get('clienteId') || '').trim()
    if (!clienteId) {
      return NextResponse.json({ success: false, message: 'clienteId es requerido' }, { status: 400 })
    }

    const files = form.getAll('files') as File[]
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No se enviaron archivos' }, { status: 400 })
    }

    // Base directory for testing on Windows, fallback to project uploads if not Windows
    const baseRoot = process.env.KNOWLEDGE_BASE_DIR || (process.platform === 'win32' ? 'C:\\\\TestMapperBufalo' : path.join(process.cwd(), 'uploads', 'knowledge'))
    const baseDir = path.join(baseRoot, clienteId)
    await mkdir(baseDir, { recursive: true })

    const saved: { name: string; size: number; path: string }[] = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const safeName = file.name.replace(/[^\w.\-]+/g, '_')
      const savePath = path.join(baseDir, safeName)
      await writeFile(savePath, buffer)
      saved.push({ name: safeName, size: buffer.length, path: savePath })
    }

    return NextResponse.json({ success: true, saved })
  } catch (error) {
    console.error('❌ Upload knowledge error:', error)
    return NextResponse.json({ success: false, message: 'Error al subir archivos' }, { status: 500 })
  }
}


