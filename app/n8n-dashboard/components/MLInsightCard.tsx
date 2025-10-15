"use client";

import React from 'react';

interface MLInsightCardProps {
  titulo: string;
  valor: string | number;
  descripcion: string;
  color: string;
  relevancia: number;
  mlScore?: number;
  mlPrediction?: string;
}

export default function MLInsightCard({
  titulo,
  valor,
  descripcion,
  color,
  relevancia,
  mlScore,
  mlPrediction
}: MLInsightCardProps) {
  const colorClasses = {
    green: 'border-green-500 bg-green-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    red: 'border-red-500 bg-red-50',
    blue: 'border-blue-500 bg-blue-50',
    purple: 'border-purple-500 bg-purple-50'
  };

  const textColorClasses = {
    green: 'text-green-900',
    yellow: 'text-yellow-900',
    red: 'text-red-900',
    blue: 'text-blue-900',
    purple: 'text-purple-900'
  };

  const valueColorClasses = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${colorClasses[color as keyof typeof colorClasses]} p-6 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-700">{titulo}</h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {relevancia}% relevancia
            </span>
          </div>
          <p className={`text-3xl font-bold mb-2 ${valueColorClasses[color as keyof typeof valueColorClasses]}`}>
            {valor}
          </p>
        </div>
        {mlScore && (
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">ML Score</div>
            <div className="text-lg font-bold text-purple-600">{(mlScore * 100).toFixed(0)}%</div>
          </div>
        )}
      </div>
      
      <p className={`text-sm ${textColorClasses[color as keyof typeof textColorClasses]} mb-3`}>
        {descripcion}
      </p>
      
      {mlPrediction && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 flex items-start gap-2">
            <span className="text-purple-500">🤖</span>
            <span className="italic">{mlPrediction}</span>
          </p>
        </div>
      )}
    </div>
  );
}

