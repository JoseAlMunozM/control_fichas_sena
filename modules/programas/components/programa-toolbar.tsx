"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui";

export interface ProgramaToolbarProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  createLabel?: string;
  onCreate?: () => void;
}

export function ProgramaToolbar({
  actions,
  createLabel = "Nuevo programa",
  description = "Administra los programas disponibles.",
  onCreate,
  title = "Programas",
}: ProgramaToolbarProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {onCreate ? (
          <Button onClick={onCreate}>{createLabel}</Button>
        ) : null}
      </div>
    </div>
  );
}
