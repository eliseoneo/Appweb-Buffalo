'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Phone, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users,
  Heart,
  BarChart3,
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { getClientConfig } from '@/lib/cliente-utils'
import { ClienteConfig } from '@/types/cliente'
import ClientHeader from '@/components/ClientHeader'
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts'

// Tipos de KPIs basados en el campo 'kpis' de crear_kpis
interface KPIDefinition {
  titulo: string
  descripcion: string
  tipo_grafico: 'individual' | 'linea' | 'barras_vertical' | 'barras_horizontal' | 'donut'
  num_inputs: number
  inputs: string[]
  ejemplo: string
}

interface KPIData {
  titulo: string
  valor: number | string
  unidad?: string
  descripcion: string
  tipo: string
  data?: any[]
}

export default function DashboardKPIsPage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [kpis, setKpis] = useState<KPIData[]>([])
  const [kpiDefinitions, setKpiDefinitions] = useState<KPIDefinition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const clienteData = getClientConfig(clienteId)
    if (clienteData) {
      setCliente(clienteData)
    }
    
    // Cargar KPIs
    loadKPIs()
  }, [clienteId])

  const loadKPIs = async () => {
    // 🔥 FORCE MOCK DATA MODE FOR TESTING
    // Set this to true to always use mock data
    const FORCE_MOCK_DATA = true
    
    if (FORCE_MOCK_DATA) {
      console.log('🔥 FORCE MOCK DATA MODE ENABLED')
      setIsLoading(true)
      // Simulate loading delay
      setTimeout(() => {
        loadMockKPIs()
        setIsLoading(false)
      }, 500)
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)

      // Fetch KPI definitions from crear_kpis table
      const response = await fetch('/api/kpis/definitions')
      
      if (!response.ok) {
        throw new Error('Error al cargar las definiciones de KPIs')
      }

      const definitions: KPIDefinition[] = await response.json()
      setKpiDefinitions(definitions)

      // Fetch actual KPI data from llamadas_data table
      const dataResponse = await fetch(`/api/kpis/data?clienteId=${clienteId}`)
      
      if (!dataResponse.ok) {
        throw new Error('Error al cargar los datos de KPIs')
      }

      const kpiData: KPIData[] = await dataResponse.json()
      
      // Check if we got empty data
      if (!kpiData || kpiData.length === 0) {
        console.warn('⚠️ API returned empty data, using mock data instead')
        throw new Error('Sin datos en la base de datos')
      }
      
      setKpis(kpiData)
      setLastUpdated(new Date())

    } catch (err) {
      console.error('Error loading KPIs:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      
      // Load mock data for demonstration
      loadMockKPIs()
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockKPIs = () => {
    console.log('🔄 Loading mock KPIs data...')
    // Mock data basado en TODAS las 13 definiciones de KPIs del usuario
    const mockKPIs: KPIData[] = [
      // 1. Individual Metrics (3 KPIs)
      {
        titulo: 'Número total de llamadas',
        valor: '1,234',
        descripcion: 'Muestra el número total de llamadas registradas en el dataset. Es una métrica fundamental para entender el volumen de actividad.',
        tipo: 'individual'
      },
      {
        titulo: 'Duración media de las llamadas',
        valor: '4:30',
        unidad: 'minutos',
        descripcion: 'Calcula la duración promedio de las llamadas en segundos. Permite evaluar la eficiencia y la extensión de las interacciones.',
        tipo: 'individual'
      },
      {
        titulo: 'Costo total de las llamadas',
        valor: '€1,500.50',
        descripcion: 'Suma el costo total de todas las llamadas en euros. Proporciona una visión general del gasto asociado a las comunicaciones.',
        tipo: 'individual'
      },
      
      // 2. Line Charts (2 KPIs)
      {
        titulo: 'Evolución del número de llamadas por día',
        valor: 0,
        descripcion: 'Muestra cómo el volumen de llamadas ha cambiado a lo largo del tiempo, agrupado por día. Útil para identificar tendencias y picos de actividad.',
        tipo: 'linea',
        data: [
          { fecha: '01/01', llamadas: 120 },
          { fecha: '02/01', llamadas: 150 },
          { fecha: '03/01', llamadas: 135 },
          { fecha: '04/01', llamadas: 180 },
          { fecha: '05/01', llamadas: 165 },
          { fecha: '06/01', llamadas: 190 },
          { fecha: '07/01', llamadas: 210 }
        ]
      },
      {
        titulo: 'Evolución de la duración media de las llamadas por día',
        valor: 0,
        descripcion: 'Representa la duración promedio de las llamadas a lo largo del tiempo. Permite detectar si las interacciones se están volviendo más largas o más cortas.',
        tipo: 'linea',
        data: [
          { fecha: '01/01', llamadas: 240 },
          { fecha: '02/01', llamadas: 265 },
          { fecha: '03/01', llamadas: 255 },
          { fecha: '04/01', llamadas: 280 },
          { fecha: '05/01', llamadas: 270 },
          { fecha: '06/01', llamadas: 290 },
          { fecha: '07/01', llamadas: 275 }
        ]
      },
      
      // 3. Vertical Bar Charts (1 KPI)
      {
        titulo: 'Distribución de motivos de desconexión',
        valor: 0,
        descripcion: 'Muestra la frecuencia de cada motivo por el cual las llamadas se desconectan. Ayuda a identificar problemas comunes o áreas de mejora en el proceso de llamada.',
        tipo: 'barras_vertical',
        data: [
          { nombre: 'usuario cuelga', valor: 450 },
          { nombre: 'agente cuelga', valor: 120 },
          { nombre: 'no hay respuesta', valor: 280 },
          { nombre: 'ocupado', valor: 180 },
          { nombre: 'tiempo maximo', valor: 85 }
        ]
      },
      
      // 4. Donut Charts (4 KPIs)
      {
        titulo: 'Sentimiento del usuario en las llamadas',
        valor: 0,
        descripcion: 'Proporción de los diferentes sentimientos expresados por los usuarios durante las llamadas. Permite evaluar la satisfacción general del cliente.',
        tipo: 'donut',
        data: [
          { nombre: 'Positive', valor: 520 },
          { nombre: 'Negative', valor: 180 },
          { nombre: 'Neutral', valor: 420 },
          { nombre: 'Unknown', valor: 114 }
        ]
      },
      {
        titulo: 'Estado de interés en entrevista',
        valor: 0,
        descripcion: 'Muestra la distribución de los resultados de las llamadas en relación con la consecución de una entrevista. Permite evaluar la efectividad de las llamadas para generar leads calificados.',
        tipo: 'donut',
        data: [
          { nombre: 'Calificado > Quiere entrevista', valor: 320 },
          { nombre: 'no se ha proporcionado esta info', valor: 450 },
          { nombre: 'Sin interes', valor: 280 },
          { nombre: 'No se puede contactar', valor: 184 }
        ]
      },
      {
        titulo: 'Situación laboral de los usuarios contactados',
        valor: 0,
        descripcion: 'Proporción de usuarios que trabajan o no trabajan, según la información recopilada. Útil para segmentar la audiencia y entender el perfil de los contactos.',
        tipo: 'donut',
        data: [
          { nombre: 'Sí', valor: 680 },
          { nombre: 'No', valor: 320 },
          { nombre: 'no se ha proporcionado esta info', valor: 180 },
          { nombre: 'NULL', valor: 54 }
        ]
      },
      {
        titulo: 'Preferencia de turno de contacto',
        valor: 0,
        descripcion: 'Muestra la distribución de los turnos preferidos por los usuarios para ser contactados. Útil para optimizar la planificación de llamadas.',
        tipo: 'donut',
        data: [
          { nombre: 'Tarde', valor: 520 },
          { nombre: 'Mañana', valor: 380 },
          { nombre: 'Mediodía', valor: 220 },
          { nombre: 'NULL', valor: 114 }
        ]
      },
      
      // 5. Horizontal Bar Charts (3 KPIs)
      {
        titulo: 'Distribución de agentes por número de llamadas',
        valor: 0,
        descripcion: 'Compara el número de llamadas gestionadas por cada agente. Útil para evaluar la carga de trabajo y el rendimiento individual de los agentes.',
        tipo: 'barras_horizontal',
        data: [
          { nombre: 'DEMO V2 PLANETA', valor: 650 },
          { nombre: 'Si llaman a EAE', valor: 420 },
          { nombre: 'Llamar mas tarde al lead', valor: 164 }
        ]
      },
      {
        titulo: 'Antigüedad laboral de los usuarios contactados',
        valor: 0,
        descripcion: 'Distribución de la antigüedad laboral de los usuarios. Permite entender la experiencia profesional de la base de contactos.',
        tipo: 'barras_horizontal',
        data: [
          { nombre: '<1 año', valor: 180 },
          { nombre: '1 año – 3 años', valor: 320 },
          { nombre: '3 años – 10 años', valor: 450 },
          { nombre: '>10 años', valor: 220 },
          { nombre: 'no se ha proporcionado esta info', valor: 64 }
        ]
      },
      {
        titulo: 'Nivel de estudios de los usuarios contactados',
        valor: 0,
        descripcion: 'Distribución del nivel de estudios de los usuarios. Ayuda a perfilar demográficamente a los contactos.',
        tipo: 'barras_horizontal',
        data: [
          { nombre: 'Estudios superiores', valor: 520 },
          { nombre: 'Bachillerato', valor: 380 },
          { nombre: 'Estudios secundarios', valor: 220 },
          { nombre: 'Sin estudios oficiales', valor: 80 },
          { nombre: 'no se ha proporcionado esta info', valor: 34 }
        ]
      }
    ]

    console.log('✅ Mock KPIs loaded:', mockKPIs.length, 'KPIs')
    console.log('📊 KPI types:', mockKPIs.map(k => ({ titulo: k.titulo, tipo: k.tipo })))
    
    // Debug: Show data for each KPI
    mockKPIs.forEach(kpi => {
      if (kpi.data) {
        console.log(`  ➡️ ${kpi.titulo}: ${kpi.data.length} data items`, kpi.data)
      }
    })
    
    setKpis(mockKPIs)
  }

  const refreshData = async () => {
    await loadKPIs()
  }

  // Render individual KPI card
  const renderIndividualKPI = (kpi: KPIData, index: number) => {
    const icons = [Phone, Clock, DollarSign, Users, TrendingUp, Heart]
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500']
    const Icon = icons[index % icons.length]
    const color = colors[index % colors.length]

    return (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{kpi.titulo}</p>
            <p className="text-3xl font-bold text-gray-900">{kpi.valor}</p>
            {kpi.unidad && (
              <p className="text-sm text-gray-500 mt-1">{kpi.unidad}</p>
            )}
          </div>
          <div className={`h-14 w-14 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 line-clamp-2">{kpi.descripcion}</p>
      </div>
    )
  }

  // Render line chart
  const renderLineChart = (kpi: KPIData) => {
    console.log('📈 Rendering line chart:', kpi.titulo, 'data:', kpi.data?.length || 0)
    if (kpi.data && kpi.data.length > 0) {
      console.log('  Sample data:', kpi.data[0])
    }
    
    try {
      if (!kpi.data || kpi.data.length === 0) {
        console.warn('⚠️ Line chart has no data:', kpi.titulo)
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">{kpi.descripcion}</p>
              </div>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Sin datos disponibles</p>
            </div>
          </div>
        )
      }

      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">{kpi.descripcion}</p>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={kpi.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="fecha" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="llamadas" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    } catch (error) {
      console.error('❌ Error rendering line chart:', kpi.titulo, error)
      return (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-red-500 mt-1">Error al cargar gráfico</p>
            </div>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
            <p className="text-red-500 text-sm">Error al renderizar gráfico de líneas</p>
          </div>
        </div>
      )
    }
  }

  // Render vertical bar chart
  const renderVerticalBarChart = (kpi: KPIData) => {
    console.log('📊 Rendering vertical bar chart:', kpi.titulo, 'data:', kpi.data?.length || 0)
    
    try {
      if (!kpi.data || kpi.data.length === 0) {
        console.warn('⚠️ Vertical bar chart has no data:', kpi.titulo)
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">{kpi.descripcion}</p>
              </div>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Sin datos disponibles</p>
            </div>
          </div>
        )
      }

      const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">{kpi.descripcion}</p>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kpi.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="nombre" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                {kpi.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    } catch (error) {
      console.error('❌ Error rendering vertical bar chart:', kpi.titulo, error)
      return (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-red-500 mt-1">Error al cargar gráfico</p>
            </div>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
            <p className="text-red-500 text-sm">Error al renderizar gráfico de barras verticales</p>
          </div>
        </div>
      )
    }
  }

  // Render horizontal bar chart
  const renderHorizontalBarChart = (kpi: KPIData) => {
    console.log('📊 Rendering horizontal bar chart:', kpi.titulo, 'data:', kpi.data?.length || 0)
    
    try {
      if (!kpi.data || kpi.data.length === 0) {
        console.warn('⚠️ Horizontal bar chart has no data:', kpi.titulo)
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">{kpi.descripcion}</p>
              </div>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Sin datos disponibles</p>
            </div>
          </div>
        )
      }

      const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">{kpi.descripcion}</p>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kpi.data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                type="category"
                dataKey="nombre" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                width={150}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Bar dataKey="valor" radius={[0, 8, 8, 0]}>
                {kpi.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    } catch (error) {
      console.error('❌ Error rendering horizontal bar chart:', kpi.titulo, error)
      return (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-red-500 mt-1">Error al cargar gráfico</p>
            </div>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
            <p className="text-red-500 text-sm">Error al renderizar gráfico de barras horizontales</p>
          </div>
        </div>
      )
    }
  }

  // Render donut/pie chart
  const renderDonutChart = (kpi: KPIData) => {
    console.log('🍩 Rendering donut chart:', kpi.titulo, 'data:', kpi.data?.length || 0)
    
    try {
      if (!kpi.data || kpi.data.length === 0) {
        console.warn('⚠️ Donut chart has no data:', kpi.titulo)
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">{kpi.descripcion}</p>
              </div>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Sin datos disponibles</p>
            </div>
          </div>
        )
      }

      const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#9ca3af']

      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">{kpi.descripcion}</p>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={kpi.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="valor"
                label={({ nombre }: any) => nombre}
              >
                {kpi.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )
    } catch (error) {
      console.error('❌ Error rendering donut chart:', kpi.titulo, error)
      return (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-red-500 mt-1">Error al cargar gráfico</p>
            </div>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
            <p className="text-red-500 text-sm">Error al renderizar gráfico de donut</p>
          </div>
        </div>
      )
    }
  }

  // Render KPI based on type
  const renderKPI = (kpi: KPIData, index: number) => {
    console.log(`🎨 renderKPI called for: "${kpi.titulo}" (type: ${kpi.tipo})`)
    
    try {
      switch (kpi.tipo) {
        case 'individual':
          return renderIndividualKPI(kpi, index)
        case 'linea':
          return renderLineChart(kpi)
        case 'barras_vertical':
          return renderVerticalBarChart(kpi)
        case 'barras_horizontal':
          return renderHorizontalBarChart(kpi)
        case 'donut':
          return renderDonutChart(kpi)
        default:
          console.error(`❌ Unknown KPI type: "${kpi.tipo}" for KPI: "${kpi.titulo}"`)
          return (
            <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
                  <p className="text-sm text-yellow-600 mt-1">Tipo de gráfico desconocido: {kpi.tipo}</p>
                </div>
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="h-64 bg-yellow-50 rounded-lg flex items-center justify-center">
                <p className="text-yellow-600 text-sm">Tipo de gráfico no soportado</p>
              </div>
            </div>
          )
      }
    } catch (error) {
      console.error(`❌ Critical error rendering KPI: "${kpi.titulo}"`, error)
      return (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{kpi.titulo}</h3>
              <p className="text-sm text-red-500 mt-1">Error crítico al renderizar</p>
            </div>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
            <p className="text-red-500 text-sm">Error al procesar KPI</p>
          </div>
        </div>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buffalo-green mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando KPIs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title="Dashboard de KPIs"
        subtitle="Indicadores clave de rendimiento basados en datos de llamadas"
      />
      
      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Métricas de Llamadas</h2>
            <p className="text-sm text-gray-500 mt-1">
              Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-buffalo-green text-white rounded-lg hover:bg-buffalo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Mostrando datos de ejemplo</p>
              <p className="text-xs text-yellow-700 mt-1">
                {error} - Los datos reales se cargarán cuando la API esté disponible.
              </p>
            </div>
          </div>
        )}

        {/* Individual KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {(() => {
            const individualKPIs = kpis.filter(kpi => kpi.tipo === 'individual')
            console.log('📊 Individual KPIs to render:', individualKPIs.length)
            return individualKPIs.map((kpi, index) => (
              <div key={`individual-${kpi.titulo}-${index}`}>
                {renderIndividualKPI(kpi, index)}
              </div>
            ))
          })()}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(() => {
            const chartKPIs = kpis.filter(kpi => kpi.tipo !== 'individual')
            console.log('📈 Chart KPIs to render:', chartKPIs.length, chartKPIs.map(k => k.tipo))
            return chartKPIs.map((kpi, index) => (
              <div key={`chart-${kpi.titulo}-${index}`}>
                {renderKPI(kpi, index)}
              </div>
            ))
          })()}
        </div>

        {/* Empty State */}
        {kpis.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay KPIs disponibles</h3>
            <p className="text-gray-500">Los KPIs se cargarán automáticamente cuando haya datos disponibles.</p>
          </div>
        )}
      </div>
    </div>
  )
}

