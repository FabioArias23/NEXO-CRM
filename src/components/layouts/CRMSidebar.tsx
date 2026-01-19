"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAVIGATION, type NavItem } from "@/utils/navigationConfig";
import { ChevronRight, Clock, LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

export function CRMSidebar() {
  const { pathname } = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "/base/views": true,
  });

  // Filtrar items según permisos
  const filteredNav = APP_NAVIGATION.filter((item) => {
    if (item.path === "/base/admin" && !isAdmin) return false;
    if (item.children) {
      item.children = item.children.filter((child) => {
        if (child.path === "/admin/users" && !isAdmin) return false;
        return true;
      });
      return item.children.length > 0 || item.path !== "/base/admin";
    }
    return true;
  });

  const toggleExpanded = (path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarContent className="flex flex-col h-full">
        {/* Header / Branding */}
        <div className="px-4 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-foreground tracking-tight">
                NEXO CRM
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Enterprise
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarGroup className="pb-0">
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">
              Navegación
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {filteredNav.map((item) => (
                  <NavItemComponent
                    key={item.path}
                    item={item}
                    pathname={pathname}
                    expandedItems={expandedItems}
                    onToggleExpanded={toggleExpanded}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Actions Section */}
          <div className="mt-8 pt-4 border-t border-border/50">
            <SidebarGroup className="pb-0">
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">
                Acciones Rápidas
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2">
                  <Link
                    to="/base/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground text-muted-foreground group"
                  >
                    <Plus className="w-4 h-4 flex-shrink-0" />
                    <span>Nueva Oportunidad</span>
                    <kbd className="ml-auto text-xs text-muted-foreground/70 font-mono">
                      ⌘N
                    </kbd>
                  </Link>
                  <Link
                    to="/base/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground text-muted-foreground group"
                  >
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Actividades</span>
                  </Link>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-0" />

        {/* User Profile Section */}
        <div className="px-3 py-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-sm">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            {isAdmin && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                Admin
              </Badge>
            )}
          </div>

          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

// Componente recursivo para items de navegación
interface NavItemComponentProps {
  item: NavItem;
  pathname: string;
  expandedItems: Record<string, boolean>;
  onToggleExpanded: (path: string) => void;
}

function NavItemComponent({
  item,
  pathname,
  expandedItems,
  onToggleExpanded,
}: NavItemComponentProps) {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems[item.path] ?? false;
  const isActive = pathname === item.path;
  const isParentActive =
    pathname.startsWith(item.path + "/") && item.path !== "/base";
  const isAnyChildActive = item.children?.some(
    (child) => pathname === child.path || pathname.startsWith(child.path + "/"),
  );

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive || isParentActive}
          className="text-sm font-medium transition-all"
        >
          <Link to={item.path} className="gap-3">
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Con children (items anidados)
  return (
    <SidebarMenuItem>
      <div
        className={`flex items-center gap-0 rounded-lg transition-colors ${
          isAnyChildActive ? "bg-primary/5" : ""
        }`}
      >
        <SidebarMenuButton
          asChild
          isActive={isAnyChildActive || isActive}
          className="text-sm font-medium flex-1"
        >
          <Link to={item.path} className="gap-3">
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>

        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleExpanded(item.path);
          }}
          className="px-2 py-2 hover:bg-accent rounded-md transition-colors ml-auto"
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        </button>
      </div>

      {/* Nested Items */}
      {hasChildren && isExpanded && (
        <SidebarMenuSub className="ml-0 px-0">
          {item.children.map((child) => {
            const ChildIcon = child.icon;
            const isChildActive = pathname === child.path;
            return (
              <SidebarMenuSubItem key={child.path} className="pl-2">
                <SidebarMenuSubButton
                  asChild
                  isActive={isChildActive}
                  className="text-sm font-normal pl-6"
                >
                  <Link to={child.path} className="gap-3">
                    {ChildIcon && (
                      <ChildIcon className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{child.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      )}

      {/* Collapsed indicator */}
      {hasChildren && !isExpanded && isAnyChildActive && (
        <div className="text-xs text-muted-foreground px-4 py-1">
          {isAnyChildActive && (
            <Badge variant="secondary" className="text-xs">
              +{item.children.length}
            </Badge>
          )}
        </div>
      )}
    </SidebarMenuItem>
  );
}

// Types
interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}
