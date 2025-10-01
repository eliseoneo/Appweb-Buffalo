'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Calendar, FileText, X, Upload, File } from 'lucide-react'
import { getClientConfig } from '@/lib/cliente-utils'
import { ClienteConfig } from '@/types/cliente'
import ClientHeader from '@/components/ClientHeader'

interface Campana {
  id: number
  nombre: string
  descripcion: string
  estado: 'En Progreso' | 'Lanzamiento' | 'Finalizada' | 'General'
  fechaInicio: string
  fechaFin: string
  tieneDocumento: boolean
}

export default function CampanasPage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [campanas, setCampanas] = useState<Campana[]>([
    {
      id: 1,
      nombre: "Navidad 2024",
      descripcion: "Campaña de promociones navideñas con descuentos especiales para productos destacados",
      estado: "En Progreso",
      fechaInicio: "2024-12-01",
      fechaFin: "2024-12-31",
      tieneDocumento: true
    },
    {
      id: 2,
      nombre: "Lanzamiento Producto A",
      descripcion: "Campaña de lanzamiento del nuevo producto A con estrategia multi-canal",
      estado: "Lanzamiento",
      fechaInicio: "2024-11-15",
      fechaFin: "2024-12-15",
      tieneDocumento: true
    },
    {
      id: 3,
      nombre: "Black Friday 2024",
      descripcion: "Campaña especial de Black Friday con ofertas limitadas y promociones flash",
      estado: "Finalizada",
      fechaInicio: "2024-11-24",
      fechaFin: "2024-11-29",
      tieneDocumento: false
    },
    {
      id: 4,
      nombre: "Campaña General Q4",
      descripcion: "Campaña general para el cuarto trimestre enfocada en retención de clientes",
      estado: "General",
      fechaInicio: "2024-10-01",
      fechaFin: "2024-12-31",
      tieneDocumento: true
    }
  ])

  const [formData, setFormData] = useState({
    nombre: '',
    documento: null as File | null,
    fechaInicio: '',
    fechaFin: '',
    observaciones: ''
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
    
    // Validación básica
    if (!formData.nombre || !formData.fechaInicio || !formData.fechaFin) {
      alert('Nombre y fechas son obligatorios')
      return
    }

    // Crear nueva campaña
    const nuevaCampana: Campana = {
      id: Date.now(),
      nombre: formData.nombre,
      descripcion: formData.observaciones || 'Sin observaciones',
      estado: 'En Progreso',
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      tieneDocumento: formData.documento !== null
    }

    setCampanas(prev => [...prev, nuevaCampana])
    setShowModal(false)
    setFormData({
      nombre: '',
      documento: null,
      fechaInicio: '',
      fechaFin: '',
      observaciones: ''
    })
  }

  const getCardBackgroundColor = (estado: Campana['estado']) => {
    switch (estado) {
      case 'En Progreso':
        return 'bg-green-100'
      case 'Lanzamiento':
        return 'bg-yellow-100'
      case 'Finalizada':
        return 'bg-gray-200'
      case 'General':
        return 'bg-blue-100'
      default:
        return 'bg-gray-200'
    }
  }

  const getEstadoBadgeColor = (estado: Campana['estado']) => {
    switch (estado) {
      case 'En Progreso':
        return 'bg-green-100 text-green-800'
      case 'Lanzamiento':
        return 'bg-yellow-100 text-yellow-800'
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800'
      case 'General':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title="Gestión de Campañas"
        subtitle="Marketing y Publicidad"
        showFilters={false}
      />


      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Lista de campañas */}
        <div className="space-y-4">
          {campanas.map((campana) => (
            <div key={campana.id} className={`rounded-lg p-4 ${getCardBackgroundColor(campana.estado)} border border-gray-200`}>
              {/* Línea superior: Nombre + Badge de estado */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{campana.nombre}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadgeColor(campana.estado)}`}>
                  {campana.estado}
                </span>
              </div>

              {/* Línea media: Descripción */}
              <p className="text-gray-700 mb-3">{campana.descripcion}</p>

              {/* Línea inferior: Fechas + Documento */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                {/* Fechas */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(campana.fechaInicio).toLocaleDateString('es-ES')} - {new Date(campana.fechaFin).toLocaleDateString('es-ES')}
                  </span>
                </div>

                {/* Documento adjunto */}
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {campana.tieneDocumento ? 'Documento adjunto' : 'Sin documentos'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Card para añadir nueva campaña */}
          <div 
            onClick={() => setShowModal(true)}
            className="rounded-lg p-4 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-buffalo-green transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center gap-3">
              <Plus className="h-5 w-5 text-gray-500" />
              <span className="text-lg font-medium text-gray-700">Añadir campaña</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Nueva Campaña */}
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
              <h2 className="text-xl font-bold text-gray-900">Crear Nueva Campaña</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre de la campaña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la campaña *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-buffalo-green focus:border-transparent text-gray-900"
                  placeholder="Ej: Navidad 2024"
                  required
                />
              </div>

              {/* Adjuntar documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjuntar documento
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => handleInputChange('documento', e.target.files?.[0] || null)}
                    className="hidden"
                    id="documento-upload"
                  />
                  <label
                    htmlFor="documento-upload"
                    className="w-full flex items-center justify-center gap-3 px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-buffalo-green hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    {formData.documento ? (
                      <>
                        <File className="h-6 w-6 text-buffalo-green" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{formData.documento.name}</p>
                          <p className="text-xs text-gray-500">Archivo seleccionado</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">Subir archivo</p>
                          <p className="text-xs text-gray-500">Haz clic para seleccionar</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Formatos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)</p>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-buffalo-green focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de fin *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-buffalo-green focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-buffalo-green focus:border-transparent text-gray-900"
                  placeholder="Observaciones adicionales sobre la campaña..."
                />
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
