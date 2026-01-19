import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeWorkspaceSidebar } from "./HomeWorkspaceSidebar";
import { CRMHeader } from "./CRMHeader";
import { CRMFooter } from "./CRMFooter";
import { ToastContainer } from "@/components/shared/Toast";
import { useToast } from "@/hooks/useToast";

export function HomeShell() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex min-h-dvh w-full bg-background text-foreground">
      <SidebarProvider>
        <HomeWorkspaceSidebar />

        <div className="flex flex-1 flex-col">
          <CRMHeader showSidebarTrigger={false} showBreadcrumbs={false} />

          <main className="flex-1">
            <Outlet />
          </main>

          <CRMFooter />
        </div>
      </SidebarProvider>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
