import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CRMSidebar } from "./CRMSidebar";
import { CRMHeader } from "./CRMHeader";
import { CRMFooter } from "./CRMFooter";
import { Toast } from "@/components/shared/Toast";
import { useToast } from "@/hooks/useToast";

export function AppShell() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex min-h-dvh w-full bg-background text-foreground">
      <SidebarProvider>
        <CRMSidebar />

        <div className="flex flex-1 flex-col">
          <CRMHeader />

          <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
            <Outlet /> {}
          </main>

          <CRMFooter />
        </div>
      </SidebarProvider>

      {}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}


