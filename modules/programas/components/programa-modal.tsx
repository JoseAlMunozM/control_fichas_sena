"use client";

import type { ReactNode } from "react";

import { Modal } from "@/components/ui";

export type ProgramaModalMode = "create" | "edit";

export interface ProgramaModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  footer?: ReactNode;
  mode?: ProgramaModalMode;
  title?: ReactNode;
}

export function ProgramaModal({
  children,
  footer,
  isOpen,
  mode = "create",
  onClose,
  title,
}: ProgramaModalProps) {
  const resolvedTitle =
    title ??
    (mode === "create" ? "Crear programa" : "Editar programa");

  return (
    <Modal
      footer={footer}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={resolvedTitle}
    >
      {children}
    </Modal>
  );
}
