import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ModernMetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean; // true = positivo (verde), false = negativo (rojo)
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'purple' | 'orange'; // Colores semánticos
}

export function ModernMetricCard({ title, value, trend, trendUp, icon: Icon, color }: ModernMetricCardProps) {
  // Mapas de colores para manejar estilos dinámicos
  const colorMap = {
    blue:   { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'hover:border-blue-500/50' },
    emerald:{ bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'hover:border-emerald-500/50' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'hover:border-purple-500/50' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'hover:border-orange-500/50' },
  };
  
  const theme = colorMap[color];
  const TrendIcon = trendUp ? ArrowUpRight : ArrowDownRight;
  const trendColor = trendUp ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className={`
      relative overflow-hidden rounded-xl border border-gray-800 bg-[#09090b] p-6
      transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50 ${theme.border}
      group
    `}>
      {/* Efecto de brillo en el fondo */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${theme.bg} blur-2xl opacity-20 transition-opacity group-hover:opacity-40`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-lg border border-gray-800/50 ${theme.bg}`}>
          <Icon className={`w-5 h-5 ${theme.text}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-gray-900 border border-gray-800 ${trendColor}`}>
             <TrendIcon className="w-3 h-3" /> {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{title}</p>
      </div>
    </div>
  );
}