/**
 * Synthetic Data for Dashboard Base
 * Generated from normalized n8n agent call data
 */

// KPI 1: Total Calls Summary
export const totalCallsData = {
  total: 2847,
  thisMonth: 892,
  lastMonth: 765,
  percentageChange: 16.6
};

// KPI 14: Response Rate
export const responseRateData = {
  answeredCalls: 2198,
  totalCalls: 2847,
  responseRate: 77.2,
  trend: "up"
};

// KPI 3: Total Cost
export const totalCostData = {
  totalCost: 128.45,
  averageCostPerCall: 0.045,
  thisMonth: 42.18,
  lastMonth: 35.67,
  percentageChange: 18.3
};

// KPI 16: Cost per Conversion
export const costPerConversionData = [
  { campaign: "TEST", cost: 0.35, conversions: 124, costPerConversion: 11.50 },
  { campaign: "DEMO V2 PLANETA", cost: 45.20, conversions: 85, costPerConversion: 15.20 },
  { campaign: "Si llaman a EAE", cost: 38.50, conversions: 92, costPerConversion: 12.80 },
  { campaign: "Llamar mas tarde", cost: 44.75, conversions: 78, costPerConversion: 16.90 }
];

// KPI 7: User Sentiment Distribution
export const sentimentData = [
  { name: "Positivo", value: 1285, percentage: 45.1, color: "#10b981" },
  { name: "Neutral", value: 987, percentage: 34.7, color: "#6b7280" },
  { name: "Negativo", value: 575, percentage: 20.2, color: "#ef4444" }
];

// KPI 6: Disconnect Reasons Distribution
export const disconnectReasonsData = [
  { name: "Usuario cuelga", value: 1142, percentage: 40.1, color: "#3b82f6" },
  { name: "Agente cuelga", value: 856, percentage: 30.1, color: "#8b5cf6" },
  { name: "No hay respuesta", value: 427, percentage: 15.0, color: "#f59e0b" },
  { name: "Ocupado", value: 256, percentage: 9.0, color: "#ec4899" },
  { name: "Tiempo máximo", value: 166, percentage: 5.8, color: "#ef4444" }
];

// KPI 4: Call Evolution Over Time (Last 30 Days)
export const callEvolutionData = [
  { date: "2025-09-15", calls: 78, conversions: 14 },
  { date: "2025-09-16", calls: 92, conversions: 18 },
  { date: "2025-09-17", calls: 85, conversions: 15 },
  { date: "2025-09-18", calls: 102, conversions: 21 },
  { date: "2025-09-19", calls: 95, conversions: 17 },
  { date: "2025-09-20", calls: 88, conversions: 16 },
  { date: "2025-09-21", calls: 76, conversions: 12 },
  { date: "2025-09-22", calls: 110, conversions: 23 },
  { date: "2025-09-23", calls: 98, conversions: 19 },
  { date: "2025-09-24", calls: 91, conversions: 17 },
  { date: "2025-09-25", calls: 105, conversions: 22 },
  { date: "2025-09-26", calls: 89, conversions: 15 },
  { date: "2025-09-27", calls: 94, conversions: 18 },
  { date: "2025-09-28", calls: 87, conversions: 16 },
  { date: "2025-09-29", calls: 99, conversions: 20 },
  { date: "2025-09-30", calls: 103, conversions: 21 },
  { date: "2025-10-01", calls: 96, conversions: 19 },
  { date: "2025-10-02", calls: 108, conversions: 24 },
  { date: "2025-10-03", calls: 92, conversions: 17 },
  { date: "2025-10-04", calls: 100, conversions: 20 },
  { date: "2025-10-05", calls: 95, conversions: 18 },
  { date: "2025-10-06", calls: 88, conversions: 15 },
  { date: "2025-10-07", calls: 112, conversions: 25 },
  { date: "2025-10-08", calls: 97, conversions: 19 },
  { date: "2025-10-09", calls: 104, conversions: 22 },
  { date: "2025-10-10", calls: 90, conversions: 16 },
  { date: "2025-10-11", calls: 98, conversions: 20 },
  { date: "2025-10-12", calls: 106, conversions: 23 },
  { date: "2025-10-13", calls: 93, conversions: 18 },
  { date: "2025-10-14", calls: 101, conversions: 21 }
];

// KPI 8: Agent Performance Distribution
export const agentPerformanceData = [
  { agent: "MODELO 1", calls: 1456, conversions: 262, conversionRate: 18.0 },
  { agent: "MODELO 2", calls: 892, conversions: 196, conversionRate: 22.0 },
  { agent: "DEMO V2 PLANETA", calls: 499, conversions: 82, conversionRate: 16.4 }
];

// Additional metrics for context
export const additionalMetrics = {
  averageDuration: 18.5, // seconds
  averageWaitTime: 4.2, // seconds
  callbackRate: 15.3, // percentage
  interviewRate: 19.5 // percentage of calls resulting in interview
};

// Time periods for filtering
export const timePeriods = [
  { value: "today", label: "Hoy" },
  { value: "week", label: "Esta Semana" },
  { value: "month", label: "Este Mes" },
  { value: "quarter", label: "Este Trimestre" },
  { value: "year", label: "Este Año" },
  { value: "all", label: "Todo el Tiempo" }
];

// Campaign comparison data
export const campaignComparison = [
  { name: "TEST", calls: 245, conversions: 45, cost: 11.03, roi: 245 },
  { name: "DEMO V2 PLANETA", calls: 892, conversions: 147, cost: 40.14, roi: 198 },
  { name: "Si llaman a EAE", calls: 1105, conversions: 216, cost: 49.76, roi: 212 },
  { name: "Llamar mas tarde", calls: 605, conversions: 102, cost: 27.52, roi: 168 }
];

