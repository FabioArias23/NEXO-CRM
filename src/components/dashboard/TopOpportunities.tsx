import { useMemo, useState } from "react";
import { Opportunity } from "../../core/types";
import { Building2, User, Calendar } from "lucide-react";
import { OpportunityModal } from "../modals/OpportunityModal";

interface TopOpportunitiesProps {
  opportunities: Opportunity[];
}

export function TopOpportunities({ opportunities }: TopOpportunitiesProps) {
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  const topOpps = useMemo(() => {
    return [...opportunities]
      .filter(
        (opp) => !["Cerrado Ganado", "Cerrado Perdido"].includes(opp.stage),
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [opportunities]);

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      Prospecto: "bg-gray-800 text-gray-300",
      Calificado: "bg-gray-700 text-gray-200",
      Propuesta: "bg-gray-600 text-white",
      Negociación: "bg-gray-500 text-white",
      "Cerrado Ganado": "bg-white text-black",
      "Cerrado Perdido": "bg-gray-900 text-gray-500",
    };
    return colors[stage] || "bg-gray-700 text-gray-300";
  };

  return (
    <>
      <div className="bg-gray-950 border border-gray-900 rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg text-white mb-1">Top Oportunidades</h3>
          <p className="text-sm text-gray-500">
            Mayor valor en pipeline activo
          </p>
        </div>

        {topOpps.length > 0 ? (
          <div className="space-y-4">
            {topOpps.map((opp) => (
              <div
                key={opp.id}
                onClick={() => setSelectedOpportunity(opp)}
                className="p-4 border border-gray-900 rounded-lg hover:border-gray-700 hover:bg-gray-900 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm text-white">{opp.name}</h4>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${getStageColor(opp.stage)}`}
                      >
                        {opp.stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>{opp.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{opp.contact}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-white">
                    ${opp.value.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Probabilidad</span>
                    <span>{opp.probability}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5">
                    <div
                      className="bg-white h-1.5 rounded-full transition-all"
                      style={{ width: `${opp.probability}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Cierre:{" "}
                        {new Date(opp.closeDate).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                    <span>Por: {opp.ownerName.split(" ")[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <p className="text-sm">No hay oportunidades activas</p>
            <p className="text-xs mt-1">
              Crea una nueva oportunidad para comenzar
            </p>
          </div>
        )}
      </div>

      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </>
  );
}
