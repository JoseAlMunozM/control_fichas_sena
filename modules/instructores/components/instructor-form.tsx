"use client";

import type { FormEventHandler } from "react";

import {
  Button,
  Input,
  Textarea,
} from "@/components/ui";

import type { CreateInstructorDto } from "../types";

export type InstructorFormValue = CreateInstructorDto;

export type InstructorFormErrors = Partial<
  Record<keyof InstructorFormValue, string>
>;

export const emptyInstructorForm: InstructorFormValue = {
  nombre: "",
  correo: "",
  telefono: "",
  observaciones: "",
  fechaInicioContrato: "",
  fechaFinContrato: "",
};

export interface InstructorFormProps {
  value: InstructorFormValue;
  errors?: InstructorFormErrors;
  isSubmitting?: boolean;
  isEditing?: boolean;
  onChange: <Key extends keyof InstructorFormValue>(
    field: Key,
    value: InstructorFormValue[Key],
  ) => void;
  onCancel: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function InstructorForm({
  errors = {},
  isSubmitting = false,
  isEditing = false,
  onCancel,
  onChange,
  onSubmit,
  value,
}: InstructorFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <Input
        disabled={isSubmitting}
        error={errors.nombre}
        label="Nombre completo"
        onChange={(event) => onChange("nombre", event.target.value)}
        required
        value={value.nombre}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          disabled={isSubmitting}
          error={errors.correo}
          label="Correo institucional"
          onChange={(event) => onChange("correo", event.target.value)}
          required
          type="email"
          value={value.correo}
        />
        <Input
          disabled={isSubmitting}
          error={errors.telefono}
          label="Teléfono"
          onChange={(event) => onChange("telefono", event.target.value)}
          value={value.telefono ?? ""}
        />
      </div>
      {!isEditing ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            disabled={isSubmitting}
            error={errors.fechaInicioContrato}
            label="Inicio del contrato"
            onChange={(event) =>
              onChange("fechaInicioContrato", event.target.value)
            }
            required
            type="date"
            value={value.fechaInicioContrato}
          />
          <Input
            disabled={isSubmitting}
            error={errors.fechaFinContrato}
            label="Finalización del contrato"
            onChange={(event) =>
              onChange("fechaFinContrato", event.target.value)
            }
            required
            type="date"
            value={value.fechaFinContrato}
          />
        </div>
      ) : null}
      <Textarea
        disabled={isSubmitting}
        error={errors.observaciones}
        label="Observaciones"
        onChange={(event) =>
          onChange("observaciones", event.target.value)
        }
        value={value.observaciones ?? ""}
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
          Guardar instructor
        </Button>
      </div>
    </form>
  );
}
