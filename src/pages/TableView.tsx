import { useState, useMemo } from "react";
import { useOpportunities } from "../hooks/useOpportunities";
import { Opportunity } from "../core/types";
import { OpportunityModal } from "../components/modals/OpportunityModal";
import { ExportButton } from "../components/table/ExportButton";
import {
  ColumnSelector,
  ColumnConfig,
} from "../components/table/ColumnSelector";
import {
  AdvancedFilters,
  FilterRule,
} from "../components/table/AdvancedFilters";
import { QuickStats } from "../components/table/QuickStats";
import {
  Search,
  ArrowUpDown,
  User,
  Clock,
  Loader2,
  Filter,
  Download,
} from "lucide-react";

export function TableView() {
  const { opportunities, loading } = useOpportunities();
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [advancedFilters, setAdvancedFilters] = useState<FilterRule[]>([]);
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "name", label: "Nombre", visible: true },
    { key: "value", label: "Valor", visible: true },
    { key: "stage", label: "Etapa", visible: true },
    { key: "company", label: "Empresa", visible: true },
    { key: "contact", label: "Contacto", visible: true },
    { key: "owner", label: "Propietario", visible: true },
    { key: "modified", label: "Última Modificación", visible: true },
    { key: "probability", label: "Probabilidad", visible: false },
    { key: "closeDate", label: "Fecha de Cierre", visible: false },
  ]);

  const toggleColumn = (key: string) => {
    setColumns(
      columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        const matchesSearch =
          opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.contact.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStage = stageFilter === "all" || opp.stage === stageFilter;

        const matchesAdvancedFilters = advancedFilters.every((rule) => {
          const value = opp[rule.field];
          switch (rule.operator) {
            case "equals":
              return value === rule.value;
            case "contains":
              return value.toLowerCase().includes(rule.value.toLowerCase());
            case "greaterThan":
              return value > rule.value;
            case "lessThan":
              return value < rule.value;
            default:
              return true;
          }
        });

        return matchesSearch && matchesStage && matchesAdvancedFilters;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
  }, [
    opportunities,
    searchQuery,
    stageFilter,
    advancedFilters,
    sortField,
    sortDirection,
  ]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando tabla de oportunidades...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl text-white mb-1 truncate">
              Vista de Tabla
            </h1>
            <p className="text-gray-500 text-sm sm:text-base truncate">
              {filteredOpportunities.length} oportunidades totales
            </p>
          </div>
        </div>

        {}
        <QuickStats opportunities={filteredOpportunities} />

        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative w-full sm:flex-1 sm:max-w-md">
                <Search className="w-5 h-5 shrink-0 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, empresa o contacto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>

              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600 text-sm"
              >
                <option value="all">Todas las Etapas</option>
                <option value="Prospecto">Prospecto</option>
                <option value="Calificado">Calificado</option>
                <option value="Propuesta">Propuesta</option>
                <option value="Negociación">Negociación</option>
                <option value="Cerrado Ganado">Cerrado Ganado</option>
                <option value="Cerrado Perdido">Cerrado Perdido</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`p-2 border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors ${
                  showAdvancedFilters
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Filter className="w-5 h-5 shrink-0" />
              </button>
              <ColumnSelector columns={columns} onToggle={toggleColumn} />
              <ExportButton opportunities={filteredOpportunities} />
            </div>
          </div>
        </div>

        {}
        {showAdvancedFilters && (
          <AdvancedFilters
            filters={advancedFilters}
            onChange={setAdvancedFilters}
          />
        )}

        <div className="bg-gray-950 border border-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-800">
                <tr>
                  {columns
                    .filter((col) => col.visible)
                    .map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-4 text-left text-sm text-gray-400"
                      >
                        {col.label}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.length > 0 ? (
                  filteredOpportunities.map((opp) => (
                    <tr
                      key={opp.id}
                      onClick={() => setSelectedOpportunity(opp)}
                      className="border-b border-gray-900 hover:bg-gray-900 cursor-pointer transition-colors"
                    >
                      {columns.find((c) => c.key === "name")?.visible && (
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-white">{opp.name}</p>
                            <p className="text-xs text-gray-600">
                              Cierre:{" "}
                              {new Date(opp.closeDate).toLocaleDateString(
                                "es-ES",
                              )}
                            </p>
                          </div>
                        </td>
                      )}
                      {columns.find((c) => c.key === "value")?.visible && (
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-white">
                              ${opp.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">
                              {opp.probability}% prob.
                            </p>
                          </div>
                        </td>
                      )}
                      {columns.find((c) => c.key === "stage")?.visible && (
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs rounded ${getStageColor(
                              opp.stage,
                            )}`}
                          >
                            {opp.stage}
                          </span>
                        </td>
                      )}
                      {columns.find((c) => c.key === "company")?.visible && (
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {opp.company}
                        </td>
                      )}
                      {columns.find((c) => c.key === "contact")?.visible && (
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {opp.contact}
                        </td>
                      )}
                      {columns.find((c) => c.key === "owner")?.visible && (
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 shrink-0 text-gray-500 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-300 truncate">
                                {opp.owner.name}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {opp.owner.email}
                              </p>
                            </div>
                          </div>
                        </td>
                      )}
                      {columns.find((c) => c.key === "modified")?.visible && (
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 shrink-0 text-gray-500 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-300 truncate">
                                {opp.lastModifiedByName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {new Date(opp.updatedAt).toLocaleString(
                                  "es-ES",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                      )}
                      {columns.find((c) => c.key === "probability")
                        ?.visible && (
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {opp.probability}%
                        </td>
                      )}
                      {columns.find((c) => c.key === "closeDate")?.visible && (
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {new Date(opp.closeDate).toLocaleDateString("es-ES")}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.filter((c) => c.visible).length}
                      className="px-6 py-12 text-center"
                    >
                      <p className="text-gray-600">
                        No se encontraron oportunidades
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {searchQuery || stageFilter !== "all"
                          ? "Intenta ajustar tus filtros"
                          : "Crea tu primera oportunidad"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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


