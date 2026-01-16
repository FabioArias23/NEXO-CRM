import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { adminService, ActivityLog, UserStat } from "../services/admin.service";
import {
  Activity,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  BarChart3,
  Loader2,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"activity" | "users">("activity");

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
      const interval = setInterval(fetchAdminData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      setError(null);
      const [acts, stats] = await Promise.all([
        adminService.getActivities(),
        adminService.getUserStats(),
      ]);

      setActivities(acts);
      setUserStats(stats);
    } catch (err: any) {
      console.error("Error fetching admin data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl text-foreground mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground">
            Solo los administradores pueden acceder a este panel.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Cargando panel de administración...
          </p>
        </div>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "update":
        return <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "delete":
        return <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20";
      case "update":
        return "text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20";
      case "delete":
        return "text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20";
      default:
        return "text-muted-foreground bg-secondary border border-border";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen text-foreground transition-colors duration-300">
      <div>
        <h1 className="text-2xl text-foreground mb-1 font-bold">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Monitoreo y estadísticas en tiempo real
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary rounded-lg">
              <Users className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <h3 className="text-3xl text-foreground font-bold mb-1">
            {userStats.length}
          </h3>
          <p className="text-sm text-muted-foreground">Usuarios Totales</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary rounded-lg">
              <Activity className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <h3 className="text-3xl text-foreground font-bold mb-1">
            {activities.length}
          </h3>
          <p className="text-sm text-muted-foreground">
            Actividades Registradas
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary rounded-lg">
              <TrendingUp className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <h3 className="text-3xl text-foreground font-bold mb-1">
            $
            {userStats
              .reduce((sum, u) => sum + u.totalValue, 0)
              .toLocaleString()}
          </h3>
          <p className="text-sm text-muted-foreground">Valor Total Pipeline</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary rounded-lg">
              <BarChart3 className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <h3 className="text-3xl text-foreground font-bold mb-1">
            {userStats.reduce((sum, u) => sum + u.wonDeals, 0)}
          </h3>
          <p className="text-sm text-muted-foreground">Deals Ganados</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-border flex">
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "activity"
                ? "bg-secondary text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <Activity className="w-4 h-4 inline-block mr-2" />
            Actividad en Tiempo Real
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "bg-secondary text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-2" />
            Estadísticas por Usuario
          </button>
        </div>

        {/* Activity Log Tab */}
        {activeTab === "activity" && (
          <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              {activities.slice(0, 50).map((activity) => (
                <div
                  key={activity.id}
                  className="bg-background border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${getActionColor(activity.action)}`}
                    >
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {activity.userName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getActionColor(activity.action)}`}
                          >
                            {activity.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.timestamp).toLocaleString(
                            "es-ES",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.action === "create" &&
                          `Creó la oportunidad "${activity.entityName}"`}
                        {activity.action === "update" &&
                          `Actualizó "${activity.entityName}"`}
                        {activity.action === "delete" &&
                          `Eliminó "${activity.entityName}"`}
                      </p>
                      {activity.details?.changes &&
                        activity.details.changes.length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground bg-secondary/50 p-2 rounded border border-border">
                            Cambios: {activity.details.changes.join(", ")}
                          </div>
                        )}
                      {activity.details?.stage &&
                        !activity.details?.changes && (
                          <div className="mt-2 text-xs text-muted-foreground bg-secondary/50 p-2 rounded border border-border">
                            Etapa: {activity.details.stage} | Valor: $
                            {activity.details.value?.toLocaleString()}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    No hay actividad registrada aún
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Stats Tab */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Oportunidades
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Actividades
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Deals Ganados
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Última Actividad
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {userStats.map((stat) => (
                  <tr
                    key={stat.userId}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {stat.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded font-medium border ${
                          stat.role === "admin"
                            ? "bg-foreground text-background border-transparent"
                            : "bg-secondary text-muted-foreground border-border"
                        }`}
                      >
                        {stat.role === "admin" ? "Admin" : "Empleado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {stat.opportunitiesCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {stat.activitiesCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      ${stat.totalValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400 font-bold">
                      {stat.wonDeals}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      {new Date(stat.lastActive).toLocaleString("es-ES", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {userStats.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No hay usuarios registrados
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
