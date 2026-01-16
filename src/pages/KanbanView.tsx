import { useState, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useOpportunities } from "../hooks/useOpportunities";
import { Opportunity } from "../core/types";
import { OpportunityModal } from "../components/modals/OpportunityModal";
import {
  Loader2,
  GripVertical,
  Building2,
  User,
  Calendar,
  Plus,
  Search,
  Filter,
  X,
  Users,
  DollarSign,
  TrendingUp,
  Edit2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const stages = [
  "Prospecto",
  "Calificado",
  "Propuesta",
  "Negociación",
  "Cerrado Ganado",
  "Cerrado Perdido",
];

// Colores para la barrita lateral de cada Stage (decorativo)
const getStageAccentColor = (stage: string) => {
  const colors: Record<string, string> = {
    Prospecto: "border-gray-400",
    Calificado: "border-blue-500",
    Propuesta: "border-purple-500",
    Negociación: "border-orange-500",
    "Cerrado Ganado": "border-green-500",
    "Cerrado Perdido": "border-red-500",
  };
  return colors[stage] || "border-gray-400";
};

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
  onQuickEdit: (e: React.MouseEvent) => void;
}

function OpportunityCard({
  opportunity,
  onClick,
  onQuickEdit,
}: OpportunityCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "opportunity",
    item: { id: opportunity.id, currentStage: opportunity.stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-3 bg-card border border-border/60 rounded-lg shadow-sm hover:shadow-md hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all group relative select-none mb-2"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate flex-1">
            {opportunity.name}
          </h4>
          <button
            onClick={onQuickEdit}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded transition-all shrink-0"
            title="Edición rápida"
          >
            <Edit2 className="w-3 h-3 shrink-0 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
          <Building2 className="w-3 h-3 shrink-0" />
          <span className="truncate">{opportunity.company}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-1 gap-2">
          <span className="text-xs font-bold text-foreground bg-accent/50 px-1.5 py-0.5 rounded truncate">
            ${opportunity.value.toLocaleString()}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>
              {new Date(
                opportunity.close_date || new Date(),
              ).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StageColumnProps {
  stage: string;
  opportunities: Opportunity[];
  onDrop: (opportunityId: string, newStage: string) => void;
  onCardClick: (opp: Opportunity) => void;
  onQuickEdit: (opp: Opportunity) => void;
  onAddNew: () => void;
}

function StageColumn({
  stage,
  opportunities,
  onDrop,
  onCardClick,
  onQuickEdit,
  onAddNew,
}: StageColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "opportunity",
    drop: (item: { id: string; currentStage: string }) => {
      if (item.currentStage !== stage) {
        onDrop(item.id, stage);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div className="flex-shrink-0 w-72 sm:w-80 h-full flex flex-col min-w-0">
      {/* 
         CAMBIO PRINCIPAL: "LA CAJA"
         Usamos bg-muted/50 (gris claro) para toda la columna.
         Esto crea el efecto "carril" visualmente sólido.
      */}
      <div
        ref={drop as any}
        className={`
          flex flex-col h-full rounded-xl border border-border bg-muted/40 dark:bg-muted/10 overflow-hidden
          ${isOver ? "ring-2 ring-primary/50 bg-primary/5" : ""}
        `}
      >
        {/* Header de la Columna */}
        <div
          className={`p-3 bg-background/50 border-b border-border backdrop-blur-sm sticky top-0 z-10 border-t-4 ${getStageAccentColor(stage)}`}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-foreground">{stage}</h3>
            <span className="text-xs font-medium text-muted-foreground bg-background border border-border px-2 py-0.5 rounded-full">
              {opportunities.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              Total
            </span>
            <span className="text-xs font-mono font-medium text-foreground opacity-80">
              ${totalValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Cuerpo Scrollable */}
        <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onClick={() => onCardClick(opp)}
              onQuickEdit={(e) => {
                e.stopPropagation();
                onQuickEdit(opp);
              }}
            />
          ))}

          {/* Botón Añadir al final de la lista */}
          <button
            onClick={onAddNew}
            className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-lg transition-colors mt-2 border border-transparent hover:border-border"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Añadir tarjeta</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function KanbanView() {
  const { opportunities, loading, updateOpportunity } = useOpportunities();
  const { user, isAdmin } = useAuth();
  const [selectedOpportunity, setSelectedOpportunity] = useState<
    Opportunity | null | undefined
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterByUser, setFilterByUser] = useState(false);

  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.name.toLowerCase().includes(search) ||
          opp.company.toLowerCase().includes(search) ||
          opp.contact.toLowerCase().includes(search),
      );
    }

    if ((!isAdmin || filterByUser) && user) {
      filtered = filtered.filter((opp) => opp.owner_id === user.id);
    }

    return filtered;
  }, [opportunities, searchTerm, isAdmin, filterByUser, user]);

  const opportunitiesByStage = useMemo(() => {
    return stages.reduce(
      (acc, stage) => {
        acc[stage] = filteredOpportunities.filter((opp) => opp.stage === stage);
        return acc;
      },
      {} as Record<string, Opportunity[]>,
    );
  }, [filteredOpportunities]);

  const handleDrop = async (opportunityId: string, newStage: string) => {
    try {
      await updateOpportunity(opportunityId, { stage: newStage as any });
    } catch (error) {
      console.error("Error updating opportunity stage:", error);
    }
  };

  const totalPipelineValue = useMemo(() => {
    return filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  }, [filteredOpportunities]);

  const weightedValue = useMemo(() => {
    return filteredOpportunities.reduce(
      (sum, opp) => sum + (opp.value * opp.probability) / 100,
      0,
    );
  }, [filteredOpportunities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="p-4 sm:p-6 h-full flex flex-col bg-background text-foreground transition-colors duration-300">
          {/* Header Superior */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 truncate">
                Pipeline Kanban
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md whitespace-nowrap">
                  <DollarSign className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-foreground font-medium">
                    ${totalPipelineValue.toLocaleString()}
                  </span>{" "}
                  Total
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md whitespace-nowrap">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-foreground font-medium">
                    ${Math.round(weightedValue).toLocaleString()}
                  </span>{" "}
                  Pond.
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-foreground font-medium">
                    {filteredOpportunities.length}
                  </span>{" "}
                  Deals
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="pl-9 pr-8 py-2 bg-card border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent rounded-full"
                  >
                    <X className="w-3 h-3 shrink-0 text-muted-foreground" />
                  </button>
                )}
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors border ${
                    showFilters
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-input hover:bg-accent text-muted-foreground"
                  }`}
                >
                  <Filter className="w-5 h-5 shrink-0" />
                </button>
              )}
            </div>
          </div>

          {showFilters && isAdmin && (
            <div className="bg-card border border-border rounded-xl p-3 mb-4 shadow-sm animate-in slide-in-from-top-1">
              <label className="flex items-center gap-2 cursor-pointer w-fit p-1.5 hover:bg-accent rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={filterByUser}
                  onChange={(e) => setFilterByUser(e.target.checked)}
                  className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  Mostrar solo mis oportunidades
                </span>
              </label>
            </div>
          )}

          {/* ÁREA DE COLUMNAS (SCROLL HORIZONTAL) */}
          <div className="flex-1 overflow-x-auto pb-2 -mx-6 px-6">
            <div className="flex gap-4 h-full min-w-max pb-2">
              {stages.map((stage) => (
                <StageColumn
                  key={stage}
                  stage={stage}
                  opportunities={opportunitiesByStage[stage] || []}
                  onDrop={handleDrop}
                  onCardClick={setSelectedOpportunity}
                  onQuickEdit={setSelectedOpportunity}
                  onAddNew={() => setSelectedOpportunity(undefined)}
                />
              ))}
            </div>
          </div>
        </div>
      </DndProvider>

      {selectedOpportunity !== null && (
        <OpportunityModal
          opportunity={selectedOpportunity || undefined}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </>
  );
}
