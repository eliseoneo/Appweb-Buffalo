'use client'

import { useState } from 'react'
import { 
  Target, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  Play,
  Pause,
  Users,
  TrendingUp,
  BarChart3,
  Download
} from 'lucide-react'

interface Campana {
  id: string
  nombre: string
  descripcion: string
  cliente: string
  estado: 'Activa' | 'Pausada' | 'Completada' | 'Borrador'
  fechaInicio: string
  fechaFin: string
  objetivo: number
  progreso: number
  tipo: 'Llamadas' | 'Chat' | 'Email' | 'Mixta'
  tieneArchivo?: boolean
  archivo?: string
}

export default function AdminCampanasPage() {
  const [campanas] = useState<Campana[]>([
    {
      id: 'CAM-001',
      nombre: 'Campaña Navidad 2024',
      descripcion: 'Promociones especiales para temporada navideña',
      cliente: 'TechCorp Solutions',
      estado: 'Activa',
      fechaInicio: '2024-12-01',
      fechaFin: '2024-12-31',
      objetivo: 1000,
      progreso: 750,
      tipo: 'Llamadas',
      tieneArchivo: true,
      archivo: 'campaña_navidad_2024.pdf'
    },
    {
      id: 'CAM-002',
      nombre: 'Lanzamiento Producto X',
      descripcion: 'Campaña de lanzamiento del nuevo producto',
      cliente: 'InnovaCorp',
      estado: 'Pausada',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-02-15',
      objetivo: 500,
      progreso: 320,
      tipo: 'Mixta',
      tieneArchivo: true,
      archivo: 'brief_producto_x.docx'
    },
    {
      id: 'CAM-003',
      nombre: 'Encuesta Satisfacción',
      descripcion: 'Campaña de encuestas a clientes existentes',
      cliente: 'StartupXYZ',
      estado: 'Completada',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-01-31',
      objetivo: 300,
      progreso: 300,
      tipo: 'Chat',
      tieneArchivo: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('Todas')
  const [filterTipo, setFilterTipo] = useState('Todos')

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activa':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Pausada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Completada':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Borrador':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Llamadas':
        return 'bg-purple-100 text-purple-800'
      case 'Chat':
        return 'bg-blue-100 text-blue-800'
      case 'Email':
        return 'bg-orange-100 text-orange-800'
      case 'Mixta':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCampanas = campanas.filter(camp => {
    const matchesSearch = camp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === 'Todas' || camp.estado === filterEstado
    const matchesTipo = filterTipo === 'Todos' || camp.tipo === filterTipo
    
    return matchesSearch && matchesEstado && matchesTipo
  })

  const estadisticas = {
    total: campanas.length,
    activas: campanas.filter(c => c.estado === 'Activa').length,
    pausadas: campanas.filter(c => c.estado === 'Pausada').length,
    completadas: campanas.filter(c => c.estado === 'Completada').length
  }

  const getProgresoPercentage = (progreso: number, objetivo: number) => {
    return Math.round((progreso / objetivo) * 100)
  }

  const handleDownloadFile = (archivo: string) => {
    // Simular descarga del archivo
    console.log('Descargando archivo de campaña:', archivo)
    // En producción aquí se haría la descarga real
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campañas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona campañas de marketing y comunicación de clientes
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {/* Search Bar with Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, cliente o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-buffalo-green focus:border-transparent bg-white text-gray-900"
              >
                <option value="Todas">Todos los estados</option>
                <option value="Activa">Activa</option>
                <option value="Pausada">Pausada</option>
                <option value="Completada">Completada</option>
                <option value="Borrador">Borrador</option>
              </select>
              
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-buffalo-green focus:border-transparent bg-white text-gray-900"
              >
                <option value="Todos">Todos los tipos</option>
                <option value="Llamadas">Llamadas</option>
                <option value="Chat">Chat</option>
                <option value="Email">Email</option>
                <option value="Mixta">Mixta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campañas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.activas}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Play className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pausadas</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.pausadas}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Pause className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{estadisticas.completadas}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>


        {/* Campañas List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Campañas ({filteredCampanas.length})
          </h2>
          
          {filteredCampanas.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron campañas</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCampanas.map((campana) => (
                <div key={campana.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{campana.nombre}</h3>
                        <span className="text-sm text-gray-500">#{campana.id}</span>
                        {campana.tieneArchivo && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            📎 Archivo
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{campana.descripcion}</p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{campana.cliente}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{campana.fechaInicio} - {campana.fechaFin}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(campana.tipo)}`}>
                        {campana.tipo}
                      </span>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(campana.estado)}`}>
                        {campana.estado}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        {campana.tieneArchivo && (
                          <button 
                            onClick={() => handleDownloadFile(campana.archivo!)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Descargar archivo de campaña"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progreso</span>
                      <span className="text-sm font-medium text-gray-900">
                        {campana.progreso} / {campana.objetivo} ({getProgresoPercentage(campana.progreso, campana.objetivo)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-buffalo-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgresoPercentage(campana.progreso, campana.objetivo)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
