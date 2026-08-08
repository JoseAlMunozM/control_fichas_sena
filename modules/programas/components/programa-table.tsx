"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import {
  Badge,
  Button,
  Table,
  type TableColumn,
} from "@/components/ui";

import type { ProgramaDto } from "../types";
import { ProgramaEmptyState } from "./programa-empty-state";

export interface ProgramaTableProps {
  programas: readonly ProgramaDto[];
  disabled?: boolean;
  emptyState?: ReactNode;
  onDelete?: (programa: ProgramaDto) => void;
  onEdit?: (programa: ProgramaDto) => void;
}

export function ProgramaTable({
  disabled = false,
  emptyState,
  onDelete,
  onEdit,
  programas,
}: ProgramaTableProps) {
  const columns: readonly TableColumn<ProgramaDto>[] = [
    {
      id: "codigo",
      header: "Código",
      render: (programa) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {programa.codigo}
        </span>
      ),
    },
    {
      id: "nombre",
      header: "Nombre",
      render: (programa) => programa.nombre,
    },
    {
      id: "descripcion",
      header: "Descripción",
      cellClassName: "max-w-md whitespace-normal",
      render: (programa) =>
        programa.descripcion || (
          <span className="text-zinc-400">Sin descripción</span>
        ),
    },
    {
      id: "plan",
      header: "Plan activo",
      render: (programa) => {
        const activePlan = programa.planes.find((plan) => plan.estado);

        return activePlan ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {activePlan.version}
            </p>
            <p className="text-xs text-zinc-500">
              {activePlan.competencias.length} competencias · {activePlan.totalHoras} horas
            </p>
          </div>
        ) : (
          <Badge variant="warning">Sin plan activo</Badge>
        );
      },
    },
    {
      id: "estado",
      header: "Estado",
      render: (programa) => (
        <Badge variant={programa.estado ? "success" : "neutral"}>
          {programa.estado ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    ...onEdit || onDelete
      ? [
          {
            id: "actions",
            header: "Acciones",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (programa: ProgramaDto) => (
              <div className="flex justify-end gap-2">
                <Link
                  className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
                  href={`/programas/${programa.id}`}
                >
                  Administrar plan
                </Link>
                {onEdit ? (
                  <Button
                    aria-label={`Editar ${programa.nombre}`}
                    disabled={disabled}
                    onClick={() => onEdit(programa)}
                    size="sm"
                    variant="ghost"
                  >
                    Editar
                  </Button>
                ) : null}
                {onDelete ? (
                  <Button
                    aria-label={`Eliminar ${programa.nombre}`}
                    disabled={disabled}
                    onClick={() => onDelete(programa)}
                    size="sm"
                    variant="danger"
                  >
                    Eliminar
                  </Button>
                ) : null}
              </div>
            ),
          },
        ]
      : [],
  ];

  if (programas.length === 0) {
    return emptyState ?? <ProgramaEmptyState />;
  }

  return (
    <Table
      caption="Listado de programas"
      columns={columns}
      data={programas}
      getRowKey={(programa) => programa.id}
    />
  );
}
