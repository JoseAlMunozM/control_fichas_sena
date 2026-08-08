"use client";

import {
  Badge,
  Button,
  Table,
  type TableColumn,
} from "@/components/ui";
import { formatFichaDate } from "@/modules/fichas/utils";

import {
  PRORROGA_ESTADO,
  PRORROGA_ESTADO_LABELS,
} from "../constants";
import type { ProrrogaDto } from "../types";

export interface ProrrogaTableProps {
  prorrogas: readonly ProrrogaDto[];
  disabled?: boolean;
  onEdit: (prorroga: ProrrogaDto) => void;
  onDelete: (prorroga: ProrrogaDto) => void;
  onResolve: (
    prorroga: ProrrogaDto,
    estado: "APROBADA" | "RECHAZADA",
  ) => void;
}

const statusVariants = {
  [PRORROGA_ESTADO.PENDIENTE]: "warning",
  [PRORROGA_ESTADO.APROBADA]: "success",
  [PRORROGA_ESTADO.RECHAZADA]: "danger",
} as const;

export function ProrrogaTable({
  disabled = false,
  onDelete,
  onEdit,
  onResolve,
  prorrogas,
}: ProrrogaTableProps) {
  const columns: readonly TableColumn<ProrrogaDto>[] = [
    {
      id: "ficha",
      header: "Ficha",
      cellClassName: "min-w-48 whitespace-normal",
      render: (prorroga) => (
        <div>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            {prorroga.fichaNumero}
          </p>
          <p className="text-xs text-zinc-500">{prorroga.municipio}</p>
        </div>
      ),
    },
    {
      id: "programa",
      header: "Programa",
      cellClassName: "min-w-64 whitespace-normal",
      render: (prorroga) => prorroga.programaNombre,
    },
    {
      id: "actuales",
      header: "Fechas actuales",
      cellClassName: "min-w-52 whitespace-normal",
      render: (prorroga) => (
        <div className="space-y-1 text-xs">
          <p>Lectiva: {formatFichaDate(prorroga.fechaFinLectivaAnterior)}</p>
          <p>Práctica: {formatFichaDate(prorroga.fechaFinPracticaAnterior)}</p>
        </div>
      ),
    },
    {
      id: "nuevas",
      header: "Fechas solicitadas",
      cellClassName: "min-w-52 whitespace-normal",
      render: (prorroga) => (
        <div className="space-y-1 text-xs font-medium text-zinc-900 dark:text-zinc-100">
          <p>Lectiva: {formatFichaDate(prorroga.fechaFinLectivaNueva)}</p>
          <p>Práctica: {formatFichaDate(prorroga.fechaFinPracticaNueva)}</p>
        </div>
      ),
    },
    {
      id: "motivo",
      header: "Motivo",
      cellClassName: "min-w-64 whitespace-normal",
      render: (prorroga) => (
        <div>
          <p>{prorroga.motivo}</p>
          {prorroga.observacionRespuesta ? (
            <p className="mt-1 text-xs text-zinc-500">
              Respuesta: {prorroga.observacionRespuesta}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      render: (prorroga) => (
        <Badge variant={statusVariants[prorroga.estado]}>
          {PRORROGA_ESTADO_LABELS[prorroga.estado]}
        </Badge>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "min-w-72 whitespace-nowrap text-right",
      render: (prorroga) =>
        prorroga.estado === PRORROGA_ESTADO.PENDIENTE ? (
          <div className="flex justify-end gap-2">
            <Button
              disabled={disabled}
              onClick={() => onEdit(prorroga)}
              size="sm"
              variant="ghost"
            >
              Editar
            </Button>
            <Button
              disabled={disabled}
              onClick={() => onResolve(prorroga, PRORROGA_ESTADO.APROBADA)}
              size="sm"
            >
              Aprobar
            </Button>
            <Button
              disabled={disabled}
              onClick={() => onResolve(prorroga, PRORROGA_ESTADO.RECHAZADA)}
              size="sm"
              variant="secondary"
            >
              Rechazar
            </Button>
            <Button
              disabled={disabled}
              onClick={() => onDelete(prorroga)}
              size="sm"
              variant="danger"
            >
              Eliminar
            </Button>
          </div>
        ) : (
          <span className="text-xs text-zinc-500">
            Histórico conservado
          </span>
        ),
    },
  ];

  return (
    <Table
      caption="Solicitudes de prórroga"
      columns={columns}
      data={prorrogas}
      getRowKey={(prorroga) => prorroga.id}
      tableClassName="min-w-[1500px]"
    />
  );
}
