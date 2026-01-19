import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Table2,
  Columns3,
  ClipboardList,
  TrendingUp,
  Users,
  Settings,
  Shield,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  children?: NavItem[];
}

export const APP_NAVIGATION: NavItem[] = [
  {
    label: "Dashboard",
    path: "/base/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Vistas",
    path: "/base/views",
    icon: Columns3,
    children: [
      { label: "Vista Tabla", path: "/base/table", icon: Table2 },
      { label: "Pipeline Kanban", path: "/base/kanban", icon: ClipboardList },
      { label: "Consultorías", path: "/base/consultorias", icon: Users },
    ],
  },
  {
    label: "Administración",
    path: "/base/admin",
    icon: Settings,
    children: [
      { label: "Analytics", path: "/base/analytics", icon: TrendingUp },
      { label: "Gestión de Usuarios", path: "/admin/users", icon: Shield },
    ],
  },
];

// Hook para obtener breadcrumbs basado en ruta actual
export function useBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ label: "NEXO", path: "/" }];

  if (pathname === "/" || pathname === "") {
    return breadcrumbs;
  }

  if (pathname.startsWith("/base")) {
    breadcrumbs.push({ label: "CRM", path: "/base/dashboard" });

    // Buscar en navegación
    const findInNav = (items: NavItem[], current: string[]): NavItem | null => {
      for (const item of items) {
        if (item.path === current[current.length - 1]) return item;
        if (item.children) {
          const found = findInNav(item.children, current);
          if (found) return found;
        }
      }
      return null;
    };

    const parts = pathname.split("/");
    const found = findInNav(APP_NAVIGATION, parts);

    if (found) {
      breadcrumbs.push({ label: found.label, path: found.path });
    } else {
      // Fallback para rutas sin configurar
      const lastPart = parts[parts.length - 1];
      breadcrumbs.push({
        label: lastPart.charAt(0).toUpperCase() + lastPart.slice(1),
        path: pathname,
      });
    }
  }

  return breadcrumbs;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}
