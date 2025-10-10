'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Brain,
  Phone, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users,
  Heart,
  Target,
  AlertCircle,
  RefreshCw,
  Sparkles,
  TrendingDown,
  Activity,
  Zap
} from 'lucide-react'
import { generateMLScenario, type MLScenario } from '@/app/api/kpis/ia-insights/ml-scenarios'
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
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Insight {
  id: string
  titulo: string
  valor: string | number
  descripcion: string
  tipo: 'metric' | 'trend' | 'alert' | 'recommendation'
  relevancia: number
  categoria: string
  icono: string
  color: string
}

interface ChartInsight {
  id: string
  titulo: string
  descripcion: string
  tipo: 'line' | 'bar' | 'donut' | 'area'
  data: any[]
  relevancia: number
  insight: string
}

interface IAResponse {
  insights: Insight[]
  charts: ChartInsight[]
  totalLlamadas: number
  timestamp: string
  message?: string
}

export default function DashboardIAPage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [iaData, setIaData] = useState<IAResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [currentScenario, setCurrentScenario] = useState<MLScenario>('balanced')

  useEffect(() => {
    const clienteData = getClientConfig(clienteId)
    if (clienteData) {
      setCliente(clienteData)
    }
    
    loadIAInsights()
  }, [clienteId])

  const loadIAInsights = async () => {
    // 🔥 FORCE MOCK DATA MODE FOR TESTING
    // Set this to true to always use mock data
    const FORCE_MOCK_DATA = true
    
    if (FORCE_MOCK_DATA) {
      console.log('🔥 DASHBOARD IA - MOCK DATA MODE ENABLED')
      setIsLoading(true)
      // Simulate loading delay
      setTimeout(() => {
        loadMockIAData()
        setIsLoading(false)
      }, 800)
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/kpis/ia-insights?clienteId=${clienteId}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar insights de IA')
      }

      const data: IAResponse = await response.json()
      
      // Check if we got empty data
      if (!data || (!data.insights?.length && !data.charts?.length)) {
        console.warn('⚠️ API returned no insights, using mock data')
        throw new Error('Sin datos suficientes para generar insights')
      }
      
      setIaData(data)
      setLastUpdated(new Date())

    } catch (err) {
      console.error('Error loading IA insights:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      
      // Load mock data for demonstration
      loadMockIAData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockIAData = (scenario: MLScenario = currentScenario) => {
    console.log(`🔄 Loading mock IA data with ML scenario: ${scenario}`)
    
    const scenarioData = generateMLScenario(scenario)
    
    const totalInsight = scenarioData.insights.find(i => i.id.includes('total'))
    const totalValue = totalInsight?.valor
    const totalLlamadas = typeof totalValue === 'number' ? totalValue : 
                         typeof totalValue === 'string' ? parseInt(totalValue.replace(/,/g, '')) || 1234 :
                         1234
    
    const mockData: IAResponse = {
      insights: scenarioData.insights,
      charts: scenarioData.charts,
      totalLlamadas,
      timestamp: new Date().toISOString()
    }
    
    // OLD HARDCODED DATA - REPLACED BY SCENARIOS
    /*
    const mockData: IAResponse = {
      insights: [
        // Insight 1: Total Calls (100% relevance)
        {
          id: 'total-calls',
          titulo: 'Total de Llamadas',
          valor: '1,234',
          descripcion: 'Volumen total de llamadas procesadas en el período',
          tipo: 'metric',
          relevancia: 100,
          categoria: 'Volumen',
          icono: 'Phone',
          color: 'blue'
        },
        
        // Insight 2: Customer Satisfaction - ALERT (98% relevance)
        {
          id: 'satisfaction-alert',
          titulo: 'Satisfacción del Cliente',
          valor: '42.1%',
          descripcion: '⚠️ Alto nivel de sentimiento negativo detectado (35% negativo)',
          tipo: 'alert',
          relevancia: 98,
          categoria: 'Calidad',
          icono: 'Heart',
          color: 'red'
        },
        
        // Insight 3: Conversion Rate - EXCELLENT (95% relevance)
        {
          id: 'conversion-rate',
          titulo: 'Tasa de Conversión',
          valor: '28.3%',
          descripcion: '🎯 Excelente tasa de conversión a entrevistas',
          tipo: 'metric',
          relevancia: 95,
          categoria: 'Conversión',
          icono: 'Target',
          color: 'green'
        },
        
        // Insight 4: Average Duration (85% relevance)
        {
          id: 'avg-duration',
          titulo: 'Duración Promedio',
          valor: '4:32',
          descripcion: 'Duración óptima de llamada - buena interacción con clientes',
          tipo: 'metric',
          relevancia: 85,
          categoria: 'Eficiencia',
          icono: 'Clock',
          color: 'blue'
        },
        
        // Insight 5: Total Cost (85% relevance)
        {
          id: 'total-cost',
          titulo: 'Costo Total',
          valor: '€1,245.80',
          descripcion: 'Costo promedio por llamada: €1.01',
          tipo: 'metric',
          relevancia: 85,
          categoria: 'Costos',
          icono: 'DollarSign',
          color: 'green'
        },
        
        // Insight 6: Growth Trend (90% relevance)
        {
          id: 'growth-trend',
          titulo: 'Tendencia de Crecimiento',
          valor: '+12.5%',
          descripcion: '📈 Crecimiento sostenido en el volumen de llamadas',
          tipo: 'trend',
          relevancia: 90,
          categoria: 'Tendencias',
          icono: 'TrendingUp',
          color: 'green'
        },
        
        // Insight 7: Best Contact Time - RECOMMENDATION (75% relevance)
        {
          id: 'best-time',
          titulo: 'Mejor Horario para Contactar',
          valor: 'Tarde',
          descripcion: '💡 El 42% de contactos exitosos ocurren en la tarde',
          tipo: 'recommendation',
          relevancia: 75,
          categoria: 'Optimización',
          icono: 'Clock',
          color: 'purple'
        },
        
        // Insight 8: Agent Performance (80% relevance)
        {
          id: 'top-agent',
          titulo: 'Agente Más Efectivo',
          valor: 'DEMO V2 PLANETA',
          descripcion: '650 llamadas gestionadas - 52% del total',
          tipo: 'metric',
          relevancia: 80,
          categoria: 'Rendimiento',
          icono: 'Users',
          color: 'blue'
        }
      ],
      
      charts: [
        // Chart 1: Call Trend (85% relevance)
        {
          id: 'call-trend',
          titulo: 'Tendencia de Llamadas (30 días)',
          descripcion: 'Evolución del volumen en el último mes',
          tipo: 'area',
          data: [
            { fecha: '10/09', llamadas: 35 },
            { fecha: '11/09', llamadas: 42 },
            { fecha: '12/09', llamadas: 38 },
            { fecha: '13/09', llamadas: 45 },
            { fecha: '14/09', llamadas: 52 },
            { fecha: '15/09', llamadas: 48 },
            { fecha: '16/09', llamadas: 55 },
            { fecha: '17/09', llamadas: 51 },
            { fecha: '18/09', llamadas: 58 },
            { fecha: '19/09', llamadas: 62 },
            { fecha: '20/09', llamadas: 59 },
            { fecha: '21/09', llamadas: 65 },
            { fecha: '22/09', llamadas: 68 },
            { fecha: '23/09', llamadas: 64 },
            { fecha: '24/09', llamadas: 71 },
            { fecha: '25/09', llamadas: 75 },
            { fecha: '26/09', llamadas: 72 },
            { fecha: '27/09', llamadas: 78 },
            { fecha: '28/09', llamadas: 82 },
            { fecha: '29/09', llamadas: 79 },
            { fecha: '30/09', llamadas: 85 }
          ],
          relevancia: 85,
          insight: '📈 Crecimiento del 12.5% - Tendencia positiva sostenida'
        },
        
        // Chart 2: Sentiment Distribution (90% relevance)
        {
          id: 'sentiment-chart',
          titulo: 'Distribución de Sentimiento',
          descripcion: 'Análisis de satisfacción del cliente',
          tipo: 'donut',
          data: [
            { nombre: 'Positive', valor: 520 },
            { nombre: 'Negative', valor: 432 },
            { nombre: 'Neutral', valor: 220 },
            { nombre: 'Unknown', valor: 62 }
          ],
          relevancia: 90,
          insight: '⚠️ 35% de sentimiento negativo - Revisar calidad de servicio'
        },
        
        // Chart 3: Top Disconnect Reasons (80% relevance)
        {
          id: 'disconnect-reasons',
          titulo: 'Principales Motivos de Desconexión',
          descripcion: 'Análisis de por qué terminan las llamadas',
          tipo: 'bar',
          data: [
            { nombre: 'usuario cuelga', valor: 450 },
            { nombre: 'no hay respuesta', valor: 280 },
            { nombre: 'ocupado', valor: 180 },
            { nombre: 'agente cuelga', valor: 120 },
            { nombre: 'tiempo maximo', valor: 85 }
          ],
          relevancia: 80,
          insight: 'El 36% de llamadas termina porque el usuario cuelga - indicador normal'
        },
        
        // Chart 4: Conversion Funnel (95% relevance)
        {
          id: 'conversion-funnel',
          titulo: 'Estado de Conversión a Entrevista',
          descripcion: 'Efectividad de llamadas para generar leads calificados',
          tipo: 'donut',
          data: [
            { nombre: 'Calificado > Quiere entrevista', valor: 350 },
            { nombre: 'no se ha proporcionado esta info', valor: 450 },
            { nombre: 'Sin interes', valor: 280 },
            { nombre: 'No se puede contactar', valor: 154 }
          ],
          relevancia: 95,
          insight: '🎯 28.3% de conversión - Por encima del promedio de la industria (20%)'
        },
        
        // Chart 5: Agent Performance (75% relevance)
        {
          id: 'agent-performance',
          titulo: 'Rendimiento por Agente',
          descripcion: 'Distribución de llamadas gestionadas',
          tipo: 'bar',
          data: [
            { nombre: 'DEMO V2 PLANETA', valor: 650 },
            { nombre: 'Si llaman a EAE', valor: 420 },
            { nombre: 'Llamar mas tarde al lead', valor: 164 }
          ],
          relevancia: 75,
          insight: 'DEMO V2 PLANETA gestiona 52% de las llamadas - considerar balanceo de carga'
        },
        
        // Chart 6: Contact Time Preference (70% relevance)
        {
          id: 'contact-time',
          titulo: 'Preferencia de Horario de Contacto',
          descripcion: 'Optimización de planificación de llamadas',
          tipo: 'donut',
          data: [
            { nombre: 'Tarde', valor: 520 },
            { nombre: 'Mañana', valor: 380 },
            { nombre: 'Mediodía', valor: 220 },
            { nombre: 'No especificado', valor: 114 }
          ],
          relevancia: 70,
          insight: '💡 42% prefiere contacto en la tarde - programar más llamadas en ese horario'
        }
      ],
      
      totalLlamadas: 1234,
      timestamp: new Date().toISOString()
    }
    */
    
    console.log('✅ Mock IA data loaded with ML scenario:', scenario)
    console.log(`  📊 Insights: ${mockData.insights.length}`)
    console.log(`  📈 Charts: ${mockData.charts.length}`)
    console.log(`  🎯 Relevance scores:`, mockData.insights.map(i => ({ titulo: i.titulo, relevancia: i.relevancia })))
    console.log(`  🤖 ML Confidence:`, scenarioData.mlMetadata?.confidence)
    
    setIaData(mockData)
    setCurrentScenario(scenario)
    setLastUpdated(new Date())
  }

  const changeScenario = (newScenario: MLScenario) => {
    console.log(`🔄 Switching to ML scenario: ${newScenario}`)
    setIsLoading(true)
    setTimeout(() => {
      loadMockIAData(newScenario)
      setIsLoading(false)
    }, 600)
  }

  const refreshData = async () => {
    await loadIAInsights()
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Phone, TrendingUp, DollarSign, Clock, Users, Heart, Target, Activity
    }
    return icons[iconName] || Activity
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
      red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
    }
    return colors[color] || colors.blue
  }

  const renderChart = (chart: ChartInsight) => {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

    if (chart.tipo === 'area') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chart.data}>
            <defs>
              <linearGradient id="colorLlamadas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="fecha" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="llamadas" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLlamadas)" />
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (chart.tipo === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="nombre" stroke="#9ca3af" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
              {chart.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chart.tipo === 'donut') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chart.data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="valor"
            >
              {chart.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Brain className="h-12 w-12 text-buffalo-green animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Analizando datos con IA...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title="Dashboard IA"
        subtitle="Insights inteligentes generados automáticamente"
      />
      
      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">IA Activada</span>
            </div>
            <div className="text-sm text-gray-500">
              Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
            </div>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-buffalo-green text-white rounded-lg hover:bg-buffalo-green/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Error or Info Message */}
        {(error || iaData?.message) && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                {error || iaData?.message}
              </p>
              {error && (
                <p className="text-xs text-blue-700 mt-1">
                  Asegúrate de que la tabla llamadas_data existe y tiene datos.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Insights Grid */}
        {iaData && iaData.insights.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-600" />
              Insights Más Relevantes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {iaData.insights.map((insight) => {
                const Icon = getIconComponent(insight.icono)
                const colors = getColorClasses(insight.color)
                
                return (
                  <div 
                    key={insight.id} 
                    className={`bg-white rounded-xl shadow-sm border ${colors.border} p-6 hover:shadow-md transition-all relative overflow-hidden`}
                  >
                    {/* Relevance indicator */}
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Sparkles className="h-3 w-3" />
                        <span>{insight.relevancia}%</span>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="text-xs text-gray-500 mb-2">{insight.categoria}</div>

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-700">{insight.titulo}</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{insight.valor}</p>
                      </div>
                      <div className={`h-12 w-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <p className={`text-sm ${colors.text} mt-2`}>
                      {insight.descripcion}
                    </p>

                    {/* Type badge */}
                    {insight.tipo === 'alert' && (
                      <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        <AlertCircle className="h-3 w-3" />
                        Alerta
                      </div>
                    )}
                    {insight.tipo === 'recommendation' && (
                      <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        <Sparkles className="h-3 w-3" />
                        Recomendación
                      </div>
                    )}
                    {insight.tipo === 'trend' && (
                      <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        <TrendingUp className="h-3 w-3" />
                        Tendencia
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Charts Grid */}
        {iaData && iaData.charts.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-6 w-6 mr-2 text-blue-600" />
              Gráficos de Alto Impacto
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {iaData.charts.map((chart) => (
                <div key={chart.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{chart.titulo}</h3>
                      <p className="text-sm text-gray-500 mt-1">{chart.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 ml-4">
                      <Sparkles className="h-3 w-3" />
                      <span>{chart.relevancia}%</span>
                    </div>
                  </div>
                  
                  {renderChart(chart)}
                  
                  {/* AI Insight */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-2">
                      <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-purple-900">
                        <span className="font-semibold">IA:</span> {chart.insight}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {(!iaData || (iaData.insights.length === 0 && iaData.charts.length === 0)) && !error && (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos para analizar</h3>
            <p className="text-gray-500">
              La IA necesita datos en la tabla llamadas_data para generar insights.
            </p>
          </div>
        )}

        {/* ML Scenario Switcher (Only in Mock Mode) */}
        {iaData && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Simulador de Modelo ML</h3>
                    <p className="text-sm text-gray-600">Prueba diferentes escenarios de respuesta del modelo</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Escenario actual: <span className="font-semibold text-purple-700">{currentScenario}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => changeScenario('excellent')}
                  disabled={currentScenario === 'excellent' || isLoading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    currentScenario === 'excellent'
                      ? 'bg-green-500 border-green-500 text-white shadow-lg'
                      : 'bg-white border-green-200 text-green-700 hover:border-green-400 hover:shadow'
                  } disabled:opacity-50`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Sparkles className="h-5 w-5" />
                    <span>Excelente</span>
                    <span className="text-xs opacity-75">Todo bien</span>
                  </div>
                </button>

                <button
                  onClick={() => changeScenario('balanced')}
                  disabled={currentScenario === 'balanced' || isLoading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    currentScenario === 'balanced'
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                      : 'bg-white border-blue-200 text-blue-700 hover:border-blue-400 hover:shadow'
                  } disabled:opacity-50`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Activity className="h-5 w-5" />
                    <span>Balanceado</span>
                    <span className="text-xs opacity-75">Normal</span>
                  </div>
                </button>

                <button
                  onClick={() => changeScenario('warning')}
                  disabled={currentScenario === 'warning' || isLoading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    currentScenario === 'warning'
                      ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg'
                      : 'bg-white border-yellow-200 text-yellow-700 hover:border-yellow-400 hover:shadow'
                  } disabled:opacity-50`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <AlertCircle className="h-5 w-5" />
                    <span>Advertencia</span>
                    <span className="text-xs opacity-75">Atención</span>
                  </div>
                </button>

                <button
                  onClick={() => changeScenario('critical')}
                  disabled={currentScenario === 'critical' || isLoading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    currentScenario === 'critical'
                      ? 'bg-red-500 border-red-500 text-white shadow-lg'
                      : 'bg-white border-red-200 text-red-700 hover:border-red-400 hover:shadow'
                  } disabled:opacity-50`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <AlertCircle className="h-5 w-5" />
                    <span>Crítico</span>
                    <span className="text-xs opacity-75">Urgente</span>
                  </div>
                </button>

                <button
                  onClick={() => changeScenario('growth')}
                  disabled={currentScenario === 'growth' || isLoading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    currentScenario === 'growth'
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                      : 'bg-white border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:shadow'
                  } disabled:opacity-50`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <TrendingUp className="h-5 w-5" />
                    <span>Crecimiento</span>
                    <span className="text-xs opacity-75">+45%</span>
                  </div>
                </button>

                <button
                  onClick={() => changeScenario('decline')}
                  disabled={currentScenario === 'decline' || isLoading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    currentScenario === 'decline'
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                      : 'bg-white border-orange-200 text-orange-700 hover:border-orange-400 hover:shadow'
                  } disabled:opacity-50`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <TrendingDown className="h-5 w-5" />
                    <span>Declive</span>
                    <span className="text-xs opacity-75">-28%</span>
                  </div>
                </button>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">🤖 Modo Simulación:</span> Haz clic en un escenario para ver cómo el ML reordena y prioriza insights automáticamente. Los escenarios simulan diferentes respuestas del modelo de machine learning.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

