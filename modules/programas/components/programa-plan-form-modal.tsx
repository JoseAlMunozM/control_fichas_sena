"use client";

import { useState, type FormEvent } from "react";

import { Button, Input, Modal, Select } from "@/components/ui";

import {
  createPlanFormacionAction,
  updatePlanFormacionAction,
} from "../actions";
import type {
  PlanFormacionDto,
  ProgramaDto,
} from "../types";

interface PlanFormValue {
  version: string;
  estado: boolean;
}

export interface ProgramaPlanFormModalProps {
  programaId: string;
  plan?: PlanFormacionDto;
  onClose: () => void;
  onSaved: (programa: ProgramaDto) => void;
}

const statusOptions = [
  { label: "Activo", value: "true" },
  { label: "Inactivo", value: "false" },
] as const;

export function ProgramaPlanFormModal({
  onClose,
  onSaved,
  plan,
  programaId,
}: ProgramaPlanFormModalProps) {
  const [value, setValue] = useState<PlanFormValue>({
    version: plan?.version ?? "",
    estado: plan?.estado ?? true,
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PlanFormValue, string>>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setErrorMessage(null);

    try {
      const result = plan
        ? await updatePlanFormacionAction(programaId, plan.id, value)
        : await createPlanFormacionAction(programaId, value);

      if (!result.success) {
        setErrorMessage(result.error.message);
        setFieldErrors({
          version: result.error.fieldErrors?.version?.[0],
          estado: result.error.fieldErrors?.estado?.[0],
        });
        return;
      }

      onSaved(result.value.data);
    } catch {
      setErrorMessage("No fue posible guardar el plan de formación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      closeOnBackdrop={!isSubmitting}
      isOpen
      onClose={isSubmitting ? () => undefined : onClose}
      title={plan ? "Editar plan" : "Crear plan"}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {errorMessage ? (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <Input
          disabled={isSubmitting}
          error={fieldErrors.version}
          label="Versión"
          onChange={(event) =>
            setValue((current) => ({
              ...current,
              version: event.target.value,
            }))
          }
          placeholder="Ejemplo: V1"
          required
          value={value.version}
        />

        <Select
          disabled={isSubmitting}
          error={fieldErrors.estado}
          helperText="Al activar esta versión, las demás versiones del programa quedarán inactivas."
          label="Estado"
          onChange={(event) =>
            setValue((current) => ({
              ...current,
              estado: event.target.value === "true",
            }))
          }
          options={statusOptions}
          value={String(value.estado)}
        />

        <div className="flex justify-end gap-3">
          <Button
            disabled={isSubmitting}
            onClick={onClose}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button isLoading={isSubmitting} type="submit">
            Guardar plan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
