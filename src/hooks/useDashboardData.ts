import { useState, useMemo } from 'react';

// --- TIPOS ---
export interface KPIMetrics {
  totalPremium: number;
  policyCount: number;
  claimsCount: number;
  renewalsCount: number;
  avgTicket: number;
}

export interface Renewal {
  id: number;
  client: string;
  clientName?: string;
  policy: string;
  type?: string;
  date: string;
  renewalDate?: string;
  amount: number;
  premium?: number;
  risk: 'high' | 'medium' | 'low';
}

// --- DATOS MOCK ---
const SALES_TREND = [
  { name: 'Ene', auto: 4000, vida: 2400 },
  { name: 'Feb', auto: 3000, vida: 1398 },
  { name: 'Mar', auto: 2000, vida: 9800 },
  { name: 'Abr', auto: 2780, vida: 3908 },
  { name: 'May', auto: 1890, vida: 4800 },
  { name: 'Jun', auto: 2390, vida: 3800 },
  { name: 'Jul', auto: 3490, vida: 4300 },
];

// Datos para Gráfico de Torta (Distribución)
const DISTRIBUTION_DATA = [
  { name: 'Automotor', value: 45, color: '#3b82f6' }, // Blue
  { name: 'Vida & Retiro', value: 30, color: '#10b981' }, // Emerald
  { name: 'ART', value: 15, color: '#8b5cf6' }, // Purple
  { name: 'Otros', value: 10, color: '#f59e0b' }, // Amber
];

// Datos para Gráfico de Barras (Ventas por Canal)
const CHANNEL_DATA = [
  { name: 'Directo', ventas: 120 },
  { name: 'Referidos', ventas: 85 },
  { name: 'Web', ventas: 45 },
  { name: 'Brokers', ventas: 30 },
];

const RENEWALS_MOCK: Renewal[] = [
  { id: 1, client: 'Logística Norte S.A.', policy: 'Flota Camiones', date: '2026-01-12', amount: 450000, risk: 'high' },
  { id: 2, client: 'Juan Pérez', policy: 'Todo Riesgo - Ranger', date: '2026-01-15', amount: 85000, risk: 'low' },
  { id: 3, client: 'Tech Solutions', policy: 'ART Colectivo', date: '2026-01-20', amount: 1200000, risk: 'medium' },
  { id: 4, client: 'María González', policy: 'Combinado Familiar', date: '2026-01-22', amount: 45000, risk: 'low' },
  { id: 5, client: 'Constructora del Valle', policy: 'Caución Obra', date: '2026-01-25', amount: 890000, risk: 'high' },
];

export function useDashboardData() {
  const [timeRange, setTimeRange] = useState('Este Mes');

  const kpi = useMemo(() => ({
    totalPremium: 12450000,
    policyCount: 1245,
    claimsCount: 23,
    renewalsCount: 45,
    avgTicket: 10000 
  }), [timeRange]);

  // Memorizamos los datos para evitar re-renders innecesarios
  const chartData = useMemo(() => SALES_TREND, []);
  const distributionData = useMemo(() => DISTRIBUTION_DATA, []);
  const channelData = useMemo(() => CHANNEL_DATA, []);
  
  const renewals = useMemo(() => {
    return RENEWALS_MOCK.map(item => ({
      ...item,
      clientName: item.client, 
      type: item.policy,
      renewalDate: item.date,
      premium: item.amount
    }));
  }, [timeRange]);

  const exportToExcel = () => {
    const headers = ['ID', 'Cliente', 'Póliza', 'Fecha Vencimiento', 'Monto', 'Riesgo'];
    const rows = renewals.map(r => [
      r.id, `"${r.client}"`, `"${r.policy}"`, r.date, r.amount, r.risk
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${timeRange.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    timeRange,
    setTimeRange,
    kpi,
    chartData,
    distributionData,
    channelData,
    renewals,
    exportToExcel
  };
}