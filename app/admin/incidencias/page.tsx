'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  User,
  Calendar,
  Download,
  X
} from 'lucide-react'

interface Incidencia {
  id: string
  titulo: string
  descripcion: string
  prioridad: 'Alta' | 'Media' | 'Baja'
  estado: 'Abierto' | 'En Progreso' | 'Resuelto'
  cliente: string
  fechaCreacion: string
  fechaActualizacion: string
  asignadoA?: string
  tieneArchivo?: boolean
  archivo?: string
}

export default function AdminIncidenciasPage() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([
    {
      id: 'INC-001',
      titulo: 'Error en dashboard de llamadas',
      descripcion: 'Los gráficos no cargan correctamente en TechCorp. Se muestra una pantalla en blanco cuando el usuario intenta acceder a las métricas de llamadas diarias.',
      prioridad: 'Alta',
      estado: 'En Progreso',
      cliente: 'TechCorp Solutions',
      fechaCreacion: '2024-01-15',
      fechaActualizacion: '2024-01-16',
      asignadoA: 'Equipo Técnico',
      tieneArchivo: true,
      archivo: 'captura_error_dashboard.png'
    },
    {
      id: 'INC-002',
      titulo: 'Problema de autenticación',
      descripcion: 'El cliente no puede acceder a su panel de control. Aparece un mensaje de error 401 cuando intenta hacer login con sus credenciales correctas.',
      prioridad: 'Alta',
      estado: 'Abierto',
      cliente: 'InnovaCorp',
      fechaCreacion: '2024-01-14',
      fechaActualizacion: '2024-01-14',
      tieneArchivo: false
    },
    {
      id: 'INC-003',
      titulo: 'Solicitud de nueva funcionalidad',
      descripcion: 'Cliente solicita exportar datos en Excel. Necesita poder descargar reportes mensuales de llamadas y métricas en formato .xlsx para análisis interno.',
      prioridad: 'Media',
      estado: 'Resuelto',
      cliente: 'TechCorp Solutions',
      fechaCreacion: '2024-01-10',
      fechaActualizacion: '2024-01-13',
      asignadoA: 'Desarrollo',
      tieneArchivo: true,
      archivo: 'especificaciones_excel_export.pdf'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [filterPrioridad, setFilterPrioridad] = useState('Todas')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null)

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Baja':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'En Progreso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resuelto':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return <XCircle className="h-4 w-4" />
      case 'En Progreso':
        return <Clock className="h-4 w-4" />
      case 'Resuelto':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const filteredIncidencias = incidencias.filter(inc => {
    const matchesSearch = inc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inc.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === 'Todos' || inc.estado === filterEstado
    const matchesPrioridad = filterPrioridad === 'Todas' || inc.prioridad === filterPrioridad
    
    return matchesSearch && matchesEstado && matchesPrioridad
  })

  const estadisticas = {
    total: incidencias.length,
    abiertas: incidencias.filter(i => i.estado === 'Abierto').length,
    enProgreso: incidencias.filter(i => i.estado === 'En Progreso').length,
    resueltas: incidencias.filter(i => i.estado === 'Resuelto').length
  }

  const handleViewDetail = (incidencia: Incidencia) => {
    setSelectedIncidencia(incidencia)
    setShowDetailModal(true)
  }

  const handleChangeEstado = (incidenciaId: string, nuevoEstado: 'Abierto' | 'En Progreso' | 'Resuelto') => {
    setIncidencias(prev => prev.map(inc => 
      inc.id === incidenciaId 
        ? { ...inc, estado: nuevoEstado, fechaActualizacion: new Date().toISOString().split('T')[0] }
        : inc
    ))
  }

  const handleDownloadFile = (archivo: string) => {
    // Simular descarga del archivo
    console.log('Descargando archivo:', archivo)
    // En producción aquí se haría la descarga real
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incidencias</h1>
          <p className="text-gray-600 mt-1">
            Gestiona incidencias y tickets de soporte de clientes
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
                placeholder="Buscar por título, cliente o ID..."
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
                <option value="Todos">Todos los estados</option>
                <option value="Abierto">Abierto</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Resuelto">Resuelto</option>
              </select>
              
              <select
                value={filterPrioridad}
                onChange={(e) => setFilterPrioridad(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-buffalo-green focus:border-transparent bg-white text-gray-900"
              >
                <option value="Todas">Todas las prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Incidencias</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abiertas</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{estadisticas.abiertas}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.enProgreso}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resueltas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.resueltas}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>


        {/* Incidencias List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Incidencias ({filteredIncidencias.length})
          </h2>
          
          {filteredIncidencias.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron incidencias</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIncidencias.map((incidencia) => (
                <div key={incidencia.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{incidencia.titulo}</h3>
                        <span className="text-sm text-gray-500">#{incidencia.id}</span>
                        {incidencia.tieneArchivo && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            📎 Archivo
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {incidencia.descripcion}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{incidencia.cliente}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{incidencia.fechaCreacion}</span>
                        </div>
                        
                        {incidencia.asignadoA && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Asignado: {incidencia.asignadoA}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(incidencia.prioridad)}`}>
                        {incidencia.prioridad}
                      </span>
                      
                      {/* Estado con botones para cambiar */}
                      <div className="flex gap-2">
                        {(['Abierto', 'En Progreso', 'Resuelto'] as const).map((estado) => (
                          <button
                            key={estado}
                            onClick={() => handleChangeEstado(incidencia.id, estado)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              incidencia.estado === estado
                                ? getEstadoColor(estado)
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-300'
                            }`}
                          >
                            {estado}
                          </button>
                        ))}
                      </div>
                      
                      {/* Botones de acción */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewDetail(incidencia)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {incidencia.tieneArchivo && (
                          <button 
                            onClick={() => handleDownloadFile(incidencia.archivo!)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Descargar archivo"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Detail Modal */}
      {showDetailModal && selectedIncidencia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDetailModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Detalles de la Incidencia</h2>
                  <p className="text-sm text-gray-500">ID: {selectedIncidencia.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Título y Estado */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{selectedIncidencia.titulo}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(selectedIncidencia.estado)}`}>
                      {getEstadoIcon(selectedIncidencia.estado)}
                      {selectedIncidencia.estado}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(selectedIncidencia.prioridad)}`}>
                      {selectedIncidencia.prioridad}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Cliente</h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{selectedIncidencia.cliente}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Asignado a</h4>
                  <div className="text-gray-600">
                    {selectedIncidencia.asignadoA || 'Sin asignar'}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Fecha de creación</h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedIncidencia.fechaCreacion}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Última actualización</h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{selectedIncidencia.fechaActualizacion}</span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h4>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedIncidencia.descripcion}
                </p>
              </div>

              {/* Archivo adjunto */}
              {selectedIncidencia.tieneArchivo && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Archivo adjunto</h4>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        📎
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedIncidencia.archivo}</p>
                        <p className="text-sm text-gray-500">Archivo adjunto</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(selectedIncidencia.archivo!)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </button>
                  </div>
                </div>
              )}

              {/* Cambiar estado */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Cambiar estado</h4>
                <div className="flex gap-3">
                  {(['Abierto', 'En Progreso', 'Resuelto'] as const).map((estado) => (
                    <button
                      key={estado}
                      onClick={() => {
                        handleChangeEstado(selectedIncidencia.id, estado)
                        setSelectedIncidencia({ ...selectedIncidencia, estado })
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        selectedIncidencia.estado === estado
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {getEstadoIcon(estado)}
                      {estado}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón de cerrar */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
