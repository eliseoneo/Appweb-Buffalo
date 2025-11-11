'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface Incidencia {
  id: number
  cliente_id: number
  cliente_nombre: string
  fecha_crea_incidencia: string
  estado: string
  descripcion: string
  prioridad?: string | null
  fecha_resolucion?: string | null
  fecha_postergado?: string | null
  datos_solucion?: string | null
  tiempo_aplicado_solucion?: number | null
  contacto_crea_incidencia?: string | null
}

interface ClienteItem {
  id: string
  nombreEmpresa: string
}

export default function AdminIncidenciasPage() {
  const [incidencias, setIncidencias] = useManagerState<Incidencia[]>([])
  const [clientes, setClientes] = useManagerState<ClienteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [clienteFilter, setClienteFilter] = useState<string>('')
  const [estadoFilter, setEstadoFilter] = useState<string>('')

  // Form state (create new)
  const [form, setForm] = useState({
    clienteId: '',
    estado: 'abierta',
    prioridad: 'media',
    descripcion: '',
    contacto: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  // Action modal state (cerrar / postergar)
  const [actionOpen, setActionOpen] = useState(false)
  const [actionMode, setActionMode] = useState<'cerrar' | 'postergar'>('cerrar')
  const [actionRow, setActionRow] = useState<Incidencia | null>(null)
  const [actionFecha, setActionFecha] = useState<string>('')
  const [actionDatos, setActionDatos] = useState<string>('')
  const [actionTiempo, setActionTiempo] = useState<string>('')

  // Pagination & caching
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const cacheRef = (globalThis as any).__incidenciasCacheRef || { map: new Map<string, any>() }
  ;(globalThis as any).__incidenciasCacheRef = cacheRef

  useEffect(() => {
    const fetchBase = async () => {
      try {
        setLoading(true)
        setError(null)
        // load clients
        const cRes = await fetch('/api/clientes')
        const cJson = await cRes.json()
        if (cRes.ok && cJson.success) {
          const items: ClienteItem[] = (cJson.clientes || []).map((c: any) => ({
            id: String(c.id),
            nombreEmpresa: c.nombreEmpresa || 'Sin nombre'
          }))
          items.sort((a: any, b: any) => a.nombreEmpresa.localeCompare(b.nombreEmpresa, 'es'))
          setClientes(items)
        }
      } catch (e: any) {
        setError(e?.message || 'Error cargando clientes')
      } finally {
        setLoading(false)
      }
    }
    fetchBase()
  }, [])

  const fetchIncidencias = async () => {
    try {
      const params = new URLSearchParams()
      if (clienteFilter) params.set('clienteId', clienteFilter)
      if (estadoFilter) params.set('estado', estadoFilter)
      if (debouncedSearch) params.set('q', debouncedSearch)
      params.set('page', String(page))
      params.set('pageSize', String(pageSize))
      const url = `/api/admin/incidencias?${params.toString()}`

      // Simple in-memory cache with TTL
      const cacheKey = url
      const now = Date.now()
      const cached = cacheRef.map.get(cacheKey)
      const TTL = 30_000 // 30s
      if (cached && (now - cached.ts) < TTL) {
        setIncidencias(cached.data || [])
        setTotal(cached.total || 0)
        setTotalPages(cached.totalPages || 1)
        setError(null)
        return
      }

      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) {
        setError(`Error cargando incidencias (${res.status})`)
        setIncidencias([])
        setTotal(0)
        setTotalPages(1)
        return
      }
      const json = await res.json().catch(() => null)
      if (json && json.success) {
        setIncidencias(json.data || [])
        setTotal(json.total || 0)
        setTotalPages(json.totalPages || 1)
        setError(null)
        cacheRef.map.set(cacheKey, { data: json.data || [], total: json.total || 0, totalPages: json.totalPages || 1, ts: now })
      } else {
        setError(json?.message || 'No se pudo cargar incidencias')
        setIncidencias([])
        setTotal(0)
        setTotalPages(1)
      }
    } catch (e: any) {
      console.error('fetchIncidencias error:', e)
      setError(e?.message || 'Fallo de red cargando incidencias')
      setIncidencias([])
      setTotal(0)
      setTotalPages(1)
    }
  }

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 300)
    return () => clearTimeout(t)
  }, [searchTerm])

  useEffect(() => {
    fetchIncidencias()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteFilter, estadoFilter, page, pageSize, debouncedSearch])

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(1)
  }, [clienteFilter, estadoFilter, debouncedSearch])

  const filtered = useMemo(() => incidencias, [incidencias])

  const openActionModal = (row: Incidencia, mode: 'cerrar' | 'postergar') => {
    setActionRow(row)
    setActionMode(mode)
    // Prefill date to now in local datetime-local format
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
    setActionFecha(local)
    setActionDatos('')
    setActionTiempo('')
    setActionOpen(true)
  }

  const submitAction = async () => {
    if (!actionRow) return
    try {
      const tiempo = actionTiempo ? parseInt(actionTiempo, 10) : null
      const body: any = {
        estado: actionMode === 'cerrar' ? 'cerrada' : 'postergada',
        datosSolucion: actionDatos || null,
        tiempoAplicadoSolucion: Number.isFinite(tiempo as any) ? tiempo : null
      }
      if (actionMode === 'cerrar') {
        body.fechaResolucion = actionFecha || null
      } else {
        body.fechaPostergado = actionFecha || null
      }

      const res = await fetch(`/api/admin/incidencias/${actionRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'No se pudo actualizar la incidencia')
      }
      setActionOpen(false)
      setActionRow(null)
      await fetchIncidencias()
    } catch (e: any) {
      alert(e?.message || 'Error actualizando incidencia')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMsg('')
    try {
      const res = await fetch('/api/admin/incidencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: form.clienteId || clienteFilter || clientes[0]?.id,
          estado: form.estado || 'abierta',
          descripcion: form.descripcion,
          prioridad: form.prioridad,
          contactoCreaIncidencia: form.contacto || null
        })
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Error al crear incidencia')
      setSubmitMsg('Incidencia creada')
      setForm(f => ({ ...f, descripcion: '' }))
      await fetchIncidencias()
    } catch (err: any) {
      console.error(err)
      setSubmitMsg(err?.message || 'Error al crear incidencia')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center px-8">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incidencias</h1>
            <p className="text-gray-600 mt-1">Gestión de incidencias por cliente</p>
          </div>
          <Link href="/admin" className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm">
            ← Volver al dashboard
          </Link>
        </div>
      </div>

      {/* Action Modal (Cerrar/Postergar) */}
      {actionOpen && actionRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setActionOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionMode === 'cerrar' ? 'Cerrar incidencia' : 'Postergar incidencia'} #{actionRow.id}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  {actionMode === 'cerrar' ? 'Fecha de cierre' : 'Fecha de postergación'}
                </label>
                <input
                  type="datetime-local"
                  value={actionFecha}
                  onChange={(e) => setActionFecha(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  {actionMode === 'cerrar' ? 'Solución (opcional)' : 'Nota (opcional)'}
                </label>
                <textarea
                  value={actionDatos}
                  onChange={(e) => setActionDatos(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
                  placeholder={actionMode === 'cerrar' ? 'Describe brevemente la solución aplicada' : 'Describe por qué se posterga'}
                />
              </div>

              {actionMode === 'cerrar' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tiempo aplicado (minutos, opcional)</label>
                  <input
                    type="number"
                    min={0}
                    value={actionTiempo}
                    onChange={(e) => setActionTiempo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setActionOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={submitAction}
                className={`px-4 py-2 rounded-lg ${actionMode === 'cerrar' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}
              >
                {actionMode === 'cerrar' ? 'Confirmar cierre' : 'Confirmar postergación'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
            {error}
          </div>
        )}
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar (cliente, estado, prioridad, descripción)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
            />
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
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="abierta">Abierta</option>
              <option value="en_progreso">En Progreso</option>
              <option value="postergada">Postergada</option>
              <option value="resuelta">Resuelta</option>
              <option value="cerrada">Cerrada</option>
            </select>
            <button
              onClick={() => { setClienteFilter(''); setEstadoFilter(''); setSearchTerm('') }}
              className="px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Crear Incidencia</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <select
              value={form.clienteId || clienteFilter}
              onChange={(e) => setForm(f => ({ ...f, clienteId: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
              required
            >
              <label />
              <option value="">Seleccionar cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombreEmpresa}</option>
              ))}
            </select>
            <select
              value={form.estado}
              onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
              required
            >
              <option value="abierta">Abierta</option>
              <option value="en_progreso">En Progreso</option>
              <option value="postergada">Postergada</option>
              <option value="resuelta">Resuelta</option>
              <option value="cerrada">Cerrada</option>
            </select>
            <select
              value={form.prioridad}
              onChange={(e) => setForm(f => ({ ...f, prioridad: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
            <input
              type="text"
              placeholder="Contacto (opcional)"
              value={form.contacto}
              onChange={(e) => setForm(f => ({ ...f, contacto: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
            />
            <textarea
              placeholder="Descripción de la incidencia"
              value={form.descripcion}
              onChange={(e) => setForm(f => ({ ...f, descripcion: e.target.value }))}
              className="md:col-span-3 w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
              required
            />
            <div className="md:col-span-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Creando...' : 'Crear incidencia'}
              </button>
              {submitMsg && <span className="text-sm text-gray-600">{submitMsg}</span>}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Top toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50 text-sm text-gray-700">
            <div>
              {total > 0 ? (
                <span>
                  Página {page} de {totalPages} · {total} registros
                </span>
              ) : (
                <span>Sin resultados</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Filas por página</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-buffalo-green focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(i => (
                  <tr key={i.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(i.fecha_crea_incidencia).toLocaleString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i.cliente_nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${i.estado === 'resuelta' || i.estado === 'cerrada' ? 'bg-green-100 text-green-800' : i.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' : i.estado === 'postergada' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {i.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i.prioridad || '-'}</td>
                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700 max-w-3xl">{i.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {(i.estado === 'cerrada' || i.estado === 'resuelta') ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          <>
                            <button
                              onClick={() => openActionModal(i, 'cerrar')}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700"
                              title="Cerrar incidencia"
                            >
                              Cerrar
                            </button>
                            <button
                              onClick={() => openActionModal(i, 'postergar')}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-yellow-600 text-white hover:bg-yellow-700"
                              title="Postergar incidencia"
                            >
                              Postergar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-700">
              {total > 0 && (
                <span>
                  Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} de {total}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">Página {page} de {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500">No hay incidencias para los filtros seleccionados.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function useManagerState<T>(initial: T) {
  const [v, setV] = useState<T>(initial)
  return [v, setV] as const
}


