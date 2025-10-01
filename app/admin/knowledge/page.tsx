'use client'

import { useState } from 'react'
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
  const [clientesDocumentos] = useState<ClienteDocumentos[]>([
    {
      clienteId: 'techcorp',
      clienteNombre: 'TechCorp Solutions',
      documentos: [
        {
          id: '1',
          titulo: 'Manual de Agentes de Llamadas',
          tipo: 'pdf',
          tamaño: '2.4 MB',
          fechaSubida: '2024-01-15',
          categoria: 'Llamadas'
        },
        {
          id: '2',
          titulo: 'Guía de Configuración',
          tipo: 'word',
          tamaño: '1.8 MB',
          fechaSubida: '2024-01-12',
          categoria: 'Configuración'
        }
      ]
    },
    {
      clienteId: 'innovacorp',
      clienteNombre: 'InnovaCorp',
      documentos: [
        {
          id: '3',
          titulo: 'Manual de Usuario Chat',
          tipo: 'pdf',
          tamaño: '1.2 MB',
          fechaSubida: '2024-01-10',
          categoria: 'Chat'
        },
        {
          id: '4',
          titulo: 'Automatizaciones Personalizadas',
          tipo: 'markdown',
          tamaño: '856 KB',
          fechaSubida: '2024-01-08',
          categoria: 'Automatizaciones'
        }
      ]
    },
    {
      clienteId: 'startupxyz',
      clienteNombre: 'StartupXYZ',
      documentos: [
        {
          id: '5',
          titulo: 'Guía de Inicio Rápido',
          tipo: 'pdf',
          tamaño: '950 KB',
          fechaSubida: '2024-01-05',
          categoria: 'Introducción'
        }
      ]
    }
  ])

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
                <p className="text-3xl font-bold text-gray-900 mt-2">{Math.round(totalDocumentos / totalClientes)}</p>
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
