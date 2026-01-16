import {
  Plus,
  Command,
  Bell,
  User as UserIcon,
  ChevronDown,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { adminService } from "../../services/admin.service";

interface TopBarProps {
  onCreateOpportunity: () => void;
}

export function TopBar({ onCreateOpportunity }: TopBarProps) {
  const { user, isAdmin, accessToken } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [recentActivityCount, setRecentActivityCount] = useState(0);

  useEffect(() => {
    if (isAdmin && accessToken) {
      fetchRecentActivity();
      const interval = setInterval(fetchRecentActivity, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAdmin, accessToken]);

  const fetchRecentActivity = async () => {
    try {
      const activities = await adminService.getActivities();
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recent = activities.filter(
        (act) => new Date(act.timestamp) > fiveMinutesAgo,
      );
      setRecentActivityCount(recent.length);
    } catch (error) {
      // Silently fail
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
      {/* Left */}
      <div className="flex items-center gap-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Buscar
        </p>
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-lg hover:border-input transition-colors text-muted-foreground text-xs"
        >
          <Command className="w-3 h-3" />
          <span>K</span>
          <span className="ml-1">para comandos rápidos</span>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Activity */}
        {isAdmin && (
          <div className="relative group">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Activity className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              {recentActivityCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                  {recentActivityCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Notifications */}
        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm text-foreground leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Admin" : "Empleado"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <p className="text-sm text-popover-foreground mb-1">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        isAdmin
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isAdmin ? "Admin" : "Empleado"}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent rounded transition-colors">
                    Perfil
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent rounded transition-colors">
                    Configuración
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Create */}
        <button
          onClick={onCreateOpportunity}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Crear Nuevo</span>
        </button>
      </div>
    </div>
  );
}
