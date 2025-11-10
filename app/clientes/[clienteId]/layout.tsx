'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ClienteConfig } from '@/types/cliente'
import { getClientConfig, getModulosActivos, generateCSSVariables, getGruposNavegacion } from '@/lib/cliente-utils'
import { 
  Home,
  Phone, 
  MessageSquare, 
  Bot, 
  AlertTriangle,
  Target,
  BookOpen,
  TestTube,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Brain,
  Activity
} from 'lucide-react'

interface ClienteLayoutProps {
  children: React.ReactNode
}

const iconMap = {
  Home,
  Phone,
  MessageSquare,
  Bot,
  AlertTriangle,
  Target,
  BookOpen,
  TestTube,
  Search,
  Settings,
  BarChart3,
  Brain
}

export default function ClienteLayout({ children }: ClienteLayoutProps) {
  const params = useParams()
  const clienteId = params?.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clienteId) {
      console.error('❌ No clienteId provided')
      setError('ID de cliente no proporcionado')
      setLoading(false)
      return
    }

    const fetchCliente = async () => {
      try {
        console.log('🔍 Loading cliente config for:', clienteId)
        
        // First try static config
        let clienteData = getClientConfig(clienteId)
        
        // If not found in static config, try API
        if (!clienteData) {
          console.log('📡 Cliente not in static config, fetching from API...')
          try {
            const response = await fetch(`/api/clientes/${clienteId}`)
            const apiData = await response.json()
            
            if (response.ok && apiData.success && apiData.cliente) {
              console.log('✅ Cliente found in API:', apiData.cliente.id, apiData.cliente.nombreEmpresa)
              
              // Create ClienteConfig from API data
              clienteData = {
                id: String(apiData.cliente.id),
                nombre: apiData.cliente.nombreEmpresa,
                color: apiData.cliente.colorPrincipal || '#00C896',
                logo: apiData.cliente.logo || '',
                modulos: [], // Will be populated from default modules
                grupos: {} // Will use default navigation
              }
            }
          } catch (apiError) {
            console.warn('⚠️ Error fetching from API:', apiError)
          }
        }
        
        if (clienteData) {
          console.log('✅ Cliente config found:', clienteData.id, clienteData.nombre)
          setCliente(clienteData)
          
          // Aplicar variables CSS dinámicas solo en el cliente
          if (typeof document !== 'undefined') {
            const style = document.createElement('style')
            style.id = `cliente-style-${clienteId}`
            style.textContent = `
              :root {
                --primary: ${clienteData.color};
              }
              .text-primary {
                color: var(--primary);
              }
              .bg-primary {
                background-color: var(--primary);
              }
              .border-primary {
                border-color: var(--primary);
              }
              .ring-primary {
                --tw-ring-color: var(--primary);
              }
              
              /* Ocultar scrollbar pero mantener funcionalidad */
              .scrollbar-hide {
                -ms-overflow-style: none;  /* Internet Explorer 10+ */
                scrollbar-width: none;  /* Firefox */
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;  /* Safari and Chrome */
              }
            `
            
            // Remove existing style if it exists
            const existingStyle = document.getElementById(`cliente-style-${clienteId}`)
            if (existingStyle) {
              document.head.removeChild(existingStyle)
            }
            
            document.head.appendChild(style)
          }
        } else {
          console.warn('⚠️ Cliente config not found in static config or API for:', clienteId)
          // Don't set error here - let the component render and show the "not found" message
        }
      } catch (error) {
        console.error('❌ Error al cargar cliente:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido al cargar el cliente')
      } finally {
        setLoading(false)
      }
    }

    fetchCliente()
  }, [clienteId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" suppressHydrationWarning>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buffalo-green mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Only show error screen if there's a critical error AND no clienteId
  // If we have clienteId, always render - let child components fetch from API
  if (error && !clienteId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" suppressHydrationWarning>
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-buffalo-green text-white rounded-lg hover:bg-buffalo-green/90"
          >
            Volver al login
          </button>
        </div>
      </div>
    )
  }

  // Always render the layout if we have clienteId - let child components handle missing cliente
  // The dashboard will fetch from API even if static config doesn't exist
  if (!cliente && clienteId) {
    console.warn('⚠️ Cliente config not found in static config, but rendering layout anyway for:', clienteId)
    console.log('💡 Child components (like dashboard) will fetch from API and show saved design')
  }

  // Get navigation groups - handle case where cliente might not be found
  let gruposNavegacion: Record<string, any[]> = {}
  try {
    if (clienteId) {
      gruposNavegacion = getGruposNavegacion(clienteId)
      
      // If no navigation groups found, provide default navigation
      if (Object.keys(gruposNavegacion).length === 0) {
        console.log('📋 No navigation groups found, using default navigation')
        gruposNavegacion = {
          'Navegación': [
            { name: 'Dashboard', href: `/clientes/${clienteId}/dashboard-kpis`, icon: 'Home' },
            { name: 'Llamadas', href: `/clientes/${clienteId}/llamadas`, icon: 'Phone' },
            { name: 'Texto/Chat', href: `/clientes/${clienteId}/texto`, icon: 'MessageSquare' },
            { name: 'Automatizaciones', href: `/clientes/${clienteId}/automatizaciones`, icon: 'Bot' },
            { name: 'Buscar', href: `/clientes/${clienteId}/buscar`, icon: 'Search' },
            { name: 'Dinámico', href: `/clientes/${clienteId}/dinamico`, icon: 'BarChart3' }
          ]
        }
      }
    }
  } catch (err) {
    console.error('Error getting navigation groups:', err)
    // Provide default navigation if groups can't be loaded
    gruposNavegacion = {
      'Navegación': [
        { name: 'Dashboard', href: `/clientes/${clienteId}/dashboard-kpis`, icon: 'Home' },
        { name: 'Llamadas', href: `/clientes/${clienteId}/llamadas`, icon: 'Phone' },
        { name: 'Texto/Chat', href: `/clientes/${clienteId}/texto`, icon: 'MessageSquare' },
        { name: 'Automatizaciones', href: `/clientes/${clienteId}/automatizaciones`, icon: 'Bot' },
        { name: 'Buscar', href: `/clientes/${clienteId}/buscar`, icon: 'Search' },
        { name: 'Dinámico', href: `/clientes/${clienteId}/dinamico`, icon: 'BarChart3' }
      ]
    }
  }

  // Use default color if cliente not found
  const primaryColor = cliente?.color || '#00C896'

  return (
    <div className="min-h-screen bg-gray-50" data-theme={clienteId || 'default'} suppressHydrationWarning>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} suppressHydrationWarning>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} suppressHydrationWarning />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-[#1A1D23] shadow-xl h-screen" suppressHydrationWarning>
          {/* Header con logo Agencia Buffalo para móvil */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 border-b border-gray-700 lg:hidden" style={{ height: '88px' }}>
            <div className="flex items-center gap-3">
              <img
                src="https://agenciabuffalo.es/wp-content/uploads/2025/08/a58a83c2-193d-4bea-b71e-9aa1ca8e9d02.png"
                alt="Agencia Buffalo"
                className="h-10 w-auto"
              />
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navegación con scroll */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
            <nav className="py-4">
              {Object.entries(gruposNavegacion).map(([grupoNombre, items]) => (
                <div key={grupoNombre} className="mb-6">
                  <h3 className="uppercase text-xs font-bold text-gray-400 px-4 mt-6 mb-2">
                    {grupoNombre}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item, index) => {
                      const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Home
                      const isActive = false // TODO: implement active state logic
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 mx-2 ${
                            isActive 
                              ? 'bg-[#2A2E37] text-primary font-semibold' 
                              : 'text-gray-300 hover:bg-[#2A2E37]'
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                          {item.name}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
              
              {/* Sistema - n8n Dashboard */}
              <div className="mb-6">
                <h3 className="uppercase text-xs font-bold text-gray-400 px-4 mt-6 mb-2">
                  Sistema
                </h3>
                <div className="space-y-2">
                  <a
                    href="/n8n-dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 mx-2 text-gray-300 hover:bg-[#2A2E37]"
                  >
                    <Activity className="h-5 w-5" />
                    n8n Analytics
                  </a>
                </div>
              </div>
            </nav>
          </div>

          {/* Logout fijo abajo */}
          <div className="flex-shrink-0 border-t border-gray-700 p-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-md transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col" suppressHydrationWarning>
        <div className="flex flex-col h-screen bg-[#1A1D23] shadow-lg" suppressHydrationWarning>
          {/* Header con logo Agencia Buffalo para desktop */}
          <div className="flex-shrink-0 flex items-center justify-center border-b border-gray-700" style={{ height: '88px' }}>
            <img
              src="https://agenciabuffalo.es/wp-content/uploads/2025/08/a58a83c2-193d-4bea-b71e-9aa1ca8e9d02.png"
              alt="Agencia Buffalo"
              className="h-10 w-auto"
            />
          </div>

          {/* Navegación con scroll */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
            <nav className="py-4">
              {Object.entries(gruposNavegacion).map(([grupoNombre, items]) => (
                <div key={grupoNombre} className="mb-6">
                  <h3 className="uppercase text-xs font-bold text-gray-400 px-4 mt-6 mb-2">
                    {grupoNombre}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item, index) => {
                      const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Home
                      const isActive = false // TODO: implement active state logic
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 mx-2 ${
                            isActive 
                              ? 'bg-[#2A2E37] text-primary font-semibold' 
                              : 'text-gray-300 hover:bg-[#2A2E37]'
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                          {item.name}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
              
              {/* Sistema - n8n Dashboard */}
              <div className="mb-6">
                <h3 className="uppercase text-xs font-bold text-gray-400 px-4 mt-6 mb-2">
                  Sistema
                </h3>
                <div className="space-y-2">
                  <a
                    href="/n8n-dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 mx-2 text-gray-300 hover:bg-[#2A2E37]"
                  >
                    <Activity className="h-5 w-5" />
                    n8n Analytics
                  </a>
                </div>
              </div>
            </nav>
          </div>

          {/* Logout fijo abajo */}
          <div className="flex-shrink-0 border-t border-gray-700 p-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-md transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64" suppressHydrationWarning>
        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200" suppressHydrationWarning>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-gray-900">Dashboard</span>
        </div>

        {/* Page content */}
        <main className="py-0" suppressHydrationWarning>
          {children}
        </main>
      </div>
    </div>
  )
}