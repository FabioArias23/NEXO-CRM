import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Opportunity } from "../../core/types";

interface PipelineDistributionProps {
  opportunities: Opportunity[];
}

const STAGE_COLORS: Record<string, string> = {
  Prospecto: "#e5e7eb",
  Calificado: "#d1d5db",
  Propuesta: "#9ca3af",
  Negociación: "#6b7280",
  "Cerrado Ganado": "#ffffff",
  "Cerrado Perdido": "#4b5563",
};

export function PipelineDistribution({
  opportunities,
}: PipelineDistributionProps) {
  const chartData = useMemo(() => {
    const stageCounts = opportunities.reduce(
      (acc, opp) => {
        acc[opp.stage] = (acc[opp.stage] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(stageCounts).map(([name, value]) => ({
      name,
      value,
      color: STAGE_COLORS[name] || "#9ca3af",
    }));
  }, [opportunities]);

  return (
    <div className="bg-gray-950 border border-gray-900 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg text-white mb-1">Distribución del Pipeline</h3>
        <p className="text-sm text-gray-500">Por etapa de negocio</p>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-600 text-sm">No hay datos disponibles</p>
        </div>
      )}
    </div>
  );
}


