"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartComponentProps {
  title: string;
  subtitle?: string;
  data: Array<any>;
  dataKeys: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  layout?: 'horizontal' | 'vertical';
}

export default function BarChartComponent({ 
  title, 
  subtitle, 
  data, 
  dataKeys,
  layout = 'vertical'
}: BarChartComponentProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data}
          layout={layout}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          {layout === 'vertical' ? (
            <>
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey={dataKeys[0].key} tick={{ fontSize: 12 }} stroke="#9ca3af" width={120} />
            </>
          ) : (
            <>
              <XAxis type="category" dataKey={dataKeys[0].key} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            </>
          )}
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          {dataKeys.slice(1).map((item, index) => (
            <Bar 
              key={index}
              dataKey={item.key} 
              fill={item.color} 
              name={item.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

