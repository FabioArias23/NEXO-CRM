import React from "react";

import { useNavigate } from "react-router";
import {
  Search,
  Bell,
  Plus,
  Star,
  Users,
  Layout,
  ChevronDown,
  Shield,
  FileText,
  Briefcase,
  LogOut,
  Settings,
  FolderOpen,
  AlertTriangle,
  Filter,
  Clock,
  BarChart3,
  ScrollText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function HomeWorkspace() {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* --- SIDEBAR DEL LOBBY --- */}
      <aside className="w-64 border-r border-border flex flex-col bg-background flex-shrink-0 transition-colors duration-300">
        <div className="p-6 pb-4 border-b border-border bg-background transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Shield className="w-6 h-6 text-background" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-bold text-foreground tracking-tight">
                NEXO CRM
              </h2>
              <p className="text-[10px] text-muted-foreground font-medium tracking-[0.2em] uppercase truncate">
                Workspace
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 space-y-1">
          <SidebarItem icon={Layout} label="Inicio" active />
          <SidebarItem icon={Star} label="Favoritos" />
          <SidebarItem icon={Users} label="Compartido conmigo" />
        </div>

        <div className="my-4 border-t border-border mx-6"></div>

        {/* Lista de Espacios de Trabajo */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex items-center justify-between text-muted-foreground mb-3 px-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Espacios de trabajo
            </span>
            <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-foreground transition-colors" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 text-foreground py-2 px-2.5 hover:bg-accent rounded-lg cursor-pointer transition-all group">
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                <FolderOpen className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <span className="text-sm font-medium flex-1 truncate">
                Nexo Consultora
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
            </div>
            {/* Accesos rápidos dentro del sidebar */}
            <div className="pl-7 space-y-0.5 border-l border-border ml-4 mt-1">
              <button
                onClick={() => navigate("/base/dashboard")}
                className="w-full text-left text-xs text-muted-foreground hover:text-foreground cursor-pointer py-1.5 px-2.5 hover:bg-accent/60 rounded-md transition-all font-medium"
              >
                Principal
              </button>
              <button
                onClick={() => navigate("/base/table")}
                className="w-full text-left text-xs text-muted-foreground hover:text-foreground cursor-pointer py-1.5 px-2.5 hover:bg-accent/60 rounded-md transition-all font-medium"
              >
                Base Clientes
              </button>
            </div>
          </div>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-border bg-background transition-colors duration-300 space-y-2">
          {/* User Profile Compact */}
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase">
                {isAdmin ? "Admin" : "Consultor"}
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded-lg transition-colors text-xs group"
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 text-left">Configuración</span>
            </button>
          )}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL (GRID DE BASES) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Top Bar Home - Compacto y funcional */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar o filtrar bases..."
                className="w-full bg-muted/50 border border-border rounded-lg py-1.5 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:border-ring focus:bg-background transition-all placeholder:text-muted-foreground"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded">
                ⌘K
              </kbd>
            </div>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filtros
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Banner de Bienvenida - Compacto y Funcional (120px altura) */}
          <div className="mx-6 mt-6 mb-5 bg-gradient-to-r from-primary/8 via-primary/5 to-background border border-border/60 rounded-xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">
                Hola, {user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                Accede rápidamente a tus bases de trabajo
              </p>
            </div>
            <button
              onClick={() => navigate("/base/dashboard")}
              className="flex items-center gap-2.5 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Layout className="w-4 h-4" />
              Continuar trabajando
            </button>
          </div>

          {/* Contenedor de Bases con padding profesional (24px) */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-foreground tracking-tight">
                  Bases de Trabajo
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Acceso rápido a tus módulos principales
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-sm hover:shadow-md">
                <Plus className="w-4 h-4" />
                Nueva Base
              </button>
            </div>

            {/* Grid de 3 columnas con gap de 24px */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* BASE 1: Dashboard Principal */}
              <BaseCard
                title="Dashboard Ejecutivo"
                metrics={{ primary: "247 ops", secondary: "34% conversión" }}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
                icon={<Briefcase className="w-5 h-5" />}
                onClick={() => navigate("/base/dashboard")}
                activity="Actualizado hace 5 min"
                starred
              />

              {/* BASE 2: Clientes */}
              <BaseCard
                title="Base Clientes"
                metrics={{
                  primary: "1,247 registros",
                  secondary: "+23 esta semana",
                }}
                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                icon={<Users className="w-5 h-5" />}
                onClick={() => navigate("/base/table")}
                activity="18 cambios hoy"
              />

              {/* BASE 3: Pipeline */}
              <BaseCard
                title="Pipeline Ventas"
                metrics={{
                  primary: "$2.4M activo",
                  secondary: "42 en negociación",
                }}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
                icon={<BarChart3 className="w-5 h-5" />}
                onClick={() => navigate("/base/kanban")}
                activity="3 deals cerrados hoy"
                starred
              />

              {/* BASE 4: Siniestros - Con alerta */}
              <BaseCard
                title="Gestión Siniestros"
                metrics={{
                  primary: "14 casos activos",
                  secondary: "3 requieren atención",
                }}
                color="bg-gradient-to-br from-red-500 to-red-600"
                icon={<Shield className="w-5 h-5" />}
                onClick={() => navigate("/base/table")}
                activity="2 nuevos hoy"
                alert
                alertMessage="3 casos críticos"
              />

              {/* BASE 5: Pólizas */}
              <BaseCard
                title="Pólizas"
                metrics={{
                  primary: "892 activas",
                  secondary: "47 por renovar",
                }}
                color="bg-gradient-to-br from-orange-500 to-orange-600"
                icon={<ScrollText className="w-5 h-5" />}
                onClick={() => navigate("/base/table")}
                activity="12 renovaciones este mes"
              />

              {/* Crear Nueva Base */}
              <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-accent/50 transition-all group min-h-[180px]">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                  Crear nueva base
                </span>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-8 pt-6 border-t border-border/60">
              <h3 className="text-sm font-semibold text-foreground tracking-tight mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction
                  label="Nueva Oportunidad"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => navigate("/base/dashboard")}
                />
                <QuickAction
                  label="Ver Reportes"
                  icon={<FileText className="w-4 h-4" />}
                  onClick={() => {}}
                />
                <QuickAction
                  label="Calendario"
                  icon={<Clock className="w-4 h-4" />}
                  onClick={() => {}}
                />
                <QuickAction
                  label="Configuración"
                  icon={<Settings className="w-4 h-4" />}
                  onClick={() => navigate("/admin/users")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponentes del HomeWorkspace

function SidebarItem({
  icon: Icon,
  label,
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-accent-foreground hover:bg-accent"}`}
    >
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        <Icon className="w-[18px] h-[18px] transition-transform group-hover:scale-110" />
      </div>
      <span className="text-sm flex-1">{label}</span>
    </div>
  );
}

// Base Card Refactorizada - Semántica y Accesibilidad Core
function BaseCard({
  title,
  metrics,
  color,
  icon,
  starred,
  activity,
  alert,
  alertMessage,
  onClick,
}: {
  title: string;
  metrics: { primary: string; secondary: string };
  color: string;
  icon: React.ReactNode;
  starred?: boolean;
  activity: string;
  alert?: boolean;
  alertMessage?: string;
  onClick: () => void;
}) {
  // Extraemos valor y unidad para el renderizado
  const [primaryValue, ...primaryUnit] = metrics.primary.split(" ");
  const unitText = primaryUnit.join(" ");

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer focus-within:ring-2 focus-within:ring-primary rounded-xl transition-all hover:scale-[1.02] hover:-translate-y-1"
    >
      <Card
        className={`relative overflow-hidden border-2 shadow-sm transition-all hover:shadow-lg ${alert ? "border-destructive/30" : "hover:border-primary/20"}`}
      >
        {/* Indicadores de Estado (Alertas o Favoritos) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {alert && alertMessage && (
            <div
              role="alert"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold uppercase tracking-wide"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{alertMessage}</span>
            </div>
          )}
          {starred && !alert && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground/40 hover:text-yellow-500 hover:bg-transparent"
              aria-label={`Quitar ${title} de favoritos`}
            >
              <Star className="h-5 w-5 fill-current" />
            </Button>
          )}
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shadow-sm text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold tracking-tight truncate group-hover:text-primary transition-colors duration-200">
                  {title}
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  <time dateTime={new Date().toISOString()}>{activity}</time>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Métrica principal - Destacada */}
            <div className="flex flex-col">
              <dt className="sr-only"></dt>
              <dd className="text-3xl font-bold tracking-tight text-foreground">
                {primaryValue}
                {unitText && (
                  <span className="text-lg font-medium text-muted-foreground ml-1">
                    {unitText}
                  </span>
                )}
              </dd>
            </div>

            {/* Métrica secundaria - Subordinada */}
            <div className="flex flex-col">
              <dt className="sr-only"></dt>
              <dd className="text-sm font-medium text-muted-foreground">
                {metrics.secondary}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

// Quick Action Button
function QuickAction({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 bg-card border border-border/60 rounded-xl hover:border-primary/30 hover:bg-accent hover:shadow-md transition-all group text-left shadow-sm"
    >
      <div className="w-9 h-9 rounded-lg bg-muted/70 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors text-muted-foreground group-hover:text-primary">
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground truncate">
        {label}
      </span>
    </button>
  );
}
