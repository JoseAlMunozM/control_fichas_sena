"use client";

import type { FormEventHandler } from "react";

import { Button, Input, Select, Textarea } from "@/components/ui";
import type { FichaDto } from "@/modules/fichas/types";
import { formatFichaDate } from "@/modules/fichas/utils";

export interface ProrrogaFormValue {
  fichaId: string;
  fechaFinLectivaNueva: string;
  fechaFinPracticaNueva: string;
  motivo: string;
}

export type ProrrogaFormErrors = Partial<
  Record<keyof ProrrogaFormValue, string>
>;

export interface ProrrogaFormProps {
  value: ProrrogaFormValue;
  fichas: readonly FichaDto[];
  mode: "create" | "edit";
  errors?: ProrrogaFormErrors;
  isSubmitting?: boolean;
  onChange: <Key extends keyof ProrrogaFormValue>(
    field: Key,
    value: ProrrogaFormValue[Key],
  ) => void;
  onFichaChange: (fichaId: string) => void;
  onCancel: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function ProrrogaForm({
  errors = {},
  fichas,
  isSubmitting = false,
  mode,
  onCancel,
  onChange,
  onFichaChange,
  onSubmit,
  value,
}: ProrrogaFormProps) {
  const selectedFicha = fichas.find((ficha) => ficha.id === value.fichaId);
  const fichaOptions = fichas.map((ficha) => ({
    label: `${ficha.numero} · ${ficha.programaNombre} · ${ficha.municipio}`,
    value: ficha.id,
  }));

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <Select
        disabled={isSubmitting || mode === "edit"}
        error={errors.fichaId}
        label="Ficha"
        onChange={(event) => onFichaChange(event.target.value)}
        options={fichaOptions}
        placeholder="Selecciona una ficha"
        required
        value={value.fichaId}
      />

      {selectedFicha ? (
        <div className="grid gap-3 rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-950/60 sm:grid-cols-3">
          <div>
            <p className="text-zinc-500">Fecha de inicio</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatFichaDate(selectedFicha.fechaInicio)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Fin lectivo actual</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatFichaDate(selectedFicha.fechaFinLectiva)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Fin práctico actual</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatFichaDate(selectedFicha.fechaFinPractica)}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          disabled={isSubmitting}
          error={errors.fechaFinLectivaNueva}
          label="Nuevo fin de etapa lectiva"
          min={selectedFicha?.fechaFinLectiva}
          onChange={(event) =>
            onChange("fechaFinLectivaNueva", event.target.value)
          }
          required
          type="date"
          value={value.fechaFinLectivaNueva}
        />
        <Input
          disabled={isSubmitting}
          error={errors.fechaFinPracticaNueva}
          label="Nuevo fin de etapa práctica"
          min={value.fechaFinLectivaNueva || selectedFicha?.fechaFinPractica}
          onChange={(event) =>
            onChange("fechaFinPracticaNueva", event.target.value)
          }
          required
          type="date"
          value={value.fechaFinPracticaNueva}
        />
      </div>

      <Textarea
        disabled={isSubmitting}
        error={errors.motivo}
        label="Motivo de la prórroga"
        onChange={(event) => onChange("motivo", event.target.value)}
        required
        rows={4}
        value={value.motivo}
      />

      <div className="flex justify-end gap-3">
        <Button
          disabled={isSubmitting}
          onClick={onCancel}
          variant="secondary"
        >
          Cancelar
        </Button>
        <Button isLoading={isSubmitting} type="submit">
          {mode === "create" ? "Crear solicitud" : "Actualizar solicitud"}
        </Button>
      </div>
    </form>
  );
}
