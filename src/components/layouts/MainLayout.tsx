import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import { Sidebar } from '../navigation/Sidebar';
import { TopBar } from '../navigation/TopBar'; // Asegúrate que TopBar acepte children o modifícalo
import { CommandPalette } from '../shared/CommandPalette';
import { OpportunityModal } from '../modals/OpportunityModal';
import { ToastContainer } from '../shared/Toast';
import { useToast } from '../../hooks/useToast';
import { ThemeToggle } from '../ui/ThemeToggle'; // <--- IMPORTAR BOTON

export function MainLayout() {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    // CAMBIO IMPORTANTE: Usamos bg-background y text-foreground en lugar de bg-black
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pasamos el toggle dentro del TopBar o lo modificamos directamente */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
            <div className="flex-1">
                <TopBar onCreateOpportunity={() => setShowCreateModal(true)} />
            </div>
            <div className="pl-4 border-l border-border ml-4">
                <ThemeToggle /> {/* <--- AQUÍ ESTÁ EL BOTÓN */}
            </div>
        </div>
        
        <main className="flex-1 overflow-auto bg-background/50">
          <Outlet />
        </main>
      </div>

      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onCreateOpportunity={() => setShowCreateModal(true)}
        />
      )}

      {showCreateModal && (
        <OpportunityModal
          opportunity={null}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}