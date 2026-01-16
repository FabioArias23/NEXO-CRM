import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, MoreHorizontal } from 'lucide-react';

interface DataItem {
  name: string;
  ventas: number;
}

interface Props {
  data: DataItem[];
}

export function SalesChannelChart({ data }: Props) {
  return (
    <div className="bg-[#09090b] border border-gray-800 rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <BarChart3 className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Canales de Venta</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rendimiento</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Gráfico */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            barCategoryGap={15} // Espacio entre barras
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="#52525b" fontSize={10} hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#a1a1aa" 
              fontSize={11} 
              width={70} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #333', color: '#fff', fontSize: '12px' }}
              formatter={(value) => [value, 'Ventas']}
            />
            <Bar dataKey="ventas" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} 
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}