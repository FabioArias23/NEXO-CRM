import { Plus, Command, Bell, User as UserIcon, ChevronDown, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { projectId } from '../../utils/supabase/info';

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
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1db75c60/admin/activities`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.ok) {
        const { activities } = await res.json();
        // Count activities from last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recent = activities.filter(
          (act: any) => new Date(act.timestamp) > fiveMinutesAgo
        );
        setRecentActivityCount(recent.length);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  return (
    <div className="bg-gray-950 border-b border-gray-900">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Plataforma Multi-Usuario
          </p>
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true
              });
              window.dispatchEvent(event);
            }}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-gray-500 text-xs"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
            <span className="ml-1">para comandos rápidos</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Activity Indicator (Admin only) */}
          {isAdmin && (
            <div className="relative">
              <button className="p-2 hover:bg-gray-900 rounded-lg transition-colors relative group">
                <Activity className="w-5 h-5 text-gray-500 group-hover:text-gray-300" />
                {recentActivityCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-xs rounded-full flex items-center justify-center">
                    {recentActivityCount}
                  </span>
                )}
              </button>
              {recentActivityCount > 0 && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none">
                  <p className="text-xs text-gray-400">
                    {recentActivityCount} actividad{recentActivityCount > 1 ? 'es' : ''} nueva{recentActivityCount > 1 ? 's' : ''} en los últimos 5 min
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-900 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-500" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm text-white">{user?.name}</p>
                  <p className="text-xs text-gray-600">
                    {isAdmin ? 'Administrador' : 'Empleado'}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-20 overflow-hidden">
                  <div className="p-4 border-b border-gray-800">
                    <p className="text-sm text-white mb-1">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        isAdmin ? 'bg-white text-black' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {isAdmin ? 'Admin' : 'Empleado'}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors">
                      Perfil
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors">
                      Configuración
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Create Button */}
          <button
            onClick={onCreateOpportunity}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Crear Nuevo</span>
          </button>
        </div>
      </div>
    </div>
  );
}