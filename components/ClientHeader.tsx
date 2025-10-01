'use client'

import { ClienteConfig } from '@/types/cliente'

interface ClientHeaderProps {
  cliente: ClienteConfig | null
  title?: string
  subtitle?: string
}

export default function ClientHeader({ cliente, title, subtitle }: ClientHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200" style={{ height: '88px' }}>
      <div className="flex items-center justify-center h-full px-8">
        {/* Logo + Nombre de la empresa - Centrados */}
        <div className="flex items-center gap-4">
          {/* Logo del cliente con altura adaptativa */}
          {cliente?.logo && (
            <div className="flex items-center justify-center h-10">
              <img 
                src={cliente.logo} 
                alt={`Logo ${cliente.nombre}`} 
                className="max-h-10 w-auto object-contain" 
              />
            </div>
          )}
          
          {/* Separador */}
          {cliente?.logo && (
            <span className="text-gray-400 text-lg">|</span>
          )}
          
          {/* Nombre de la empresa */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">
              {cliente?.nombre || 'Cliente'}
            </h1>
            {title && title !== 'Dashboard' && (
              <p className="text-sm text-gray-500">{title} {subtitle && `- ${subtitle}`}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}