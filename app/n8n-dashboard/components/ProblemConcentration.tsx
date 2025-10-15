"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ProblemConcentrationProps {
  data: Array<{
    category: string;
    problems: number;
    severity: 'high' | 'medium' | 'low';
  }>;
  title: string;
  subtitle?: string;
}

export default function ProblemConcentration({ data, title, subtitle }: ProblemConcentrationProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444'; // Red
      case 'medium': return '#f59e0b'; // Orange
      case 'low': return '#fbbf24'; // Yellow
      default: return '#6b7280'; // Gray
    }
  };

  const totalProblems = data.reduce((sum, item) => sum + item.problems, 0);

  const chartData = data.map(item => ({
    name: item.category,
    value: item.problems,
    percentage: ((item.problems / totalProblems) * 100).toFixed(1),
    color: getSeverityColor(item.severity),
    severity: item.severity
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg border-2" style={{ borderColor: data.color }}>
          <p className="text-sm font-semibold text-gray-900">{data.name}</p>
          <p className="text-xs text-gray-600 mt-1">
            {data.value} problemas ({data.percentage}%)
          </p>
          <p className="text-xs font-medium mt-1" style={{ color: data.color }}>
            Severidad: {data.severity === 'high' ? 'Alta' : data.severity === 'medium' ? 'Media' : 'Baja'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-xs font-medium text-red-700">{totalProblems} problemas detectados</span>
          </div>
        </div>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percentage }) => `${name} (${percentage}%)`}
            labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Problem List */}
      <div className="mt-4 space-y-2">
        {chartData
          .sort((a, b) => b.value - a.value)
          .map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
                <span className="text-xs text-gray-500 w-12 text-right">({item.percentage}%)</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

