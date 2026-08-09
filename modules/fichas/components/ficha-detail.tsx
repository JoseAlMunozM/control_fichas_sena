"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  Table,
  type TableColumn,
} from "@/components/ui";
import type { InstructorDto } from "@/modules/instructores/types";
import {
  COMPETENCIA_TIPO,
  COMPETENCIA_TIPO_LABELS,
} from "@/modules/programas/constants";

import {
  FICHA_ESTADO,
  FICHA_ESTADO_LABELS,
  SEGUIMIENTO_ESTADO,
  SEGUIMIENTO_ESTADO_LABELS,
} from "../constants";
import type {
  FichaDto,
  FichaSeguimientoDto,
} from "../types";
import { formatFichaDate, formatFichaSchedule } from "../utils";
import { ProgramacionManagerModal } from "./programacion-manager-modal";
import { FichaLeaderHistoryModal } from "./ficha-leader-history-modal";

export interface FichaDetailProps {
  ficha: FichaDto;
  instructores: readonly InstructorDto[];
}

const fichaStatusVariants = {
  [FICHA_ESTADO.PLANEADA]: "neutral",
  [FICHA_ESTADO.EN_FORMACION]: "info",
  [FICHA_ESTADO.ETAPA_PRACTICA]: "warning",
  [FICHA_ESTADO.FINALIZADA]: "success",
  [FICHA_ESTADO.CANCELADA]: "danger",
} as const;

const seguimientoStatusVariants = {
  [SEGUIMIENTO_ESTADO.PENDIENTE]: "neutral",
  [SEGUIMIENTO_ESTADO.PROGRAMADA]: "info",
  [SEGUIMIENTO_ESTADO.EN_EJECUCION]: "progress",
  [SEGUIMIENTO_ESTADO.FINALIZADA]: "success",
  [SEGUIMIENTO_ESTADO.SUSPENDIDA]: "suspended",
  [SEGUIMIENTO_ESTADO.CANCELADA]: "danger",
} as const;

const competenciaTypeVariants = {
  [COMPETENCIA_TIPO.TECNICA]: "info",
  [COMPETENCIA_TIPO.TRANSVERSAL]: "warning",
  [COMPETENCIA_TIPO.PRACTICA]: "success",
} as const;

export function FichaDetail({
  ficha: initialFicha,
  instructores,
}: FichaDetailProps) {
  const [ficha, setFicha] = useState(initialFicha);
  const [selectedSeguimientoId, setSelectedSeguimientoId] =
    useState<string | null>(null);
  const [isLeaderHistoryOpen, setIsLeaderHistoryOpen] = useState(false);
  const selectedSeguimiento = ficha.seguimientos.find(
    (seguimiento) => seguimiento.id === selectedSeguimientoId,
  );
  const completedCount = ficha.seguimientos.filter(
    (seguimiento) => seguimiento.estado === SEGUIMIENTO_ESTADO.FINALIZADA,
  ).length;
  const totalHours = ficha.seguimientos.reduce(
    (total, seguimiento) => total + seguimiento.horasPlan,
    0,
  );

  const columns: readonly TableColumn<FichaSeguimientoDto>[] = [
    {
      id: "orden",
      header: "Orden",
      render: (seguimiento) => seguimiento.orden,
    },
    {
      id: "competencia",
      header: "Competencia",
      cellClassName: "min-w-80 whitespace-normal",
      render: (seguimiento) => (
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {seguimiento.competenciaNombre}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {seguimiento.competenciaNorma}
          </p>
        </div>
      ),
    },
    {
      id: "tipo",
      header: "Tipo",
      render: (seguimiento) => (
        <Badge variant={competenciaTypeVariants[seguimiento.competenciaTipo]}>
          {COMPETENCIA_TIPO_LABELS[seguimiento.competenciaTipo]}
        </Badge>
      ),
    },
    {
      id: "horas",
      header: "Horas",
      render: (seguimiento) => {
        const programmedHours = seguimiento.programaciones.reduce(
          (total, programacion) => total + programacion.horasProgramadas,
          0,
        );
        return (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {programmedHours} h programadas
            </p>
            <p className="text-xs text-zinc-500">
              {Math.max(0, seguimiento.horasPlan - programmedHours)} pendientes
              {" · "}{seguimiento.horasPlan} del plan
            </p>
          </div>
        );
      },
    },
    {
      id: "programacion",
      header: "Instructor y horario",
      cellClassName: "min-w-64 whitespace-normal",
      render: (seguimiento) =>
        seguimiento.programaciones.length > 0 ? (
          <div className="space-y-1.5">
            {seguimiento.programaciones.slice(0, 2).map((programacion) => (
              <div key={programacion.id}>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {programacion.instructorNombre}
                </p>
                <p className="text-xs text-zinc-500">
                  {programacion.bloques
                    .map(
                      (block) =>
                        `${block.dia.slice(0, 3)} ${block.horaInicio}–${block.horaFin}`,
                    )
                    .join(" · ")}
                </p>
              </div>
            ))}
            {seguimiento.programaciones.length > 2 ? (
              <p className="text-xs text-zinc-500">
                +{seguimiento.programaciones.length - 2} segmentos
              </p>
            ) : null}
          </div>
        ) : (
          <span className="text-zinc-500">Sin programar</span>
        ),
    },
    {
      id: "estado",
      header: "Estado",
      render: (seguimiento) => (
        <Badge variant={seguimientoStatusVariants[seguimiento.estado]}>
          {SEGUIMIENTO_ESTADO_LABELS[seguimiento.estado]}
        </Badge>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "whitespace-nowrap text-right",
      render: (seguimiento) => (
        <Button
          onClick={() => setSelectedSeguimientoId(seguimiento.id)}
          size="sm"
          variant="secondary"
        >
          Administrar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
          href="/fichas"
        >
          ← Volver a fichas
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Ficha {ficha.numero}
          </h1>
          <Badge variant={fichaStatusVariants[ficha.estado]}>
            {FICHA_ESTADO_LABELS[ficha.estado]}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          {ficha.programaCodigo} · {ficha.programaNombre} · Plan {ficha.planVersion}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          headerAction={
            <Button
              onClick={() => setIsLeaderHistoryOpen(true)}
              size="sm"
              variant="ghost"
            >
              Ver histórico
            </Button>
          }
          title="Información general"
        >
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-zinc-500">Instructor líder</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {ficha.instructorLiderNombre}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Ubicación</dt>
              <dd className="text-zinc-700 dark:text-zinc-300">
                {ficha.municipio}
                {ficha.sede ? ` · ${ficha.sede}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Modalidad</dt>
              <dd className="text-zinc-700 dark:text-zinc-300">
                {ficha.modalidad ?? "Sin especificar"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Jornada permitida">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {formatFichaSchedule(ficha.jornadas)}
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Las programaciones futuras deberán estar dentro de esta jornada.
          </p>
        </Card>

        <Card title="Fechas">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">Inicio</dt>
              <dd>{formatFichaDate(ficha.fechaInicio)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">Fin lectivo</dt>
              <dd>{formatFichaDate(ficha.fechaFinLectiva)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">Fin práctico</dt>
              <dd>{formatFichaDate(ficha.fechaFinPractica)}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Competencias
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {ficha.seguimientos.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Horas del plan
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {totalHours}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Finalizadas
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {completedCount} / {ficha.seguimientos.length}
          </p>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Seguimiento de competencias
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Se generó automáticamente desde la versión del plan asignada.
        </p>
      </div>

      <Table
        caption="Seguimiento de competencias de la ficha"
        columns={columns}
        data={ficha.seguimientos}
        getRowKey={(seguimiento) => seguimiento.id}
        tableClassName="min-w-[1250px]"
      />

      {ficha.observaciones ? (
        <Card title="Observaciones">
          <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
            {ficha.observaciones}
          </p>
        </Card>
      ) : null}

      {selectedSeguimiento ? (
        <ProgramacionManagerModal
          ficha={ficha}
          instructores={instructores}
          key={selectedSeguimiento.id}
          onClose={() => setSelectedSeguimientoId(null)}
          onFichaChange={setFicha}
          seguimiento={selectedSeguimiento}
        />
      ) : null}

      {isLeaderHistoryOpen ? (
        <FichaLeaderHistoryModal
          ficha={ficha}
          instructores={instructores}
          onClose={() => setIsLeaderHistoryOpen(false)}
          onFichaChange={setFicha}
        />
      ) : null}
    </div>
  );
}
