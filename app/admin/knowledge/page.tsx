'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  FileText, 
  File, 
  Download, 
  Search,
  Upload
} from 'lucide-react'

interface Documento {
  id: string
  titulo: string
  tipo: 'pdf' | 'word' | 'markdown'
  tamaño: string
  fechaSubida: string
  categoria: string
}

interface ClienteDocumentos {
  clienteId: string
  clienteNombre: string
  documentos: Documento[]
}

export default function AdminKnowledgePage() {
  const [clientesDocumentos, setClientesDocumentos] = useState<ClienteDocumentos[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [uploadMsg, setUploadMsg] = useState<Record<string, string>>({})

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes <= 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const mapExtToTipo = (name: string): 'pdf' | 'word' | 'markdown' => {
    const lower = name.toLowerCase()
    if (lower.endsWith('.pdf')) return 'pdf'
    if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'word'
    return 'markdown'
  }

  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/clientes')
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Error al cargar clientes')
        }
        const mapped: ClienteDocumentos[] = (data.clientes || []).map((c: any) => ({
          clienteId: String(c.id),
          clienteNombre: c.nombreEmpresa || 'Sin nombre',
          documentos: [] // Se pueden cargar documentos reales más adelante
        }))
        // Orden alfabético por nombre para mejor UX
        mapped.sort((a, b) => a.clienteNombre.localeCompare(b.clienteNombre, 'es'))
        setClientesDocumentos(mapped)
      } catch (e: any) {
        setError(e?.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }
    loadClientes()
  }, [])

  // Load files for each client if not loaded yet
  useEffect(() => {
    if (!clientesDocumentos || clientesDocumentos.length === 0) return
    clientesDocumentos.forEach(c => {
      if ((c.documentos || []).length === 0) {
        refreshClienteFiles(c.clienteId)
      }
    })
  }, [clientesDocumentos])

  const [searchTerm, setSearchTerm] = useState('')

  const getFileIcon = (tipo: string) => {
    // Icono uniforme para todos los tipos de archivo
    return <File className="h-6 w-6 text-gray-600" />
  }

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'Llamadas':
        return 'bg-green-100 text-green-800'
      case 'Chat':
        return 'bg-blue-100 text-blue-800'
      case 'Automatizaciones':
        return 'bg-purple-100 text-purple-800'
      case 'Configuración':
        return 'bg-orange-100 text-orange-800'
      case 'Introducción':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredClientes = clientesDocumentos.filter(cliente =>
    cliente.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calcular estadísticas totales
  const totalDocumentos = clientesDocumentos.reduce((total, cliente) => total + cliente.documentos.length, 0)
  const totalClientes = clientesDocumentos.length

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, clienteId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length === 0) return
    await uploadFiles(clienteId, files)
  }

  const handleSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>, clienteId: string) => {
    // Capture the input element BEFORE any await
    const inputEl = e.currentTarget
    const files = Array.from(inputEl.files || [])
    if (files.length === 0) return
    await uploadFiles(clienteId, files)
    // reset input safely after await
    try {
      inputEl.value = ''
    } catch {}
  }

  const uploadFiles = async (clienteId: string, files: File[]) => {
    try {
      setUploading(prev => ({ ...prev, [clienteId]: true }))
      setUploadMsg(prev => ({ ...prev, [clienteId]: '' }))

      const form = new FormData()
      form.append('clienteId', clienteId)
      for (const f of files) {
        form.append('files', f, f.name)
      }

      const res = await fetch('/api/admin/knowledge/upload', {
        method: 'POST',
        body: form
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Error al subir archivos')
      }

      setUploadMsg(prev => ({ ...prev, [clienteId]: `Subidos ${json.saved?.length || files.length} archivo(s)` }))

      // Refresh list from disk
      await refreshClienteFiles(clienteId)
    } catch (e: any) {
      setUploadMsg(prev => ({ ...prev, [clienteId]: e?.message || 'Error al subir' }))
    } finally {
      setUploading(prev => ({ ...prev, [clienteId]: false }))
    }
  }

  const refreshClienteFiles = async (clienteId: string) => {
    try {
      const res = await fetch(`/api/admin/knowledge/files?clienteId=${encodeURIComponent(clienteId)}`)
      const json = await res.json()
      if (!res.ok || !json.success) return
      const docs: Documento[] = (json.files || []).map((f: any, idx: number) => ({
        id: `${clienteId}-${idx}-${f.name}`,
        titulo: f.name,
        tipo: mapExtToTipo(f.name),
        tamaño: formatBytes(Number(f.size) || 0),
        fechaSubida: f.modifiedAt ? new Date(f.modifiedAt).toISOString().slice(0, 10) : '',
        categoria: 'Archivo'
      }))
      setClientesDocumentos(prev => prev.map(c => c.clienteId === clienteId ? { ...c, documentos: docs } : c))
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-1">
            Documentos y material de conocimiento de clientes
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {/* Loading / Error States */}
        {loading && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-600">
            Cargando clientes...
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalClientes}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documentos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalDocumentos}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio por Cliente</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalClientes ? Math.round(totalDocumentos / totalClientes) : 0}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Encontrados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{filteredClientes.length}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Cliente Documents Cards */}
        {filteredClientes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron clientes</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredClientes.map((cliente) => (
              <div key={cliente.clienteId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{cliente.clienteNombre}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {cliente.documentos.length} documento{cliente.documentos.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    ID: {cliente.clienteId}
                  </div>
                </div>

                {/* Drag & Drop uploader */}
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                  onDrop={(e) => handleDrop(e, cliente.clienteId)}
                  className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Arrastra y suelta archivos aquí o
                      <label className="ml-1 text-blue-600 underline cursor-pointer">
                        selecciona
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => handleSelectFiles(e, cliente.clienteId)}
                        />
                      </label>
                    </div>
                    <div className="text-sm">
                      {uploading[cliente.clienteId] ? (
                        <span className="text-gray-500">Subiendo...</span>
                      ) : (
                        <span className={`text-${uploadMsg[cliente.clienteId]?.toLowerCase().includes('error') ? 'red' : 'green'}-600`}>
                          {uploadMsg[cliente.clienteId] || ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {cliente.documentos.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No hay documentos disponibles</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {cliente.documentos.map((documento) => (
                      <div key={documento.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          {getFileIcon(documento.tipo)}
                          <div>
                            <h3 className="font-medium text-gray-900">{documento.titulo}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">{documento.tamaño}</span>
                              <span className="text-sm text-gray-500">{documento.fechaSubida}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(documento.categoria)}`}>
                                {documento.categoria}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
