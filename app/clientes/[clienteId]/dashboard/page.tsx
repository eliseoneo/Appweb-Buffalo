'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ClienteConfig } from '@/types/cliente'
import { getClientConfig } from '@/lib/cliente-utils'
import { 
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Activity,
  BarChart3
} from 'lucide-react'

export default function DashboardPage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const clienteData = getClientConfig(clienteId)
    setCliente(clienteData || null)
    setLoading(false)
  }, [clienteId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buffalo-green mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cliente no encontrado</h1>
          <p className="text-gray-600">El cliente con ID "{clienteId}" no existe.</p>
        </div>
      </div>
    )
  }

  const kpis = [
    {
      titulo: 'Usuarios Activos',
      valor: '12,345',
      cambio: '+12%',
      icono: Users,
      color: 'bg-blue-500'
    },
    {
      titulo: 'Ingresos Mensuales',
      valor: '€45,678',
      cambio: '+8%',
      icono: DollarSign,
      color: 'bg-green-500'
    },
    {
      titulo: 'Tiempo de Respuesta',
      valor: '2.3s',
      cambio: '-15%',
      icono: Clock,
      color: 'bg-yellow-500'
    },
    {
      titulo: 'Tasa de Conversión',
      valor: '15.2%',
      cambio: '+5%',
      icono: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {cliente.nombre}
          </h1>
          <p className="text-gray-600 mt-1">
            Tu dashboard personalizado con métricas en tiempo real
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 space-y-8">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icono
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.titulo}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.valor}</p>
                    <p className="text-sm text-green-600 mt-1">{kpi.cambio}</p>
                  </div>
                  <div className={`h-12 w-12 ${kpi.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Líneas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tendencia de Usuarios</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de tendencia</p>
                <p className="text-sm text-gray-400">Datos de los últimos 30 días</p>
              </div>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Actividad por Módulo</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de barras</p>
                <p className="text-sm text-gray-400">Actividad por módulo activo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos Activos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Módulos Activos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cliente.modulos.map((modulo, index) => (
              <div key={index} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: `${cliente.color}20` }}
                >
                  <div 
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: cliente.color }}
                  ></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{modulo}</p>
                  <p className="text-sm text-gray-500">Módulo activo</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            {[
              { accion: 'Nuevo usuario registrado', tiempo: 'Hace 5 minutos', tipo: 'success' },
              { accion: 'Campaña "Q1 2024" iniciada', tiempo: 'Hace 1 hora', tipo: 'info' },
              { accion: 'Incidencia resuelta #123', tiempo: 'Hace 2 horas', tipo: 'success' },
              { accion: 'Backup automático completado', tiempo: 'Hace 3 horas', tipo: 'info' }
            ].map((actividad, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-3 ${
                    actividad.tipo === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-gray-900">{actividad.accion}</span>
                </div>
                <span className="text-sm text-gray-500">{actividad.tiempo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}