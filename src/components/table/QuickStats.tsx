import { Opportunity } from "../../core/types";
import { DollarSign, TrendingUp, Target, Users } from "lucide-react";

interface QuickStatsProps {
  opportunities: Opportunity[];
}

export function QuickStats({ opportunities }: QuickStatsProps) {
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const avgValue =
    opportunities.length > 0 ? totalValue / opportunities.length : 0;
  const avgProbability =
    opportunities.length > 0
      ? opportunities.reduce((sum, opp) => sum + opp.probability, 0) /
        opportunities.length
      : 0;
  const activeCount = opportunities.filter(
    (opp) => !["Cerrado Ganado", "Cerrado Perdido"].includes(opp.stage),
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        title="Total Pipeline"
        value={`$${totalValue.toLocaleString()}`}
        icon={DollarSign}
        color="text-emerald-500"
        bg="bg-emerald-500/10"
      />
      <StatCard
        title="Promedio"
        value={`$${Math.round(avgValue).toLocaleString()}`}
        icon={TrendingUp}
        color="text-blue-500"
        bg="bg-blue-500/10"
      />
      <StatCard
        title="Prob. Promedio"
        value={`${Math.round(avgProbability)}%`}
        icon={Target}
        color="text-purple-500"
        bg="bg-purple-500/10"
      />
      <StatCard
        title="Oportunidades Activas"
        value={activeCount.toString()}
        icon={Users}
        color="text-orange-500"
        bg="bg-orange-500/10"
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between hover:border-primary/20 transition-all min-w-0">
      <div className="min-w-0 flex-1 mr-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 truncate">
          {title}
        </p>
        <p className="text-xl font-bold text-foreground truncate">{value}</p>
      </div>
      <div className={`p-2.5 rounded-lg ${bg} shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  );
}
