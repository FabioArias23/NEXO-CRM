import { Link } from "react-router";
import { Plus, Folder, Star } from "lucide-react";
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

interface Workspace {
  id: string;
  name: string;
  icon?: React.ReactNode;
  isFavorite?: boolean;
}

const WORKSPACES: Workspace[] = [
  { id: "1", name: "Nexo Consultoría", isFavorite: true },
  { id: "2", name: "Base Clientes", isFavorite: false },
];

export function HomeWorkspaceSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Logo */}
        <SidebarGroup>
          <div className="px-4 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold">N</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">NEXO CRM</h2>
                <p className="text-xs text-muted-foreground">Workspace</p>
              </div>
            </div>
          </div>
        </SidebarGroup>

        {/* Favoritos */}
        <SidebarGroup>
          <SidebarGroupLabel>Favoritos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {WORKSPACES.filter((w) => w.isFavorite).map((ws) => (
                <SidebarMenuItem key={ws.id}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-lg px-3 py-2 transition-colors">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{ws.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Espacios de Trabajo */}
        <SidebarGroup>
          <SidebarGroupLabel>Espacios de Trabajo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {WORKSPACES.map((ws) => (
                <SidebarMenuItem key={ws.id}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-lg px-3 py-2 transition-colors">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span>{ws.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-lg px-3 py-2 transition-colors text-muted-foreground hover:text-foreground">
                    <Plus className="h-4 w-4" />
                    <span>Nuevo Espacio</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
