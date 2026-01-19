import { useLocation } from "react-router";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
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
import { APP_NAVIGATION, type NavItem } from "@/utils/navigationConfig";
import { useAuth } from "@/contexts/AuthContext";

export function CRMSidebar() {
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();

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

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredNav.map((item) => (
              <NavItemComponent
                key={item.path}
                item={item}
                pathname={pathname}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// Componente recursivo para manejar items con children
interface NavItemComponentProps {
  item: NavItem;
  pathname: string;
}

function NavItemComponent({ item, pathname }: NavItemComponentProps) {
  const Icon = item.icon;
  const isActive =
    pathname === item.path || pathname.startsWith(item.path + "/");
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link to={item.path}>
            {Icon && <Icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Con children (items anidados)
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={item.path}>
          {Icon && <Icon className="h-4 w-4" />}
          <span>{item.label}</span>
          {hasChildren && (
            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          )}
        </Link>
      </SidebarMenuButton>

      {hasChildren && (
        <SidebarMenuSub>
          {item.children.map((child) => (
            <SidebarMenuSubItem key={child.path}>
              <SidebarMenuSubButton asChild isActive={pathname === child.path}>
                <Link to={child.path}>
                  <span>{child.label}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
