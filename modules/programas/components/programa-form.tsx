"use client";

import type { FormEventHandler } from "react";

import { Button, Input, Select } from "@/components/ui";

import type { CreateProgramaDto } from "../types";

const estadoOptions = [
  {
    label: "Activo",
    value: "true",
  },
  {
    label: "Inactivo",
    value: "false",
  },
] as const;

export type ProgramaFormErrors = Partial<
  Record<keyof CreateProgramaDto, string>
>;

export interface ProgramaFormProps {
  value: CreateProgramaDto;
  onCodigoChange: (value: string) => void;
  onNombreChange: (value: string) => void;
  onDescripcionChange: (value: string) => void;
  onEstadoChange: (value: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  cancelLabel?: string;
  disabled?: boolean;
  errors?: ProgramaFormErrors;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ProgramaForm({
  cancelLabel = "Cancelar",
  disabled = false,
  errors = {},
  isSubmitting = false,
  onCancel,
  onCodigoChange,
  onDescripcionChange,
  onEstadoChange,
  onNombreChange,
  onSubmit,
  submitLabel = "Guardar programa",
  value,
}: ProgramaFormProps) {
  return (
    <form className="space-y-5" noValidate onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          autoComplete="off"
          disabled={disabled || isSubmitting}
          error={errors.codigo}
          label="Código"
          name="codigo"
          onChange={(event) => onCodigoChange(event.target.value)}
          placeholder="Código del programa"
          required
          value={value.codigo}
        />
        <Select
          disabled={disabled || isSubmitting}
          error={errors.estado}
          label="Estado"
          name="estado"
          onChange={(event) =>
            onEstadoChange(event.target.value === "true")
          }
          options={estadoOptions}
          value={String(value.estado ?? true)}
        />
      </div>

      <Input
        autoComplete="off"
        disabled={disabled || isSubmitting}
        error={errors.nombre}
        label="Nombre"
        name="nombre"
        onChange={(event) => onNombreChange(event.target.value)}
        placeholder="Nombre del programa"
        required
        value={value.nombre}
      />

      <Input
        disabled={disabled || isSubmitting}
        error={errors.descripcion}
        label="Descripción"
        name="descripcion"
        onChange={(event) => onDescripcionChange(event.target.value)}
        placeholder="Descripción opcional"
        value={value.descripcion ?? ""}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            disabled={disabled || isSubmitting}
            onClick={onCancel}
            variant="secondary"
          >
            {cancelLabel}
          </Button>
        ) : null}
        <Button
          disabled={disabled}
          isLoading={isSubmitting}
          loadingText="Guardando..."
          type="submit"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
