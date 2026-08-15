"use client";

import { useState, type FormEvent } from "react";

import {
  Alert,
  Button,
  Input,
  Modal,
  Select,
  Textarea,
} from "@/components/ui";

import {
  COMPETENCIA_TIPO,
  COMPETENCIA_TIPO_LABELS,
} from "../constants";
import {
  addPlanCompetenciaAction,
  updatePlanCompetenciaAction,
} from "../actions";
import type {
  CreatePlanCompetenciaDto,
  PlanCompetenciaEntity,
  ProgramaDto,
} from "../types";

export interface ProgramaCompetenciaFormModalProps {
  programaId: string;
  planId: string;
  competencia?: PlanCompetenciaEntity;
  onClose: () => void;
  onSaved: (programa: ProgramaDto) => void;
}

const typeOptions = Object.values(COMPETENCIA_TIPO).map((value) => ({
  label: COMPETENCIA_TIPO_LABELS[value],
  value,
}));

export function ProgramaCompetenciaFormModal({
  competencia,
  onClose,
  onSaved,
  planId,
  programaId,
}: ProgramaCompetenciaFormModalProps) {
  const [value, setValue] = useState<CreatePlanCompetenciaDto>({
    norma: competencia?.norma ?? "",
    nombre: competencia?.nombre ?? "",
    tipo: competencia?.tipo ?? COMPETENCIA_TIPO.TRANSVERSAL,
    horas: competencia?.horas ?? 48,
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CreatePlanCompetenciaDto, string>>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setErrorMessage(null);

    try {
      const result = competencia
        ? await updatePlanCompetenciaAction(
            programaId,
            planId,
            competencia.id,
            value,
          )
        : await addPlanCompetenciaAction(programaId, planId, value);

      if (!result.success) {
        setErrorMessage(result.error.message);
        setFieldErrors({
          norma: result.error.fieldErrors?.norma?.[0],
          nombre: result.error.fieldErrors?.nombre?.[0],
          tipo: result.error.fieldErrors?.tipo?.[0],
          horas: result.error.fieldErrors?.horas?.[0],
        });
        return;
      }

      onSaved(result.value.data);
    } catch {
      setErrorMessage(
        "La solicitud no llegó al servidor. Verifica tu conexión y vuelve a guardar la competencia.",
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
      title={competencia ? "Editar competencia" : "Agregar competencia"}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {errorMessage ? (
          <Alert title="No se pudo guardar la competencia">
            {errorMessage}
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            disabled={isSubmitting}
            error={fieldErrors.nombre}
            label="Nombre corto"
            onChange={(event) =>
              setValue((current) => ({
                ...current,
                nombre: event.target.value,
              }))
            }
            placeholder="Ejemplo: Inglés"
            required
            value={value.nombre}
          />
          <Select
            disabled={isSubmitting}
            error={fieldErrors.tipo}
            label="Tipo"
            onChange={(event) =>
              setValue((current) => ({
                ...current,
                tipo: event.target.value as CreatePlanCompetenciaDto["tipo"],
              }))
            }
            options={typeOptions}
            value={value.tipo}
          />
        </div>

        <Textarea
          disabled={isSubmitting}
          error={fieldErrors.norma}
          label="Norma o descripción de la competencia"
          onChange={(event) =>
            setValue((current) => ({
              ...current,
              norma: event.target.value,
            }))
          }
          required
          rows={4}
          value={value.norma}
        />

        <Input
          disabled={isSubmitting}
          error={fieldErrors.horas}
          label="Horas del plan"
          min={1}
          onChange={(event) =>
            setValue((current) => ({
              ...current,
              horas: event.target.valueAsNumber,
            }))
          }
          required
          type="number"
          value={Number.isNaN(value.horas) ? "" : value.horas}
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
            Guardar competencia
          </Button>
        </div>
      </form>
    </Modal>
  );
}
