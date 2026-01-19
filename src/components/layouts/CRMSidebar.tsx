import { Link, useLocation } from "react-router";
import {
  ChartNoAxesCombinedIcon,
  Table2Icon,
  Columns3Icon,
  ClipboardListIcon,
  TrendingUpIcon,
  UsersIcon,
  SettingsIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function CRMSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <Sidebar>
      <SidebarContent>
        {}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/base/dashboard")}
                >
                  <Link to="/base/dashboard">
                    <ChartNoAxesCombinedIcon />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {}
        <SidebarGroup>
          <SidebarGroupLabel>Vistas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/base/table")}>
                  <Link to="/base/table">
                    <Table2Icon />
                    <span>Vista Tabla</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/base/kanban")}>
                  <Link to="/base/kanban">
                    <Columns3Icon />
                    <span>Pipeline Kanban</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/base/consultorias")}
                >
                  <Link to="/base/consultorias">
                    <ClipboardListIcon />
                    <span>Consultorías</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {}
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/base/analytics")}
                >
                  <Link to="/base/analytics">
                    <TrendingUpIcon />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/users")}>
                  <Link to="/admin/users">
                    <UsersIcon />
                    <span>Gestión de Usuarios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/base/settings">
                    <SettingsIcon />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}


