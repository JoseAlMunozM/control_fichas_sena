"use client";

import { Button } from "@/components/ui/button";
import { getPaginationItems } from "@/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
  ariaLabel?: string;
}

export function Pagination({
  ariaLabel = "Paginación",
  currentPage,
  disabled = false,
  onPageChange,
  siblingCount = 1,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(
    currentPage,
    totalPages,
    siblingCount,
  );

  return (
    <nav aria-label={ariaLabel} className="flex items-center justify-center gap-1">
      <Button
        variant="secondary"
        size="sm"
        disabled={disabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </Button>

      {items.map((item) =>
        typeof item === "number" ? (
          <Button
            key={item}
            variant={item === currentPage ? "primary" : "secondary"}
            size="sm"
            disabled={disabled}
            aria-current={item === currentPage ? "page" : undefined}
            aria-label={`Página ${item}`}
            className="min-w-8 px-2"
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ) : (
          <span
            key={item}
            aria-hidden="true"
            className="flex size-8 items-center justify-center text-zinc-500"
          >
            &hellip;
          </span>
        ),
      )}

      <Button
        variant="secondary"
        size="sm"
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </Button>
    </nav>
  );
}
