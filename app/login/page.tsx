'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🚀 Enviando login:', formData)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('📡 Respuesta del servidor:', response.status)

      const data = await response.json()
      console.log('📦 Datos recibidos:', data)

      if (data.success) {
        console.log('✅ Login exitoso, redirigiendo...')
        console.log('👤 User data:', data.user)
        console.log('🆔 Cliente ID:', data.user.cliente_id, 'Type:', typeof data.user.cliente_id)
        
        // Redirigir inmediatamente sin esperar
        if (data.user.tipo_usuario === 'admin') {
          window.location.href = '/admin'
        } else {
          // Redirigir al panel del cliente específico
          const clienteId = data.user.cliente_id
          if (!clienteId) {
            console.error('❌ No cliente_id found in user data')
            setError('Error: No se encontró el ID del cliente. Contacta al administrador.')
            return
          }
          console.log('🔗 Redirigiendo a:', `/clientes/${clienteId}/dashboard`)
          window.location.href = `/clientes/${clienteId}/dashboard`
        }
      } else {
        console.log('❌ Error en login:', data.message)
        setError(data.message || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('💥 Error de conexión:', error)
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buffalo AI</h1>
          <p className="text-gray-600">Iniciar Sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin o cliente"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin123"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Admin: admin / admin123</p>
          <p>Cliente: cliente / admin123</p>
        </div>
      </div>
    </div>
  )
}