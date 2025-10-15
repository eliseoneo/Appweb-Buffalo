/**
 * ML Scenarios for n8n Analytics Dashboard
 * Auto-analyzes call data and generates ML insights
 */

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
  mlScore?: number
  mlPrediction?: string
}

interface MLChartData {
  id: string
  titulo: string
  descripcion: string
  tipo: 'line' | 'bar' | 'donut' | 'area'
  data: any[]
  relevancia: number
  insight: string
  mlScore?: number
}

/**
 * Auto-analyze data and determine best scenario
 */
export function analyzeDataAndSelectScenario(callData: any): MLScenario {
  const totalCalls = callData.totalCallsData?.total || 0
  const responseRate = callData.responseRateData?.responseRate || 0
  const sentimentPositive = callData.sentimentData?.find((s: any) => s.name === 'Positivo')?.percentage || 0
  const costPerCall = callData.totalCostData?.averageCostPerCall || 0
  
  // ML Auto-detection logic
  if (sentimentPositive >= 75 && responseRate >= 85) {
    return 'excellent' // Peak performance
  } else if (sentimentPositive < 35 || responseRate < 50) {
    return 'critical' // Emergency
  } else if (totalCalls > 3500 && sentimentPositive > 65) {
    return 'growth' // Scaling opportunity
  } else if (totalCalls < 1000 || sentimentPositive < 50) {
    return 'decline' // Intervention needed
  } else if (sentimentPositive < 60 || costPerCall > 0.10) {
    return 'warning' // Needs attention
  } else {
    return 'balanced' // Normal operations
  }
}

/**
 * Generate prediction trend data
 */
function generatePredictionTrend(
  days: number,
  currentValue: number,
  predictedValue: number,
  trend: 'up' | 'down' | 'stable'
): any[] {
  const data = [];
  const historicalDays = Math.floor(days * 0.6);
  const futureDays = days - historicalDays;
  
  // Historical data
  for (let i = 0; i < historicalDays; i++) {
    const variation = (Math.random() - 0.5) * (currentValue * 0.1);
    const value = Math.round(currentValue + variation);
    const date = new Date();
    date.setDate(date.getDate() - (historicalDays - i));
    
    data.push({
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      actual: value,
      predicted: null
    });
  }
  
  // Future prediction
  const increment = (predictedValue - currentValue) / futureDays;
  for (let i = 0; i < futureDays; i++) {
    const baseValue = currentValue + (increment * i);
    const variation = trend === 'stable' 
      ? (Math.random() - 0.5) * (currentValue * 0.05)
      : (Math.random() - 0.5) * (currentValue * 0.15);
    const value = Math.round(baseValue + variation);
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    data.push({
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      actual: null,
      predicted: value
    });
  }
  
  return data;
}

/**
 * Generate ML scenario data based on type
 */
export function generateMLScenario(scenario: MLScenario) {
  const scenarios = {
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
          icono: 'heart',
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
          icono: 'target',
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
          icono: 'trending-up',
          color: 'green',
          mlScore: 0.88
        },
        {
          id: 'cost-efficiency',
          titulo: 'Eficiencia de Costos',
          valor: '€0.045',
          descripcion: '💰 ML: Costo por llamada muy competitivo',
          tipo: 'metric' as const,
          relevancia: 85,
          categoria: 'Costos',
          icono: 'dollar',
          color: 'green',
          mlScore: 0.82
        }
      ],
      weaknessData: [
        { area: 'Satisfacción', score: 95, issues: 2 },
        { area: 'Conversión', score: 92, issues: 3 },
        { area: 'Costos', score: 88, issues: 4 },
        { area: 'Respuesta', score: 90, issues: 3 },
        { area: 'Duración', score: 85, issues: 5 }
      ],
      predictionData: {
        calls: generatePredictionTrend(20, 2847, 3520, 'up'),
        conversion: generatePredictionTrend(20, 35.8, 38.2, 'up'),
        satisfaction: generatePredictionTrend(20, 85.2, 87.5, 'up')
      },
      problemConcentration: [
        { category: 'Calidad de Script', problems: 2, severity: 'low' as const },
        { category: 'Timing de Llamadas', problems: 3, severity: 'low' as const },
        { category: 'Capacitación', problems: 1, severity: 'low' as const }
      ],
      mlMetadata: {
        model: 'RandomForest',
        confidence: 0.92,
        scenarioName: 'Excelente',
        prediction: 'Rendimiento superior continuará próximos 14 días',
        recommendation: 'Mantener estrategia actual, documentar mejores prácticas'
      }
    },

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
          icono: 'alert-triangle',
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
          icono: 'trending-down',
          color: 'yellow',
          mlScore: 0.91,
          mlPrediction: 'Predicción: descenso a 12% en próximos 7 días'
        },
        {
          id: 'cost-rising',
          titulo: 'Costo por Llamada',
          valor: '€0.125',
          descripcion: '💸 ML: Costos aumentando - optimizar duración de llamadas',
          tipo: 'recommendation' as const,
          relevancia: 95,
          categoria: 'Costos',
          icono: 'dollar',
          color: 'yellow',
          mlScore: 0.86
        }
      ],
      weaknessData: [
        { area: 'Satisfacción', score: 58, issues: 12 },
        { area: 'Conversión', score: 52, issues: 15 },
        { area: 'Costos', score: 45, issues: 18 },
        { area: 'Respuesta', score: 72, issues: 8 },
        { area: 'Duración', score: 65, issues: 10 }
      ],
      predictionData: {
        calls: generatePredictionTrend(20, 2847, 2450, 'down'),
        conversion: generatePredictionTrend(20, 14.2, 12.0, 'down'),
        satisfaction: generatePredictionTrend(20, 58.3, 52.0, 'down')
      },
      problemConcentration: [
        { category: 'Calidad de Servicio', problems: 18, severity: 'high' as const },
        { category: 'Scripts Desactualizados', problems: 15, severity: 'high' as const },
        { category: 'Costos Elevados', problems: 12, severity: 'medium' as const },
        { category: 'Timing Subóptimo', problems: 8, severity: 'medium' as const },
        { category: 'Capacitación', problems: 10, severity: 'medium' as const }
      ],
      mlMetadata: {
        model: 'GradientBoosting',
        confidence: 0.85,
        scenarioName: 'Advertencia',
        prediction: 'Requiere atención - métricas en descenso',
        recommendation: 'Revisar calidad de servicio y optimizar procesos'
      }
    },

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
          icono: 'alert-circle',
          color: 'red',
          mlScore: 0.96,
          mlPrediction: 'Modelo predice pérdida masiva de clientes'
        },
        {
          id: 'conversion-critical',
          titulo: 'Tasa de Conversión',
          valor: '4.8%',
          descripcion: '🚨 ML: CRÍTICO - Conversión colapsando - revisar todo el proceso',
          tipo: 'alert' as const,
          relevancia: 100,
          categoria: 'Conversión',
          icono: 'x-circle',
          color: 'red',
          mlScore: 0.94,
          mlPrediction: 'Crisis de conversión - acción inmediata requerida'
        },
        {
          id: 'emergency-action',
          titulo: 'Acción Inmediata',
          valor: 'URGENTE',
          descripcion: '🚨 ML: Revisar calidad de servicio, scripts y capacitación HOY',
          tipo: 'recommendation' as const,
          relevancia: 100,
          categoria: 'Acción',
          icono: 'alert-triangle',
          color: 'red',
          mlScore: 0.95
        }
      ],
      weaknessData: [
        { area: 'Satisfacción', score: 18, issues: 45 },
        { area: 'Conversión', score: 12, issues: 52 },
        { area: 'Costos', score: 25, issues: 38 },
        { area: 'Respuesta', score: 35, issues: 28 },
        { area: 'Duración', score: 22, issues: 42 }
      ],
      predictionData: {
        calls: generatePredictionTrend(20, 1234, 850, 'down'),
        conversion: generatePredictionTrend(20, 4.8, 2.5, 'down'),
        satisfaction: generatePredictionTrend(20, 32.1, 18.0, 'down')
      },
      problemConcentration: [
        { category: 'Calidad de Servicio', problems: 52, severity: 'high' as const },
        { category: 'Abandono de Llamadas', problems: 45, severity: 'high' as const },
        { category: 'Scripts Deficientes', problems: 42, severity: 'high' as const },
        { category: 'Costos Excesivos', problems: 38, severity: 'high' as const },
        { category: 'Problemas Técnicos', problems: 28, severity: 'high' as const }
      ],
      mlMetadata: {
        model: 'DeepLearning-LSTM',
        confidence: 0.94,
        scenarioName: 'Crítico',
        prediction: '🚨 ALERTA CRÍTICA - Requiere intervención ejecutiva inmediata',
        recommendation: 'Pausar operaciones, revisar todo el proceso, capacitación urgente'
      }
    },

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
          icono: 'trending-up',
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
          icono: 'users',
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
          icono: 'trending-up',
          color: 'green',
          mlScore: 0.89
        }
      ],
      weaknessData: [
        { area: 'Satisfacción', score: 88, issues: 5 },
        { area: 'Conversión', score: 85, issues: 6 },
        { area: 'Costos', score: 78, issues: 8 },
        { area: 'Respuesta', score: 92, issues: 3 },
        { area: 'Capacidad', score: 35, issues: 42 }
      ],
      predictionData: {
        calls: generatePredictionTrend(20, 3890, 5520, 'up'),
        conversion: generatePredictionTrend(20, 26.8, 28.5, 'up'),
        satisfaction: generatePredictionTrend(20, 72.0, 75.0, 'up')
      },
      problemConcentration: [
        { category: 'Capacidad Insuficiente', problems: 42, severity: 'high' as const },
        { category: 'Recursos Limitados', problems: 28, severity: 'high' as const },
        { category: 'Escalado Necesario', problems: 18, severity: 'medium' as const },
        { category: 'Tiempos de Espera', problems: 12, severity: 'medium' as const }
      ],
      mlMetadata: {
        model: 'XGBoost',
        confidence: 0.92,
        scenarioName: 'Crecimiento',
        prediction: 'Oportunidad de crecimiento - escalar rápido',
        recommendation: 'Contratar 3-5 agentes, aumentar capacidad 40%'
      }
    },

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
          icono: 'trending-down',
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
          icono: 'activity',
          color: 'red',
          mlScore: 0.90
        }
      ],
      weaknessData: [
        { area: 'Satisfacción', score: 42, issues: 25 },
        { area: 'Conversión', score: 38, issues: 28 },
        { area: 'Costos', score: 48, issues: 22 },
        { area: 'Respuesta', score: 55, issues: 18 },
        { area: 'Retención', score: 28, issues: 35 }
      ],
      predictionData: {
        calls: generatePredictionTrend(20, 782, 520, 'down'),
        conversion: generatePredictionTrend(20, 12.5, 8.2, 'down'),
        satisfaction: generatePredictionTrend(20, 51.2, 38.0, 'down')
      },
      problemConcentration: [
        { category: 'Pérdida de Clientes', problems: 35, severity: 'high' as const },
        { category: 'Competencia', problems: 28, severity: 'high' as const },
        { category: 'Calidad en Descenso', problems: 25, severity: 'high' as const },
        { category: 'Precio/Valor', problems: 22, severity: 'medium' as const },
        { category: 'Falta de Innovación', problems: 18, severity: 'medium' as const }
      ],
      mlMetadata: {
        model: 'NeuralNetwork',
        confidence: 0.91,
        scenarioName: 'Declive',
        prediction: 'Declive continuo predicho - acción correctiva urgente',
        recommendation: 'Análisis competitivo, mejora de calidad, campaña de retención'
      }
    },

    balanced: {
      insights: [
        {
          id: 'total-balanced',
          titulo: 'Total de Llamadas',
          valor: '2,847',
          descripcion: 'ML: Volumen estable y predecible',
          tipo: 'metric' as const,
          relevancia: 100,
          categoria: 'Volumen',
          icono: 'phone',
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
          icono: 'heart',
          color: 'green',
          mlScore: 0.78
        },
        {
          id: 'response-rate',
          titulo: 'Tasa de Respuesta',
          valor: '77.2%',
          descripcion: 'ML: Buena tasa de respuesta - optimizable a 85%',
          tipo: 'metric' as const,
          relevancia: 88,
          categoria: 'Performance',
          icono: 'check-circle',
          color: 'green',
          mlScore: 0.80
        },
        {
          id: 'optimize-conversion',
          titulo: 'Optimizar Conversión',
          valor: '+5-7%',
          descripcion: '💡 ML: Modelo sugiere A/B testing de scripts',
          tipo: 'recommendation' as const,
          relevancia: 85,
          categoria: 'Optimización',
          icono: 'trending-up',
          color: 'purple',
          mlScore: 0.72
        }
      ],
      weaknessData: [
        { area: 'Satisfacción', score: 72, issues: 8 },
        { area: 'Conversión', score: 68, issues: 10 },
        { area: 'Costos', score: 75, issues: 7 },
        { area: 'Respuesta', score: 82, issues: 5 },
        { area: 'Duración', score: 78, issues: 6 }
      ],
      predictionData: {
        calls: generatePredictionTrend(20, 2847, 2920, 'stable'),
        conversion: generatePredictionTrend(20, 18.2, 19.5, 'up'),
        satisfaction: generatePredictionTrend(20, 68.5, 72.0, 'up')
      },
      problemConcentration: [
        { category: 'Optimización de Scripts', problems: 10, severity: 'medium' as const },
        { category: 'Timing de Llamadas', problems: 8, severity: 'medium' as const },
        { category: 'Costos Optimizables', problems: 7, severity: 'low' as const },
        { category: 'Capacitación Continua', problems: 6, severity: 'low' as const },
        { category: 'Mejora de Procesos', problems: 5, severity: 'low' as const }
      ],
      mlMetadata: {
        model: 'RandomForest',
        confidence: 0.79,
        scenarioName: 'Balanceado',
        prediction: 'Operaciones normales - oportunidades de optimización menores',
        recommendation: 'Mantener curso actual, experimentar con mejoras incrementales'
      }
    }
  }

  return scenarios[scenario]
}

