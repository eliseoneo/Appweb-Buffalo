'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Upload, File, FileText, FileType, Download, Eye, Trash2, X, Plus } from 'lucide-react'
import { getClientConfig } from '@/lib/cliente-utils'
import { ClienteConfig } from '@/types/cliente'
import ClientHeader from '@/components/ClientHeader'

interface Documento {
  id: number
  titulo: string
  tipo: 'pdf' | 'docx' | 'md' | 'txt'
  archivo: string
  fechaSubida: string
  tamaño: string
}

export default function KnowledgePage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: 1,
      titulo: "Manual de Usuario v2.1",
      tipo: "pdf",
      archivo: "manual-usuario-v2.1.pdf",
      fechaSubida: "2024-12-15",
      tamaño: "2.3 MB"
    },
    {
      id: 2,
      titulo: "Especificaciones Técnicas",
      tipo: "docx",
      archivo: "especificaciones-tecnicas.docx",
      fechaSubida: "2024-12-10",
      tamaño: "1.8 MB"
    },
    {
      id: 3,
      titulo: "Guía de API",
      tipo: "md",
      archivo: "guia-api.md",
      fechaSubida: "2024-12-05",
      tamaño: "45 KB"
    },
    {
      id: 4,
      titulo: "Notas de Versión",
      tipo: "txt",
      archivo: "notas-version.txt",
      fechaSubida: "2024-12-01",
      tamaño: "12 KB"
    }
  ])

  const [formData, setFormData] = useState({
    titulo: '',
    archivo: null as File | null
  })

  useEffect(() => {
    const clienteData = getClientConfig(clienteId)
    if (clienteData) {
      setCliente(clienteData)
    }
  }, [clienteId])

  const handleInputChange = (field: keyof typeof formData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.archivo) {
      alert('Título y archivo son obligatorios')
      return
    }

    // Obtener tipo de archivo
    const extension = formData.archivo.name.split('.').pop()?.toLowerCase()
    let tipo: Documento['tipo'] = 'txt'
    
    if (extension === 'pdf') tipo = 'pdf'
    else if (extension === 'docx' || extension === 'doc') tipo = 'docx'
    else if (extension === 'md') tipo = 'md'
    else if (extension === 'txt') tipo = 'txt'

    const nuevoDocumento: Documento = {
      id: Date.now(),
      titulo: formData.titulo,
      tipo,
      archivo: formData.archivo.name,
      fechaSubida: new Date().toISOString().split('T')[0],
      tamaño: `${(formData.archivo.size / 1024 / 1024).toFixed(1)} MB`
    }

    setDocumentos(prev => [nuevoDocumento, ...prev])
    setShowModal(false)
    setFormData({ titulo: '', archivo: null })
  }

  const getFileIcon = (tipo: Documento['tipo']) => {
    switch (tipo) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'docx':
        return <FileType className="h-8 w-8 text-blue-500" />
      case 'md':
        return <File className="h-8 w-8 text-gray-500" />
      case 'txt':
        return <FileText className="h-8 w-8 text-gray-400" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      setDocumentos(prev => prev.filter(doc => doc.id !== id))
    }
  }

  const handleView = (documento: Documento) => {
    alert(`Abriendo: ${documento.titulo}`)
  }

  const handleDownload = (documento: Documento) => {
    alert(`Descargando: ${documento.archivo}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title="Knowledge"
        subtitle="Gestiona y consulta documentos importantes"
        showFilters={false}
      />
      
      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Lista de Documentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentos.map((documento) => (
            <div key={documento.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Header del documento */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  {getFileIcon(documento.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{documento.titulo}</h3>
                  <p className="text-sm text-gray-500">{documento.archivo}</p>
                </div>
              </div>

              {/* Información del documento */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Fecha:</span>
                  <span>{new Date(documento.fechaSubida).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tamaño:</span>
                  <span>{documento.tamaño}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(documento)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </button>
                <button
                  onClick={() => handleDownload(documento)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </button>
                <button
                  onClick={() => handleDelete(documento.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Tarjeta para Subir Documento - Siempre al final */}
          <div 
            onClick={() => setShowModal(true)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer border-dashed border-gray-300 hover:border-buffalo-green hover:bg-green-50"
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <div className="mb-4">
                <Plus className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Subir Documento</h3>
              <p className="text-sm text-gray-500">Haz clic para añadir un nuevo documento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Subir Documento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mx-4">
            {/* Header del Modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Subir Documento</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título del documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del documento *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-buffalo-green focus:border-transparent text-gray-900"
                  placeholder="Ej: Manual de Usuario v2.1"
                  required
                />
              </div>

              {/* Campo de archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.md,.txt"
                    onChange={(e) => handleInputChange('archivo', e.target.files?.[0] || null)}
                    className="hidden"
                    id="archivo-upload"
                  />
                  <label
                    htmlFor="archivo-upload"
                    className="w-full flex items-center justify-center gap-3 px-4 py-8 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-buffalo-green hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    {formData.archivo ? (
                      <>
                        <File className="h-8 w-8 text-buffalo-green" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{formData.archivo.name}</p>
                          <p className="text-xs text-gray-500">Archivo seleccionado</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">Subir archivo</p>
                          <p className="text-xs text-gray-500">Arrastra y suelta o haz clic para seleccionar</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Formatos: PDF, Word (.docx), Markdown (.md), TXT (máx. 10MB)</p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-buffalo-green text-white rounded-lg font-medium hover:bg-buffalo-green/90 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}