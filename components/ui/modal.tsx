"use client";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

import { cn } from "@/utils";

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
} as const;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof sizeStyles;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  children,
  className,
  closeOnBackdrop = true,
  footer,
  isOpen,
  onClose,
  showCloseButton = true,
  size = "md",
  title,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-xl bg-transparent p-0 backdrop:bg-black/50",
        sizeStyles[size],
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2 id={titleId} className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="flex size-8 items-center justify-center rounded-lg text-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          ) : null}
        </div>

        <div className="overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/50">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
