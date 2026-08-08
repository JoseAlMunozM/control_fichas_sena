"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Badge, Button, Input, Modal, Select, Textarea } from "@/components/ui";
import type { InstructorDto } from "@/modules/instructores/types";

import { changeFichaLeaderAction } from "../actions";
import type { FichaDto } from "../types";
import { formatFichaDate } from "../utils";

export interface FichaLeaderHistoryModalProps {
  ficha: FichaDto;
  instructores: readonly InstructorDto[];
  onClose: () => void;
  onFichaChange: (ficha: FichaDto) => void;
}

interface LeaderFormValue {
  instructorId: string;
  fechaInicio: string;
  motivo: string;
}

function getNextDate(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
}

function getDefaultForm(
  ficha: FichaDto,
  instructores: readonly InstructorDto[],
): LeaderFormValue {
  const currentAssignment = ficha.liderHistorial.find(
    (assignment) => assignment.fechaFin === null,
  );
  const nextInstructor = instructores.find(
    (instructor) => instructor.id !== ficha.instructorLiderId,
  );

  return {
    instructorId: nextInstructor?.id ?? "",
    fechaInicio: currentAssignment
      ? getNextDate(currentAssignment.fechaInicio)
      : ficha.fechaInicio,
    motivo: "",
  };
}

export function FichaLeaderHistoryModal({
  ficha,
  instructores,
  onClose,
  onFichaChange,
}: FichaLeaderHistoryModalProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValue, setFormValue] = useState<LeaderFormValue>(() =>
    getDefaultForm(ficha, instructores),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentAssignment = ficha.liderHistorial.find(
    (assignment) => assignment.fechaFin === null,
  );
  const availableInstructors = instructores.filter(
    (instructor) => instructor.id !== ficha.instructorLiderId,
  );
  const instructorOptions = availableInstructors.map((instructor) => ({
    label: `${instructor.nombre} · ${instructor.correo}`,
    value: instructor.id,
  }));

  const openForm = () => {
    setFormValue(getDefaultForm(ficha, instructores));
    setError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await changeFichaLeaderAction(ficha.id, formValue);

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onFichaChange(result.value.data);
      setIsFormOpen(false);
    } catch {
      setError("No fue posible cambiar el instructor líder.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      closeOnBackdrop={!isSubmitting}
      isOpen
      onClose={onClose}
      showCloseButton={!isSubmitting}
      size="lg"
      title={isFormOpen ? "Cambiar instructor líder" : "Histórico de líderes"}
    >
      {isFormOpen ? (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error ? (
            <p
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <div className="rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-950/60">
            <p className="text-zinc-500">Líder actual</p>
            <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
              {ficha.instructorLiderNombre}
            </p>
          </div>
          <Select
            disabled={isSubmitting}
            label="Nuevo instructor líder"
            onChange={(event) =>
              setFormValue((current) => ({
                ...current,
                instructorId: event.target.value,
              }))
            }
            options={instructorOptions}
            placeholder="Selecciona un instructor"
            required
            value={formValue.instructorId}
          />
          <Input
            disabled={isSubmitting}
            label="Fecha efectiva del cambio"
            max={ficha.fechaFinPractica}
            min={
              currentAssignment
                ? getNextDate(currentAssignment.fechaInicio)
                : ficha.fechaInicio
            }
            onChange={(event) =>
              setFormValue((current) => ({
                ...current,
                fechaInicio: event.target.value,
              }))
            }
            required
            type="date"
            value={formValue.fechaInicio}
          />
          <Textarea
            disabled={isSubmitting}
            label="Motivo del cambio"
            onChange={(event) =>
              setFormValue((current) => ({
                ...current,
                motivo: event.target.value,
              }))
            }
            required
            rows={3}
            value={formValue.motivo}
          />
          <div className="flex justify-end gap-3">
            <Button
              disabled={isSubmitting}
              onClick={() => setIsFormOpen(false)}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button isLoading={isSubmitting} type="submit">
              Confirmar cambio
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-500">
              Cada cambio conserva el responsable y su periodo de asignación.
            </p>
            <Button
              disabled={availableInstructors.length === 0}
              onClick={openForm}
              size="sm"
            >
              Cambiar líder
            </Button>
          </div>

          {availableInstructors.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
              Registra otro instructor activo en{" "}
              <Link className="font-semibold underline" href="/instructores">
                Instructores
              </Link>{" "}
              para realizar una rotación.
            </p>
          ) : null}

          <div className="space-y-3">
            {[...ficha.liderHistorial]
              .sort((first, second) =>
                second.fechaInicio.localeCompare(first.fechaInicio),
              )
              .map((assignment) => (
                <article
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  key={assignment.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {assignment.instructorNombre}
                      </p>
                      {assignment.instructorCorreo ? (
                        <p className="text-sm text-zinc-500">
                          {assignment.instructorCorreo}
                        </p>
                      ) : null}
                    </div>
                    {assignment.fechaFin === null ? (
                      <Badge variant="success">Líder actual</Badge>
                    ) : (
                      <Badge variant="neutral">Anterior</Badge>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {formatFichaDate(assignment.fechaInicio)} –{" "}
                    {assignment.fechaFin
                      ? formatFichaDate(assignment.fechaFin)
                      : "Actualidad"}
                  </p>
                  {assignment.motivo ? (
                    <p className="mt-2 text-sm text-zinc-500">
                      {assignment.motivo}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-zinc-500">
                    Registrado por {assignment.asignadoPorNombre}
                  </p>
                </article>
              ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
