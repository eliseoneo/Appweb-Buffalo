// Mock ML Model Response Scenarios
// Simulates different machine learning model outputs

export type MLScenario = 'excellent' | 'warning' | 'critical' | 'growth' | 'decline' | 'balanced'

interface MLInsight {
  id: string
  titulo: string
  valor: string | number
  descripcion: string
  tipo: 'metric' | 'trend' | 'alert' | 'recommendation'
  relevancia: number
  categoria: string
  icono: string
  color: string
  mlScore?: number // ML confidence score
  mlPrediction?: string // ML prediction text
}

interface MLChartInsight {
  id: string
  titulo: string
  descripcion: string
  tipo: 'line' | 'bar' | 'donut' | 'area'
  data: any[]
  relevancia: number
  insight: string
  mlScore?: number
}

export function generateMLScenario(scenario: MLScenario) {
  const scenarios = {
    // SCENARIO 1: EXCELLENT PERFORMANCE
    excellent: {
      insights: [
        {
          id: 'satisfaction-excellent',
          titulo: 'Satisfacción del Cliente',
          valor: '85.2%',
          descripcion: '🎉 ML: Excelente nivel de satisfacción - mantener estrategia actual',
          tipo: 'metric' as const,
          relevancia: 100,
          categoria: 'Calidad',
          icono: 'Heart',
          color: 'green',
          mlScore: 0.95,
          mlPrediction: 'Tendencia al alza predicha para próximos 7 días'
        },
        {
          id: 'conversion-excellent',
          titulo: 'Tasa de Conversión',
          valor: '35.8%',
          descripcion: '🚀 ML: Conversión excepcional - supera benchmarks de industria',
          tipo: 'metric' as const,
          relevancia: 98,
          categoria: 'Conversión',
          icono: 'Target',
          color: 'green',
          mlScore: 0.92,
          mlPrediction: 'Modelo predice mantenimiento de alta conversión'
        },
        {
          id: 'growth-trend',
          titulo: 'Tendencia de Crecimiento',
          valor: '+24.5%',
          descripcion: '📈 ML: Crecimiento acelerado detectado - expansión recomendada',
          tipo: 'trend' as const,
          relevancia: 95,
          categoria: 'Tendencias',
          icono: 'TrendingUp',
          color: 'green',
          mlScore: 0.88
        },
        {
          id: 'total-calls',
          titulo: 'Total de Llamadas',
          valor: '2,456',
          descripcion: 'ML: Volumen óptimo para operaciones actuales',
          tipo: 'metric' as const,
          relevancia: 90,
          categoria: 'Volumen',
          icono: 'Phone',
          color: 'blue',
          mlScore: 0.85
        },
        {
          id: 'cost-efficiency',
          titulo: 'Eficiencia de Costos',
          valor: '€0.78',
          descripcion: '💰 ML: Costo por llamada muy competitivo',
          tipo: 'metric' as const,
          relevancia: 85,
          categoria: 'Costos',
          icono: 'DollarSign',
          color: 'green',
          mlScore: 0.82
        },
        {
          id: 'duration-optimal',
          titulo: 'Duración Promedio',
          valor: '5:45',
          descripcion: '✅ ML: Duración ideal para engagement profundo',
          tipo: 'metric' as const,
          relevancia: 82,
          categoria: 'Eficiencia',
          icono: 'Clock',
          color: 'blue',
          mlScore: 0.79
        },
        {
          id: 'best-practices',
          titulo: 'Mejores Prácticas',
          valor: 'Implementadas',
          descripcion: '💡 ML: Continuar con estrategia actual - alto rendimiento',
          tipo: 'recommendation' as const,
          relevancia: 78,
          categoria: 'Optimización',
          icono: 'Sparkles',
          color: 'purple',
          mlScore: 0.75
        }
      ],
      charts: [
        {
          id: 'sentiment-excellent',
          titulo: 'Distribución de Sentimiento (ML Optimizada)',
          descripcion: 'Análisis predictivo de satisfacción',
          tipo: 'donut' as const,
          data: [
            { nombre: 'Positive', valor: 2094 },
            { nombre: 'Neutral', valor: 280 },
            { nombre: 'Negative', valor: 82 },
            { nombre: 'Unknown', valor: 0 }
          ],
          relevancia: 100,
          insight: '🤖 ML: 85.2% positivo - Modelo predice mantenimiento en 95% de confianza',
          mlScore: 0.95
        },
        {
          id: 'trend-excellent',
          titulo: 'Predicción de Volumen (ML)',
          descripcion: 'Forecast de próximos 15 días con IA',
          tipo: 'area' as const,
          data: generateGrowthTrendData(30, 80, 150, 'up'),
          relevancia: 95,
          insight: '🤖 ML: Crecimiento sostenido - Modelo predice +18% próxima semana',
          mlScore: 0.91
        },
        {
          id: 'conversion-funnel',
          titulo: 'Embudo de Conversión (ML Analizado)',
          descripcion: 'Predicción de conversión optimizada',
          tipo: 'donut' as const,
          data: [
            { nombre: 'Convertidos', valor: 879 },
            { nombre: 'En Proceso', valor: 456 },
            { nombre: 'No Interesados', valor: 892 },
            { nombre: 'No Contactados', valor: 229 }
          ],
          relevancia: 92,
          insight: '🤖 ML: 35.8% conversión actual - Modelo sugiere optimización de horarios',
          mlScore: 0.89
        }
      ],
      mlMetadata: {
        model: 'RandomForest',
        confidence: 0.92,
        lastTraining: new Date().toISOString(),
        predictions: 'Rendimiento superior continuará próximos 14 días'
      }
    },

    // SCENARIO 2: WARNING - NEEDS ATTENTION
    warning: {
      insights: [
        {
          id: 'satisfaction-warning',
          titulo: 'Satisfacción del Cliente',
          valor: '58.3%',
          descripcion: '⚠️ ML: Satisfacción por debajo del objetivo (70%) - acción requerida',
          tipo: 'alert' as const,
          relevancia: 100,
          categoria: 'Calidad',
          icono: 'Heart',
          color: 'yellow',
          mlScore: 0.88,
          mlPrediction: 'Modelo predice descenso continuo si no se actúa'
        },
        {
          id: 'conversion-declining',
          titulo: 'Tasa de Conversión',
          valor: '14.2%',
          descripcion: '📉 ML: Conversión en descenso - revisar scripts y capacitación',
          tipo: 'alert' as const,
          relevancia: 98,
          categoria: 'Conversión',
          icono: 'Target',
          color: 'yellow',
          mlScore: 0.91,
          mlPrediction: 'Predicción: descenso a 12% en próximos 7 días'
        },
        {
          id: 'cost-rising',
          titulo: 'Costo por Llamada',
          valor: '€1.45',
          descripcion: '💸 ML: Costos aumentando - optimizar duración de llamadas',
          tipo: 'recommendation' as const,
          relevancia: 95,
          categoria: 'Costos',
          icono: 'DollarSign',
          color: 'yellow',
          mlScore: 0.86
        },
        {
          id: 'total-calls',
          titulo: 'Total de Llamadas',
          valor: '1,234',
          descripcion: 'ML: Volumen estable pero por debajo del potencial',
          tipo: 'metric' as const,
          relevancia: 90,
          categoria: 'Volumen',
          icono: 'Phone',
          color: 'blue',
          mlScore: 0.75
        },
        {
          id: 'duration-warning',
          titulo: 'Duración Promedio',
          valor: '3:12',
          descripcion: '⏱️ ML: Llamadas más cortas - puede indicar menor engagement',
          tipo: 'alert' as const,
          relevancia: 88,
          categoria: 'Eficiencia',
          icono: 'Clock',
          color: 'yellow',
          mlScore: 0.82
        },
        {
          id: 'optimize-timing',
          titulo: 'Optimizar Horarios',
          valor: 'Tarde/Noche',
          descripcion: '💡 ML: Modelo sugiere incrementar llamadas 16:00-20:00',
          tipo: 'recommendation' as const,
          relevancia: 85,
          categoria: 'Optimización',
          icono: 'Clock',
          color: 'purple',
          mlScore: 0.79
        }
      ],
      charts: [
        {
          id: 'sentiment-warning',
          titulo: 'Sentimiento (ML - Tendencia)',
          descripcion: 'Análisis predictivo de satisfacción',
          tipo: 'donut' as const,
          data: [
            { nombre: 'Positive', valor: 719 },
            { nombre: 'Neutral', valor: 320 },
            { nombre: 'Negative', valor: 185 },
            { nombre: 'Unknown', valor: 10 }
          ],
          relevancia: 100,
          insight: '🤖 ML: Tendencia a la baja - Modelo predice 52% positivo en 7 días si no se mejora',
          mlScore: 0.88
        },
        {
          id: 'conversion-trend-warning',
          titulo: 'Tendencia de Conversión (ML)',
          descripcion: 'Predicción de conversión próximos 14 días',
          tipo: 'area' as const,
          data: generateGrowthTrendData(21, 18, 14, 'down'),
          relevancia: 98,
          insight: '🤖 ML: Descenso del 22% detectado - Modelo recomienda revisión urgente de scripts',
          mlScore: 0.91
        },
        {
          id: 'cost-trend',
          titulo: 'Evolución de Costos (ML)',
          descripcion: 'Análisis de tendencia de costos',
          tipo: 'area' as const,
          data: generateGrowthTrendData(21, 0.95, 1.45, 'up'),
          relevancia: 95,
          insight: '🤖 ML: Costos incrementando 8% mensual - Optimizar duración llamadas',
          mlScore: 0.86
        }
      ],
      mlMetadata: {
        model: 'GradientBoosting',
        confidence: 0.85,
        lastTraining: new Date().toISOString(),
        predictions: 'Requiere atención - métricas en descenso'
      }
    },

    // SCENARIO 3: CRITICAL - IMMEDIATE ACTION REQUIRED
    critical: {
      insights: [
        {
          id: 'satisfaction-critical',
          titulo: 'Satisfacción del Cliente',
          valor: '32.1%',
          descripcion: '🚨 ML: CRÍTICO - Satisfacción muy baja - intervención inmediata',
          tipo: 'alert' as const,
          relevancia: 100,
          categoria: 'Calidad',
          icono: 'Heart',
          color: 'red',
          mlScore: 0.96,
          mlPrediction: 'Modelo predice pérdida masiva de clientes si no se actúa HOY'
        },
        {
          id: 'conversion-critical',
          titulo: 'Tasa de Conversión',
          valor: '4.8%',
          descripcion: '🚨 ML: CRÍTICO - Conversión colapsando - revisar todo el proceso',
          tipo: 'alert' as const,
          relevancia: 100,
          categoria: 'Conversión',
          icono: 'Target',
          color: 'red',
          mlScore: 0.94,
          mlPrediction: 'Crisis de conversión - acción inmediata requerida'
        },
        {
          id: 'churn-critical',
          titulo: 'Abandono de Llamadas',
          valor: '68.5%',
          descripcion: '🚨 ML: Tasa de abandono alarmante - problemas técnicos o de script',
          tipo: 'alert' as const,
          relevancia: 98,
          categoria: 'Calidad',
          icono: 'AlertCircle',
          color: 'red',
          mlScore: 0.93
        },
        {
          id: 'duration-critical',
          titulo: 'Duración Promedio',
          valor: '0:42',
          descripcion: '🚨 ML: Llamadas extremadamente cortas - verificar sistema',
          tipo: 'alert' as const,
          relevancia: 97,
          categoria: 'Eficiencia',
          icono: 'Clock',
          color: 'red',
          mlScore: 0.90
        },
        {
          id: 'emergency-action',
          titulo: 'Acción Inmediata',
          valor: 'URGENTE',
          descripcion: '🚨 ML: Revisar calidad de servicio, scripts y capacitación HOY',
          tipo: 'recommendation' as const,
          relevancia: 100,
          categoria: 'Acción',
          icono: 'AlertCircle',
          color: 'red',
          mlScore: 0.95
        },
        {
          id: 'total-calls',
          titulo: 'Total de Llamadas',
          valor: '1,234',
          descripcion: 'Volumen normal pero calidad muy deteriorada',
          tipo: 'metric' as const,
          relevancia: 75,
          categoria: 'Volumen',
          icono: 'Phone',
          color: 'blue',
          mlScore: 0.70
        }
      ],
      charts: [
        {
          id: 'sentiment-critical',
          titulo: 'Sentimiento (ML - CRÍTICO)',
          descripcion: 'Crisis de satisfacción detectada',
          tipo: 'donut' as const,
          data: [
            { nombre: 'Negative', valor: 837 },
            { nombre: 'Neutral', valor: 312 },
            { nombre: 'Positive', valor: 85 }
          ],
          relevancia: 100,
          insight: '🤖 ML: 68% negativo - INTERVENCIÓN URGENTE - Modelo detecta patrón de deterioro acelerado',
          mlScore: 0.96
        },
        {
          id: 'decline-trend',
          titulo: 'Tendencia de Satisfacción (ML)',
          descripcion: 'Predicción de crisis',
          tipo: 'area' as const,
          data: generateGrowthTrendData(21, 70, 32, 'down'),
          relevancia: 100,
          insight: '🤖 ML: Caída del 54% en 21 días - Modelo predice colapso total si no se corrige',
          mlScore: 0.94
        },
        {
          id: 'conversion-collapse',
          titulo: 'Conversión Colapsando (ML)',
          descripcion: 'Análisis de crisis de conversión',
          tipo: 'area' as const,
          data: generateGrowthTrendData(21, 28, 4.8, 'down'),
          relevancia: 98,
          insight: '🤖 ML: Caída del 83% - Emergencia operativa',
          mlScore: 0.92
        }
      ],
      mlMetadata: {
        model: 'DeepLearning-LSTM',
        confidence: 0.94,
        lastTraining: new Date().toISOString(),
        predictions: '🚨 ALERTA CRÍTICA - Requiere intervención ejecutiva inmediata',
        recommendation: 'Pausar operaciones, revisar todo el proceso, capacitación urgente'
      }
    },

    // SCENARIO 4: GROWTH - SCALING OPPORTUNITY
    growth: {
      insights: [
        {
          id: 'growth-opportunity',
          titulo: 'Oportunidad de Crecimiento',
          valor: '+45.2%',
          descripcion: '🚀 ML: Crecimiento explosivo - escalar operaciones AHORA',
          tipo: 'trend' as const,
          relevancia: 100,
          categoria: 'Tendencias',
          icono: 'TrendingUp',
          color: 'green',
          mlScore: 0.94,
          mlPrediction: 'Modelo predice +60% en próximo mes si se escala'
        },
        {
          id: 'scale-recommendation',
          titulo: 'Recomendación de Escalado',
          valor: '+3 Agentes',
          descripcion: '💡 ML: Contratar 3 agentes adicionales - ROI proyectado 340%',
          tipo: 'recommendation' as const,
          relevancia: 98,
          categoria: 'Optimización',
          icono: 'Users',
          color: 'purple',
          mlScore: 0.91
        },
        {
          id: 'market-demand',
          titulo: 'Demanda de Mercado',
          valor: 'Alta',
          descripcion: '📈 ML: Demanda supera capacidad - expandir urgente',
          tipo: 'alert' as const,
          relevancia: 96,
          categoria: 'Estrategia',
          icono: 'TrendingUp',
          color: 'green',
          mlScore: 0.89
        },
        {
          id: 'conversion-stable',
          titulo: 'Tasa de Conversión',
          valor: '26.8%',
          descripcion: '✅ ML: Conversión estable durante crecimiento - buena señal',
          tipo: 'metric' as const,
          relevancia: 92,
          categoria: 'Conversión',
          icono: 'Target',
          color: 'green',
          mlScore: 0.85
        },
        {
          id: 'total-growing',
          titulo: 'Total de Llamadas',
          valor: '3,890',
          descripcion: 'ML: Volumen creciendo rápidamente - cerca de saturación',
          tipo: 'metric' as const,
          relevancia: 90,
          categoria: 'Volumen',
          icono: 'Phone',
          color: 'blue',
          mlScore: 0.88
        }
      ],
      charts: [
        {
          id: 'growth-forecast',
          titulo: 'Forecast de Crecimiento (ML)',
          descripcion: 'Predicción de volumen próximos 30 días',
          tipo: 'area' as const,
          data: generateGrowthTrendData(30, 100, 220, 'up'),
          relevancia: 100,
          insight: '🤖 ML: Modelo predice +45% crecimiento - Preparar escalado operativo',
          mlScore: 0.94
        },
        {
          id: 'capacity-analysis',
          titulo: 'Análisis de Capacidad (ML)',
          descripcion: 'Predicción de saturación',
          tipo: 'bar' as const,
          data: [
            { nombre: 'Capacidad Actual', valor: 4000 },
            { nombre: 'Demanda Actual', valor: 3890 },
            { nombre: 'Demanda Predicha (7d)', valor: 5200 },
            { nombre: 'Capacidad Necesaria', valor: 5500 }
          ],
          relevancia: 98,
          insight: '🤖 ML: Saturación en 5 días - Contratar personal URGENTE',
          mlScore: 0.92
        }
      ],
      mlMetadata: {
        model: 'XGBoost',
        confidence: 0.92,
        lastTraining: new Date().toISOString(),
        predictions: 'Oportunidad de crecimiento - escalar rápido',
        recommendation: 'Contratar 3-5 agentes, aumentar capacidad 40%'
      }
    },

    // SCENARIO 5: DECLINE - INTERVENTION NEEDED
    decline: {
      insights: [
        {
          id: 'volume-decline',
          titulo: 'Caída de Volumen',
          valor: '-28.4%',
          descripcion: '📉 ML: Declive significativo - investigar causas raíz',
          tipo: 'alert' as const,
          relevancia: 100,
          categoria: 'Tendencias',
          icono: 'TrendingDown',
          color: 'red',
          mlScore: 0.93,
          mlPrediction: 'Modelo predice -40% si tendencia continúa'
        },
        {
          id: 'market-analysis',
          titulo: 'Análisis de Mercado',
          valor: 'Revisar',
          descripcion: '🔍 ML: Posible pérdida de competitividad - análisis requerido',
          tipo: 'recommendation' as const,
          relevancia: 98,
          categoria: 'Estrategia',
          icono: 'Activity',
          color: 'red',
          mlScore: 0.90
        },
        {
          id: 'satisfaction-declining',
          titulo: 'Satisfacción',
          valor: '51.2%',
          descripcion: '⚠️ ML: Satisfacción descendiendo correlacionada con volumen',
          tipo: 'alert' as const,
          relevancia: 95,
          categoria: 'Calidad',
          icono: 'Heart',
          color: 'yellow',
          mlScore: 0.87
        },
        {
          id: 'total-declining',
          titulo: 'Total de Llamadas',
          valor: '782',
          descripcion: 'ML: Menor volumen en 3 meses - tendencia preocupante',
          tipo: 'metric' as const,
          relevancia: 92,
          categoria: 'Volumen',
          icono: 'Phone',
          color: 'yellow',
          mlScore: 0.85
        }
      ],
      charts: [
        {
          id: 'decline-trend',
          titulo: 'Tendencia de Declive (ML)',
          descripcion: 'Análisis de caída de volumen',
          tipo: 'area' as const,
          data: generateGrowthTrendData(30, 180, 78, 'down'),
          relevancia: 100,
          insight: '🤖 ML: Caída sostenida del 28.4% - Modelo identifica pérdida de market share',
          mlScore: 0.93
        },
        {
          id: 'root-cause',
          titulo: 'Análisis de Causas (ML)',
          descripcion: 'Factores contribuyendo al declive',
          tipo: 'bar' as const,
          data: [
            { nombre: 'Competencia', valor: 45 },
            { nombre: 'Calidad Servicio', valor: 35 },
            { nombre: 'Precio', valor: 12 },
            { nombre: 'Otros', valor: 8 }
          ],
          relevancia: 98,
          insight: '🤖 ML: 45% atribuible a competencia, 35% a calidad - enfoque dual necesario',
          mlScore: 0.89
        }
      ],
      mlMetadata: {
        model: 'NeuralNetwork',
        confidence: 0.91,
        lastTraining: new Date().toISOString(),
        predictions: 'Declive continuo predicho - acción correctiva urgente',
        recommendation: 'Análisis competitivo, mejora de calidad, campaña de retención'
      }
    },

    // SCENARIO 6: BALANCED - NORMAL OPERATIONS
    balanced: {
      insights: [
        {
          id: 'total-balanced',
          titulo: 'Total de Llamadas',
          valor: '1,234',
          descripcion: 'ML: Volumen estable y predecible',
          tipo: 'metric' as const,
          relevancia: 100,
          categoria: 'Volumen',
          icono: 'Phone',
          color: 'blue',
          mlScore: 0.82
        },
        {
          id: 'satisfaction-balanced',
          titulo: 'Satisfacción del Cliente',
          valor: '68.5%',
          descripcion: '✅ ML: Nivel aceptable - oportunidad de mejora a 75%',
          tipo: 'metric' as const,
          relevancia: 90,
          categoria: 'Calidad',
          icono: 'Heart',
          color: 'green',
          mlScore: 0.78
        },
        {
          id: 'conversion-balanced',
          titulo: 'Tasa de Conversión',
          valor: '18.2%',
          descripcion: 'ML: Conversión en rango normal - optimizable',
          tipo: 'metric' as const,
          relevancia: 88,
          categoria: 'Conversión',
          icono: 'Target',
          color: 'blue',
          mlScore: 0.75
        },
        {
          id: 'optimize-conversion',
          titulo: 'Optimizar Conversión',
          valor: '+5-7%',
          descripcion: '💡 ML: Modelo sugiere A/B testing de scripts',
          tipo: 'recommendation' as const,
          relevancia: 85,
          categoria: 'Optimización',
          icono: 'TrendingUp',
          color: 'purple',
          mlScore: 0.72
        },
        {
          id: 'cost-balanced',
          titulo: 'Costo por Llamada',
          valor: '€0.98',
          descripcion: 'ML: Costos competitivos y estables',
          tipo: 'metric' as const,
          relevancia: 80,
          categoria: 'Costos',
          icono: 'DollarSign',
          color: 'green',
          mlScore: 0.70
        }
      ],
      charts: [
        {
          id: 'trend-stable',
          titulo: 'Tendencia Estable (ML)',
          descripcion: 'Volumen predecible y constante',
          tipo: 'area' as const,
          data: generateGrowthTrendData(30, 38, 42, 'stable'),
          relevancia: 85,
          insight: '🤖 ML: Estabilidad detectada - Modelo predice continuidad ±3%',
          mlScore: 0.80
        },
        {
          id: 'sentiment-balanced',
          titulo: 'Distribución de Sentimiento (ML)',
          descripcion: 'Balance normal de sentimientos',
          tipo: 'donut' as const,
          data: [
            { nombre: 'Positive', valor: 845 },
            { nombre: 'Neutral', valor: 289 },
            { nombre: 'Negative', valor: 100 }
          ],
          relevancia: 88,
          insight: '🤖 ML: 68.5% positivo - En rango aceptable, mejorable a 75%',
          mlScore: 0.78
        }
      ],
      mlMetadata: {
        model: 'RandomForest',
        confidence: 0.79,
        lastTraining: new Date().toISOString(),
        predictions: 'Operaciones normales - oportunidades de optimización menores',
        recommendation: 'Mantener curso actual, experimentar con mejoras incrementales'
      }
    }
  }

  return scenarios[scenario]
}

// Helper function to generate trend data
function generateGrowthTrendData(
  days: number, 
  startValue: number, 
  endValue: number, 
  pattern: 'up' | 'down' | 'stable'
): any[] {
  const data = []
  const increment = (endValue - startValue) / (days - 1)
  
  for (let i = 0; i < days; i++) {
    const baseValue = startValue + (increment * i)
    
    // Add realistic variation
    const variation = pattern === 'stable' 
      ? (Math.random() - 0.5) * (startValue * 0.05)  // ±5% variation
      : (Math.random() - 0.5) * (startValue * 0.1)   // ±10% variation
    
    const value = Math.max(0, Math.round(baseValue + variation))
    
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))
    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
    
    data.push({
      fecha: dateStr,
      llamadas: value
    })
  }
  
  return data
}

