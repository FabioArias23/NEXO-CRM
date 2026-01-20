import { useNavigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useModals } from '@/hooks/useModals'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  LayoutDashboard,
  Table2,
  Columns3,
  ClipboardList,
  TrendingUp,
  Users,
  Plus,
  LogOut,
  Search,
} from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { signOut, isAdmin } = useAuth()
  const { closeCommandPalette, openCreateModal } = useModals()

  const runCommand = (callback: () => void) => {
    closeCommandPalette()
    callback()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar comandos o acciones..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>

        {}
        <CommandGroup heading="Navegación">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/base/dashboard'))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/base/table'))}
          >
            <Table2 className="mr-2 h-4 w-4" />
            <span>Vista Tabla</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/base/kanban'))}
          >
            <Columns3 className="mr-2 h-4 w-4" />
            <span>Pipeline Kanban</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/base/consultorias'))}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>Consultorías</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {}
        <CommandGroup heading="Acciones">
          <CommandItem
            onSelect={() => runCommand(openCreateModal)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Crear Nueva Oportunidad</span>
            <kbd className="ml-auto text-xs text-muted-foreground">Ctrl+N</kbd>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/base/search'))}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Buscar Oportunidades</span>
          </CommandItem>
        </CommandGroup>

        {}
        {isAdmin && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Administración">
              <CommandItem
                onSelect={() => runCommand(() => navigate('/base/analytics'))}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => navigate('/admin/users'))}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Gestión de Usuarios</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        {}
        <CommandGroup heading="Sistema">
          <CommandItem
            onSelect={() => runCommand(signOut)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}


