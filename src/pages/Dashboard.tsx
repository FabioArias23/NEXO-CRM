import React from 'react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp, Users, AlertCircle, Calendar, 
  DollarSign, Shield, ArrowUpRight, ArrowDownRight,
  Activity, FileText, Filter, Download, ChevronRight, PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
// Solo importamos lo necesario para el AreaChart principal, el resto va en los componentes hijos
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import { useDashboardData } from '../hooks/useDashboardData';

// IMPORTANTE: Asegúrate de tener estos archivos creados en src/components/dashboard/
import { PortfolioDistributionCard } from '../components/dashboard/PortfolioDistributionCard';
import { SalesChannelChart } from '../components/dashboard/SalesChannelChart';

export function Dashboard() {
  const navigate = useNavigate();
  
  const { 
    timeRange, 
    setTimeRange, 
    kpi, 
    chartData, 
    distributionData,
    channelData,
    renewals,
    exportToExcel
  } = useDashboardData();

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

  return (
<div className="min-h-screen bg-background text-foreground p-6 md:p-8 font-sans overflow-y-auto pb-20">      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Ejecutivo</h1>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider font-medium">
            Resumen Operativo &bull; {new Date().getFullYear()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 group-hover:text-white transition-colors">
                <Filter className="w-3.5 h-3.5" />
             </div>
             <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-900 border border-gray-800 text-xs font-medium rounded-lg pl-4 pr-10 py-2.5 appearance-none focus:outline-none focus:border-blue-600 focus:bg-gray-800 transition-all cursor-pointer hover:border-gray-700 text-gray-300 w-40"
             >
                <option>Esta Semana</option>
                <option>Este Mes</option>
                <option>Este Trimestre</option>
                <option>Este Año</option>
             </select>
          </div>
          <button 
            onClick={exportToExcel}
            className="bg-white hover:bg-gray-200 text-black px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">Exportar Datos</span>
          </button>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard 
          title="Primas Emitidas" 
          value={formatCurrency(kpi.totalPremium)} 
          trend="+15%" 
          trendUp={true} 
          icon={DollarSign} 
          accentColor="emerald"
        />
        <KPICard 
          title="Pólizas Activas" 
          value={kpi.policyCount} 
          trend="+8" 
          trendUp={true} 
          icon={FileText} 
          accentColor="blue"
        />
        <KPICard 
          title="Ticket Promedio" 
          value={formatCurrency(kpi.avgTicket)} 
          trend="-0.4%" 
          trendUp={false} 
          icon={PieChartIcon} 
          accentColor="purple"
        />
        <KPICard 
          title="Siniestralidad" 
          value="14.2%" 
          trend="-2.1%" 
          trendUp={false} 
          goodTrend={true} 
          icon={Shield} 
          accentColor="orange"
        />
      </div>

      {/* --- FILA 1: EVOLUCIÓN (AREA) + VENCIMIENTOS (LISTA) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Gráfico de Evolución de Primas */}
        <div className="lg:col-span-2 bg-[#09090b] border border-gray-800 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-gray-700 transition-colors">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

           <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                 <Activity className="w-4 h-4 text-blue-500" /> Evolución de Primas
              </h3>
              <div className="flex gap-3">
                 <LegendItem color="bg-blue-500" label="Automotor" />
                 <LegendItem color="bg-emerald-500" label="Vida" />
              </div>
           </div>
           
           <div className="h-[300px] w-full relative z-10">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorVida" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                 <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                 <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                 />
                 <Area type="monotone" dataKey="auto" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAuto)" />
                 <Area type="monotone" dataKey="vida" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVida)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Lista de Vencimientos */}
        <div className="bg-[#09090b] border border-gray-800 rounded-2xl flex flex-col h-full overflow-hidden hover:border-gray-700 transition-colors min-h-[350px]">
           <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-black/20">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-purple-500" /> Próx. Vencimientos
              </h3>
              <button 
                onClick={() => navigate('/base/policies')}
                className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1 group"
              >
                Ver Todo <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {renewals.map((item) => (
                 <div key={item.id} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-all cursor-pointer border border-transparent hover:border-gray-800">
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 group-hover:border-gray-700 transition-colors shrink-0">
                       <span className="text-[9px] text-gray-500 uppercase font-bold">ENE</span>
                       <span className="text-sm font-bold text-white">{new Date(item.date).getDate() + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xs font-bold text-gray-300 truncate group-hover:text-white transition-colors">{item.client}</p>
                       <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.policy}</p>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-xs font-mono font-medium text-gray-300 group-hover:text-emerald-400 transition-colors">{formatCurrency(item.amount)}</p>
                       <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                         item.risk === 'high' ? 'bg-red-900/20 text-red-400 border-red-900/30' : 
                         item.risk === 'medium' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30' :
                         'bg-green-900/20 text-green-400 border-green-900/30'
                       }`}>
                         {item.risk === 'high' ? 'Alto' : item.risk === 'medium' ? 'Medio' : 'Bajo'}
                       </span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- FILA 2: DATA ANALYTICS (CORREGIDA) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Usamos el componente externo para arreglar el problema de superposición */}
        <PortfolioDistributionCard data={distributionData} />

        {/* Usamos el componente externo para el gráfico de barras */}
        <SalesChannelChart data={channelData} />

      </div>

      {/* --- RANKING ASESORES --- */}
      <div className="bg-[#09090b] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
         <div className="flex items-center justify-between mb-6">
           <h3 className="font-bold text-gray-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Rendimiento del Equipo
           </h3>
           <button className="text-xs text-blue-500 hover:text-blue-400 font-medium">Ver ranking completo</button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdvisorCard name="Juan Pérez" role="Senior" sales={12} amount="$4.5M" progress={85} image="JP" color="emerald" />
            <AdvisorCard name="Florencia Diaz" role="Senior" sales={9} amount="$3.2M" progress={65} image="FD" color="blue" />
            <AdvisorCard name="Cecilia M." role="Junior" sales={15} amount="$2.1M" progress={92} image="CM" color="purple" />
         </div>
      </div>

    </div>
  );
}

// --- SUBCOMPONENTES LOCALES ---

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  goodTrend?: boolean;
  subtext?: string;
  icon: any;
  accentColor: 'blue' | 'emerald' | 'purple' | 'orange';
}

function KPICard({ title, value, trend, trendUp, goodTrend = true, subtext, icon: Icon, accentColor }: KPICardProps) {
  const isPositive = goodTrend ? trendUp : !trendUp;
  // Usamos colores semánticos más vibrantes
  const trendColor = isPositive 
    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
    : 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
  const TrendIcon = trendUp ? ArrowUpRight : ArrowDownRight;

  // Mapas de colores para gradientes sutiles de fondo y bordes
  const styles = {
    blue:   { 
      bg: 'from-blue-500/5 to-transparent', 
      icon: 'text-blue-400 bg-blue-500/10 ring-1 ring-blue-500/20', 
      border: 'hover:border-blue-500/30' 
    },
    emerald:{ 
      bg: 'from-emerald-500/5 to-transparent', 
      icon: 'text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20', 
      border: 'hover:border-emerald-500/30' 
    },
    purple: { 
      bg: 'from-purple-500/5 to-transparent', 
      icon: 'text-purple-400 bg-purple-500/10 ring-1 ring-purple-500/20', 
      border: 'hover:border-purple-500/30' 
    },
    orange: { 
      bg: 'from-orange-500/5 to-transparent', 
      icon: 'text-orange-400 bg-orange-500/10 ring-1 ring-orange-500/20', 
      border: 'hover:border-orange-500/30' 
    },
  };

  const style = styles[accentColor];

return (
    <div className={`
      relative overflow-hidden rounded-2xl border border-gray-800 bg-[#09090b] p-5
      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50
      ${style.border} group
    `}>
      {/* Gradiente de fondo sutil al hacer hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10 flex justify-between items-start mb-4">
        {/* Icono con anillo brillante */}
        <div className={`p-2.5 rounded-xl ${style.icon} transition-transform group-hover:scale-110 duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        
        {/* Badge de tendencia */}
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${trendColor}`}>
            <TrendIcon className="w-3 h-3" /> {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-extrabold text-white tracking-tight mb-1">{value}</h3>
        <div className="flex items-center justify-between mt-2">
           <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
           {subtext && <span className="text-[10px] text-gray-500">{subtext}</span>}
        </div>
      </div>
    </div>
  );
}


function LegendItem({ color, label }: { color: string, label: string }) {
   return (
      <div className="flex items-center gap-2">
         <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
         <span className="text-xs font-medium text-gray-400">{label}</span>
      </div>
   )
}

function AdvisorCard({ name, role, sales, amount, progress, image, color }: any) {
  const barColors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

   return (
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/30 border border-gray-800/50 hover:bg-gray-900 transition-all hover:border-gray-700">
         <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400 border border-gray-700 shrink-0">
            {image}
         </div>
         <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
               <h4 className="text-sm font-bold text-white truncate">{name}</h4>
               <span className="text-xs font-mono text-gray-300">{amount}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] text-gray-500 uppercase tracking-wide">{role} &bull; {sales} ventas</span>
               <span className="text-[10px] text-gray-500">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
               <div className={`h-full rounded-full ${barColors[color as keyof typeof barColors] || 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
            </div>
         </div>
      </div>
   )
}