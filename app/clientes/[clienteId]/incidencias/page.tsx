'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Plus, AlertTriangle, Clock, Eye, Edit, Trash2, X, Upload, File } from 'lucide-react'
import { getClientConfig } from '@/lib/cliente-utils'
import { ClienteConfig } from '@/types/cliente'
import ClientHeader from '@/components/ClientHeader'

interface Incidencia {
  id: number
  titulo: string
  descripcion: string
  prioridad: 'Baja' | 'Media' | 'Alta'
  estado: 'Abierto' | 'En Progreso' | 'Resuelto'
  fechaCreacion: string
  archivo?: string
  tieneArchivo: boolean
}

export default function IncidenciasPage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null)
  const [incidencias, setIncidencias] = useState<Incidencia[]>([
    {
      id: 1,
      titulo: "Error en el sistema de pagos",
      descripcion: "El sistema de pagos no está procesando las transacciones correctamente. Los usuarios reportan errores al intentar completar sus compras.",
      prioridad: "Alta",
      estado: "Abierto",
      fechaCreacion: "2024-12-15",
      tieneArchivo: true,
      archivo: "captura-error-pagos.png"
    },
    {
      id: 2,
      titulo: "Mejora en la interfaz de usuario",
      descripcion: "Sería útil añadir un botón de acceso rápido en el dashboard principal para facilitar la navegación.",
      prioridad: "Baja",
      estado: "En Progreso",
      fechaCreacion: "2024-12-12",
      tieneArchivo: false
    },
    {
      id: 3,
      titulo: "Problemas de conectividad",
      descripcion: "Usuarios reportan intermitencias en la conexión durante las horas pico.",
      prioridad: "Media",
      estado: "Resuelto",
      fechaCreacion: "2024-12-10",
      tieneArchivo: false
    }
  ])

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'Media' as Incidencia['prioridad'],
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
    
    if (!formData.titulo || !formData.descripcion) {
      alert('Título y descripción son obligatorios')
      return
    }

    const nuevaIncidencia: Incidencia = {
      id: Date.now(),
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      prioridad: formData.prioridad,
      estado: 'Abierto',
      fechaCreacion: new Date().toISOString().split('T')[0],
      tieneArchivo: formData.archivo !== null,
      archivo: formData.archivo?.name
    }

    setIncidencias(prev => [nuevaIncidencia, ...prev])
    setShowModal(false)
    setFormData({
      titulo: '',
      descripcion: '',
      prioridad: 'Media',
      archivo: null
    })
  }

  const getEstadoBadgeColor = (estado: Incidencia['estado']) => {
    switch (estado) {
      case 'Abierto':
        return 'bg-red-100 text-red-700 border border-red-200'
      case 'En Progreso':
        return 'bg-amber-100 text-amber-700 border border-amber-200'
      case 'Resuelto':
        return 'bg-green-100 text-green-700 border border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  const getPrioridadColor = (prioridad: Incidencia['prioridad']) => {
    switch (prioridad) {
      case 'Alta':
        return 'text-red-500'
      case 'Media':
        return 'text-yellow-500'
      case 'Baja':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const handleChangeEstado = (id: number, nuevoEstado: Incidencia['estado']) => {
    setIncidencias(prev => prev.map(inc => 
      inc.id === id ? { ...inc, estado: nuevoEstado } : inc
    ))
  }

  const handleDelete = (incidencia: Incidencia) => {
    setSelectedIncidencia(incidencia)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedIncidencia) {
      setIncidencias(prev => prev.filter(inc => inc.id !== selectedIncidencia.id))
      setShowDeleteModal(false)
      setSelectedIncidencia(null)
    }
  }

  const handleViewDetail = (incidencia: Incidencia) => {
    setSelectedIncidencia(incidencia)
    setShowDetailModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title="Incidencias"
        subtitle="Reporta problemas o solicita soporte"
      />

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Lista de Incidencias */}
        <div className="space-y-6">
          {incidencias.map((incidencia) => (
            <div key={incidencia.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              {/* Header del ticket */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{incidencia.titulo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadgeColor(incidencia.estado)}`}>
                      {incidencia.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className={`h-4 w-4 ${getPrioridadColor(incidencia.prioridad)}`} />
                    <span className={`text-sm font-medium ${getPrioridadColor(incidencia.prioridad)}`}>
                      Prioridad {incidencia.prioridad}
                    </span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-gray-600 mb-5 leading-relaxed">{incidencia.descripcion}</p>

              {/* Info inferior */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Creado el {new Date(incidencia.fechaCreacion).toLocaleDateString('es-ES')}</span>
                  </div>
                  {incidencia.tieneArchivo && (
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span>Archivo adjunto</span>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => handleViewDetail(incidencia)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalle
                  </button>
                  
                  {/* Etiquetas de estado clicables */}
                  <div className="flex gap-2">
                    {(['Abierto', 'En Progreso', 'Resuelto'] as Incidencia['estado'][]).map((estado) => (
                      <button
                        key={estado}
                        onClick={() => handleChangeEstado(incidencia.id, estado)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          incidencia.estado === estado
                            ? getEstadoBadgeColor(estado)
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {estado}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleDelete(incidencia)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Card para añadir nueva incidencia */}
          <div 
            onClick={() => setShowModal(true)}
            className="rounded-lg p-4 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-buffalo-green transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center gap-3">
              <Plus className="h-5 w-5 text-gray-500" />
              <span className="text-lg font-medium text-gray-700">Añadir incidencia</span>
            </div>
          </div>
        </div>

        {/* Estado vacío */}
        {incidencias.length === 0 && (
          <div className="text-center py-16">
            <AlertTriangle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay incidencias</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              No tienes incidencias reportadas. Crea tu primera incidencia para empezar a gestionar problemas y solicitudes de soporte.
            </p>
            
            {/* Card para añadir nueva incidencia (estado vacío) */}
            <div 
              onClick={() => setShowModal(true)}
              className="inline-block rounded-lg p-4 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-buffalo-green transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center gap-3">
                <Plus className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-700">Crear primera incidencia</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Nueva Incidencia */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Nueva Incidencia</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la incidencia *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-buffalo-green focus:border-transparent text-gray-900"
                  placeholder="Ej: Error en el sistema de pagos"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción detallada *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-buffalo-green focus:border-transparent text-gray-900"
                  placeholder="Describe detalladamente el problema o solicitud..."
                  required
                />
              </div>

              {/* Prioridad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => handleInputChange('prioridad', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-buffalo-green focus:border-transparent text-gray-900"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              {/* Adjuntar archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjuntar archivo (opcional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleInputChange('archivo', e.target.files?.[0] || null)}
                    className="hidden"
                    id="archivo-incidencia"
                  />
                  <label
                    htmlFor="archivo-incidencia"
                    className="w-full flex items-center justify-center gap-3 px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-buffalo-green hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    {formData.archivo ? (
                      <>
                        <File className="h-6 w-6 text-buffalo-green" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{formData.archivo.name}</p>
                          <p className="text-xs text-gray-500">Archivo seleccionado</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">Subir archivo</p>
                          <p className="text-xs text-gray-500">PDF, imágenes o documentos</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Formatos: PDF, JPG, PNG, DOC, DOCX (máx. 10MB)</p>
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
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar */}
      {showDeleteModal && selectedIncidencia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            {/* Header del Modal */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Eliminar Incidencia</h2>
              <p className="text-gray-600">
                ¿Estás seguro de que quieres eliminar la incidencia <strong>"{selectedIncidencia.titulo}"</strong>? 
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {showDetailModal && selectedIncidencia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDetailModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Header del Modal */}
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

            {/* Contenido del Modal */}
            <div className="space-y-6">
              {/* Título y Estado */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{selectedIncidencia.titulo}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadgeColor(selectedIncidencia.estado)}`}>
                    {selectedIncidencia.estado}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${getPrioridadColor(selectedIncidencia.prioridad)}`} />
                  <span className={`text-sm font-medium ${getPrioridadColor(selectedIncidencia.prioridad)}`}>
                    Prioridad {selectedIncidencia.prioridad}
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h4>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedIncidencia.descripcion}
                </p>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Fecha de creación</h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(selectedIncidencia.fechaCreacion).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>

                {selectedIncidencia.tieneArchivo && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Archivo adjunto</h4>
                    <div className="flex items-center gap-2 text-gray-600">
                      <File className="h-4 w-4" />
                      <span>{selectedIncidencia.archivo}</span>
                    </div>
                  </div>
                )}
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