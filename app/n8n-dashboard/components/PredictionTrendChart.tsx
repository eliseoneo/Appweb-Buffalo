"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PredictionTrendChartProps {
  data: Array<{
    date: string;
    actual?: number;
    predicted: number;
  }>;
  title: string;
  subtitle?: string;
  currentValue: number;
  predictedValue: number;
  trend: 'up' | 'down' | 'stable';
}

export default function PredictionTrendChart({ 
  data, 
  title, 
  subtitle, 
  currentValue, 
  predictedValue,
  trend 
}: PredictionTrendChartProps) {
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';
  const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '→';
  const change = ((predictedValue - currentValue) / currentValue * 100).toFixed(1);
  const changeText = trend === 'up' ? `+${change}%` : `${change}%`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-lg">
            <span className="text-xs font-medium text-purple-700">ML Predicción</span>
          </div>
        </div>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        
        {/* Prediction Summary */}
        <div className="flex items-center gap-4 mt-3 p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500">Actual</p>
            <p className="text-lg font-bold text-gray-900">{currentValue}</p>
          </div>
          <div className="text-2xl text-gray-300">→</div>
          <div>
            <p className="text-xs text-gray-500">Predicción 7 días</p>
            <p className="text-lg font-bold" style={{ color: trendColor }}>{predictedValue}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-500">Cambio</p>
            <p className="text-lg font-bold flex items-center gap-1" style={{ color: trendColor }}>
              <span>{trendIcon}</span>
              <span>{changeText}</span>
            </p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${trend}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={trendColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={trendColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            stroke="#9ca3af"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <ReferenceLine 
            y={currentValue} 
            stroke="#9ca3af" 
            strokeDasharray="3 3"
            label={{ value: 'Actual', position: 'right', fontSize: 10, fill: '#6b7280' }}
          />
          {data[0].actual && (
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#94a3b8" 
              fill="#cbd5e1"
              strokeWidth={2}
              name="Histórico"
            />
          )}
          <Area 
            type="monotone" 
            dataKey="predicted" 
            stroke={trendColor} 
            fill={`url(#gradient-${trend})`}
            strokeWidth={2}
            name="Predicción ML"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

