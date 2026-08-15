"use client";

import { useState, type FormEvent } from "react";

import { Alert, Button, EmptyState, Input, Modal } from "@/components/ui";

import { addInstructorContractAction } from "../actions";
import type {
  CreateContratoInstructorDto,
  InstructorDto,
} from "../types";
import {
  formatContractDate,
  getSuggestedContractStart,
} from "../utils";

export interface InstructorContractModalProps {
  instructor: InstructorDto;
  onClose: () => void;
  onSaved: (instructor: InstructorDto) => void;
}

export function InstructorContractModal({
  instructor,
  onClose,
  onSaved,
}: InstructorContractModalProps) {
  const [value, setValue] = useState<CreateContratoInstructorDto>({
    fechaInicio: getSuggestedContractStart(instructor),
    fechaFin: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CreateContratoInstructorDto, string>>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setErrorMessage(null);

    try {
      const result = await addInstructorContractAction(instructor.id, value);

      if (!result.success) {
        setErrorMessage(result.error.message);
        setFieldErrors({
          fechaInicio: result.error.fieldErrors?.fechaInicio?.[0],
          fechaFin: result.error.fieldErrors?.fechaFin?.[0],
        });
        return;
      }

      onSaved(result.value.data);
    } catch {
      setErrorMessage(
        "La solicitud no llegó al servidor. Verifica tu conexión y vuelve a registrar el contrato.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      closeOnBackdrop={!isSubmitting}
      isOpen
      onClose={isSubmitting ? () => undefined : onClose}
      size="lg"
      title={`Contratos de ${instructor.nombre}`}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {errorMessage ? (
          <Alert title="No se pudo registrar el contrato">
            {errorMessage}
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            disabled={isSubmitting}
            error={fieldErrors.fechaInicio}
            label="Inicio del nuevo contrato"
            onChange={(event) =>
              setValue((current) => ({
                ...current,
                fechaInicio: event.target.value,
              }))
            }
            required
            type="date"
            value={value.fechaInicio}
          />
          <Input
            disabled={isSubmitting}
            error={fieldErrors.fechaFin}
            label="Finalización del nuevo contrato"
            onChange={(event) =>
              setValue((current) => ({
                ...current,
                fechaFin: event.target.value,
              }))
            }
            required
            type="date"
            value={value.fechaFin}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            disabled={isSubmitting}
            onClick={onClose}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button isLoading={isSubmitting} type="submit">
            {instructor.contratos.length > 0
              ? "Registrar renovación"
              : "Registrar contrato"}
          </Button>
        </div>
      </form>

      <div className="mt-6 border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Histórico de contratos
        </h3>

        {instructor.contratos.length > 0 ? (
          <div className="mt-3 space-y-2">
            {instructor.contratos.map((contract) => (
              <div
                className="flex flex-col justify-between gap-1 rounded-lg border border-zinc-200 px-4 py-3 text-sm sm:flex-row sm:items-center dark:border-zinc-800"
                key={contract.id}
              >
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {formatContractDate(contract.fechaInicio)} –{" "}
                  {formatContractDate(contract.fechaFin)}
                </span>
                <span className="text-xs text-zinc-500">
                  Registrado el {formatContractDate(contract.createdAt.slice(0, 10))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState
              description="Registra el primer contrato para automatizar su estado."
              title="Sin contratos registrados"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
