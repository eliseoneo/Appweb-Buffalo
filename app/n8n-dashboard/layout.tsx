'use client'

import { useState } from 'react'
import { 
  Activity,
  LogOut,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react'

interface N8NDashboardLayoutProps {
  children: React.ReactNode
}

export default function N8NDashboardLayout({ children }: N8NDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-[#1A1D23] shadow-xl h-screen">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 border-b border-gray-700" style={{ height: '88px' }}>
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-lg font-bold text-white">n8n Analytics</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
            <nav className="py-4">
              <div className="mb-6">
                <h3 className="uppercase text-xs font-bold text-gray-400 px-4 mt-6 mb-2">
                  Navegación
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.history.back()}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 mx-2 text-gray-300 hover:bg-[#2A2E37]"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Volver
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md mx-2 bg-[#2A2E37] text-blue-400 font-semibold">
                    <Activity className="h-5 w-5" />
                    n8n Analytics
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Logout */}
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
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-center border-b border-gray-700" style={{ height: '88px' }}>
            <Activity className="h-10 w-10 text-blue-500 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-white">n8n Analytics</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
            <nav className="py-4">
              <div className="mb-6">
                <h3 className="uppercase text-xs font-bold text-gray-400 px-4 mt-6 mb-2">
                  Navegación
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.history.back()}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 mx-2 text-gray-300 hover:bg-[#2A2E37]"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Volver
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md mx-2 bg-[#2A2E37] text-blue-400 font-semibold">
                    <Activity className="h-5 w-5" />
                    n8n Analytics
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-bold text-gray-400 px-4 mt-6 mb-2">
                  Información
                </h3>
                <div className="px-4 mx-2">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Dashboard de análisis de llamadas basado en datos normalizados de n8n.
                  </p>
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-400 font-medium">
                      8 KPIs principales de un total de 20 disponibles
                    </p>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Logout */}
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
          <span className="text-lg font-semibold text-gray-900">n8n Analytics</span>
        </div>

        {/* Page content */}
        <main className="py-0">
          {children}
        </main>
      </div>
      
      {/* Add scrollbar hide style */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

