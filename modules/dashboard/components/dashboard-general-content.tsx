"use client";

import { useMemo, useState } from "react";

import { Card, SearchInput, Select } from "@/components/ui";
import {
  FICHA_ESTADO,
  FICHA_ESTADO_LABELS,
  SEGUIMIENTO_ESTADO,
} from "@/modules/fichas/constants";
import type { FichaEstado } from "@/modules/fichas/types";
import { PRORROGA_ESTADO } from "@/modules/prorrogas/constants";

import type { DashboardDataDto } from "../types";
import { ControlGeneralMatrix } from "./control-general-matrix";

export interface DashboardGeneralContentProps {
  data: DashboardDataDto;
}

const fichaStatusOptions = [
  { label: "Todos", value: "all" },
  ...Object.values(FICHA_ESTADO).map((status) => ({
    label: FICHA_ESTADO_LABELS[status],
    value: status,
  })),
];

const noveltyOptions = [
  { label: "Todas", value: "all" },
  { label: "Con novedades", value: "with" },
  { label: "Sin novedades", value: "without" },
] as const;

export function DashboardGeneralContent({ data }: DashboardGeneralContentProps) {
  const [search, setSearch] = useState("");
  const [programId, setProgramId] = useState("all");
  const [status, setStatus] = useState<"all" | FichaEstado>("all");
  const [novelties, setNovelties] = useState<"all" | "with" | "without">(
    "all",
  );
  const programOptions = useMemo(() => {
    const programs = new Map<string, string>();

    data.fichas.forEach((ficha) => {
      programs.set(
        ficha.programaId,
        `${ficha.programaCodigo} · ${ficha.programaNombre}`,
      );
    });

    return [
      { label: "Todos", value: "all" },
      ...[...programs.entries()].map(([value, label]) => ({ label, value })),
    ];
  }, [data.fichas]);
  const filteredFichas = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");

    return data.fichas.filter((ficha) => {
      const searchableText = [
        ficha.numero,
        ficha.programaCodigo,
        ficha.programaNombre,
        ficha.municipio,
        ficha.sede ?? "",
        ficha.instructorLiderNombre,
      ]
        .join(" ")
        .toLocaleLowerCase("es");

      return (
        (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
        (programId === "all" || ficha.programaId === programId) &&
        (status === "all" || ficha.estado === status) &&
        (novelties === "all" ||
          (novelties === "with"
            ? ficha.totalNovedades > 0
            : ficha.totalNovedades === 0))
      );
    });
  }, [data.fichas, novelties, programId, search, status]);
  const competencies = filteredFichas.flatMap((ficha) => ficha.competencias);
  const summary = {
    fichas: filteredFichas.length,
    pendientes: competencies.filter(
      (competencia) => competencia.estado === SEGUIMIENTO_ESTADO.PENDIENTE,
    ).length,
    programadas: competencies.filter(
      (competencia) =>
        competencia.estado === SEGUIMIENTO_ESTADO.PROGRAMADA ||
        competencia.estado === SEGUIMIENTO_ESTADO.EN_EJECUCION,
    ).length,
    finalizadas: competencies.filter(
      (competencia) => competencia.estado === SEGUIMIENTO_ESTADO.FINALIZADA,
    ).length,
    novedades: filteredFichas.reduce(
      (total, ficha) => total + ficha.totalNovedades,
      0,
    ),
    prorrogas: filteredFichas.filter(
      (ficha) => ficha.prorroga?.estado === PRORROGA_ESTADO.PENDIENTE,
    ).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Control general
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Vista consolidada de fichas, competencias, instructores y novedades.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ["Fichas", summary.fichas],
          ["Pendientes", summary.pendientes],
          ["Programadas", summary.programadas],
          ["Finalizadas", summary.finalizadas],
          ["Novedades", summary.novedades],
          ["Prórrogas pendientes", summary.prorrogas],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {value}
            </p>
          </Card>
        ))}
      </div>

      <Card title="Filtros">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SearchInput
            label="Búsqueda general"
            onValueChange={setSearch}
            placeholder="Ficha, municipio o líder..."
            value={search}
          />
          <Select
            label="Programa"
            onChange={(event) => setProgramId(event.target.value)}
            options={programOptions}
            value={programId}
          />
          <Select
            label="Estado de ficha"
            onChange={(event) =>
              setStatus(event.target.value as "all" | FichaEstado)
            }
            options={fichaStatusOptions}
            value={status}
          />
          <Select
            label="Novedades"
            onChange={(event) =>
              setNovelties(
                event.target.value as "all" | "with" | "without",
              )
            }
            options={noveltyOptions}
            value={novelties}
          />
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Matriz de seguimiento
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Desplázate horizontalmente para revisar todas las competencias.
        </p>
      </div>

      <ControlGeneralMatrix fichas={filteredFichas} />
    </div>
  );
}
