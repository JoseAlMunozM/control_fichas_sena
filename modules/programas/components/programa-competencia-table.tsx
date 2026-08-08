"use client";

import { Badge, Button, Table, type TableColumn } from "@/components/ui";

import { COMPETENCIA_TIPO, COMPETENCIA_TIPO_LABELS } from "../constants";
import type { PlanCompetenciaEntity } from "../types";

export interface ProgramaCompetenciaTableProps {
  competencias: readonly PlanCompetenciaEntity[];
  disabled?: boolean;
  onEdit: (competencia: PlanCompetenciaEntity) => void;
  onRemove: (competencia: PlanCompetenciaEntity) => void;
}

const typeVariants = {
  [COMPETENCIA_TIPO.TECNICA]: "info",
  [COMPETENCIA_TIPO.TRANSVERSAL]: "warning",
  [COMPETENCIA_TIPO.PRACTICA]: "success",
} as const;

export function ProgramaCompetenciaTable({
  competencias,
  disabled = false,
  onEdit,
  onRemove,
}: ProgramaCompetenciaTableProps) {
  const columns: readonly TableColumn<PlanCompetenciaEntity>[] = [
    {
      id: "orden",
      header: "Orden",
      render: (competencia) => competencia.orden,
    },
    {
      id: "competencia",
      header: "Competencia",
      cellClassName: "min-w-80 whitespace-normal",
      render: (competencia) => (
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {competencia.nombre}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {competencia.norma}
          </p>
        </div>
      ),
    },
    {
      id: "tipo",
      header: "Tipo",
      render: (competencia) => (
        <Badge variant={typeVariants[competencia.tipo]}>
          {COMPETENCIA_TIPO_LABELS[competencia.tipo]}
        </Badge>
      ),
    },
    {
      id: "horas",
      header: "Horas",
      render: (competencia) => competencia.horas,
    },
    {
      id: "actions",
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (competencia) => (
        <div className="flex justify-end gap-2">
          <Button
            disabled={disabled}
            onClick={() => onEdit(competencia)}
            size="sm"
            variant="ghost"
          >
            Editar
          </Button>
          <Button
            disabled={disabled}
            onClick={() => onRemove(competencia)}
            size="sm"
            variant="danger"
          >
            Quitar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      caption="Competencias del plan de formación"
      columns={columns}
      data={competencias}
      emptyState="Este plan todavía no tiene competencias."
      getRowKey={(competencia) => competencia.id}
    />
  );
}
