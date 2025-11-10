'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  CheckCircle, 
  XCircle, 
  UserCheck,
  Settings,
  Building,
  X,
  MoreHorizontal
} from 'lucide-react'

interface Cliente {
  id: number
  nombreEmpresa: string
  usuario: string
  tipo: 'Directo' | 'Partnership'
  estado: 'Activo' | 'Inactivo'
  fechaCreacion: string
  logo?: string
  verticales?: string[]
  webhooks?: string[]
  partnership?: string // Para agrupar partnerships
  colorPrincipal?: string // Color principal de la empresa
  personalizacion?: {
    color?: string[]
    fuente?: string
    estilo?: string
    contacto?: string
  }
}

interface Partnership {
  id: number
  nombre: string
  slug: string
  created_at: string
  updated_at: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [stats, setStats] = useState({
    directos: 0,
    partnerships: 0,
    activos: 0,
    inactivos: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null)
  const [editForm, setEditForm] = useState({
    nombreEmpresa: '',
    coloresPrincipales: ['', '', ''],
    usuario: '',
    password: '',
    logo: ''
  })
  const [showPartnershipModal, setShowPartnershipModal] = useState(false)
  const [partnershipForm, setPartnershipForm] = useState({
    nombrePartnership: ''
  })
  const [showPartnershipMenu, setShowPartnershipMenu] = useState<string | null>(null)
  const [partnershipToDelete, setPartnershipToDelete] = useState<string | null>(null)
  const [partnershipDeleteConfirmation, setPartnershipDeleteConfirmation] = useState('')
  const [showPartnershipDeleteModal, setShowPartnershipDeleteModal] = useState(false)

  // Clientes are now loaded from database via API

  useEffect(() => {
    // Fetch partnerships, stats, and clientes from database
    const fetchPartnerships = async () => {
      try {
        const res = await fetch('/api/partnerships')
        const data = await res.json()
        if (data.success && data.partnerships) {
          setPartnerships(data.partnerships)
        }
      } catch (err) {
        console.error('Error fetching partnerships:', err)
      }
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/clientes/stats')
        const data = await res.json()
        if (data.success && data.stats) {
          setStats(data.stats)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    }

    const fetchClientes = async () => {
      try {
        const res = await fetch('/api/clientes')
        const data = await res.json()
        if (data.success && data.clientes) {
          setClientes(data.clientes)
        } else {
          setClientes([])
        }
      } catch (err) {
        console.error('Error fetching clientes:', err)
        setError('Error al cargar los clientes')
        setClientes([])
      }
    }

    // Load all data from database
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchPartnerships(), fetchStats(), fetchClientes()])
      setLoading(false)
    }
    
    loadData()
  }, [])

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPartnershipMenu) {
        setShowPartnershipMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPartnershipMenu])

  // Stats are now loaded from database via API in useEffect

  const clientesDirectos = clientes.filter(c => c.tipo === 'Directo')
  const clientesPartnership = clientes.filter(c => c.tipo === 'Partnership')
  
  // Agrupar partnerships por nombre (from database partnership field)
  const partnershipsAgrupados = clientesPartnership.reduce((acc, cliente) => {
    // Use partnership name from database relationship
    const partnership = cliente.partnership || 'Sin Partnership'
    if (!partnership || partnership === 'Sin Partnership') return acc
    
    if (!acc[partnership]) {
      acc[partnership] = []
    }
    acc[partnership].push(cliente)
    return acc
  }, {} as Record<string, Cliente[]>)

  // Partnerships con clientes (from database relationships)
  const partnershipsConClientes = Object.keys(partnershipsAgrupados).filter(key => 
    partnershipsAgrupados[key].length > 0
  )
  
  // Partnerships de la base de datos que no tienen clientes asignados aún
  const partnershipsVaciosDB = partnerships
    .filter(p => {
      // No está en los partnerships con clientes
      return !partnershipsConClientes.includes(p.nombre)
    })
    .map(p => p.nombre)

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente)
    setDeleteConfirmation('')
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (clienteToDelete && deleteConfirmation === clienteToDelete.nombreEmpresa) {
      setClientes(clientes.filter(c => c.id !== clienteToDelete.id))
      setShowDeleteModal(false)
      setClienteToDelete(null)
      setDeleteConfirmation('')
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setClienteToEdit(cliente)
    
    // Get colors from database personalizacion.color array, or use defaults
    const colorsFromDB = cliente.personalizacion?.color || []
    const defaultColors = ['#00C896', '#0066CC', '#FF6B6B']
    const coloresPrincipales = colorsFromDB.length >= 3 
      ? colorsFromDB.slice(0, 3) // Use first 3 colors from DB
      : colorsFromDB.length > 0
      ? [...colorsFromDB, ...defaultColors.slice(colorsFromDB.length)] // Fill remaining with defaults
      : defaultColors // Use all defaults if no colors in DB
    
    setEditForm({
      nombreEmpresa: cliente.nombreEmpresa,
      coloresPrincipales: coloresPrincipales,
      usuario: cliente.usuario,
      password: '', // No mostramos la contraseña actual
      logo: cliente.logo || ''
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async () => {
    if (!clienteToEdit) return

    try {
      setLoading(true)
      
      // Prepare personalizacion with color array
      const personalizacion = {
        ...clienteToEdit.personalizacion,
        color: editForm.coloresPrincipales
      }

      const response = await fetch(`/api/clientes/${clienteToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreEmpresa: editForm.nombreEmpresa,
          usuario: editForm.usuario,
          password: editForm.password,
          logo: editForm.logo,
          coloresPrincipales: editForm.coloresPrincipales
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setClientes(clientes.map(c => 
          c.id === clienteToEdit.id 
            ? { 
                ...c, 
                nombreEmpresa: editForm.nombreEmpresa,
                usuario: editForm.usuario,
                logo: editForm.logo,
                personalizacion: personalizacion,
                colorPrincipal: editForm.coloresPrincipales[0] || c.colorPrincipal
              }
            : c
        ))
        setShowEditModal(false)
        setClienteToEdit(null)
        setError('')
      } else {
        setError(data.message || 'Error al actualizar el cliente')
      }
    } catch (err) {
      console.error('Error updating cliente:', err)
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePartnership = () => {
    setPartnershipForm({
      nombrePartnership: ''
    })
    setShowPartnershipModal(true)
  }

  const handlePartnershipSubmit = async () => {
    if (!partnershipForm.nombrePartnership) {
      setError('Por favor ingresa el nombre del partnership')
      return
    }

    try {
      // Llamar API para crear partnership en base de datos
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: partnershipForm.nombrePartnership })
      })

      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'No se pudo crear el partnership')
      }

      // Refresh partnerships list and stats from database
      const [resPartnerships, resStats] = await Promise.all([
        fetch('/api/partnerships'),
        fetch('/api/clientes/stats')
      ])
      
      const dataPartnerships = await resPartnerships.json()
      if (dataPartnerships.success && dataPartnerships.partnerships) {
        setPartnerships(dataPartnerships.partnerships)
      }
      
      const dataStats = await resStats.json()
      if (dataStats.success && dataStats.stats) {
        setStats(dataStats.stats)
      }
      setShowPartnershipModal(false)
      setPartnershipForm({ nombrePartnership: '' })
      console.log(`✅ Partnership "${data.partnership.nombre}" creado`) 
    } catch (error) {
      console.error('Error:', error)
      setError('Error al crear el partnership')
    }
  }

  const handlePartnershipDelete = (partnershipName: string) => {
    setPartnershipToDelete(partnershipName)
    setPartnershipDeleteConfirmation('')
    setShowPartnershipDeleteModal(true)
    setShowPartnershipMenu(null)
  }

  const confirmPartnershipDelete = async () => {
    if (!partnershipToDelete) return
    
    if (partnershipDeleteConfirmation !== partnershipToDelete) {
      setError('El nombre del partnership no coincide')
      return
    }

    try {
      // Delete partnership from database
      const res = await fetch(`/api/partnerships?nombre=${encodeURIComponent(partnershipToDelete)}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'No se pudo eliminar el partnership')
      }

      // Refresh partnerships, stats, and clientes from database
      const [resPartnerships, resStats, resClientes] = await Promise.all([
        fetch('/api/partnerships'),
        fetch('/api/clientes/stats'),
        fetch('/api/clientes')
      ])
      
      const dataPartnerships = await resPartnerships.json()
      if (dataPartnerships.success && dataPartnerships.partnerships) {
        setPartnerships(dataPartnerships.partnerships)
      }
      
      const dataStats = await resStats.json()
      if (dataStats.success && dataStats.stats) {
        setStats(dataStats.stats)
      }
      
      const dataClientes = await resClientes.json()
      if (dataClientes.success && dataClientes.clientes) {
        setClientes(dataClientes.clientes)
      }
      setShowPartnershipDeleteModal(false)
      setPartnershipToDelete(null)
      setPartnershipDeleteConfirmation('')
      
      console.log(`✅ Partnership "${partnershipToDelete}" eliminado exitosamente`)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al eliminar el partnership')
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Directo': return <Users className="h-4 w-4" />
      case 'Partnership': return <UserCheck className="h-4 w-4" />
      default: return <Building className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buffalo-green mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando clientes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">Error al cargar los clientes. Por favor, inténtalo de nuevo.</p>
          <button className="bg-buffalo-green text-white px-6 py-2 rounded-lg hover:bg-buffalo-green/90 transition-colors">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center justify-between px-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <button className="bg-buffalo-green text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-buffalo-green/90 transition-colors flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      {/* Estadísticas - Solo 4 en una fila */}
      <div className="bg-gray-50 px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-buffalo-green">{stats.directos}</p>
                <p className="text-sm text-gray-600">Clientes Directos</p>
              </div>
              <Users className="h-8 w-8 text-buffalo-green" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-yellow-600">{stats.partnerships}</p>
                <p className="text-sm text-gray-600">Partnerships</p>
              </div>
              <UserCheck className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-buffalo-green">{stats.activos}</p>
                <p className="text-sm text-gray-600">Activos</p>
              </div>
              <CheckCircle className="h-8 w-8 text-buffalo-green" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-500">{stats.inactivos}</p>
                <p className="text-sm text-gray-600">Inactivos</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-8 py-6 space-y-8">
        {/* Caja de Clientes Directos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-buffalo-green" />
              Clientes Directos
              <span className="ml-2 bg-buffalo-green text-white text-sm px-2 py-1 rounded-full">
                {clientesDirectos.length}
              </span>
            </h2>
          </div>
          <div className="p-6">
            {clientesDirectos.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay clientes directos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {clientesDirectos.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer relative flex items-center"
                  >

                    {/* Logo de la Empresa - Iniciales */}
                    <div className="flex-shrink-0 mr-4">
                      <div 
                        className="h-12 w-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: cliente.colorPrincipal || '#00C896' }}
                      >
                        <span className="text-white font-bold text-lg">
                          {cliente.nombreEmpresa.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Información Principal */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base mb-1">{cliente.nombreEmpresa}</h3>
                          <p className="text-gray-600 text-sm mb-1">@{cliente.usuario}</p>
                          <p className="text-gray-500 text-xs">{cliente.fechaCreacion}</p>
                        </div>
                        
                        {/* Estado */}
                        <div className="flex-shrink-0 ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            cliente.estado === 'Activo' 
                              ? 'bg-buffalo-green text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {cliente.estado === 'Activo' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {cliente.estado}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex-shrink-0 ml-4 flex space-x-2">
                      <button className="text-blue-600 hover:text-buffalo-green transition-colors p-2 rounded hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(cliente)}
                        className="text-orange-600 hover:text-buffalo-green transition-colors p-2 rounded hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cliente)}
                        className="text-red-600 hover:text-red-700 transition-colors p-2 rounded hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Partnerships Vacíos desde Base de Datos */}
        {partnershipsVaciosDB.map((partnershipName) => {
          const partnershipDB = partnerships.find(p => p.nombre === partnershipName)
          return (
            <div key={partnershipName} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-yellow-600" />
                    Partnership: {partnershipName}
                    <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                      Vacío
                    </span>
                  </h2>
                  
                  {/* Menú de 3 puntos */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPartnershipMenu(showPartnershipMenu === partnershipName ? null : partnershipName)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showPartnershipMenu === partnershipName && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                        <button
                          onClick={() => handlePartnershipDelete(partnershipName)}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar Partnership</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Este partnership está vacío</p>
                  <p className="text-xs text-gray-400">Los clientes aparecerán aquí cuando se añadan</p>
                </div>
              </div>
            </div>
          )
        })}

        {/* Partnerships con Clientes */}
        {partnershipsConClientes.map((partnershipName) => {
          const clientes = partnershipsAgrupados[partnershipName]
          return (
            <div key={partnershipName} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-yellow-600" />
                    Partnership: {partnershipName}
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                      {clientes.length}
                    </span>
                  </h2>
                  
                  {/* Menú de 3 puntos */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPartnershipMenu(showPartnershipMenu === partnershipName ? null : partnershipName)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showPartnershipMenu === partnershipName && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                        <button
                          onClick={() => handlePartnershipDelete(partnershipName)}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar Partnership</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer relative flex items-center"
                  >

                    {/* Logo de la Empresa - Iniciales */}
                    <div className="flex-shrink-0 mr-4">
                      <div 
                        className="h-12 w-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: cliente.colorPrincipal || '#00C896' }}
                      >
                        <span className="text-white font-bold text-lg">
                          {cliente.nombreEmpresa.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Información Principal */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base mb-1">{cliente.nombreEmpresa}</h3>
                          <p className="text-gray-600 text-sm mb-1">@{cliente.usuario}</p>
                          <p className="text-gray-500 text-xs">{cliente.fechaCreacion}</p>
                        </div>
                        
                        {/* Estado */}
                        <div className="flex-shrink-0 ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            cliente.estado === 'Activo' 
                              ? 'bg-buffalo-green text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {cliente.estado === 'Activo' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {cliente.estado}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex-shrink-0 ml-4 flex space-x-2">
                      <button className="text-blue-600 hover:text-buffalo-green transition-colors p-2 rounded hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(cliente)}
                        className="text-orange-600 hover:text-buffalo-green transition-colors p-2 rounded hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cliente)}
                        className="text-red-600 hover:text-red-700 transition-colors p-2 rounded hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        {/* Botón para añadir nuevo Partnership */}
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-buffalo-green transition-colors">
          <div className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Añadir Nuevo Partnership</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Crea un nuevo partnership para agrupar clientes
                </p>
                <button 
                  onClick={handleCreatePartnership}
                  className="bg-buffalo-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-buffalo-green/90 transition-colors flex items-center mx-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Partnership
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-buffalo-green text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center">
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">
              Para confirmar la eliminación, escribe el nombre exacto del cliente:
            </p>
            <p className="text-sm font-medium text-gray-800 mb-2">
              <strong>{clienteToDelete?.nombreEmpresa}</strong>
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Escribe el nombre del cliente aquí..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteConfirmation !== clienteToDelete?.nombreEmpresa}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-buffalo-green to-buffalo-green/90 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Edit className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Editar Cliente</h3>
                    <p className="text-white/80 text-sm">Modifica la información del cliente</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setClienteToEdit(null)
                  }}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda */}
                <div className="space-y-6">
                  {/* Nombre del Cliente */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Nombre del Cliente
                    </label>
                    <input
                      type="text"
                      value={editForm.nombreEmpresa}
                      onChange={(e) => setEditForm({...editForm, nombreEmpresa: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Ingresa el nombre de la empresa"
                    />
                  </div>

                  {/* Usuario del Dashboard */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Usuario del Dashboard
                    </label>
                    <input
                      type="text"
                      value={editForm.usuario}
                      onChange={(e) => setEditForm({...editForm, usuario: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="usuario_dashboard"
                    />
                  </div>

                  {/* Contraseña de la App */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Contraseña de la App
                    </label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                      placeholder="Nueva contraseña (opcional)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                    <p className="text-xs text-gray-500">Deja vacío para mantener la contraseña actual</p>
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-6">
                  {/* Colores Principales */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Colores Principales
                    </label>
                    <div className="space-y-3">
                      {editForm.coloresPrincipales.map((color, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => {
                                const newColors = [...editForm.coloresPrincipales]
                                newColors[index] = e.target.value
                                setEditForm({...editForm, coloresPrincipales: newColors})
                              }}
                              className="w-12 h-12 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-buffalo-green transition-colors"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={color}
                              onChange={(e) => {
                                const newColors = [...editForm.coloresPrincipales]
                                newColors[index] = e.target.value
                                setEditForm({...editForm, coloresPrincipales: newColors})
                              }}
                              placeholder="#000000"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                            />
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-xs text-gray-500 font-medium">
                              Color {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logo de la App - Alineado con Contraseña */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Logo de la App
                    </label>
                    <input
                      type="url"
                      value={editForm.logo}
                      onChange={(e) => setEditForm({...editForm, logo: e.target.value})}
                      placeholder="https://ejemplo.com/logo.png"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                    {editForm.logo && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-3">Vista previa:</p>
                        <div className="flex items-center space-x-4">
                          <img 
                            src={editForm.logo} 
                            alt="Logo preview" 
                            className="h-16 w-16 object-contain border-2 border-gray-200 rounded-lg bg-white p-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">Logo actualizado</p>
                            <p className="text-xs">Se aplicará en la aplicación del cliente</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setClienteToEdit(null)
                  }}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-8 py-3 text-sm font-semibold text-white bg-buffalo-green rounded-xl hover:bg-buffalo-green/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Partnership */}
      {showPartnershipModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-buffalo-green to-buffalo-green/90 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Crear Nuevo Partnership</h3>
                    <p className="text-white/80 text-sm">Añade un nuevo partnership para agrupar clientes</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPartnershipModal(false)
                    setPartnershipForm({
                      nombrePartnership: ''
                    })
                  }}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
              <div className="max-w-md mx-auto">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Nombre del Partnership
                    </label>
                    <input
                      type="text"
                      value={partnershipForm.nombrePartnership}
                      onChange={(e) => setPartnershipForm({...partnershipForm, nombrePartnership: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Ej: María, Sergi, Carlos, etc."
                    />
                    <p className="text-sm text-gray-500">
                      Este será el nombre que aparecerá en "Partnership: [Nombre]"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowPartnershipModal(false)
                    setPartnershipForm({
                      nombrePartnership: ''
                    })
                  }}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePartnershipSubmit}
                  className="px-8 py-3 text-sm font-semibold text-white bg-buffalo-green rounded-xl hover:bg-buffalo-green/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Crear Partnership
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar Partnership */}
      {showPartnershipDeleteModal && partnershipToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Eliminar Partnership</h3>
                  <p className="text-white/80 text-sm">Esta acción no se puede deshacer</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="h-8 w-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Estás seguro de que quieres eliminar este partnership?
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Se eliminarán todos los clientes asociados a este partnership.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Escribe el nombre del partnership para confirmar:
                  </label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border-2 border-gray-200">
                    <span className="text-gray-900 font-medium">{partnershipToDelete}</span>
                  </div>
                  <input
                    type="text"
                    value={partnershipDeleteConfirmation}
                    onChange={(e) => setPartnershipDeleteConfirmation(e.target.value)}
                    placeholder={`Escribe "${partnershipToDelete}" para confirmar`}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 rounded-b-2xl">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowPartnershipDeleteModal(false)
                    setPartnershipToDelete(null)
                    setPartnershipDeleteConfirmation('')
                  }}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmPartnershipDelete}
                  disabled={partnershipDeleteConfirmation !== partnershipToDelete}
                  className="px-8 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Eliminar Partnership
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}