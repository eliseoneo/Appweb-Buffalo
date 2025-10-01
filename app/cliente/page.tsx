'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente al dashboard del cliente
    router.push('/clientes/techcorp/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buffalo-green mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo al dashboard...</p>
      </div>
    </div>
  )
}