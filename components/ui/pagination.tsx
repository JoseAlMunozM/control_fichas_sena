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
  const safeTotalPages = Math.max(0, Math.trunc(totalPages));

  if (safeTotalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(
    Math.max(1, Math.trunc(currentPage)),
    safeTotalPages,
  );
  const items = getPaginationItems(
    safeCurrentPage,
    safeTotalPages,
    siblingCount,
  );

  return (
    <nav aria-label={ariaLabel} className="flex items-center justify-center gap-1">
      <Button
        variant="secondary"
        size="sm"
        disabled={disabled || safeCurrentPage <= 1}
        onClick={() => onPageChange(safeCurrentPage - 1)}
      >
        Anterior
      </Button>

      {items.map((item) =>
        typeof item === "number" ? (
          <Button
            key={item}
            variant={item === safeCurrentPage ? "primary" : "secondary"}
            size="sm"
            disabled={disabled}
            aria-current={item === safeCurrentPage ? "page" : undefined}
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
        disabled={disabled || safeCurrentPage >= safeTotalPages}
        onClick={() => onPageChange(safeCurrentPage + 1)}
      >
        Siguiente
      </Button>
    </nav>
  );
}
