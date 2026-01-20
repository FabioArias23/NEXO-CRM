import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { AuthGuard } from "../components/auth/AuthGuard";
import { AppShell } from "../components/layouts/AppShell";
import { HomeShell } from "../components/layouts/HomeShell";
import { ConsultoriaView } from "../pages/ConsultoriaView";
import { LoginPage } from "../pages/LoginPage";

import { Dashboard } from "../pages/Dashboard";
import { TableView } from "../pages/TableView";
import { KanbanView } from "../pages/KanbanView";
import { AdminPanel } from "../pages/AdminPanel"; // Panel de métricas antiguas/analytics

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
            path: "",
            element: <HomeShell />,
            children: [
              {
                index: true,
                Component: HomeWorkspace,
              },
            ],
          },
          {
            path: "base",
            element: <AppShell />,
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
          {
            path: "admin",
            element: <AppShell />,
            children: [
              {
                path: "users",
                Component: AdminUserManagement,
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
