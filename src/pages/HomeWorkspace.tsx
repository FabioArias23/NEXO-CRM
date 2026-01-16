import React from 'react';

import { useNavigate } from 'react-router';
import { 
  Search, Bell, Plus, Star, Users, Layout, 
  Grid, ChevronDown, Shield, 
  FileText, Briefcase, LogOut,
  Settings, FolderOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function HomeWorkspace() {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* --- SIDEBAR DEL LOBBY --- */}
      <aside className="w-64 border-r border-gray-900 flex flex-col bg-black flex-shrink-0">
        <div className="p-6 flex items-center gap-3 text-white font-bold tracking-wider">
           <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
             <Shield className="w-5 h-5 text-black" />
           </div>
           <span className="text-sm">NEXO CRM</span>
        </div>

        <div className="px-3 py-2 space-y-1">
          <SidebarItem icon={Layout} label="Inicio" active />
          <SidebarItem icon={Star} label="Favoritos" />
          <SidebarItem icon={Users} label="Compartido conmigo" />
        </div>

        <div className="my-4 border-t border-gray-900 mx-6"></div>

        {/* Lista de Espacios de Trabajo */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex items-center justify-between text-gray-500 mb-3 px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Espacios de trabajo</span>
            <Plus className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white py-2 px-2 hover:bg-gray-900 rounded-lg cursor-pointer transition-colors">
              <ChevronDown className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Nexo Consultora</span>
            </div>
            {/* Accesos rápidos dentro del sidebar */}
            <div className="pl-8 space-y-1 border-l border-gray-800 ml-4">
              <p onClick={() => navigate('/base/dashboard')} className="text-xs text-gray-400 hover:text-white cursor-pointer py-1.5 transition-colors">
                Principal
              </p>
              <p onClick={() => navigate('/base/table')} className="text-xs text-gray-400 hover:text-white cursor-pointer py-1.5 transition-colors">
                Base Clientes
              </p>
            </div>
          </div>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-900 space-y-1">
           {isAdmin && (
             <button 
               onClick={() => navigate('/admin/users')}
               className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors text-sm"
             >
               <Settings className="w-4 h-4" /> Gestión Usuarios
             </button>
           )}
           <button 
             onClick={() => signOut()}
             className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors text-sm"
           >
             <LogOut className="w-4 h-4" /> Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL (GRID DE BASES) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Top Bar Home */}
        <header className="h-16 border-b border-gray-900 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar bases, tablas o personas (Ctrl+K)..." 
              className="w-full bg-gray-900 border border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gray-600 focus:bg-gray-800 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="flex items-center gap-6 ml-4">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
              <div className="text-right hidden md:block">
                <p className="text-xs text-white font-medium">{user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase">{isAdmin ? 'Admin' : 'Consultor'}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white to-gray-400 flex items-center justify-center text-black text-xs font-bold border border-gray-700">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
          
          {/* Banner de Bienvenida */}
          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 mb-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2 text-white">Hola, {user?.name?.split(' ')[0]}</h1>
              <p className="text-gray-400 text-sm max-w-xl mb-6">
                Bienvenido a NEXO ENTERPRISE. Aquí tienes un resumen de tus bases de datos y actividades recientes.
              </p>
              <button 
                onClick={() => navigate('/base/dashboard')}
                className="bg-white text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Continuar trabajando
              </button>
            </div>
          </div>

          {/* Grid de Bases (Estilo Airtable) */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Grid className="w-4 h-4" /> Bases Activas
            </h2>
            <div className="flex gap-2">
              <button className="text-xs text-gray-500 hover:text-white transition-colors">Recientes</button>
              <span className="text-gray-700">|</span>
              <button className="text-xs text-gray-500 hover:text-white transition-colors">Todas</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* BASE 1: Principal */}
            <BaseCard 
              title="CONSULTORA MF" 
              subtitle="Dashboard Ejecutivo" 
              color="bg-blue-600"
              borderColor="group-hover:border-blue-500/50"
              icon={<Briefcase className="w-6 h-6 text-white" />}
              onClick={() => navigate('/base/dashboard')}
              starred
            />
            
            {/* BASE 2: Clientes */}
            <BaseCard 
              title="BASE CLIENTES" 
              subtitle="Tabla Maestra" 
              color="bg-emerald-600"
              borderColor="group-hover:border-emerald-500/50"
              icon={<Users className="w-6 h-6 text-white" />}
              onClick={() => navigate('/base/table')}
            />
            
            {/* BASE 3: Pipeline */}
            <BaseCard 
              title="PIPELINE VENTAS" 
              subtitle="Kanban View" 
              color="bg-purple-600"
              borderColor="group-hover:border-purple-500/50"
              icon={<Layout className="w-6 h-6 text-white" />}
              onClick={() => navigate('/base/kanban')}
            />
            
            {/* BASE 4: Siniestros (Nuevo) */}
            <BaseCard 
              title="SINIESTROS" 
              subtitle="Gestión de Casos" 
              color="bg-red-600"
              borderColor="group-hover:border-red-500/50"
              icon={<Shield className="w-6 h-6 text-white" />}
              onClick={() => navigate('/base/table')} 
            />
            
            {/* BASE 5: Pólizas (Nuevo) */}
             <BaseCard 
              title="PÓLIZAS 2025" 
              subtitle="Renovaciones y Altas" 
              color="bg-orange-500"
              borderColor="group-hover:border-orange-500/50"
              icon={<FileText className="w-6 h-6 text-white" />}
              onClick={() => navigate('/base/table')} 
            />

            {/* Crear Nueva Base */}
            <div className="border border-dashed border-gray-800 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 hover:bg-gray-900/30 transition-all group">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mb-3 group-hover:bg-gray-800 transition-colors">
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-gray-300 font-medium">Crear nueva base</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponentes del HomeWorkspace

function SidebarItem({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${active ? 'bg-gray-900 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-900/50'}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

function BaseCard({ title, subtitle, color, borderColor, icon, starred, onClick }: any) {
  return (
    <div onClick={onClick} className={`bg-gray-950 border border-gray-900 ${borderColor} rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 group h-40 flex flex-col relative`}>
       {/* Icono y Header */}
       <div className="p-5 flex items-start gap-4 h-full relative z-10">
          <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
             {icon}
          </div>
          <div className="flex-1 min-w-0 pt-1">
             <h3 className="text-white font-bold text-base truncate group-hover:text-blue-200 transition-colors">{title}</h3>
             <p className="text-gray-500 text-xs mt-1.5">{subtitle}</p>
             
             <div className="mt-4 flex -space-x-2 overflow-hidden">
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-gray-950 bg-gray-800 flex items-center justify-center text-[8px] text-white">MF</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-gray-950 bg-gray-700 flex items-center justify-center text-[8px] text-white">LG</div>
             </div>
          </div>
       </div>
       
       {/* Estrella Favoritos */}
       {starred && (
         <div className="absolute top-4 right-4 text-yellow-500/50 group-hover:text-yellow-400 transition-colors">
            <Star className="w-4 h-4 fill-current" />
         </div>
       )}

       {/* Barra de color inferior con gradiente */}
       <div className={`h-1.5 w-full ${color} opacity-80`}></div>
    </div>
  )
}