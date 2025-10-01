'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getClientConfig } from '@/lib/cliente-utils'
import { ClienteConfig } from '@/types/cliente'
import ClientHeader from '@/components/ClientHeader'

export default function PruebaPage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    modelo: ''
  })
  const [errors, setErrors] = useState({
    nombre: '',
    email: '',
    telefono: '',
    modelo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    const clienteData = getClientConfig(clienteId)
    if (clienteData) {
      setCliente(clienteData)
    }
  }, [clienteId])

  // Auto hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleInputChange = (field: 'nombre' | 'email' | 'telefono' | 'modelo', value: string) => {
    // Limpiar errores al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    if (field === 'telefono') {
      // Limpiar espacios y mantener solo dígitos
      const cleanedValue = value.replace(/\s/g, '').replace(/\D/g, '')
      // Limitar a 9 dígitos
      const limitedValue = cleanedValue.slice(0, 9)
      setFormData(prev => ({ ...prev, [field]: limitedValue }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const validateForm = () => {
    const newErrors = { nombre: '', email: '', telefono: '', modelo: '' }
    let isValid = true

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre requerido'
      isValid = false
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email requerido'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
      isValid = false
    }

    // Validar teléfono
    if (!formData.telefono) {
      newErrors.telefono = 'Teléfono requerido'
      isValid = false
    } else if (formData.telefono.length !== 9) {
      newErrors.telefono = 'Debe tener 9 dígitos'
      isValid = false
    }

    // Validar modelo
    if (!formData.modelo) {
      newErrors.modelo = 'Modelo requerido'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.nombre.trim(),
        phone_e164: `+34${formData.telefono}`,
        clienteId: clienteId
      }

      const response = await fetch('/api/mock/llamadas-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setToast({ type: 'success', message: '✓ Enviado con éxito' })
        setFormData({ nombre: '', email: '', telefono: '', modelo: '' })
      } else {
        setToast({ type: 'error', message: '✗ Error al enviar' })
      }
    } catch (error) {
      setToast({ type: 'error', message: '✗ Error al enviar' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title="Probar Sistema"
        subtitle="Agentes de Llamadas"
        showFilters={false}
      />

      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-sm">
          <div className="bg-gradient-to-br from-[#00C896] to-[#00E0A3] rounded-xl shadow-lg p-6">
            {/* Título */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">Probar Sistema</h2>
              <p className="text-white/80 text-sm mt-1">Completa los datos para realizar una prueba</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nombre */}
              <div>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-md shadow-sm outline-none placeholder-gray-400 text-gray-900"
                  placeholder="Tu nombre"
                  required
                />
                {errors.nombre && (
                  <p className="mt-1 text-xs text-red-200">{errors.nombre}</p>
                )}
              </div>

              {/* Campo Email */}
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-md shadow-sm outline-none placeholder-gray-400 text-gray-900"
                  placeholder="tu@email.com"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-200">{errors.email}</p>
                )}
              </div>

              {/* Campo Teléfono */}
              <div>
                <div className="flex items-center bg-white rounded-md shadow-sm">
                  <span className="px-3 text-gray-500 select-none text-sm">+34</span>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    maxLength={9}
                    inputMode="numeric"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-r-md outline-none placeholder-gray-400 text-gray-900"
                    placeholder="600 000 000"
                    required
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-xs text-red-200">{errors.telefono}</p>
                )}
              </div>

              {/* Campo Modelo */}
              <div>
                <select
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-md shadow-sm outline-none text-gray-900 appearance-none"
                  required
                >
                  <option value="">Selecciona un modelo</option>
                  <option value="gpt-4">GPT-4 Turbo</option>
                  <option value="gpt-3.5">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3 Sonnet</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
                {errors.modelo && (
                  <p className="mt-1 text-xs text-red-200">{errors.modelo}</p>
                )}
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 mt-6 ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'
                }`}
              >
                {isSubmitting ? 'Enviando…' : 'Enviar Prueba'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
