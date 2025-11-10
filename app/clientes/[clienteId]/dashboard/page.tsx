'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params.clienteId as string

  useEffect(() => {
    // Redirigir al dashboard con KPIs que usa datos de la API y diseño guardado
    if (clienteId) {
      router.replace(`/clientes/${clienteId}/dashboard-kpis`)
    }
  }, [clienteId, router])

  return null
}