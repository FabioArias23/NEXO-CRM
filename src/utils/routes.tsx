import { createBrowserRouter, Navigate } from 'react-router';
import { AuthGuard } from '../components/auth/AuthGuard';
import { ConsultoriaView } from '../pages/ConsultoriaView';

// Páginas de Autenticación
import { LoginPage } from '../pages/LoginPage';

// Layouts
import { MainLayout } from '../components/layouts/MainLayout';

// Páginas del Proyecto (Dentro de una Base)
import { Dashboard } from '../pages/Dashboard';
import { TableView } from '../pages/TableView';
import { KanbanView } from '../pages/KanbanView';
import { AdminPanel } from '../pages/AdminPanel'; // Panel de métricas antiguas/analytics

// Páginas Globales (Nuevas)
import { HomeWorkspace } from '../pages/HomeWorkspace';
import { AdminUserManagement } from '../pages/AdminUserManagement';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      // 1. EL LOBBY (Pantalla principal estilo Airtable)
      // Esta es la ruta raíz ("/")
      { 
        index: true, 
        Component: HomeWorkspace 
      },
      
      // 2. PANEL DE ADMINISTRACIÓN GLOBAL
      // Gestión de usuarios y permisos (solo para admins)
      {
        path: 'admin/users',
        Component: AdminUserManagement
      },

      // 3. EL ESPACIO DE TRABAJO (CRM)
      // Todo lo que está bajo "/base" muestra el Sidebar lateral y el TopBar
      {
        path: 'base',
        element: <MainLayout />,
        children: [
          // Redirección automática: si entran a /base, van al dashboard
          { 
            index: true, 
            element: <Navigate to="dashboard" replace /> 
          },
          
          // Dashboard Principal (Métricas)
          { 
            path: 'dashboard', 
            Component: Dashboard 
          },
              { 
            path: 'table', 
            Component: ConsultoriaView 
          },
          // Tabla de Clientes (Base General)
          { 
            path: 'table', 
            Component: TableView 
          },
          
          // Tabla de Pólizas (Reutilizamos TableView por ahora)
          { 
            path: 'policies', 
            Component: TableView 
          },
          
          // Kanban de Siniestros/Ventas
          { 
            path: 'kanban', 
            Component: KanbanView 
          },
          
          // Analíticas Administrativas (Solo Admin ve el link en sidebar)
          { 
            path: 'analytics', 
            Component: AdminPanel 
          },
        ],
      },
    ],
  },
  
  // 4. CATCH-ALL (Manejo de errores 404)
  // Cualquier ruta desconocida redirige al Lobby
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);