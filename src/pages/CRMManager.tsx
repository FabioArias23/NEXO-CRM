import React, { useState, useMemo } from 'react';
import { 
  Plus, Grid3X3, Table as TableIcon, Search, 
  Filter, ChevronDown, ChevronRight, MoreHorizontal,
  Settings, Trash2, CheckCircle2, Circle
} from 'lucide-react';
import crmMockData from '../data/mocks/crm.json';

// --- 1. CONFIGURACIÓN Y TIPOS ---

type StatusType = 'Nuevo' | 'Contactar Luego' | 'En Proceso' | 'Cerrado Ganado' | 'Cerrado Perdido';

interface Record {
  id: number;
  fecha: string;
  cliente: string;
  contacto: string;
  telefono: string;
  status: StatusType;
}

interface View {
  id: string;
  name: string;
  type: 'grid' | 'kanban';
  filter?: string; // Para lógica futura
}

// Configuración de Estilos de Status (Badge System)
const STATUS_CONFIG: Record<StatusType, { color: string, dot: string }> = {
  'Nuevo': { color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-500' },
  'Contactar Luego': { color: 'bg-purple-500/15 text-purple-400 border-purple-500/30', dot: 'bg-purple-500' },
  'En Proceso': { color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-500' },
  'Cerrado Ganado': { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-500' },
  'Cerrado Perdido': { color: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-500' },
};

// --- 2. COMPONENTE PRINCIPAL ---

export default function CRMManager() {
  // --- ESTADOS ---
  // Estado de Datos (Fuente de la verdad)
  const [records, setRecords] = useState<Record[]>(INITIAL_DATA);
  
  // Estado de Vistas (Pestañas)
  const [views, setViews] = useState<View[]>([
    { id: 'v1', name: 'Vista General', type: 'grid' },
    { id: 'v2', name: 'Mis Clientes', type: 'grid' }
export default function CRMManager() {
  // --- ESTADOS ---
  // Estado de Datos (Fuente de la verdad)
  const [records, setRecords] = useState<Record[]>(crmMockData.records as Record[]);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<number | null>(null); // Para el dropdown de status

  // --- LÓGICA CORE ---

  // 1. Crear Nueva Vista (Requerimiento Crítico)
  const handleCreateView = () => {
    const newId = `v${Date.now()}`;
    const newViewNumber = views.length + 1;
    const newView: View = {
      id: newId,
      name: `Nueva Vista ${newViewNumber}`,
      type: 'grid'
    };
    
    setViews([...views, newView]);
    setActiveViewId(newId); // Cambiar foco inmediatamente
  };

  // 2. Eliminar Vista
  const handleDeleteView = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (views.length === 1) return; // No borrar la última
    const newViews = views.filter(v => v.id !== id);
    setViews(newViews);
    if (activeViewId === id) setActiveViewId(newViews[0].id);
  };

  // 3. Actualizar Status (Smart Grouping Trigger)
  const handleStatusChange = (id: number, newStatus: StatusType) => {
    // Al actualizar el estado, React re-ejecutará useMemo, moviendo la fila automáticamente
    setRecords(prev => prev.map(record => 
      record.id === id ? { ...record, status: newStatus } : record
    ));
    setEditingId(null); // Cerrar dropdown
  };

  // 4. Agrupación Dinámica (El cerebro de la tabla)
  const groupedRecords = useMemo(() => {
    const groups: Record<string, Record[]> = {};
    
    // Orden de renderizado de grupos deseado
    const order: StatusType[] = ['Nuevo', 'En Proceso', 'Contactar Luego', 'Cerrado Ganado', 'Cerrado Perdido'];
    
    // Inicializar grupos vacíos para mantener el orden visual
    order.forEach(status => groups[status] = []);

    // Distribuir registros
    records.forEach(record => {
      if (groups[record.status]) {
        groups[record.status].push(record);
      } else {
        // Fallback por si hay un status raro
        if (!groups['Otros']) groups['Otros'] = [];
        groups['Otros'].push(record);
      }
    });

    return groups;
  }, [records]); // Se recalcula cada vez que 'records' cambia

  // --- RENDERIZADO ---

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white font-sans overflow-hidden">
      
      {/* 1. TOP BAR & TABS NAVIGATION */}
      <div className="flex flex-col border-b border-gray-800 bg-black z-20">
        
        {/* Header Superior */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-md">
              <Grid3X3 className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-sm tracking-wide">GESTIÓN COMERCIAL</h1>
            <span className="text-gray-600">/</span>
            <span className="text-sm text-gray-400">Todas las oportunidades</span>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-2.5 top-1.5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-gray-900 border border-gray-800 rounded-md py-1 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-blue-500 w-48 transition-all"
                />
             </div>
          </div>
        </div>

        {/* Tab Bar (Scrollable) */}
        <div className="flex items-center px-2 h-10 bg-[#09090b] overflow-x-auto no-scrollbar">
          {views.map((view) => (
            <div
              key={view.id}
              onClick={() => setActiveViewId(view.id)}
              className={`
                group flex items-center gap-2 px-4 py-2.5 border-r border-gray-800/50 cursor-pointer min-w-fit transition-all relative
                ${activeViewId === view.id ? 'bg-[#18181b] text-white' : 'text-gray-500 hover:bg-[#18181b]/50 hover:text-gray-300'}
              `}
            >
              <TableIcon className={`w-3.5 h-3.5 ${activeViewId === view.id ? 'text-blue-400' : ''}`} />
              <span className="text-xs font-medium">{view.name}</span>
              
              {/* Botón Borrar (Hover) */}
              <button 
                onClick={(e) => handleDeleteView(view.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-all ml-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              {/* Indicador Activo */}
              {activeViewId === view.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"></div>
              )}
            </div>
          ))}

          {/* BOTÓN CREAR VISTA (+) */}
          <button
            onClick={handleCreateView}
            className="flex items-center gap-1 px-3 py-1 ml-1 text-xs font-medium text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Crear Vista
          </button>
        </div>
      </div>

      {/* 2. MAIN TOOLBAR */}
      <div className="h-12 border-b border-gray-800 flex items-center px-4 bg-[#09090b] gap-2">
         <ToolbarButton icon={Filter} label="Filtrar" />
         <ToolbarButton icon={Grid3X3} label="Agrupar" active />
         <ToolbarButton icon={Settings} label="Campos" />
         <div className="h-4 w-px bg-gray-800 mx-2"></div>
         <span className="text-xs text-gray-500">{records.length} registros</span>
      </div>

      {/* 3. DATA GRID (LA TABLA) */}
      <div className="flex-1 overflow-auto bg-black custom-scrollbar">
        <table className="w-full border-collapse text-sm table-fixed">
          <thead className="sticky top-0 z-10 bg-[#09090b] text-gray-500 text-xs font-medium uppercase tracking-wider border-b border-gray-800">
             <tr>
               <th className="w-10 p-2 text-center border-r border-gray-800 bg-[#09090b] sticky left-0 z-20">
                 <input type="checkbox" className="rounded border-gray-700 bg-gray-800" />
               </th>
               <HeaderCell label="Status" width="w-48" />
               <HeaderCell label="Fecha" width="w-32" />
               <HeaderCell label="Cliente" width="w-64" />
               <HeaderCell label="Contacto" width="w-48" />
               <HeaderCell label="Teléfono" width="w-40" />
               <th className="w-full bg-[#09090b]"></th> {/* Spacer */}
             </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-900">
             {Object.entries(groupedRecords).map(([statusName, groupItems]) => {
                const isCollapsed = collapsedGroups[statusName];
                const config = STATUS_CONFIG[statusName as StatusType] || { color: 'bg-gray-800 text-gray-400', dot: 'bg-gray-500' };

                return (
                  <React.Fragment key={statusName}>
                    {/* GROUP HEADER ROW */}
                    <tr className="bg-[#121214] hover:bg-[#18181b] transition-colors sticky left-0 z-0">
                       <td colSpan={6} className="p-0">
                          <div 
                            onClick={() => setCollapsedGroups(prev => ({...prev, [statusName]: !prev[statusName]}))}
                            className="flex items-center gap-2 py-1.5 px-4 cursor-pointer select-none group"
                          >
                             <div className="p-0.5 rounded hover:bg-white/10 text-gray-500 group-hover:text-white transition-colors">
                               {isCollapsed ? <ChevronRight className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                             </div>
                             
                             <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wide ${config.color}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
                                {statusName}
                             </div>

                             <span className="text-xs text-gray-500 font-medium ml-1">
                               {groupItems.length}
                             </span>
                          </div>
                       </td>
                    </tr>

                    {/* GROUP ROWS */}
                    {!isCollapsed && groupItems.map(row => (
                      <tr key={row.id} className="group hover:bg-[#18181b] transition-colors border-b border-gray-900/50">
                         {/* Checkbox Col */}
                         <td className="border-r border-gray-800/50 p-0 relative bg-inherit sticky left-0 z-10 text-center">
                            <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity">
                               <input type="checkbox" className="rounded border-gray-700 bg-gray-800 cursor-pointer" />
                            </div>
                            <span className="text-xs text-gray-600 font-mono group-hover:opacity-0">{row.id}</span>
                         </td>

                         {/* Status Cell (Editable) */}
                         <td className="border-r border-gray-800/50 px-3 py-1.5 relative">
                            <div className="relative">
                               <button 
                                 onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                                 className={`flex items-center gap-2 px-2 py-1 rounded w-full text-left text-xs font-medium transition-colors hover:bg-gray-800 ${editingId === row.id ? 'bg-gray-800 ring-1 ring-blue-500' : ''}`}
                               >
                                  <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[row.status].dot}`}></div>
                                  <span className="truncate flex-1">{row.status}</span>
                                  <ChevronDown className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100" />
                               </button>

                               {/* Dropdown Menu para Status */}
                               {editingId === row.id && (
                                 <>
                                   <div className="fixed inset-0 z-40" onClick={() => setEditingId(null)}></div>
                                   <div className="absolute top-full left-0 mt-1 w-48 bg-[#18181b] border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                      {Object.keys(STATUS_CONFIG).map((s) => (
                                        <div 
                                          key={s}
                                          onClick={() => handleStatusChange(row.id, s as StatusType)}
                                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 cursor-pointer text-xs text-gray-300"
                                        >
                                           <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s as StatusType].dot}`}></div>
                                           <span>{s}</span>
                                           {row.status === s && <CheckCircle2 className="w-3 h-3 ml-auto text-blue-500"/>}
                                        </div>
                                      ))}
                                   </div>
                                 </>
                               )}
                            </div>
                         </td>

                         {/* Data Cells */}
                         <Cell value={row.fecha} font="font-mono text-gray-400" />
                         <Cell value={row.cliente} font="font-medium text-white" />
                         <Cell value={row.contacto} />
                         <Cell value={row.telefono} />
                         
                         {/* Empty Spacer */}
                         <td></td>
                      </tr>
                    ))}

                    {/* Fila para agregar en grupo (Visual) */}
                    {!isCollapsed && (
                       <tr className="h-8 hover:bg-[#121214] transition-colors">
                          <td className="border-r border-gray-800/30 sticky left-0 bg-[#09090b] z-10"></td>
                          <td colSpan={5} className="px-3 border-b border-gray-900/30">
                             <div className="flex items-center gap-2 text-gray-600 hover:text-gray-400 cursor-pointer text-xs group/add">
                                <Plus className="w-3 h-3"/>
                                <span className="opacity-0 group-hover/add:opacity-100 transition-opacity">Nuevo en {statusName}</span>
                             </div>
                          </td>
                       </tr>
                    )}
                  </React.Fragment>
                );
             })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// --- SUBCOMPONENTES ---

function ToolbarButton({ icon: Icon, label, active }: any) {
  return (
    <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${active ? 'bg-blue-900/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function HeaderCell({ label, width }: { label: string, width: string }) {
  return (
    <th className={`${width} px-3 py-2 text-left border-r border-gray-800 bg-[#09090b] hover:bg-[#121214] cursor-pointer transition-colors group`}>
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </th>
  );
}

function Cell({ value, font = "text-gray-300" }: { value: string, font?: string }) {
  return (
    <td className="border-r border-gray-800/50 px-3 py-1.5 truncate">
      <span className={`text-xs ${font}`}>{value}</span>
    </td>
  );
}