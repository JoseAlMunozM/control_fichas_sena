import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui";

export interface ProgramaEmptyStateProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function ProgramaEmptyState({
  action,
  description = "No hay programas para mostrar con los criterios actuales.",
  title = "No se encontraron programas",
}: ProgramaEmptyStateProps) {
  return (
    <EmptyState
      action={action}
      description={description}
      title={title}
    />
  );
}
