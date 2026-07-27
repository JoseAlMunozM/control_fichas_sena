"use client";

import type { ReactNode } from "react";

import { Button, type ButtonVariant } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  confirmVariant?: Extract<ButtonVariant, "danger" | "primary">;
  isLoading?: boolean;
}

export function ConfirmDialog({
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  confirmVariant = "danger",
  description,
  isLoading = false,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      closeOnBackdrop={!isLoading}
      showCloseButton={!isLoading}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText={confirmLabel}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="text-sm leading-6 text-zinc-600">{description}</div>
    </Modal>
  );
}
