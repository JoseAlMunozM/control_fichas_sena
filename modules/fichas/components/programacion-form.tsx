"use client";

import { useMemo, type FormEvent } from "react";

import { Button, Input, Select } from "@/components/ui";
import type { InstructorDto } from "@/modules/instructores/types";

import { DIA_SEMANA_LABELS } from "../constants";
import type {
  CreateProgramacionDto,
  DiaSemana,
  FichaDto,
  FichaSeguimientoDto,
} from "../types";
import { calculateProgrammedHours, formatFichaSchedule } from "../utils";

export interface ProgramacionBlockFormValue {
  key: string;
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface ProgramacionFormValue {
  instructorId: string;
  fechaInicio: string;
  fechaFin: string;
  bloques: ProgramacionBlockFormValue[];
}

export interface ProgramacionFormProps {
  ficha: FichaDto;
  seguimiento: FichaSeguimientoDto;
  instructores: readonly InstructorDto[];
  value: ProgramacionFormValue;
  editingProgramacionId?: string;
  error?: string | null;
  isSubmitting?: boolean;
  onChange: (value: ProgramacionFormValue) => void;
  onCancel: () => void;
  onSubmit: (value: CreateProgramacionDto) => void;
}

export function createEmptyProgramacionForm(
  ficha: FichaDto,
): ProgramacionFormValue {
  const defaultSchedule = ficha.jornadas[0] ?? {
    dia: "LUNES" as const,
    horaInicio: "07:00",
    horaFin: "13:00",
  };

  return {
    instructorId: "",
    fechaInicio: ficha.fechaInicio,
    fechaFin: ficha.fechaInicio,
    bloques: [
      {
        key: "initial-block",
        dia: defaultSchedule.dia,
        horaInicio: defaultSchedule.horaInicio,
        horaFin: defaultSchedule.horaFin,
      },
    ],
  };
}

export function ProgramacionForm({
  error,
  editingProgramacionId,
  ficha,
  instructores,
  isSubmitting = false,
  onCancel,
  onChange,
  onSubmit,
  seguimiento,
  value,
}: ProgramacionFormProps) {
  const programmedHours = useMemo(
    () =>
      calculateProgrammedHours(
        value.fechaInicio,
        value.fechaFin,
        value.bloques,
      ),
    [value.bloques, value.fechaFin, value.fechaInicio],
  );
  const existingHours = seguimiento.programaciones.reduce(
    (total, programacion) =>
      programacion.id === editingProgramacionId
        ? total
        : total + programacion.horasProgramadas,
    0,
  );
  const instructorOptions = instructores.map((instructor) => ({
    label: `${instructor.nombre} · ${instructor.correo}`,
    value: instructor.id,
  }));
  const dayOptions = ficha.jornadas.map((jornada) => ({
    label: DIA_SEMANA_LABELS[jornada.dia],
    value: jornada.dia,
  }));

  const updateBlock = (
    key: string,
    field: "horaInicio" | "horaFin",
    nextValue: string,
  ) => {
    onChange({
      ...value,
      bloques: value.bloques.map((block) =>
        block.key === key ? { ...block, [field]: nextValue } : block,
      ),
    });
  };

  const updateBlockDay = (key: string, day: DiaSemana) => {
    const jornada = ficha.jornadas.find((item) => item.dia === day);

    if (!jornada) return;

    onChange({
      ...value,
      bloques: value.bloques.map((block) =>
        block.key === key
          ? {
              ...block,
              dia: day,
              horaInicio: jornada.horaInicio,
              horaFin: jornada.horaFin,
            }
          : block,
      ),
    });
  };

  const addBlock = () => {
    const jornada = ficha.jornadas[0];

    if (!jornada) return;

    onChange({
      ...value,
      bloques: [
        ...value.bloques,
        {
          key: crypto.randomUUID(),
          dia: jornada.dia,
          horaInicio: jornada.horaInicio,
          horaFin: jornada.horaFin,
        },
      ],
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      instructorId: value.instructorId,
      fechaInicio: value.fechaInicio,
      fechaFin: value.fechaFin,
      bloques: value.bloques.map(({ dia, horaFin, horaInicio }) => ({
        dia,
        horaInicio,
        horaFin,
      })),
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? (
        <p
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Select
        disabled={isSubmitting}
        label="Instructor"
        onChange={(event) =>
          onChange({ ...value, instructorId: event.target.value })
        }
        options={instructorOptions}
        placeholder="Selecciona un instructor"
        required
        value={value.instructorId}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          disabled={isSubmitting}
          label="Fecha inicial"
          max={
            seguimiento.competenciaTipo === "PRACTICA"
              ? ficha.fechaFinPractica
              : ficha.fechaFinLectiva
          }
          min={ficha.fechaInicio}
          onChange={(event) =>
            onChange({ ...value, fechaInicio: event.target.value })
          }
          required
          type="date"
          value={value.fechaInicio}
        />
        <Input
          disabled={isSubmitting}
          label="Fecha final"
          max={
            seguimiento.competenciaTipo === "PRACTICA"
              ? ficha.fechaFinPractica
              : ficha.fechaFinLectiva
          }
          min={value.fechaInicio || ficha.fechaInicio}
          onChange={(event) =>
            onChange({ ...value, fechaFin: event.target.value })
          }
          required
          type="date"
          value={value.fechaFin}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Bloques semanales
            </h3>
            <p className="text-xs text-zinc-500">
              Jornada permitida: {formatFichaSchedule(ficha.jornadas)}
            </p>
          </div>
          <Button
            disabled={isSubmitting || ficha.jornadas.length === 0}
            onClick={addBlock}
            size="sm"
            variant="secondary"
          >
            Agregar bloque
          </Button>
        </div>

        {value.bloques.map((block) => {
          const jornada = ficha.jornadas.find(
            (item) => item.dia === block.dia,
          );

          return (
            <div
              className="grid gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
              key={block.key}
            >
              <Select
                disabled={isSubmitting}
                label="Día"
                onChange={(event) =>
                  updateBlockDay(block.key, event.target.value as DiaSemana)
                }
                options={dayOptions}
                value={block.dia}
              />
              <Input
                disabled={isSubmitting}
                label="Desde"
                max={jornada?.horaFin}
                min={jornada?.horaInicio}
                onChange={(event) =>
                  updateBlock(block.key, "horaInicio", event.target.value)
                }
                required
                type="time"
                value={block.horaInicio}
              />
              <Input
                disabled={isSubmitting}
                label="Hasta"
                max={jornada?.horaFin}
                min={jornada?.horaInicio}
                onChange={(event) =>
                  updateBlock(block.key, "horaFin", event.target.value)
                }
                required
                type="time"
                value={block.horaFin}
              />
              <Button
                disabled={isSubmitting || value.bloques.length === 1}
                onClick={() =>
                  onChange({
                    ...value,
                    bloques: value.bloques.filter(
                      (item) => item.key !== block.key,
                    ),
                  })
                }
                size="sm"
                variant="ghost"
              >
                Quitar
              </Button>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-950/60 sm:grid-cols-3">
        <div>
          <p className="text-zinc-500">Ya programadas</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            {existingHours} h
          </p>
        </div>
        <div>
          <p className="text-zinc-500">Este segmento</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            {programmedHours} h
          </p>
        </div>
        <div>
          <p className="text-zinc-500">Horas del plan</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            {seguimiento.horasPlan} h
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button disabled={isSubmitting} onClick={onCancel} variant="secondary">
          Cancelar
        </Button>
        <Button isLoading={isSubmitting} type="submit">
          Guardar programación
        </Button>
      </div>
    </form>
  );
}
