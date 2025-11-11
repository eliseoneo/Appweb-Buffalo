'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardData {
  stats: {
    activeClients: number
    applications: number
    metrics: number
    reports: number
  }
  changes: {
    clientsThisMonth: number
    appsThisWeek: number
    metricsToday: number
  }
  recentActivity: Array<{
    action: string
    timeAgo: string
    user: string
    color: string
  }>
  performance: {
    callsProcessed: number
    avgResponseRate?: number
    avgWaitTimeSec?: number
  }
}

export default function AdminPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/dashboard')
        const result = await response.json()

        if (result.success) {
          setDashboardData(result.data)
          setError(null)
        } else {
          setError(result.message || 'Error al cargar los datos')
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Error al conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Helper function to get color class for activity
  const getActivityColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500'
    }
    return colorMap[color] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const data = dashboardData || {
    stats: { activeClients: 0, applications: 0, metrics: 0, reports: 0 },
    changes: { clientsThisMonth: 0, appsThisWeek: 0, metricsToday: 0 },
    recentActivity: [],
    performance: { callsProcessed: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido al Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu plataforma Buffalo AI desde aquí
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.activeClients}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">
                {data.changes.clientsThisMonth > 0 ? `+${data.changes.clientsThisMonth} este mes` : 'Sin cambios este mes'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aplicaciones</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.applications}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">
                {data.changes.appsThisWeek > 0 ? `+${data.changes.appsThisWeek} esta semana` : 'Sin cambios esta semana'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Métricas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.metrics}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">
                {data.changes.metricsToday > 0 ? `+${data.changes.metricsToday} hoy` : 'Sin cambios hoy'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reportes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.reports}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">Total registros</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/crear-cliente" className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Nuevo Cliente</p>
                <p className="text-sm text-gray-500">Agregar un nuevo cliente</p>
              </div>
            </Link>

            <button className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Nueva Aplicación</p>
                <p className="text-sm text-gray-500">Crear una nueva app</p>
              </div>
            </button>

            <Link href="/admin/metricas" className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Ver Métricas</p>
                <p className="text-sm text-gray-500">Analizar rendimiento</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`h-2 w-2 ${getActivityColorClass(activity.color)} rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.timeAgo} • {activity.user}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Servidor Principal</span>
                <span className="flex items-center text-green-600 text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  Operativo
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de Datos</span>
                <span className="flex items-center text-green-600 text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  Conectada
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Webhooks</span>
                <span className="flex items-center text-green-600 text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  Activa
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Servicios de IA</span>
                <span className="flex items-center text-yellow-600 text-sm">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></div>
                  Mantenimiento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Métricas de Rendimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              {(() => {
                const rr = typeof data.performance.avgResponseRate === 'number' ? data.performance.avgResponseRate : 0
                const rrColor = rr >= 85 ? 'text-green-600' : rr >= 60 ? 'text-yellow-600' : 'text-red-600'
                return (
                  <div className={`text-3xl font-bold ${rrColor} mb-2`}>
                    {`${rr.toFixed(1)}%`}
                  </div>
                )
              })()}
              <div className="text-sm text-gray-600">Efectividad Global (Tasa de Respuesta)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {typeof data.performance.avgWaitTimeSec === 'number' ? `${data.performance.avgWaitTimeSec.toFixed(1)}s` : '0.0s'}
              </div>
              <div className="text-sm text-gray-600">Tiempo de Respuesta</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{data.performance.callsProcessed.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Llamadas Procesadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}