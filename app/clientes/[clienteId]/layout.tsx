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
  Brain
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
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const clienteData = getClientConfig(clienteId)
        if (clienteData) {
          setCliente(clienteData)
          
          // Aplicar variables CSS dinámicas
          const style = document.createElement('style')
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
          document.head.appendChild(style)

          return () => {
            document.head.removeChild(style)
          }
        }
      } catch (error) {
        console.error('Error al cargar cliente:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCliente()
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

  const gruposNavegacion = getGruposNavegacion(clienteId)

  return (
    <div className="min-h-screen bg-gray-50" data-theme={clienteId}>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-[#1A1D23] shadow-xl h-screen">
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-screen bg-[#1A1D23] shadow-lg">
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
      <div className="lg:pl-64">
        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
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
        <main className="py-0">
          {children}
        </main>
      </div>
    </div>
  )
}