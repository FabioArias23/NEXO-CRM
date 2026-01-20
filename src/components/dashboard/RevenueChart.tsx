import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Opportunity } from "../../core/types";

interface RevenueChartProps {
  opportunities: Opportunity[];
}

export function RevenueChart({ opportunities }: RevenueChartProps) {
  const chartData = useMemo(() => {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const currentMonth = new Date().getMonth();

    return months.map((month, index) => {
      const baseValue = 40000 + index * 5000;
      const variance = Math.random() * 15000;

      return {
        month,
        valor: Math.round(baseValue + variance),
        proyectado: baseValue + 10000,
        actual: index <= currentMonth,
      };
    });
  }, []);

  return (
    <div className="bg-gray-950 border border-gray-900 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg text-white mb-1">Tendencia de Ingresos</h3>
        <p className="text-sm text-gray-500">Proyección anual del pipeline</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#fff",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#ffffff"
              strokeWidth={2}
              fill="url(#colorValor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <span className="text-sm text-gray-500">Valor del Pipeline</span>
        </div>
      </div>
    </div>
  );
}


