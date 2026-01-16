import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Table2, 
  Columns3,
  LogOut,
  ShieldCheck, 
  FileText,    
  Users,
  ArrowLeft,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard Global', to: '/base/dashboard', icon: LayoutDashboard },
  { name: 'Base de Clientes', to: '/base/table', icon: Users }, 
  { name: 'Pólizas Activas', to: '/base/policies', icon: FileText },
  { name: 'Siniestros (Kanban)', to: '/base/kanban', icon: Columns3 },
];

export function Sidebar() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col h-screen flex-shrink-0 z-20 relative transition-colors duration-300">
      
      {/* BOTÓN VOLVER AL LOBBY */}
      <div className="px-4 pt-4">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </button>
      </div>

      {/* HEADER LOGO */}
      <div className="p-6 pb-4 border-b border-border bg-background transition-colors duration-300">
        <div className="flex items-center gap-3">
          {/* Logo invierte colores según el tema: Fondo negro/icono blanco en Light, Fondo blanco/icono negro en Dark */}
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-wider">NEXO CRM</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-[0.2em] uppercase">Enterprise</p>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Gestión Operativa
        </p>
        
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md' // Estilo activo
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground' // Estilo inactivo
              }`
            }
          >
            <item.icon className="w-4 h-4 transition-transform group-hover:scale-105" />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Sección Admin */}
        {isAdmin && (
          <>
            <div className="my-4 border-t border-border mx-3" />
            <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Configuración
            </p>
            <NavLink
              to="/base/analytics"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`
              }
            >
              <Settings className="w-4 h-4" />
              <span>Analíticas Admin</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* FOOTER USUARIO */}
      <div className="p-4 border-t border-border bg-background transition-colors duration-300">
        <div className="p-3 rounded-xl bg-card border border-border mb-3 hover:border-input transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-background">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm text-foreground font-medium truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wide">
                  {isAdmin ? 'Administrador' : 'Consultor'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>CERRAR SESIÓN</span>
        </button>
      </div>
    </div>
  );
}