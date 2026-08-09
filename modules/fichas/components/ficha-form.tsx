"use client";

import type { FormEventHandler } from "react";

import { Button, Input, Select, Textarea } from "@/components/ui";
import type { ProgramaDto } from "@/modules/programas/types";

import {
  DEFAULT_JORNADAS_FORMACION,
  DIA_SEMANA,
  DIA_SEMANA_LABELS,
  FICHA_ESTADO,
  FICHA_ESTADO_LABELS,
} from "../constants";
import type {
  CreateFichaDto,
  DiaSemana,
  FichaEstado,
  JornadaFormacion,
} from "../types";

export interface FichaFormValue extends CreateFichaDto {
  estado?: FichaEstado;
}

export type FichaFormErrors = Partial<
  Record<keyof FichaFormValue, string>
>;

export interface FichaFormProps {
  value: FichaFormValue;
  programas: readonly ProgramaDto[];
  mode: "create" | "edit";
  onChange: <Key extends keyof FichaFormValue>(
    field: Key,
    value: FichaFormValue[Key],
  ) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  errors?: FichaFormErrors;
  isSubmitting?: boolean;
}

const dayOptions = Object.values(DIA_SEMANA);
const statusOptions = Object.values(FICHA_ESTADO).map((value) => ({
  label: FICHA_ESTADO_LABELS[value],
  value,
}));

export const emptyFichaForm: FichaFormValue = {
  numero: "",
  programaId: "",
  planId: "",
  municipio: "",
  sede: "",
  modalidad: "",
  jornadas: DEFAULT_JORNADAS_FORMACION.map((jornada) => ({ ...jornada })),
  fechaInicio: "",
  fechaFinLectiva: "",
  fechaFinPractica: "",
  observaciones: "",
  estado: FICHA_ESTADO.PLANEADA,
};

export function FichaForm({
  errors = {},
  isSubmitting = false,
  mode,
  onCancel,
  onChange,
  onSubmit,
  programas,
  value,
}: FichaFormProps) {
  const selectedProgram = programas.find(
    (programa) => programa.id === value.programaId,
  );
  const programOptions = programas.map((programa) => ({
    label: `${programa.codigo} · ${programa.nombre}`,
    value: programa.id,
  }));
  const planOptions = (selectedProgram?.planes ?? []).map((plan) => ({
    label: `${plan.version}${plan.estado ? " · Activo" : ""}`,
    value: plan.id,
  }));

  const toggleDay = (day: DiaSemana) => {
    const existing = value.jornadas.some((jornada) => jornada.dia === day);
    const jornadas = existing
      ? value.jornadas.filter((jornada) => jornada.dia !== day)
      : [...value.jornadas, { dia: day, horaInicio: "07:00", horaFin: "13:00" }]
          .sort(
            (first, second) =>
              dayOptions.indexOf(first.dia) - dayOptions.indexOf(second.dia),
          );

    onChange("jornadas", jornadas);
  };

  const updateJornada = (
    day: DiaSemana,
    field: keyof Pick<JornadaFormacion, "horaInicio" | "horaFin">,
    nextValue: string,
  ) => {
    onChange(
      "jornadas",
      value.jornadas.map((jornada) =>
        jornada.dia === day ? { ...jornada, [field]: nextValue } : jornada,
      ),
    );
  };

  return (
    <form className="space-y-5" noValidate onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          disabled={isSubmitting}
          error={errors.numero}
          label="Número de ficha"
          onChange={(event) => onChange("numero", event.target.value)}
          required
          value={value.numero}
        />
        {mode === "edit" ? (
          <Select
            disabled={isSubmitting}
            error={errors.estado}
            label="Estado"
            onChange={(event) =>
              onChange("estado", event.target.value as FichaEstado)
            }
            options={statusOptions}
            value={value.estado ?? FICHA_ESTADO.PLANEADA}
          />
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          disabled={isSubmitting || mode === "edit"}
          error={errors.programaId}
          label="Programa"
          onChange={(event) => {
            const programa = programas.find(
              (item) => item.id === event.target.value,
            );
            const defaultPlan =
              programa?.planes.find((plan) => plan.estado) ??
              programa?.planes[0];

            onChange("programaId", event.target.value);
            onChange("planId", defaultPlan?.id ?? "");
          }}
          options={programOptions}
          placeholder="Selecciona un programa"
          required
          value={value.programaId}
        />
        <Select
          disabled={isSubmitting || mode === "edit" || !selectedProgram}
          error={errors.planId}
          helperText="Las competencias se copiarán desde esta versión."
          label="Versión del plan"
          onChange={(event) => onChange("planId", event.target.value)}
          options={planOptions}
          placeholder="Selecciona una versión"
          required
          value={value.planId}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          disabled={isSubmitting}
          error={errors.municipio}
          label="Municipio"
          onChange={(event) => onChange("municipio", event.target.value)}
          required
          value={value.municipio}
        />
        <Input
          disabled={isSubmitting}
          error={errors.sede}
          label="Sede"
          onChange={(event) => onChange("sede", event.target.value)}
          value={value.sede ?? ""}
        />
        <Input
          disabled={isSubmitting}
          error={errors.modalidad}
          label="Modalidad"
          onChange={(event) => onChange("modalidad", event.target.value)}
          placeholder="Ejemplo: Presencial"
          value={value.modalidad ?? ""}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Jornadas de formación
        </legend>
        <p className="mt-1 text-xs text-zinc-500">
          Selecciona los días y define el horario permitido para cada uno.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {dayOptions.map((day) => (
            <label
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              key={day}
            >
              <input
                checked={value.jornadas.some((jornada) => jornada.dia === day)}
                disabled={isSubmitting}
                onChange={() => toggleDay(day)}
                type="checkbox"
              />
              {DIA_SEMANA_LABELS[day]}
            </label>
          ))}
        </div>

        {value.jornadas.length > 0 ? (
          <div className="mt-4 space-y-3">
            {value.jornadas.map((jornada) => (
              <div
                className="grid gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 sm:grid-cols-[1fr_1fr_1fr] sm:items-end"
                key={jornada.dia}
              >
                <p className="pb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {DIA_SEMANA_LABELS[jornada.dia]}
                </p>
                <Input
                  disabled={isSubmitting}
                  label="Desde"
                  onChange={(event) =>
                    updateJornada(jornada.dia, "horaInicio", event.target.value)
                  }
                  required
                  type="time"
                  value={jornada.horaInicio}
                />
                <Input
                  disabled={isSubmitting}
                  label="Hasta"
                  onChange={(event) =>
                    updateJornada(jornada.dia, "horaFin", event.target.value)
                  }
                  required
                  type="time"
                  value={jornada.horaFin}
                />
              </div>
            ))}
          </div>
        ) : null}
        {errors.jornadas ? (
          <p className="mt-1.5 text-xs text-red-600">{errors.jornadas}</p>
        ) : null}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          disabled={isSubmitting}
          error={errors.fechaInicio}
          label="Fecha de inicio"
          onChange={(event) => onChange("fechaInicio", event.target.value)}
          required
          type="date"
          value={value.fechaInicio}
        />
        <Input
          disabled={isSubmitting}
          error={errors.fechaFinLectiva}
          label="Fin de etapa lectiva"
          onChange={(event) =>
            onChange("fechaFinLectiva", event.target.value)
          }
          required
          type="date"
          value={value.fechaFinLectiva}
        />
        <Input
          disabled={isSubmitting}
          error={errors.fechaFinPractica}
          label="Fin de etapa práctica"
          onChange={(event) =>
            onChange("fechaFinPractica", event.target.value)
          }
          required
          type="date"
          value={value.fechaFinPractica}
        />
      </div>

      <Textarea
        disabled={isSubmitting}
        error={errors.observaciones}
        label="Observaciones"
        onChange={(event) => onChange("observaciones", event.target.value)}
        rows={3}
        value={value.observaciones ?? ""}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button disabled={isSubmitting} onClick={onCancel} variant="secondary">
          Cancelar
        </Button>
        <Button isLoading={isSubmitting} type="submit">
          {mode === "create" ? "Crear ficha" : "Actualizar ficha"}
        </Button>
      </div>
    </form>
  );
}
