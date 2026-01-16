import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  LayoutDashboard, 
  Table2, 
  Columns3, 
  Shield,
  LogOut,
  Plus,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
  onCreateOpportunity?: () => void;
}

export function CommandPalette({ onClose, onCreateOpportunity }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();

  const commands = [
    {
      id: 'dashboard',
      label: 'Ir a Dashboard',
      icon: LayoutDashboard,
      action: () => navigate('/'),
      category: 'Navegación',
    },
    {
      id: 'table',
      label: 'Ir a Vista de Tabla',
      icon: Table2,
      action: () => navigate('/table'),
      category: 'Navegación',
    },
    {
      id: 'kanban',
      label: 'Ir a Pipeline Kanban',
      icon: Columns3,
      action: () => navigate('/kanban'),
      category: 'Navegación',
    },
    ...(isAdmin ? [{
      id: 'admin',
      label: 'Ir a Panel de Admin',
      icon: Shield,
      action: () => navigate('/admin'),
      category: 'Navegación',
    }] : []),
    {
      id: 'create',
      label: 'Crear Nueva Oportunidad',
      icon: Plus,
      action: () => {
        onClose();
        onCreateOpportunity?.();
      },
      category: 'Acciones',
    },
    {
      id: 'logout',
      label: 'Cerrar Sesión',
      icon: LogOut,
      action: () => signOut(),
      category: 'Sistema',
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleCommandClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar comandos o acciones..."
            className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} className="mb-3 last:mb-0">
              <div className="px-3 py-2 text-xs text-gray-500">{category}</div>
              {cmds.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => handleCommandClick(cmd.action)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left hover:bg-gray-800 transition-colors group"
                >
                  <cmd.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {cmd.label}
                  </span>
                </button>
              ))}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron comandos</p>
              <p className="text-sm text-gray-700 mt-1">Intenta con otra búsqueda</p>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>Presiona <kbd className="px-2 py-1 bg-gray-800 rounded">ESC</kbd> para cerrar</span>
          </div>
          <span>Cmd+K para abrir</span>
        </div>
      </div>
    </div>
  );
}
