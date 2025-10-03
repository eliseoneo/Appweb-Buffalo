import dinamicoData from './dinamico-data.json'
import dinamicoExamples from './dinamico-data-examples.json'

export type DinamicoConfigType = 'default' | 'minimal' | 'executive' | 'operational' | 'custom'

export interface DinamicoConfig {
  pageConfig: {
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
  sections: Array<{
    id: string
    title: string
    description: string
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
    metrics: Array<{
      id: string
      name: string
      value: number
      unit: string
      trend: 'up' | 'down' | 'stable'
      change: number
      color: string
      category: string
    }>
    charts: Array<{
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
    }>
  }>
}

export function loadDinamicoConfig(configType: DinamicoConfigType = 'default'): DinamicoConfig {
  switch (configType) {
    case 'minimal':
      return dinamicoExamples.examples.minimal as DinamicoConfig
    case 'executive':
      return dinamicoExamples.examples.executive as DinamicoConfig
    case 'operational':
      return dinamicoExamples.examples.operational as DinamicoConfig
    case 'custom':
      // Load from localStorage or API
      const customConfig = localStorage.getItem('dinamico-custom-config')
      if (customConfig) {
        return JSON.parse(customConfig)
      }
      return dinamicoData as DinamicoConfig
    case 'default':
    default:
      return dinamicoData as DinamicoConfig
  }
}

export function saveCustomConfig(config: DinamicoConfig): void {
  localStorage.setItem('dinamico-custom-config', JSON.stringify(config))
}

export function getAvailableConfigs(): Array<{ type: DinamicoConfigType; name: string; description: string }> {
  return [
    {
      type: 'default',
      name: 'Dashboard Estándar',
      description: 'Configuración por defecto con métricas balanceadas'
    },
    {
      type: 'minimal',
      name: 'Vista Minimalista',
      description: 'Interfaz simplificada con métricas esenciales'
    },
    {
      type: 'executive',
      name: 'Dashboard Ejecutivo',
      description: 'Vista estratégica para directivos y tomadores de decisiones'
    },
    {
      type: 'operational',
      name: 'Dashboard Operacional',
      description: 'Métricas detalladas para operaciones diarias'
    },
    {
      type: 'custom',
      name: 'Configuración Personalizada',
      description: 'Configuración guardada personalizada'
    }
  ]
}

export function createCustomConfig(
  baseConfig: DinamicoConfig,
  overrides: Partial<DinamicoConfig>
): DinamicoConfig {
  return {
    ...baseConfig,
    ...overrides,
    pageConfig: {
      ...baseConfig.pageConfig,
      ...overrides.pageConfig
    },
    sections: overrides.sections || baseConfig.sections
  }
}

export function validateConfig(config: any): config is DinamicoConfig {
  return (
    config &&
    config.pageConfig &&
    config.sections &&
    Array.isArray(config.sections) &&
    config.pageConfig.title &&
    config.pageConfig.subtitle
  )
}
