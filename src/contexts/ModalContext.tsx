import { useState, useEffect, type ReactNode } from "react";
import {
  ModalContext as ModalContextProvider,
  type ModalContextType,
} from "./ModalContext.provider";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { OpportunityModal } from "@/components/modals/OpportunityModal";

export function ModalProvider({ children }: { children: ReactNode }) {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCreateModal(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const contextValue: ModalContextType = {
    showCommandPalette,
    setShowCommandPalette,
    showCreateModal,
    setShowCreateModal,
    openCommandPalette: () => setShowCommandPalette(true),
    closeCommandPalette: () => setShowCommandPalette(false),
    openCreateModal: () => setShowCreateModal(true),
    closeCreateModal: () => setShowCreateModal(false),
  };

  return (
    <ModalContextProvider.Provider value={contextValue}>
      {children}

      {}
      {showCommandPalette && (
        <CommandPalette
          open={showCommandPalette}
          onOpenChange={setShowCommandPalette}
        />
      )}

      {}
      {showCreateModal && (
        <OpportunityModal
          opportunity={undefined}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </ModalContextProvider.Provider>
  );
}


