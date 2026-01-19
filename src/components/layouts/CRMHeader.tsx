import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useModals } from "@/hooks/useModals";
import { useBreadcrumbs } from "@/utils/navigationConfig";
import { LogOutIcon, PlusIcon } from "lucide-react";

interface CRMHeaderProps {
  showSidebarTrigger?: boolean;
  showBreadcrumbs?: boolean;
}

export function CRMHeader({
  showSidebarTrigger = true,
  showBreadcrumbs = true,
}: CRMHeaderProps) {
  const { user, signOut } = useAuth();
  const { openCreateModal } = useModals();
  const { pathname } = useLocation();
  const breadcrumbs = useBreadcrumbs(pathname);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-card sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
        {/* Left: Menu + Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {showSidebarTrigger && (
            <>
              <SidebarTrigger className="[&_svg]:!size-5 flex-shrink-0" />
              <Separator
                orientation="vertical"
                className="hidden !h-4 sm:block"
              />
            </>
          )}

          {!showSidebarTrigger && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  N
                </span>
              </div>
              <span className="font-semibold text-foreground hidden sm:block">
                NEXO CRM
              </span>
            </div>
          )}

          {showBreadcrumbs && (
            <Breadcrumb className="hidden sm:block flex-1 min-w-0">
              <BreadcrumbList>
                {breadcrumbs.map((item, idx) => (
                  <div key={item.path} className="flex items-center gap-2">
                    {idx > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {idx === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.path}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={openCreateModal}
            className="hidden sm:flex"
          >
            <PlusIcon className="size-4" />
            <span>Nueva Oportunidad</span>
            <kbd className="ml-2 text-xs text-muted-foreground">Ctrl+N</kbd>
          </Button>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            title="Cerrar sesión"
          >
            <LogOutIcon className="size-4" />
          </Button>

          <Button variant="ghost" size="icon" className="size-9 flex-shrink-0">
            <Avatar className="size-9 rounded-md">
              <AvatarFallback className="rounded-md">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
