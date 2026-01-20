import {
  AlignLeft,
  ArrowUpDown,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Grid3X3,
  List,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Table as TableIcon,
  User,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { ClientRecord, RecordDrawer } from "../components/modals/RecordDrawer";
import consultoriaMockData from "../data/mocks/consultoria.json";


interface ColumnDef {
  key: keyof ClientRecord;
  label: string;
  icon: any;
  width: string;
  minWidth: number;
}

const ALL_COLUMNS: ColumnDef[] = [
  {
    key: "fechaCarga",
    label: "FECHA CARGA",
    icon: Calendar,
    width: "w-32",
    minWidth: 120,
  },
  { key: "caller", label: "CALLER", icon: User, width: "w-32", minWidth: 120 },
  {
    key: "derivados",
    label: "DERIVADOS",
    icon: CheckSquare,
    width: "w-24",
    minWidth: 100,
  },
  {
    key: "razonSocial",
    label: "RAZÓN SOCIAL",
    icon: AlignLeft,
    width: "w-64",
    minWidth: 250,
  },
  {
    key: "contacto",
    label: "CONTACTO",
    icon: User,
    width: "w-48",
    minWidth: 200,
  },
  { key: "tel1", label: "TELÉFONO", icon: Phone, width: "w-40", minWidth: 160 },
  {
    key: "status",
    label: "STATUS",
    icon: MoreHorizontal,
    width: "w-40",
    minWidth: 160,
  },
];

interface ViewConfig {
  id: string;
  name: string;
  icon: any;
  filters: Partial<ClientRecord>;
  groupBy?: keyof ClientRecord | null;
  description: string;
}

const VIEWS_CONFIG: ViewConfig[] = [
  {
    id: "all",
    name: "Base General",
    icon: Grid3X3,
    filters: {},
    description: "Todos los registros.",
    groupBy: "status",
  },
  {
    id: "juan",
    name: "Vista Juan",
    icon: TableIcon,
    filters: { caller: "Juan" },
    groupBy: "status",
    description: "Mis clientes.",
  },
  {
    id: "florencia",
    name: "Vista Florencia",
    icon: TableIcon,
    filters: { caller: "Florencia" },
    groupBy: "status",
    description: "Clientes de Florencia.",
  },
  {
    id: "cecilia",
    name: "Vista Cecilia",
    icon: TableIcon,
    filters: { caller: "Cecilia" },
    groupBy: "status",
    description: "Clientes de Cecilia.",
  },
];

export function ConsultoriaView() {

  const [records, setRecords] = useState<ClientRecord[]>(
    consultoriaMockData.clients as ClientRecord[],
  );
  const [activeViewId, setActiveViewId] = useState("juan");
  const [selectedRecord, setSelectedRecord] = useState<ClientRecord | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ClientRecord;
    direction: "asc" | "desc";
  } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.key as string),
  );
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  const activeViewConfig = useMemo(() => {
    return (
      VIEWS_CONFIG.find((view) => view.id === activeViewId) || VIEWS_CONFIG[0]
    );
  }, [activeViewId]);


  const processedRecords = useMemo(() => {
    let data = [...records];

    for (const key in activeViewConfig.filters) {
      if (activeViewConfig.filters.hasOwnProperty(key)) {
        data = data.filter(
          (record) =>
            record[key as keyof ClientRecord] ===
            activeViewConfig.filters[key as keyof ClientRecord],
        );
      }
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.razonSocial.toLowerCase().includes(lowerTerm) ||
          r.contacto.toLowerCase().includes(lowerTerm) ||
          r.tel1.includes(lowerTerm),
      );
    }

    if (sortConfig) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [records, activeViewConfig, searchTerm, sortConfig]);

  const groupedRecords = useMemo(() => {
    if (activeViewConfig.groupBy) {
      const groups: Record<string, ClientRecord[]> = {};
      const statusOrder = [
        "Nuevo",
        "Contactar Luego",
        "Contactado",
        "Cotizando",
        "Cerrado",
        "Cerrado Ganado",
      ];

      processedRecords.forEach((record) => {
        const key =
          (record[activeViewConfig.groupBy!] as string) || "Sin Agrupar";
        if (!groups[key]) groups[key] = [];
        groups[key].push(record);
      });

      return Object.keys(groups)
        .sort((a, b) => {
          if (activeViewConfig.groupBy === "status") {
            const idxA = statusOrder.indexOf(a);
            const idxB = statusOrder.indexOf(b);
            return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
          }
          return a.localeCompare(b);
        })
        .map((key) => ({
          groupName: key,
          items: groups[key],
        }));
    } else {
      return [{ groupName: "Todos los registros", items: processedRecords }];
    }
  }, [processedRecords, activeViewConfig.groupBy]);

  const handleAddRecord = () => {
    const newId = Math.max(...records.map((r) => r.id), 0) + 1;
    const today = new Date().toISOString().split("T")[0];
    let defaultCaller = "Sistema";
    if (activeViewConfig.filters.caller)
      defaultCaller = activeViewConfig.filters.caller as string;

    const newRecord: ClientRecord = {
      id: newId,
      fechaCarga: today,
      caller: defaultCaller,
      derivados: "",
      razonSocial: "NUEVO CLIENTE (Editar)",
      contacto: "",
      tel1: "",
      status: "Nuevo",
    };
    setRecords([...records, newRecord]);
    setSelectedRecord(newRecord);
  };

  const handleUpdateRecord = (id: number, field: string, value: any) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const toggleSort = (key: keyof ClientRecord) => {
    setSortConfig((current) => {
      if (current?.key === key && current.direction === "asc")
        return { key, direction: "desc" };
      return { key, direction: "asc" };
    });
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (

    <div className="flex flex-col h-full bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
      {}
      <div className="h-14 md:h-12 border-b border-border flex items-center justify-between px-4 bg-background flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer hover:bg-accent px-2 py-1 rounded truncate transition-colors">
            <h1 className="font-bold text-sm tracking-wide truncate">
              CONSULTORA MF 2
            </h1>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
          </div>
          <div className="h-4 w-px bg-border hidden md:block"></div>
          <div className="hidden md:flex gap-1 overflow-x-auto">
            <TabButton active>Datos</TabButton>
            <TabButton>Automatizaciones</TabButton>
            <TabButton>Interfaces</TabButton>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground mr-2 hidden sm:block">
            Guardado
          </span>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shadow-sm">
            Compartir
          </button>
        </div>
      </div>

      {}
      <div className="h-10 border-b border-border flex items-center px-2 bg-background overflow-x-auto scrollbar-hide flex-shrink-0">
        {VIEWS_CONFIG.slice(0, 3).map((view) => (
          <ViewTab
            key={view.id}
            label={view.name}
            active={activeViewId === view.id}
            onClick={() => setActiveViewId(view.id)}
          />
        ))}
        <button
          onClick={handleAddRecord}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-3 py-1 border-l border-border ml-2 whitespace-nowrap transition-colors"
        >
          <Plus className="w-3 h-3" /> Crear registro
        </button>
      </div>

      {}
      <div className="flex flex-1 overflow-hidden relative">
        {}
        <aside className="w-60 border-r border-border bg-card flex flex-col flex-shrink-0 hidden md:flex">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2 top-1.5 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en vista..."
                className="w-full bg-secondary border border-border rounded px-2 pl-7 py-1 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-4">
            <div>
              <p className="px-2 text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                <span className="text-yellow-500">★</span> Favoritos
              </p>
              <ViewItem
                label="Vista Florencia"
                icon={Grid3X3}
                active={activeViewId === "florencia"}
                onClick={() => setActiveViewId("florencia")}
              />
              <ViewItem
                label="Vista Cecilia"
                icon={Grid3X3}
                active={activeViewId === "cecilia"}
                onClick={() => setActiveViewId("cecilia")}
              />
            </div>

            <div>
              <p className="px-2 text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Vistas Personales
              </p>
              {VIEWS_CONFIG.map((view) => (
                <ViewItem
                  key={view.id}
                  label={view.name}
                  icon={view.icon}
                  active={activeViewId === view.id}
                  onClick={() => setActiveViewId(view.id)}
                />
              ))}
            </div>
          </div>
        </aside>

        {}
        <main className="flex-1 flex flex-col min-w-0 bg-background relative">
          {}
          <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-background overflow-x-auto scrollbar-hide flex-shrink-0">
            <div className="flex items-center gap-2 pr-4">
              <button className="flex items-center gap-1 px-2 py-1 hover:bg-accent rounded text-xs font-medium text-foreground whitespace-nowrap transition-colors">
                <activeViewConfig.icon className="w-4 h-4 text-blue-500" />
                <span className="font-bold">{activeViewConfig.name}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground ml-1" />
              </button>
              <div className="h-4 w-px bg-border mx-1 flex-shrink-0"></div>

              {}
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded hover:bg-accent text-xs transition-colors whitespace-nowrap ${showColumnMenu ? "bg-accent text-foreground" : "text-muted-foreground"}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {ALL_COLUMNS.length - visibleColumns.length > 0
                      ? `${ALL_COLUMNS.length - visibleColumns.length} ocultos`
                      : "Ocultar campos"}
                  </span>
                  <span className="sm:hidden">Campos</span>
                </button>

                {showColumnMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowColumnMenu(false)}
                    ></div>
                    <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-xl z-20 p-2 flex flex-col gap-1 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                      <p className="text-[10px] text-muted-foreground uppercase px-2 py-1">
                        Mostrar columnas
                      </p>
                      {ALL_COLUMNS.map((col) => (
                        <button
                          key={col.key as string}
                          onClick={() =>
                            toggleColumnVisibility(col.key as string)
                          }
                          className="flex items-center gap-2 px-2 py-1.5 text-xs text-foreground hover:bg-accent rounded text-left w-full transition-colors"
                        >
                          <div
                            className={`w-3 h-3 rounded-sm border flex items-center justify-center ${visibleColumns.includes(col.key as string) ? "bg-blue-600 border-blue-600" : "border-muted-foreground"}`}
                          >
                            {visibleColumns.includes(col.key as string) && (
                              <Check className="w-2 h-2 text-white" />
                            )}
                          </div>
                          {col.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <ToolButton
                icon={Filter}
                label="Filtrar"
                active={searchTerm !== ""}
              />
              <ToolButton
                icon={List}
                label="Agrupar"
                active={!!activeViewConfig.groupBy}
              />
              <ToolButton
                icon={ArrowUpDown}
                label="Ordenar"
                onClick={() => toggleSort("fechaCarga")}
                active={!!sortConfig}
              />
              <ToolButton icon={Download} label="Exportar" />
            </div>
          </div>

          {}
          <div className="flex-1 overflow-auto bg-background relative">
            <table className="w-full border-collapse text-xs table-fixed">
              <thead className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
                <tr>
                  <th className="w-10 border-r border-border p-2 text-center bg-background sticky left-0 z-20">
                    <input
                      type="checkbox"
                      className="rounded bg-secondary border-muted-foreground"
                    />
                  </th>
                  {ALL_COLUMNS.filter((c) =>
                    visibleColumns.includes(c.key as string),
                  ).map((col) => (
                    <HeaderCell
                      key={col.key as string}
                      icon={col.icon}
                      label={col.label}
                      width={col.width}
                      minWidth={col.minWidth}
                      isSorted={sortConfig?.key === col.key}
                      onClick={() => toggleSort(col.key)}
                    />
                  ))}
                  <th className="w-full bg-background border-b border-border"></th>
                </tr>
              </thead>
              <tbody>
                {groupedRecords.map((group) => (
                  <React.Fragment key={group.groupName}>
                    <tr className="bg-muted/30 sticky left-0 z-10">
                      <td colSpan={visibleColumns.length + 2} className="p-0">
                        <GroupHeader
                          label={group.groupName}
                          count={group.items.length}
                          isExpanded={!collapsedGroups[group.groupName]}
                          onToggle={() => toggleGroupCollapse(group.groupName)}

                          color={
                            group.groupName === "Contactar Luego"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                              : group.groupName === "Nuevo"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                : group.groupName === "Cerrado"
                                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                                  : "bg-secondary text-muted-foreground border-border"
                          }
                        />
                      </td>
                    </tr>

                    {!collapsedGroups[group.groupName] &&
                      group.items.map((row) => (
                        <TableRow
                          key={row.id}
                          row={row}
                          visibleColumns={visibleColumns}
                          onClick={() => setSelectedRecord(row)}
                          onUpdate={handleUpdateRecord}
                        />
                      ))}
                  </React.Fragment>
                ))}

                {}
                {[...Array(5)].map((_, i) => (
                  <tr key={`empty-${i}`} className="border-b border-border h-8">
                    <td className="border-r border-border bg-muted/5 sticky left-0 z-10"></td>
                    {visibleColumns.map((c, j) => (
                      <td key={j} className="border-r border-border"></td>
                    ))}
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {}
          <div className="h-10 border-t border-border bg-background flex items-center px-4 text-xs text-muted-foreground gap-4 flex-shrink-0">
            <div
              onClick={handleAddRecord}
              className="flex items-center gap-1 border border-border rounded px-2 py-1 hover:bg-accent cursor-pointer text-foreground transition-colors"
            >
              <Plus className="w-3 h-3" /> Añadir
            </div>
            <span>{processedRecords.length} registros</span>
            <div className="h-4 w-px bg-border"></div>
            <span>Vista completada</span>
          </div>

          <RecordDrawer
            isOpen={!!selectedRecord}
            onClose={() => setSelectedRecord(null)}
            record={selectedRecord || ({} as any)}
            onUpdateRecord={handleUpdateRecord}
          />
        </main>
      </div>

      {}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-64 bg-background border-r border-border flex flex-col h-full animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <span className="font-bold text-foreground">Vistas</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">
                  Mis Vistas
                </p>
                {VIEWS_CONFIG.map((view) => (
                  <ViewItem
                    key={view.id}
                    label={view.name}
                    icon={view.icon}
                    active={activeViewId === view.id}
                    onClick={() => {
                      setActiveViewId(view.id);
                      setIsMobileMenuOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function TabButton({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors whitespace-nowrap ${active ? "bg-background text-foreground border-t border-x border-border translate-y-[1px]" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function ViewTab({ label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-1 px-4 py-2 text-xs font-medium border-r border-border cursor-pointer min-w-max transition-colors ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"}`}
    >
      {active && <Grid3X3 className="w-3 h-3 text-blue-500" />}
      {label}
      {active && <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />}
    </div>
  );
}

function ViewItem({ label, icon: Icon, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
    >
      <Icon
        className={`w-4 h-4 ${active ? "text-blue-500" : "text-muted-foreground group-hover:text-foreground"}`}
      />
      <span className="text-sm truncate flex-1">{label}</span>
    </div>
  );
}

function ToolButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2 py-1 rounded hover:bg-accent text-xs transition-colors ${active ? "text-blue-500 bg-blue-500/10" : "text-muted-foreground"}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function HeaderCell({
  icon: Icon,
  label,
  width,
  minWidth,
  onClick,
  isSorted,
}: any) {
  return (
    <th
      onClick={onClick}
      style={{ minWidth: `${minWidth}px` }}
      className={`${width} border-r border-border px-3 py-2 text-left font-medium text-[11px] text-muted-foreground bg-background hover:bg-accent cursor-pointer group transition-colors select-none`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`w-3.5 h-3.5 ${isSorted ? "text-blue-500" : "text-muted-foreground group-hover:text-foreground"}`}
        />
        <span
          className={`truncate uppercase tracking-wide ${isSorted ? "text-blue-500" : ""}`}
        >
          {label}
        </span>
        {isSorted && <ArrowUpDown className="w-3 h-3 ml-auto text-blue-500" />}
        {!isSorted && (
          <ChevronDown className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
        )}
      </div>
    </th>
  );
}

const GroupHeader = ({ label, count, color, isExpanded, onToggle }: any) => (
  <div
    onClick={onToggle}
    className="flex items-center gap-2 py-1.5 px-4 bg-muted/30 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors w-full"
  >
    {isExpanded ? (
      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
    ) : (
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
    )}

    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${color}`}
    >
      {label}
    </span>

    <span className="text-[11px] text-muted-foreground font-medium ml-1">
      ({count} registros)
    </span>
  </div>
);

function TableRow({ row, visibleColumns, onClick, onUpdate }: any) {
  const handleWhatsAppClick = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    if (!phone) return;
    let cleanNumber = phone.replace(/\D/g, "");
    if (cleanNumber.length === 10) cleanNumber = `549${cleanNumber}`;
    else if (cleanNumber.length === 12 && cleanNumber.startsWith("54"))
      cleanNumber = `549${cleanNumber.slice(2)}`;

    window.open(`https://api.whatsapp.com/send?phone=${cleanNumber}`, "_blank");
  };

  const [isEditingTel1, setIsEditingTel1] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [currentTel1, setCurrentTel1] = useState(row.tel1);
  const [currentStatus, setCurrentStatus] = useState(row.status);

  const handleBlurTel1 = () => {
    setIsEditingTel1(false);
    if (currentTel1 !== row.tel1) {
      onUpdate(row.id, "tel1", currentTel1);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    onUpdate(row.id, "status", newStatus);
    setIsEditingStatus(false);
  };

  const renderCell = (colKey: string) => {
    switch (colKey) {
      case "fechaCarga":
        return (
          <span className="font-mono text-muted-foreground">
            {row.fechaCarga}
          </span>
        );
      case "caller":
        return (
          <div className="flex items-center gap-1.5 text-foreground">
            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-muted-foreground border border-border">
              {row.caller.charAt(0)}
            </div>
            {row.caller}
          </div>
        );
      case "derivados":
        return (
          row.derivados && (
            <CheckSquare className="w-3.5 h-3.5 text-green-500 inline" />
          )
        );
      case "razonSocial":
        return (
          <span
            className="font-medium text-foreground truncate block"
            title={row.razonSocial}
          >
            {row.razonSocial}
          </span>
        );
      case "contacto":
        return (
          <span
            className="text-foreground/80 truncate block"
            title={row.contacto}
          >
            {row.contacto}
          </span>
        );
      case "tel1":
        return (
          <div className="flex items-center justify-between w-full group/cell h-full min-h-[20px]">
            {isEditingTel1 ? (
              <input
                type="text"
                value={currentTel1}
                onChange={(e) => setCurrentTel1(e.target.value)}
                onBlur={handleBlurTel1}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleBlurTel1();
                }}
                autoFocus
                className="w-full bg-secondary border border-blue-500 rounded-sm px-1 py-0.5 text-foreground text-[11px] focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTel1(true);
                  }}
                  className="font-mono text-[11px] text-muted-foreground cursor-text hover:text-foreground truncate flex-1"
                >
                  {row.tel1 || "-"}
                </span>
                {row.tel1 && (
                  <button
                    onClick={(e) => handleWhatsAppClick(e, row.tel1)}
                    className="opacity-0 group-hover/cell:opacity-100 p-1 mr-1 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded transition-all duration-200"
                    title="Abrir WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </button>
                )}
              </>
            )}
          </div>
        );
      case "status":
        return (
          <div className="w-full h-full flex items-center">
            {isEditingStatus ? (
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                onBlur={() => setIsEditingStatus(false)}
                autoFocus
                className="w-full bg-secondary border border-blue-500 rounded-sm px-1 py-0.5 text-foreground text-[10px] focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                {[
                  "Nuevo",
                  "Contactar Luego",
                  "Contactado",
                  "Cotizando",
                  "Cerrado",
                  "Cerrado Ganado",
                  "Cerrado Perdido",
                ].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingStatus(true);
                }}
                className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap font-medium tracking-wide ${
                  row.status === "Contactar Luego"
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                    : row.status === "Nuevo"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                      : row.status === "Cerrado"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                        : "bg-secondary text-muted-foreground border-border"
                }`}
              >
                {row.status}
              </span>
            )}
          </div>
        );
      default:
        return <span className="text-muted-foreground">{row[colKey]}</span>;
    }
  };

  return (
    <tr
      onClick={onClick}
      className="border-b border-border hover:bg-accent/40 cursor-pointer transition-colors group h-8"
    >
      <td className="border-r border-border text-center py-0 relative bg-inherit sticky left-0 z-10 bg-background group-hover:bg-accent/40 transition-colors">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center h-full absolute inset-0 z-20">
          <input
            type="checkbox"
            className="rounded bg-secondary border-muted-foreground cursor-pointer w-3.5 h-3.5"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="group-hover:opacity-0 flex items-center justify-center text-[10px] text-muted-foreground font-mono h-full w-full">
          {row.id}
        </div>
      </td>

      {visibleColumns.map((colKey: string) => (
        <td
          key={colKey}
          className="border-r border-border px-3 py-1 text-[12px] truncate relative h-full"
        >
          {renderCell(colKey)}
        </td>
      ))}
      {}
      <td></td>
    </tr>
  );
}


