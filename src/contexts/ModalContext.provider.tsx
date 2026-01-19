import { createContext, type ReactNode } from "react";

export interface ModalContextType {
  showCommandPalette: boolean;
  setShowCommandPalette: (show: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);


