import { useContext } from "react";
import {
  ModalContext,
  type ModalContextType,
} from "@/contexts/ModalContext.provider";

export const useModals = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within ModalProvider");
  }
  return context;
};


