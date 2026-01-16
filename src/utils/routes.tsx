import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { AuthGuard } from "../components/auth/AuthGuard";
import { ConsultoriaView } from "../pages/ConsultoriaView";
import { LoginPage } from "../pages/LoginPage";
import { MainLayout } from "../components/layouts/MainLayout";

// Páginas del Proyecto (Dentro de una Base)
import { Dashboard } from "../pages/Dashboard";
import { TableView } from "../pages/TableView";
import { KanbanView } from "../pages/KanbanView";
import { AdminPanel } from "../pages/AdminPanel"; // Panel de métricas antiguas/analytics

// Páginas Globales (Nuevas)
import { HomeWorkspace } from "../pages/HomeWorkspace";
import { AdminUserManagement } from "../pages/AdminUserManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "",
        element: <AuthGuard />,
        children: [
          {
            index: true,
            Component: HomeWorkspace,
          },
          {
            path: "admin/users",
            Component: AdminUserManagement,
          },
          {
            path: "base",
            element: <MainLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                Component: Dashboard,
              },
              {
                path: "consultorias",
                Component: ConsultoriaView,
              },
              {
                path: "table",
                Component: TableView,
              },
              {
                path: "policies",
                Component: TableView,
              },
              {
                path: "kanban",
                Component: KanbanView,
              },
              {
                path: "analytics",
                Component: AdminPanel,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
