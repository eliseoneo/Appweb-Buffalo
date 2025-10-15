/**
 * Filter Data Utilities
 * Process test scenarios data based on filter selections
 */

import testScenariosData from './test-scenarios-data.json';

export interface FilteredData {
  totalCallsData: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  responseRateData: {
    answeredCalls: number;
    totalCalls: number;
    responseRate: number;
    trend: string;
  };
  totalCostData: {
    totalCost: number;
    averageCostPerCall: number;
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  sentimentData: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  disconnectReasonsData: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  callEvolutionData: Array<{
    date: string;
    calls: number;
    conversions: number;
  }>;
  agentPerformanceData: Array<{
    agent: string;
    calls: number;
    conversions: number;
    conversionRate: number;
  }>;
  costPerConversionData: Array<{
    campaign: string;
    cost: number;
    conversions: number;
    costPerConversion: number;
  }>;
}

/**
 * Map date range selection to data key
 */
function getDateRangeKey(dateRange: string): string {
  const mapping: Record<string, string> = {
    'Hoy': 'today',
    'Ayer': 'yesterday',
    'Últimos 7 días': 'last_7_days',
    'Últimos 30 días': 'last_30_days',
    'Este mes': 'this_month',
    'Mes pasado': 'last_month'
  };
  
  return mapping[dateRange] || 'last_30_days';
}

/**
 * Get data based on filters
 */
export function getFilteredData(
  dateRange: string,
  campaign: string,
  language: string
): FilteredData {
  const dateKey = getDateRangeKey(dateRange);
  const dateData = testScenariosData.calls_by_date[dateKey as keyof typeof testScenariosData.calls_by_date];
  
  if (!dateData) {
    return getDefaultData();
  }

  // Apply campaign filter
  let totalCalls = dateData.total_calls;
  let sentimentData = dateData.sentiment;
  let disconnectData = dateData.disconnect_reasons;
  
  if (campaign) {
    // Filter by campaign
    const campaignCalls = dateData.by_campaign[campaign as keyof typeof dateData.by_campaign] || 0;
    const campaignRatio = campaignCalls / dateData.total_calls;
    
    totalCalls = campaignCalls;
    sentimentData = {
      positive: Math.round(dateData.sentiment.positive * campaignRatio),
      neutral: Math.round(dateData.sentiment.neutral * campaignRatio),
      negative: Math.round(dateData.sentiment.negative * campaignRatio)
    };
    disconnectData = {
      "usuario cuelga": Math.round(dateData.disconnect_reasons["usuario cuelga"] * campaignRatio),
      "agente cuelga": Math.round(dateData.disconnect_reasons["agente cuelga"] * campaignRatio),
      "no hay respuesta": Math.round(dateData.disconnect_reasons["no hay respuesta"] * campaignRatio),
      "ocupado": Math.round(dateData.disconnect_reasons["ocupado"] * campaignRatio),
      "tiempo maximo": Math.round(dateData.disconnect_reasons["tiempo maximo"] * campaignRatio)
    };
  }
  
  // Apply language filter
  if (language !== 'all') {
    const languageCalls = dateData.by_language[language as keyof typeof dateData.by_language] || 0;
    const languageRatio = languageCalls / dateData.total_calls;
    
    totalCalls = Math.round(totalCalls * languageRatio);
    sentimentData = {
      positive: Math.round(sentimentData.positive * languageRatio),
      neutral: Math.round(sentimentData.neutral * languageRatio),
      negative: Math.round(sentimentData.negative * languageRatio)
    };
    disconnectData = {
      "usuario cuelga": Math.round(disconnectData["usuario cuelga"] * languageRatio),
      "agente cuelga": Math.round(disconnectData["agente cuelga"] * languageRatio),
      "no hay respuesta": Math.round(disconnectData["no hay respuesta"] * languageRatio),
      "ocupado": Math.round(disconnectData["ocupado"] * languageRatio),
      "tiempo maximo": Math.round(disconnectData["tiempo maximo"] * languageRatio)
    };
  }

  // Calculate derived values
  const answeredCalls = Math.round(totalCalls * (dateData.response_rate / 100));
  const totalCost = totalCalls * dateData.avg_duration * 0.0027; // Approximate cost calculation
  
  // Get evolution data
  const evolutionKey = dateKey === 'today' ? 'today' : dateKey === 'last_7_days' ? 'last_7_days' : 'last_30_days';
  const evolutionData = testScenariosData.evolution_data[evolutionKey as keyof typeof testScenariosData.evolution_data] || [];
  
  // Format evolution data
  const formattedEvolution = evolutionData.map((item: any) => ({
    date: item.date || item.hour || '',
    calls: item.calls,
    conversions: item.conversions
  }));

  // Get agent performance data
  const agentKey = dateKey === 'today' ? 'today' : dateKey === 'last_7_days' || dateKey === 'yesterday' ? 'last_7_days' : 'all';
  const agentData = testScenariosData.agent_performance_by_filter[agentKey as keyof typeof testScenariosData.agent_performance_by_filter] || [];
  
  // Get cost per conversion data
  const costKey = dateKey === 'today' ? 'today' : dateKey === 'last_7_days' || dateKey === 'yesterday' ? 'last_7_days' : 'all';
  const costData = testScenariosData.cost_per_conversion_by_filter[costKey as keyof typeof testScenariosData.cost_per_conversion_by_filter] || [];

  // Build sentiment data array
  const totalSentiment = sentimentData.positive + sentimentData.neutral + sentimentData.negative;
  const sentimentArray = [
    {
      name: 'Positivo',
      value: sentimentData.positive,
      percentage: parseFloat(((sentimentData.positive / totalSentiment) * 100).toFixed(1)),
      color: '#10b981'
    },
    {
      name: 'Neutral',
      value: sentimentData.neutral,
      percentage: parseFloat(((sentimentData.neutral / totalSentiment) * 100).toFixed(1)),
      color: '#6b7280'
    },
    {
      name: 'Negativo',
      value: sentimentData.negative,
      percentage: parseFloat(((sentimentData.negative / totalSentiment) * 100).toFixed(1)),
      color: '#ef4444'
    }
  ];

  // Build disconnect reasons array
  const totalDisconnect = Object.values(disconnectData).reduce((sum, val) => sum + val, 0);
  const disconnectArray = [
    {
      name: 'Usuario cuelga',
      value: disconnectData["usuario cuelga"],
      percentage: parseFloat(((disconnectData["usuario cuelga"] / totalDisconnect) * 100).toFixed(1)),
      color: '#3b82f6'
    },
    {
      name: 'Agente cuelga',
      value: disconnectData["agente cuelga"],
      percentage: parseFloat(((disconnectData["agente cuelga"] / totalDisconnect) * 100).toFixed(1)),
      color: '#8b5cf6'
    },
    {
      name: 'No hay respuesta',
      value: disconnectData["no hay respuesta"],
      percentage: parseFloat(((disconnectData["no hay respuesta"] / totalDisconnect) * 100).toFixed(1)),
      color: '#f59e0b'
    },
    {
      name: 'Ocupado',
      value: disconnectData["ocupado"],
      percentage: parseFloat(((disconnectData["ocupado"] / totalDisconnect) * 100).toFixed(1)),
      color: '#ec4899'
    },
    {
      name: 'Tiempo máximo',
      value: disconnectData["tiempo maximo"],
      percentage: parseFloat(((disconnectData["tiempo maximo"] / totalDisconnect) * 100).toFixed(1)),
      color: '#ef4444'
    }
  ];

  return {
    totalCallsData: {
      total: totalCalls,
      thisMonth: dateKey === 'this_month' ? totalCalls : Math.round(totalCalls * 0.35),
      lastMonth: Math.round(totalCalls * 0.88),
      percentageChange: parseFloat(((totalCalls - (totalCalls * 0.88)) / (totalCalls * 0.88) * 100).toFixed(1))
    },
    responseRateData: {
      answeredCalls,
      totalCalls,
      responseRate: parseFloat(dateData.response_rate.toFixed(1)),
      trend: 'up'
    },
    totalCostData: {
      totalCost: parseFloat(totalCost.toFixed(2)),
      averageCostPerCall: parseFloat((totalCost / totalCalls).toFixed(4)),
      thisMonth: parseFloat((totalCost * 0.35).toFixed(2)),
      lastMonth: parseFloat((totalCost * 0.88).toFixed(2)),
      percentageChange: parseFloat(((totalCost - (totalCost * 0.88)) / (totalCost * 0.88) * 100).toFixed(1))
    },
    sentimentData: sentimentArray,
    disconnectReasonsData: disconnectArray,
    callEvolutionData: formattedEvolution,
    agentPerformanceData: agentData,
    costPerConversionData: costData
  };
}

/**
 * Get default data (fallback)
 */
function getDefaultData(): FilteredData {
  return {
    totalCallsData: {
      total: 2847,
      thisMonth: 892,
      lastMonth: 765,
      percentageChange: 16.6
    },
    responseRateData: {
      answeredCalls: 2198,
      totalCalls: 2847,
      responseRate: 77.2,
      trend: 'up'
    },
    totalCostData: {
      totalCost: 128.45,
      averageCostPerCall: 0.045,
      thisMonth: 42.18,
      lastMonth: 35.67,
      percentageChange: 18.3
    },
    sentimentData: [
      { name: 'Positivo', value: 1285, percentage: 45.1, color: '#10b981' },
      { name: 'Neutral', value: 987, percentage: 34.7, color: '#6b7280' },
      { name: 'Negativo', value: 575, percentage: 20.2, color: '#ef4444' }
    ],
    disconnectReasonsData: [
      { name: 'Usuario cuelga', value: 1142, percentage: 40.1, color: '#3b82f6' },
      { name: 'Agente cuelga', value: 856, percentage: 30.1, color: '#8b5cf6' },
      { name: 'No hay respuesta', value: 427, percentage: 15.0, color: '#f59e0b' },
      { name: 'Ocupado', value: 256, percentage: 9.0, color: '#ec4899' },
      { name: 'Tiempo máximo', value: 166, percentage: 5.8, color: '#ef4444' }
    ],
    callEvolutionData: [],
    agentPerformanceData: [],
    costPerConversionData: []
  };
}

/**
 * Get filter statistics for validation
 */
export function getFilterStatistics(
  dateRange: string,
  campaign: string,
  language: string
) {
  const data = getFilteredData(dateRange, campaign, language);
  
  return {
    totalRecords: data.totalCallsData.total,
    dateRange,
    campaign: campaign || 'All',
    language: language === 'all' ? 'All' : language,
    responseRate: data.responseRateData.responseRate,
    sentimentPositive: data.sentimentData.find(s => s.name === 'Positivo')?.percentage || 0,
    averageCost: data.totalCostData.averageCostPerCall,
    timestamp: new Date().toISOString()
  };
}

