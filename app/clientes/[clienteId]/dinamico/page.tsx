'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { BarChart3, TrendingUp, Activity, Settings, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react'
import { getClientConfig } from '@/lib/cliente-utils'
import { ClienteConfig } from '@/types/cliente'
import ClientHeader from '@/components/ClientHeader'
import FilterDropdowns from '@/components/FilterDropdowns'
import { useTranslation } from '@/lib/translations'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts'

// Importar datos dinámicos y configuraciones
import { loadDinamicoConfig, loadDinamicoConfigFromAPI, getAvailableConfigs, DinamicoConfigType } from './dinamico-config-loader'

interface DinamicoMetric {
  id: string
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  color: string
  category: string
}

interface DinamicoChart {
  id: string
  title: string
  type: 'line' | 'bar' | 'pie' | 'area'
  data: any[]
  config: any
}

interface DinamicoSection {
  id: string
  title: string
  description: string
  metrics: DinamicoMetric[]
  charts: DinamicoChart[]
  lastUpdated: string
  layout?: {
    metricsPerRow?: number
    chartLayout?: 'side-by-side' | 'stacked' | 'grid'
    showDescription?: boolean
    showLastUpdated?: boolean
    backgroundColor?: string
    borderColor?: string
    accentColor?: string
  }
}

interface DinamicoChart {
  id: string
  title: string
  type: 'line' | 'bar' | 'pie' | 'area'
  data: any[]
  config: any
  layout?: {
    width?: string
    height?: number
    responsive?: boolean
  }
}

interface PageConfig {
  title: string
  subtitle: string
  layout: 'grid' | 'list' | 'card'
  theme: 'modern' | 'classic' | 'minimal'
  refreshInterval: number
  maxSections: number
  showFilters: boolean
  showRefreshButton: boolean
  showAddButton: boolean
  gridColumns: {
    mobile: number
    tablet: number
    desktop: number
  }
  chartGridColumns: {
    mobile: number
    tablet: number
    desktop: number
  }
  defaultColors: string[]
  chartTypes: string[]
}

interface DinamicoData {
  pageConfig: PageConfig
  sections: DinamicoSection[]
}

export default function DinamicoPage() {
  const params = useParams()
  const clienteId = params.clienteId as string
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  const [sections, setSections] = useState<DinamicoSection[]>([])
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null)
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentConfigType, setCurrentConfigType] = useState<DinamicoConfigType>('default')
  const [availableConfigs] = useState(getAvailableConfigs())
  
  // Estados para filtros
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('Hoy')
  
  // Hook de traducción
  const { t } = useTranslation(selectedLanguage)

  useEffect(() => {
    const clienteData = getClientConfig(clienteId)
    if (clienteData) {
      setCliente(clienteData)
    }
    
    // Cargar datos dinámicos
    loadDinamicoData()
  }, [clienteId])

  const loadDinamicoData = async (configType: DinamicoConfigType = currentConfigType) => {
    try {
      setIsLoading(true)
      console.log('🔄 Loading dinamico data for client:', clienteId)
      
      // Try to load from database API first
      const apiData = await loadDinamicoConfigFromAPI(clienteId)
      
      if (apiData) {
        console.log('✅ Loaded data from database API:', apiData)
        setSections(apiData.sections)
        setPageConfig(apiData.pageConfig)
        setCurrentConfigType('database') // Mark as loaded from database
        if (apiData.sections.length > 0) {
          setSelectedSection(apiData.sections[0].id)
        }
      } else {
        console.log('⚠️ Database API failed, falling back to static config')
        // Fallback to static configuration
        const data = loadDinamicoConfig(configType)
        setSections(data.sections)
        setPageConfig(data.pageConfig)
        setCurrentConfigType(configType)
        if (data.sections.length > 0) {
          setSelectedSection(data.sections[0].id)
        }
      }
    } catch (error) {
      console.error('❌ Error loading dinamico data:', error)
      // Fallback to static configuration on error
      const data = loadDinamicoConfig(configType)
      setSections(data.sections)
      setPageConfig(data.pageConfig)
      setCurrentConfigType(configType)
      if (data.sections.length > 0) {
        setSelectedSection(data.sections[0].id)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigChange = (configType: DinamicoConfigType) => {
    loadDinamicoData(configType)
  }

  const refreshData = () => {
    loadDinamicoData()
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const renderChart = (chart: DinamicoChart) => {
    const commonProps = {
      width: chart.layout?.width || "100%",
      height: chart.layout?.height || chart.config?.height || 300,
      data: chart.data
    }

    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chart.config?.color || '#00bcd4'} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={chart.config?.color || '#00bcd4'} />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                labelLine={false}
                label={({ value }) => `${value}%`}
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#00bcd4'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chart.config?.color || '#00bcd4'} 
                fill={chart.config?.fillColor || '#00bcd4'} 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      
      default:
        return <div className="text-gray-500">Tipo de gráfico no soportado</div>
    }
  }

  const currentSection = sections.find(s => s.id === selectedSection)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos dinámicos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title={pageConfig?.title || "Dashboard Dinámico"}
        subtitle={pageConfig?.subtitle || "Métricas y Análisis en Tiempo Real"}
      />

      {/* Filtros debajo del header */}
      {pageConfig?.showFilters && (
        <div className="bg-gray-50 py-4">
          <div className="flex justify-center px-8">
            <FilterDropdowns
              selectedLanguage={selectedLanguage}
              selectedCampaign={selectedCampaign}
              selectedDateRange={selectedDateRange}
              onLanguageChange={setSelectedLanguage}
              onCampaignChange={setSelectedCampaign}
              onDateRangeChange={setSelectedDateRange}
              onClear={() => {
                setSelectedLanguage('all')
                setSelectedCampaign('')
                setSelectedDateRange('Hoy')
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-8 py-8 space-y-8">
        {/* Sección de Control */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Secciones Dinámicas</h2>
              <p className="text-sm text-gray-600">Gestiona y visualiza métricas personalizadas</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Configuración Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Configuración:</label>
                <select
                  value={currentConfigType}
                  onChange={(e) => handleConfigChange(e.target.value as DinamicoConfigType)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  {availableConfigs.map((config) => (
                    <option key={config.type} value={config.type}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3">
                {pageConfig?.showRefreshButton && (
                  <button
                    onClick={refreshData}
                    className="flex items-center px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar
                  </button>
                )}
                {pageConfig?.showAddButton && (
                  <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Sección
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Selector de Secciones */}
          <div className="flex space-x-2 mb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSection === section.id
                    ? 'bg-cyan-400 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Información de la Sección Actual */}
          {currentSection && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">{currentSection.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{currentSection.description}</p>
              <p className="text-xs text-gray-500">
                Última actualización: {new Date(currentSection.lastUpdated).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Métricas de la Sección Actual */}
        {currentSection && (
          <>
            {/* Grid de Métricas */}
            <div className={`grid gap-4 ${
              pageConfig?.gridColumns ? 
                `grid-cols-${pageConfig.gridColumns.mobile} md:grid-cols-${pageConfig.gridColumns.tablet} lg:grid-cols-${pageConfig.gridColumns.desktop}` :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {currentSection.metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">{metric.name}</h3>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {metric.value.toLocaleString()} {metric.unit}
                  </div>
                  <div className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}% vs período anterior
                  </div>
                </div>
              ))}
            </div>

            {/* Gráficos de la Sección Actual */}
            <div className={`grid gap-6 ${
              pageConfig?.chartGridColumns ? 
                `grid-cols-${pageConfig.chartGridColumns.mobile} md:grid-cols-${pageConfig.chartGridColumns.tablet} lg:grid-cols-${pageConfig.chartGridColumns.desktop}` :
                'grid-cols-1 lg:grid-cols-2'
            }`}>
              {currentSection.charts.map((chart) => (
                <div
                  key={chart.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{chart.title}</h3>
                  {renderChart(chart)}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mensaje si no hay secciones */}
        {sections.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay secciones dinámicas</h3>
            <p className="text-gray-600 mb-6">Crea tu primera sección para comenzar a visualizar métricas personalizadas</p>
            <button className="flex items-center px-6 py-3 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors mx-auto">
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Sección
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
