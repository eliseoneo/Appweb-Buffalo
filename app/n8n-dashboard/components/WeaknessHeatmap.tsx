"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeaknessHeatmapProps {
  data: Array<{
    area: string;
    score: number;
    issues: number;
  }>;
  title: string;
  subtitle?: string;
}

export default function WeaknessHeatmap({ data, title, subtitle }: WeaknessHeatmapProps) {
  // Color based on score (lower score = more problems = redder)
  const getColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green - excellent
    if (score >= 60) return '#3b82f6'; // Blue - good
    if (score >= 40) return '#f59e0b'; // Orange - warning
    return '#ef4444'; // Red - critical
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis type="category" dataKey="area" tick={{ fontSize: 12 }} stroke="#9ca3af" width={110} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any, name: string, props: any) => [
              `Score: ${value}% (${props.payload.issues} problemas)`,
              props.payload.area
            ]}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          <span className="text-gray-600">Excelente (80-100)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
          <span className="text-gray-600">Bueno (60-79)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
          <span className="text-gray-600">Advertencia (40-59)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-red-500"></div>
          <span className="text-gray-600">Crítico (0-39)</span>
        </div>
      </div>
    </div>
  );
}

