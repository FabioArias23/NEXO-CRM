import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon, MoreHorizontal } from 'lucide-react';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: DataItem[];
}

export function PortfolioDistributionCard({ data }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#09090b] border border-gray-800 rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <PieChartIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Distribución</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Por Ramo</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-6 flex-1 items-center min-h-0">
        
        {/* COLUMNA 1: GRÁFICO */}
        <div className="relative w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="68%" 
                outerRadius="95%" 
                paddingAngle={0}
                dataKey="value"
                stroke="#09090b" 
                strokeWidth={4}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="hover:opacity-80 transition-opacity duration-300 cursor-pointer outline-none"
                  />
                ))}
              </Pie>
              <Tooltip 
                cursor={false}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Texto Central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-2xl font-bold text-white/90 tracking-tight font-mono">100%</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium mt-1">TOTAL</span>
          </div>
        </div>

        {/* COLUMNA 2: LEYENDA (Colores Arreglados) */}
        <div className="space-y-3 flex flex-col justify-center pl-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between group w-full cursor-default border-b border-gray-800/30 pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-3 overflow-hidden">
                {/* 
                   FIX DE COLORES:
                   1. Eliminé el 'ring-2' que tapaba el color.
                   2. Aumenté ligeramente el tamaño a 'w-3 h-3'.
                   3. Agregué boxShadow inline para dar un efecto de brillo (glow).
                */}
                <div 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}50` // 50 es opacidad hex para el glow
                  }}
                ></div>
                <span className="text-xs text-gray-400 font-medium truncate group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-bold text-white font-mono ml-2 tabular-nums">
                {item.value}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}