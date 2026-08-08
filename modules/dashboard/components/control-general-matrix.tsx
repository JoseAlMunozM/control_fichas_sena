"use client";

import Link from "next/link";

import { Badge } from "@/components/ui";
import {
  DIA_SEMANA_LABELS,
  FICHA_ESTADO,
  FICHA_ESTADO_LABELS,
  SEGUIMIENTO_ESTADO,
  SEGUIMIENTO_ESTADO_LABELS,
} from "@/modules/fichas/constants";
import { formatFichaDate, formatFichaSchedule } from "@/modules/fichas/utils";
import {
  PRORROGA_ESTADO,
  PRORROGA_ESTADO_LABELS,
} from "@/modules/prorrogas/constants";

import type {
  DashboardCompetenciaDto,
  DashboardFichaDto,
} from "../types";

export interface ControlGeneralMatrixProps {
  fichas: readonly DashboardFichaDto[];
}

const followupStatusVariants = {
  [SEGUIMIENTO_ESTADO.PENDIENTE]: "neutral",
  [SEGUIMIENTO_ESTADO.PROGRAMADA]: "info",
  [SEGUIMIENTO_ESTADO.EN_EJECUCION]: "progress",
  [SEGUIMIENTO_ESTADO.FINALIZADA]: "success",
  [SEGUIMIENTO_ESTADO.SUSPENDIDA]: "suspended",
  [SEGUIMIENTO_ESTADO.CANCELADA]: "danger",
} as const;

const fichaStatusVariants = {
  [FICHA_ESTADO.PLANEADA]: "neutral",
  [FICHA_ESTADO.EN_FORMACION]: "info",
  [FICHA_ESTADO.ETAPA_PRACTICA]: "warning",
  [FICHA_ESTADO.FINALIZADA]: "success",
  [FICHA_ESTADO.CANCELADA]: "danger",
} as const;

const extensionStatusVariants = {
  [PRORROGA_ESTADO.PENDIENTE]: "warning",
  [PRORROGA_ESTADO.APROBADA]: "success",
  [PRORROGA_ESTADO.RECHAZADA]: "danger",
} as const;

interface CompetencyColumn {
  key: string;
  nombre: string;
  programaCodigo: string;
}

function getColumns(fichas: readonly DashboardFichaDto[]): CompetencyColumn[] {
  const columns = new Map<string, CompetencyColumn>();

  fichas.forEach((ficha) => {
    ficha.competencias.forEach((competencia) => {
      columns.set(competencia.key, {
        key: competencia.key,
        nombre: competencia.nombre,
        programaCodigo: ficha.programaCodigo,
      });
    });
  });

  return [...columns.values()].sort(
    (first, second) =>
      first.programaCodigo.localeCompare(second.programaCodigo, "es") ||
      first.nombre.localeCompare(second.nombre, "es"),
  );
}

function CompetencyCell({
  competencia,
}: {
  competencia: DashboardCompetenciaDto | undefined;
}) {
  if (!competencia) {
    return <span className="text-xs text-zinc-400">No aplica</span>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={followupStatusVariants[competencia.estado]}>
          {SEGUIMIENTO_ESTADO_LABELS[competencia.estado]}
        </Badge>
        {competencia.novedades > 0 ? (
          <Badge variant="warning">{competencia.novedades} novedad(es)</Badge>
        ) : null}
      </div>
      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {competencia.horasProgramadas} h programadas ·{" "}
        {competencia.horasPendientes} h pendientes
      </p>
      {competencia.programaciones.length > 0 ? (
        <div className="space-y-2">
          {competencia.programaciones.slice(0, 2).map((programacion) => (
            <div
              className="rounded-md bg-zinc-50 p-2 text-xs dark:bg-zinc-950/60"
              key={programacion.id}
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {programacion.instructorNombre}
              </p>
              <p className="mt-1 text-zinc-500">
                {formatFichaDate(programacion.fechaInicio)} –{" "}
                {formatFichaDate(programacion.fechaFin)}
              </p>
              <p className="mt-1 text-zinc-500">
                {programacion.bloques
                  .map(
                    (bloque) =>
                      `${DIA_SEMANA_LABELS[bloque.dia]} ${bloque.horaInicio}–${bloque.horaFin}`,
                  )
                  .join(" · ")}
              </p>
            </div>
          ))}
          {competencia.programaciones.length > 2 ? (
            <p className="text-xs text-zinc-500">
              +{competencia.programaciones.length - 2} segmentos
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-zinc-500">Sin instructor ni horario</p>
      )}
    </div>
  );
}

export function ControlGeneralMatrix({ fichas }: ControlGeneralMatrixProps) {
  const columns = getColumns(fichas);

  if (fichas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
        No hay fichas que coincidan con los filtros.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="max-h-[70vh] overflow-auto">
        <table
          className="border-collapse text-left text-sm"
          style={{ minWidth: 1160 + columns.length * 260 }}
        >
          <thead className="text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            <tr>
              <th className="sticky left-0 top-0 z-30 w-[180px] min-w-[180px] border-b border-r border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                Instructor líder
              </th>
              <th className="sticky left-[180px] top-0 z-30 w-[120px] min-w-[120px] border-b border-r border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                Ficha
              </th>
              <th className="sticky left-[300px] top-0 z-30 w-[180px] min-w-[180px] border-b border-r border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                Municipio / sede
              </th>
              <th className="sticky left-[480px] top-0 z-30 w-[180px] min-w-[180px] border-b border-r border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                Jornada
              </th>
              <th className="sticky top-0 z-20 w-[220px] min-w-[220px] border-b border-r border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                Fechas
              </th>
              <th className="sticky top-0 z-20 w-[220px] min-w-[220px] border-b border-r border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                Prórroga
              </th>
              {columns.map((column) => (
                <th
                  className="sticky top-0 z-20 w-[260px] min-w-[260px] whitespace-normal border-b border-r border-zinc-200 bg-zinc-50 px-4 py-3 align-bottom dark:border-zinc-800 dark:bg-zinc-950"
                  key={column.key}
                >
                  <span className="block text-[10px] text-emerald-700 dark:text-emerald-400">
                    {column.programaCodigo}
                  </span>
                  <span className="mt-1 block normal-case leading-5 text-zinc-700 dark:text-zinc-300">
                    {column.nombre}
                  </span>
                </th>
              ))}
              <th className="sticky top-0 z-20 w-[260px] min-w-[260px] border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                Observaciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {fichas.map((ficha) => (
              <tr className="group" key={ficha.id}>
                <td className="sticky left-0 z-10 w-[180px] min-w-[180px] border-r border-zinc-200 bg-white px-4 py-3 align-top group-hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:bg-zinc-800">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {ficha.instructorLiderNombre}
                  </p>
                  <Badge className="mt-2" variant={fichaStatusVariants[ficha.estado]}>
                    {FICHA_ESTADO_LABELS[ficha.estado]}
                  </Badge>
                </td>
                <td className="sticky left-[180px] z-10 w-[120px] min-w-[120px] border-r border-zinc-200 bg-white px-4 py-3 align-top group-hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:bg-zinc-800">
                  <Link
                    className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                    href={`/fichas/${ficha.id}`}
                  >
                    {ficha.numero}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500">
                    {ficha.programaCodigo} · {ficha.planVersion}
                  </p>
                </td>
                <td className="sticky left-[300px] z-10 w-[180px] min-w-[180px] whitespace-normal border-r border-zinc-200 bg-white px-4 py-3 align-top group-hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:bg-zinc-800">
                  <p>{ficha.municipio}</p>
                  {ficha.sede ? (
                    <p className="mt-1 text-xs text-zinc-500">{ficha.sede}</p>
                  ) : null}
                </td>
                <td className="sticky left-[480px] z-10 w-[180px] min-w-[180px] whitespace-normal border-r border-zinc-200 bg-white px-4 py-3 align-top group-hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:bg-zinc-800">
                  {formatFichaSchedule(
                    ficha.diasFormacion,
                    ficha.horaInicio,
                    ficha.horaFin,
                  )}
                </td>
                <td className="w-[220px] min-w-[220px] border-r border-zinc-200 px-4 py-3 align-top dark:border-zinc-800">
                  <div className="space-y-1 text-xs">
                    <p>Inicio: {formatFichaDate(ficha.fechaInicio)}</p>
                    <p>Lectiva: {formatFichaDate(ficha.fechaFinLectiva)}</p>
                    <p>Práctica: {formatFichaDate(ficha.fechaFinPractica)}</p>
                  </div>
                </td>
                <td className="w-[220px] min-w-[220px] border-r border-zinc-200 px-4 py-3 align-top dark:border-zinc-800">
                  {ficha.prorroga ? (
                    <div>
                      <Badge variant={extensionStatusVariants[ficha.prorroga.estado]}>
                        {PRORROGA_ESTADO_LABELS[ficha.prorroga.estado]}
                      </Badge>
                      <p className="mt-2 text-xs">
                        Lectiva: {formatFichaDate(ficha.prorroga.fechaFinLectivaNueva)}
                      </p>
                      <p className="mt-1 text-xs">
                        Práctica: {formatFichaDate(ficha.prorroga.fechaFinPracticaNueva)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500">Sin prórroga</span>
                  )}
                </td>
                {columns.map((column) => (
                  <td
                    className="w-[260px] min-w-[260px] whitespace-normal border-r border-zinc-200 px-4 py-3 align-top dark:border-zinc-800"
                    key={column.key}
                  >
                    <CompetencyCell
                      competencia={ficha.competencias.find(
                        (competencia) => competencia.key === column.key,
                      )}
                    />
                  </td>
                ))}
                <td className="w-[260px] min-w-[260px] whitespace-normal px-4 py-3 align-top">
                  {ficha.observaciones ? (
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {ficha.observaciones}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-500">Sin observaciones</p>
                  )}
                  {ficha.totalNovedades > 0 ? (
                    <Badge className="mt-2" variant="warning">
                      {ficha.totalNovedades} novedad(es)
                    </Badge>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
