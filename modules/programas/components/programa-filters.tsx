"use client";

import { Button, Card, Input, SearchInput, Select } from "@/components/ui";

import type { ProgramaFilters } from "../types";

const estadoOptions = [
  {
    label: "Todos",
    value: "all",
  },
  {
    label: "Activos",
    value: "active",
  },
  {
    label: "Inactivos",
    value: "inactive",
  },
] as const;

export interface ProgramaFiltersProps {
  filters: ProgramaFilters;
  onSearchChange: (value: string) => void;
  onCodigoChange: (value: string) => void;
  onNombreChange: (value: string) => void;
  onEstadoChange: (value: boolean | undefined) => void;
  disabled?: boolean;
  onApply?: () => void;
  onClear?: () => void;
}

export function ProgramaFiltersPanel({
  disabled = false,
  filters,
  onApply,
  onClear,
  onCodigoChange,
  onEstadoChange,
  onNombreChange,
  onSearchChange,
}: ProgramaFiltersProps) {
  const estadoValue =
    filters.estado === undefined
      ? "all"
      : filters.estado
        ? "active"
        : "inactive";

  return (
    <Card title="Filtros">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SearchInput
          disabled={disabled}
          label="Búsqueda general"
          onValueChange={onSearchChange}
          placeholder="Buscar programas..."
          value={filters.search ?? ""}
        />
        <Input
          disabled={disabled}
          label="Código"
          onChange={(event) => onCodigoChange(event.target.value)}
          placeholder="Filtrar por código"
          value={filters.codigo ?? ""}
        />
        <Input
          disabled={disabled}
          label="Nombre"
          onChange={(event) => onNombreChange(event.target.value)}
          placeholder="Filtrar por nombre"
          value={filters.nombre ?? ""}
        />
        <Select
          disabled={disabled}
          label="Estado"
          onChange={(event) => {
            const value = event.target.value;

            onEstadoChange(
              value === "all" ? undefined : value === "active",
            );
          }}
          options={estadoOptions}
          value={estadoValue}
        />
      </div>

      {onApply || onClear ? (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {onClear ? (
            <Button
              disabled={disabled}
              onClick={onClear}
              size="sm"
              variant="ghost"
            >
              Limpiar filtros
            </Button>
          ) : null}
          {onApply ? (
            <Button
              disabled={disabled}
              onClick={onApply}
              size="sm"
            >
              Aplicar filtros
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
