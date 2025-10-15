"use client";

import React, { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import CallEvolutionChart from './components/CallEvolutionChart';
import DonutChart from './components/DonutChart';
import BarChartComponent from './components/BarChartComponent';
import MLInsightCard from './components/MLInsightCard';
import WeaknessHeatmap from './components/WeaknessHeatmap';
import ProblemConcentration from './components/ProblemConcentration';
import PredictionTrendChart from './components/PredictionTrendChart';
import FilterDropdowns from '@/components/FilterDropdowns';
import { getFilteredData, getFilterStatistics } from './data/filter-data-utils';
import { analyzeDataAndSelectScenario, generateMLScenario } from './data/ml-scenarios';

export default function DashboardBase() {
  const [viewMode, setViewMode] = useState<'normal' | 'ml'>('normal');
  const [mlScenario, setMlScenario] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Filter states
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('Hoy');
  
  // Filtered dashboard data
  const [dashboardData, setDashboardData] = useState(() => 
    getFilteredData('Hoy', '', 'all')
  );

  // Update data when filters change
  useEffect(() => {
    const filteredData = getFilteredData(selectedDateRange, selectedCampaign, selectedLanguage);
    setDashboardData(filteredData);
    
    // Log filter statistics for validation
    const stats = getFilterStatistics(selectedDateRange, selectedCampaign, selectedLanguage);
    console.log('📊 Filter Applied:', stats);
  }, [selectedDateRange, selectedCampaign, selectedLanguage]);

  const handleMLAnalysis = () => {
    setIsAnalyzing(true);
    
    // Auto-analyze filtered data with context
    setTimeout(() => {
      const context = {
        dateRange: selectedDateRange,
        totalCalls: dashboardData.totalCallsData.total
      };
      
      const detectedScenario = analyzeDataAndSelectScenario(dashboardData, context);
      const mlData = generateMLScenario(detectedScenario, context);
      
      setMlScenario(mlData);
      setViewMode('ml');
      setIsAnalyzing(false);
      
      // Log ML analysis for validation
      console.log('🤖 ML Analysis (Context-Aware):', {
        scenario: detectedScenario,
        model: mlData.mlMetadata.model,
        confidence: mlData.mlMetadata.confidence,
        filters: { 
          dateRange: selectedDateRange, 
          campaign: selectedCampaign, 
          language: selectedLanguage 
        },
        context: mlData.mlMetadata.context,
        predictionTimeframe: mlData.mlMetadata.context.predictionDays + ' días'
      });
    }, 800); // Simular análisis ML
  };

  const handleNormalView = () => {
    setViewMode('normal');
  };

  const handleClearFilters = () => {
    setSelectedLanguage('all');
    setSelectedCampaign('');
    setSelectedDateRange('Hoy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">n8n Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">Panel de análisis de llamadas - Datos en tiempo real</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">En vivo</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters and View Mode Row */}
          <div className="flex items-center justify-between">
            <FilterDropdowns
              selectedLanguage={selectedLanguage}
              selectedCampaign={selectedCampaign}
              selectedDateRange={selectedDateRange}
              onLanguageChange={setSelectedLanguage}
              onCampaignChange={setSelectedCampaign}
              onDateRangeChange={setSelectedDateRange}
              onClear={handleClearFilters}
            />
            
            {/* View Mode Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleNormalView}
                disabled={isAnalyzing}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'normal'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                📊 Vista Normal
              </button>
              <button
                onClick={handleMLAnalysis}
                disabled={isAnalyzing}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'ml'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                } ${isAnalyzing ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
              >
                {isAnalyzing ? '🔄 Analizando...' : '🤖 Análisis ML'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ML Analysis View */}
        {viewMode === 'ml' && mlScenario && (
          <div className="mb-8">
            {/* ML Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🤖 Análisis ML Automático</h2>
                  <p className="text-purple-100">
                    Escenario detectado: <span className="font-bold">{mlScenario.mlMetadata.scenarioName}</span> 
                    {' • '}Modelo: {mlScenario.mlMetadata.model} 
                    {' • '}Confianza: {(mlScenario.mlMetadata.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-xs text-purple-100">Predicción ML</div>
                    <div className="text-sm font-semibold">{mlScenario.mlMetadata.prediction}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ML Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mlScenario.insights
                .sort((a: any, b: any) => b.relevancia - a.relevancia)
                .map((insight: any) => (
                  <MLInsightCard
                    key={insight.id}
                    titulo={insight.titulo}
                    valor={insight.valor}
                    descripcion={insight.descripcion}
                    color={insight.color}
                    relevancia={insight.relevancia}
                    mlScore={insight.mlScore}
                    mlPrediction={insight.mlPrediction}
                  />
                ))}
            </div>

            {/* ML Analysis Charts Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Análisis de Debilidades y Predicciones
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Weakness Heatmap */}
                {mlScenario.weaknessData && (
                  <WeaknessHeatmap
                    data={mlScenario.weaknessData}
                    title="Mapa de Calor de Debilidades"
                    subtitle="Áreas con mayor concentración de problemas (ML detectado)"
                  />
                )}
                
                {/* Problem Concentration */}
                {mlScenario.problemConcentration && (
                  <ProblemConcentration
                    data={mlScenario.problemConcentration}
                    title="Concentración de Problemas"
                    subtitle="Distribución de problemas por categoría"
                  />
                )}
              </div>

              {/* Prediction Trends */}
              {mlScenario.predictionData && mlScenario.mlMetadata.context && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <PredictionTrendChart
                    data={mlScenario.predictionData.calls}
                    title="Predicción de Llamadas"
                    subtitle={`Forecast ML próximos ${mlScenario.mlMetadata.context.predictionDays} días`}
                    currentValue={dashboardData.totalCallsData.total}
                    predictedValue={mlScenario.predictionData.calls[mlScenario.predictionData.calls.length - 1]?.predicted || dashboardData.totalCallsData.total}
                    trend={mlScenario.predictionData.calls[mlScenario.predictionData.calls.length - 1]?.predicted > dashboardData.totalCallsData.total ? 'up' : mlScenario.predictionData.calls[mlScenario.predictionData.calls.length - 1]?.predicted < dashboardData.totalCallsData.total ? 'down' : 'stable'}
                  />
                  
                  <PredictionTrendChart
                    data={mlScenario.predictionData.conversion}
                    title="Predicción de Conversión"
                    subtitle={`Tendencia ML próximos ${mlScenario.mlMetadata.context.predictionDays} días`}
                    currentValue={18.2}
                    predictedValue={mlScenario.predictionData.conversion[mlScenario.predictionData.conversion.length - 1]?.predicted || 18.2}
                    trend={mlScenario.predictionData.conversion[mlScenario.predictionData.conversion.length - 1]?.predicted > 18.2 ? 'up' : mlScenario.predictionData.conversion[mlScenario.predictionData.conversion.length - 1]?.predicted < 18.2 ? 'down' : 'stable'}
                  />
                  
                  <PredictionTrendChart
                    data={mlScenario.predictionData.satisfaction}
                    title="Predicción de Satisfacción"
                    subtitle={`Forecast ML próximos ${mlScenario.mlMetadata.context.predictionDays} días`}
                    currentValue={68.5}
                    predictedValue={mlScenario.predictionData.satisfaction[mlScenario.predictionData.satisfaction.length - 1]?.predicted || 68.5}
                    trend={mlScenario.predictionData.satisfaction[mlScenario.predictionData.satisfaction.length - 1]?.predicted > 68.5 ? 'up' : mlScenario.predictionData.satisfaction[mlScenario.predictionData.satisfaction.length - 1]?.predicted < 68.5 ? 'down' : 'stable'}
                  />
                </div>
              )}
            </div>

            {/* ML Recommendation */}
            {mlScenario.mlMetadata.recommendation && (
              <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">💡 Recomendación del Modelo ML</h3>
                <p className="text-purple-800">{mlScenario.mlMetadata.recommendation}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Normal View */}
        {viewMode === 'normal' && (
          <>
        
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Llamadas"
            value={dashboardData.totalCallsData.total.toLocaleString()}
            subtitle={`${dashboardData.totalCallsData.thisMonth} llamadas este mes`}
            trend="up"
            trendValue={`+${dashboardData.totalCallsData.percentageChange}% vs mes anterior`}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />
          
          <StatCard
            title="Tasa de Respuesta"
            value={`${dashboardData.responseRateData.responseRate}%`}
            subtitle={`${dashboardData.responseRateData.answeredCalls} de ${dashboardData.responseRateData.totalCalls} llamadas respondidas`}
            trend="up"
            trendValue="Excelente rendimiento"
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <StatCard
            title="Costo Total"
            value={`€${dashboardData.totalCostData.totalCost.toFixed(2)}`}
            subtitle={`€${dashboardData.totalCostData.averageCostPerCall.toFixed(3)} costo promedio por llamada`}
            trend="up"
            trendValue={`+${dashboardData.totalCostData.percentageChange}% vs mes anterior`}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Charts Row 1: Evolution Chart */}
        <div className="mb-8">
          <CallEvolutionChart data={dashboardData.callEvolutionData} />
        </div>

        {/* Charts Row 2: Donut Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DonutChart
            title="Sentimiento del Usuario"
            subtitle="Distribución de emociones en las llamadas"
            data={dashboardData.sentimentData}
          />
          
          <DonutChart
            title="Motivos de Desconexión"
            subtitle="Razones por las que terminaron las llamadas"
            data={dashboardData.disconnectReasonsData}
          />
        </div>

        {/* Charts Row 3: Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChartComponent
            title="Rendimiento por Agente"
            subtitle="Llamadas y conversiones por modelo"
            data={dashboardData.agentPerformanceData}
            dataKeys={[
              { key: 'agent', name: 'Agente', color: '#3b82f6' },
              { key: 'calls', name: 'Llamadas', color: '#3b82f6' },
              { key: 'conversions', name: 'Conversiones', color: '#10b981' }
            ]}
            layout="vertical"
          />
          
          <BarChartComponent
            title="Costo por Conversión"
            subtitle="Efectividad de inversión por campaña"
            data={dashboardData.costPerConversionData}
            dataKeys={[
              { key: 'campaign', name: 'Campaña', color: '#8b5cf6' },
              { key: 'costPerConversion', name: 'Costo por Conversión (€)', color: '#8b5cf6' }
            ]}
            layout="horizontal"
          />
        </div>

        {/* Additional Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Duración Promedio</p>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">18.5s</p>
            <p className="text-xs text-gray-500 mt-1">Por llamada</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Tiempo de Espera</p>
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">4.2s</p>
            <p className="text-xs text-gray-500 mt-1">Promedio de conexión</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Tasa de Recontacto</p>
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">15.3%</p>
            <p className="text-xs text-gray-500 mt-1">Callbacks solicitados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Tasa de Entrevista</p>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">19.5%</p>
            <p className="text-xs text-gray-500 mt-1">Conversión a entrevista</p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Dashboard de Análisis Basado en Datos Normalizados</h4>
              <p className="text-sm text-blue-700">
                Este dashboard utiliza datos procesados por el sistema de normalización n8n. Los datos se actualizan en tiempo real desde las llamadas de los agentes IA. 
                <span className="font-medium"> 8 KPIs principales</span> de un total de 20 disponibles están visualizados aquí para proporcionar una visión ejecutiva completa.
              </p>
            </div>
          </div>
        </div>
        
        </>
        )}

      </div>
    </div>
  );
}

