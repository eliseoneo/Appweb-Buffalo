'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Search, RefreshCw } from 'lucide-react'
import { getClientConfig } from '@/lib/cliente-utils'
import { ClienteConfig } from '@/types/cliente'
import ClientHeader from '@/components/ClientHeader'

export default function BuscarPage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  
  const [formData, setFormData] = useState({
    callId: '',
    nombre: '',
    email: '',
    telefono: ''
  })

  useEffect(() => {
    const clienteData = getClientConfig(clienteId)
    if (clienteData) {
      setCliente(clienteData)
    }
  }, [clienteId])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    // Lógica de búsqueda de llamadas
    console.log('Buscando llamadas con:', formData)
  }

  const handleClear = () => {
    setFormData({
      callId: '',
      nombre: '',
      email: '',
      telefono: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title="Buscar"
        subtitle="Agentes de Llamadas"
        showFilters={false}
      />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-6xl">
          <div className="bg-gradient-to-br from-buffalo-green to-emerald-600 rounded-xl shadow-lg p-8">
            {/* Título y Subtítulo */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Buscar Llamadas</h2>
              <p className="text-white/80">Busca llamadas en la base de datos</p>
            </div>

            {/* Formulario */}
            <div className="space-y-6">
              {/* Campos en una fila */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Call ID */}
                <div>
                  <input
                    type="text"
                    value={formData.callId}
                    onChange={(e) => handleInputChange('callId', e.target.value)}
                    className="w-full px-4 py-2 bg-white/90 rounded-md outline-none placeholder-gray-500 text-gray-900"
                    placeholder="ID de la llamada"
                  />
                </div>

                {/* Nombre */}
                <div>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="w-full px-4 py-2 bg-white/90 rounded-md outline-none placeholder-gray-500 text-gray-900"
                    placeholder="Nombre del cliente"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 bg-white/90 rounded-md outline-none placeholder-gray-500 text-gray-900"
                    placeholder="email@ejemplo.com"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="w-full px-4 py-2 bg-white/90 rounded-md outline-none placeholder-gray-500 text-gray-900"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-buffalo-green rounded-md font-semibold hover:bg-green-50 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Buscar
                </button>
                
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-6 py-2 bg-green-700 text-white rounded-md font-semibold hover:bg-green-800 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
