"use client";

import Link from "next/link";

import {
  Badge,
  Button,
  Table,
  type TableColumn,
} from "@/components/ui";

import { FICHA_ESTADO, FICHA_ESTADO_LABELS } from "../constants";
import type { FichaDto } from "../types";
import { formatFichaDate, formatFichaSchedule } from "../utils";

export interface FichaTableProps {
  fichas: readonly FichaDto[];
  disabled?: boolean;
  onEdit: (ficha: FichaDto) => void;
  onDelete: (ficha: FichaDto) => void;
}

const statusVariants = {
  [FICHA_ESTADO.PLANEADA]: "neutral",
  [FICHA_ESTADO.EN_FORMACION]: "info",
  [FICHA_ESTADO.ETAPA_PRACTICA]: "warning",
  [FICHA_ESTADO.FINALIZADA]: "success",
  [FICHA_ESTADO.CANCELADA]: "danger",
} as const;

export function FichaTable({
  disabled = false,
  fichas,
  onDelete,
  onEdit,
}: FichaTableProps) {
  const columns: readonly TableColumn<FichaDto>[] = [
    {
      id: "numero",
      header: "Ficha",
      render: (ficha) => (
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {ficha.numero}
          </p>
          <p className="text-xs text-zinc-500">Plan {ficha.planVersion}</p>
        </div>
      ),
    },
    {
      id: "programa",
      header: "Programa",
      cellClassName: "max-w-72 whitespace-normal",
      render: (ficha) => (
        <div>
          <p>{ficha.programaNombre}</p>
          <p className="text-xs text-zinc-500">{ficha.programaCodigo}</p>
        </div>
      ),
    },
    {
      id: "ubicacion",
      header: "Ubicación",
      render: (ficha) =>
        ficha.sede ? `${ficha.municipio} · ${ficha.sede}` : ficha.municipio,
    },
    {
      id: "jornada",
      header: "Jornada",
      cellClassName: "max-w-64 whitespace-normal",
      render: (ficha) =>
        formatFichaSchedule(
          ficha.diasFormacion,
          ficha.horaInicio,
          ficha.horaFin,
        ),
    },
    {
      id: "finLectiva",
      header: "Fin lectivo",
      render: (ficha) => formatFichaDate(ficha.fechaFinLectiva),
    },
    {
      id: "estado",
      header: "Estado",
      render: (ficha) => (
        <Badge variant={statusVariants[ficha.estado]}>
          {FICHA_ESTADO_LABELS[ficha.estado]}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (ficha) => (
        <div className="flex justify-end gap-2">
          <Link
            className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
            href={`/fichas/${ficha.id}`}
          >
            Ver detalle
          </Link>
          <Button
            disabled={disabled}
            onClick={() => onEdit(ficha)}
            size="sm"
            variant="ghost"
          >
            Editar
          </Button>
          <Button
            disabled={disabled}
            onClick={() => onDelete(ficha)}
            size="sm"
            variant="danger"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      caption="Listado de fichas"
      columns={columns}
      data={fichas}
      getRowKey={(ficha) => ficha.id}
    />
  );
}
