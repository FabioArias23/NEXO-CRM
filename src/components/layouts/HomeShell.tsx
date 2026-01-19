import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CRMSidebar } from "./CRMSidebar";
import { CRMHeader } from "./CRMHeader";
import { CRMFooter } from "./CRMFooter";
import { ToastContainer } from "@/components/shared/Toast";
import { useToast } from "@/hooks/useToast";
import { HomeWorkspace } from "@/pages/HomeWorkspace";

export function HomeShell() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex min-h-dvh w-full bg-background text-foreground">
      <SidebarProvider>
        <CRMSidebar />

        <div className="flex flex-1 flex-col">
          <CRMHeader />

          <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
            <HomeWorkspace />
          </main>

          <CRMFooter />
        </div>
      </SidebarProvider>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
