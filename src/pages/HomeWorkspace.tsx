import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Table2,
  Columns3,
  TrendingUp,
  Users,
  Shield,
  FileText,
  Plus,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeWorkspace() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Hola, {user?.name?.split(" ")[0] || "Admin"} 👋
        </h1>
        <p className="text-muted-foreground">
          Accede rápidamente a tus bases de trabajo y herramientas
        </p>
      </div>

      {/* Main Workspaces Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Espacios de Trabajo
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Acceso rápido a tus módulos principales
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Espacio
          </Button>
        </div>

        {/* Grid de workspaces usando shadcn/ui cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Ejecutivo */}
          <WorkspaceCard
            title="Dashboard Ejecutivo"
            description="Vista general de métricas y KPIs"
            icon={<LayoutDashboard className="h-5 w-5" />}
            stats={{ label: "Actualizado", value: "hace 5 min" }}
            badge={{ label: "Activo", variant: "default" }}
            onClick={() => navigate("/base/dashboard")}
          />

          {/* Base Clientes */}
          <WorkspaceCard
            title="Base Clientes"
            description="Gestión de clientes y contactos"
            icon={<Users className="h-5 w-5" />}
            stats={{ label: "Registros", value: "1,247" }}
            badge={{ label: "+23 hoy", variant: "secondary" }}
            onClick={() => navigate("/base/table")}
          />

          {/* Pipeline Ventas */}
          <WorkspaceCard
            title="Pipeline Ventas"
            description="Seguimiento de oportunidades"
            icon={<Columns3 className="h-5 w-5" />}
            stats={{ label: "En proceso", value: "42" }}
            badge={{ label: "$2.4M", variant: "default" }}
            onClick={() => navigate("/base/kanban")}
          />

          {/* Analytics */}
          {isAdmin && (
            <WorkspaceCard
              title="Analytics"
              description="Reportes y análisis avanzados"
              icon={<TrendingUp className="h-5 w-5" />}
              stats={{ label: "Reportes", value: "12" }}
              badge={{ label: "Admin", variant: "destructive" }}
              onClick={() => navigate("/base/analytics")}
            />
          )}

          {/* Gestión Usuarios */}
          {isAdmin && (
            <WorkspaceCard
              title="Gestión de Usuarios"
              description="Administración de permisos"
              icon={<Shield className="h-5 w-5" />}
              stats={{ label: "Usuarios", value: "24" }}
              badge={{ label: "Admin", variant: "destructive" }}
              onClick={() => navigate("/admin/users")}
            />
          )}

          {/* Create New - Empty State */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 hover:border-primary/30 group cursor-pointer min-h-[180px] flex flex-col">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-xl bg-muted ring-1 ring-border text-muted-foreground transition-transform group-hover:scale-110 duration-300 mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Crear nuevo espacio
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            label="Nueva Oportunidad"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/base/dashboard")}
          />
          <QuickActionButton
            label="Ver Reportes"
            icon={<FileText className="h-4 w-4" />}
            onClick={() => {}}
          />
          <QuickActionButton
            label="Calendario"
            icon={<Clock className="h-4 w-4" />}
            onClick={() => {}}
          />
          {isAdmin && (
            <QuickActionButton
              label="Configuración"
              icon={<Shield className="h-4 w-4" />}
              onClick={() => navigate("/admin/users")}
            />
          )}
        </div>
      </div>

      {/* Recent Activity (opcional) */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Actividad Reciente</CardTitle>
              <Button variant="ghost" size="sm">
                Ver todo
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No hay actividad reciente para mostrar
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente WorkspaceCard unificado
interface WorkspaceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: { label: string; value: string };
  badge?: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
  onClick: () => void;
}

function WorkspaceCard({
  title,
  description,
  icon,
  stats,
  badge,
  onClick,
}: WorkspaceCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 hover:border-primary/30 group cursor-pointer min-h-[180px] flex flex-col"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex justify-between items-start mb-auto">
        <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 text-primary transition-transform group-hover:scale-110 duration-300 shrink-0">
          {icon}
        </div>
        {badge && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
              badge.variant === "default"
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                : badge.variant === "secondary"
                  ? "text-gray-400 bg-gray-500/10 border border-gray-500/20"
                  : "text-red-400 bg-red-500/10 border border-red-500/20"
            }`}
          >
            {badge.label}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-card-foreground mb-1 leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-muted-foreground">
            {stats.label}:{" "}
            <span className="font-bold text-card-foreground">
              {stats.value}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente QuickActionButton
interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function QuickActionButton({ label, icon, onClick }: QuickActionButtonProps) {
  return (
    <Button
      variant="outline"
      className="justify-start h-auto py-3"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 w-full">
        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <span className="text-sm font-medium truncate">{label}</span>
      </div>
    </Button>
  );
}
