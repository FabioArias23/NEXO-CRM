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
import { LogOutIcon, PlusIcon } from "lucide-react";

interface CRMHeaderProps {
  showSidebarTrigger?: boolean;
}

export function CRMHeader({ showSidebarTrigger = true }: CRMHeaderProps) {
  const { user, signOut } = useAuth();
  const { openCreateModal } = useModals();

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
        <div className="flex items-center gap-4">
          {showSidebarTrigger ? (
            <>
              <SidebarTrigger className="[&_svg]:!size-5" />
              <Separator
                orientation="vertical"
                className="hidden !h-4 sm:block"
              />
            </>
          ) : (
            // Logo para HomeShell (sin sidebar)
            <div className="flex items-center gap-3">
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

          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">NEXO</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>CRM</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {}
        <div className="flex items-center gap-1.5">
          {}
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

          {}
          <ThemeToggle />

          {}
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            title="Cerrar sesión"
          >
            <LogOutIcon className="size-4" />
          </Button>

          {}
          <Button variant="ghost" size="icon" className="size-9">
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
