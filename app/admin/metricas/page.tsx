'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface MetricaRow {
  id: number
  cliente_id: number | null
  cliente_nombre: string | null
  aplicacion_id: number | null
  tipo_metrica: string
  valor: number
  fecha_metrica: string
  metadata?: any
}

interface ClienteItem {
  id: string
  nombreEmpresa: string
}

export default function AdminMetricasPage() {
  const [metricas, setMetricas] = useState<MetricaRow[]>([])
  const [clientes, setClientes] = useState<ClienteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [clienteFilter, setClienteFilter] = useState<string>('')
  const [onlyResumen, setOnlyResumen] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load clients for filter
        const cRes = await fetch('/api/clientes')
        const cJson = await cRes.json()
        if (cRes.ok && cJson.success) {
          const items: ClienteItem[] = (cJson.clientes || []).map((c: any) => ({
            id: String(c.id),
            nombreEmpresa: c.nombreEmpresa || 'Sin nombre'
          }))
          // Sort by name
          items.sort((a, b) => a.nombreEmpresa.localeCompare(b.nombreEmpresa, 'es'))
          setClientes(items)
        }

        // Load metrics (optionally filtered by clienteFilter)
        const url = clienteFilter ? `/api/admin/metricas?clienteId=${encodeURIComponent(clienteFilter)}` : '/api/admin/metricas'
        const mRes = await fetch(url)
        const mJson = await mRes.json()
        if (!mRes.ok || !mJson.success) {
          throw new Error(mJson.message || 'Error al obtener métricas')
        }
        setMetricas(mJson.data || [])
      } catch (e: any) {
        setError(e?.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [clienteFilter])

  const filtered = useMemo(() => {
    return (metricas || [])
      .filter(m => {
        if (onlyResumen && m.tipo_metrica !== 'resumen_cliente') return false
        const name = (m.cliente_nombre || '').toLowerCase()
        const tm = (m.tipo_metrica || '').toLowerCase()
        const term = searchTerm.toLowerCase()
        return !term || name.includes(term) || tm.includes(term)
      })
      .slice(0, 500)
  }, [metricas, searchTerm, onlyResumen])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center px-8">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Métricas</h1>
            <p className="text-gray-600 mt-1">Listado y resumen desde la tabla metricas</p>
          </div>
          <Link 
            href="/admin" 
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm"
          >
            ← Volver al dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente o tipo de métrica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
              />
            </div>

            <div>
              <select
                value={clienteFilter}
                onChange={(e) => setClienteFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
              >
                <option value="">Todos los clientes</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombreEmpresa}</option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={onlyResumen}
                onChange={(e) => setOnlyResumen(e.target.checked)}
              />
              Mostrar solo resumen_cliente
            </label>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-600">
            Cargando métricas...
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Métrica</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((m) => (
                    <tr key={m.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {m.cliente_nombre || `#${m.cliente_id ?? '-'}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          m.tipo_metrica === 'resumen_cliente' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {m.tipo_metrica}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {m.valor.toLocaleString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(m.fecha_metrica).toLocaleString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {m.metadata ? (
                          <details>
                            <summary className="cursor-pointer text-gray-700">Ver metadata</summary>
                            <pre className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-xs overflow-auto max-h-48">
{JSON.stringify(m.metadata, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-8 text-center text-gray-500">No hay métricas para los filtros seleccionados.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


