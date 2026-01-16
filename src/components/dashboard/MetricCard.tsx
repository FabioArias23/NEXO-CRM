import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  loading?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  onClick,
  loading = false 
}: MetricCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-gray-950 border border-gray-900 rounded-xl p-6 hover:border-gray-800 transition-all ${
        onClick ? 'cursor-pointer group' : ''
      } ${loading ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gray-900 rounded-lg transition-colors ${
          onClick ? 'group-hover:bg-gray-800' : ''
        }`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-green-400' : trend.value === 0 ? 'text-gray-500' : 'text-red-400'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend.value === 0 ? (
              <Minus className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl text-white mb-1">
          {loading ? '...' : value}
        </h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

interface MetricCardGridProps {
  children: ReactNode;
}

export function MetricCardGrid({ children }: MetricCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
}
