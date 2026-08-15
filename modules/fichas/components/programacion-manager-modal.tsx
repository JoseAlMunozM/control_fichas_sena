"use client";

import Link from "next/link";
import { useState } from "react";

import { Alert, Badge, Button, Modal, Select } from "@/components/ui";
import type { InstructorDto } from "@/modules/instructores/types";

import {
  createProgramacionAction,
  deleteProgramacionAction,
  updateProgramacionAction,
  updateSeguimientoEstadoAction,
} from "../actions";
import {
  DIA_SEMANA_LABELS,
  SEGUIMIENTO_ESTADO,
  SEGUIMIENTO_ESTADO_LABELS,
} from "../constants";
import type {
  CreateProgramacionDto,
  FichaDto,
  FichaSeguimientoDto,
  ProgramacionCompetenciaDto,
  SeguimientoCompetenciaEstado,
} from "../types";
import { formatFichaDate } from "../utils";
import {
  createEmptyProgramacionForm,
  ProgramacionForm,
  type ProgramacionFormValue,
} from "./programacion-form";
import { NovedadSection } from "./novedad-section";

export interface ProgramacionManagerModalProps {
  ficha: FichaDto;
  seguimiento: FichaSeguimientoDto;
  instructores: readonly InstructorDto[];
  onClose: () => void;
  onFichaChange: (ficha: FichaDto) => void;
}

const statusOptions = Object.values(SEGUIMIENTO_ESTADO).map((status) => ({
  label: SEGUIMIENTO_ESTADO_LABELS[status],
  value: status,
}));

const statusVariants = {
  [SEGUIMIENTO_ESTADO.PENDIENTE]: "neutral",
  [SEGUIMIENTO_ESTADO.PROGRAMADA]: "info",
  [SEGUIMIENTO_ESTADO.EN_EJECUCION]: "progress",
  [SEGUIMIENTO_ESTADO.FINALIZADA]: "success",
  [SEGUIMIENTO_ESTADO.SUSPENDIDA]: "suspended",
  [SEGUIMIENTO_ESTADO.CANCELADA]: "danger",
} as const;

function toFormValue(
  programacion: ProgramacionCompetenciaDto,
): ProgramacionFormValue {
  return {
    instructorId: programacion.instructorId,
    fechaInicio: programacion.fechaInicio,
    fechaFin: programacion.fechaFin,
    bloques: programacion.bloques.map((block) => ({
      key: block.id,
      dia: block.dia,
      horaInicio: block.horaInicio,
      horaFin: block.horaFin,
    })),
  };
}

export function ProgramacionManagerModal({
  ficha,
  instructores,
  onClose,
  onFichaChange,
  seguimiento,
}: ProgramacionManagerModalProps) {
  const [formValue, setFormValue] = useState<ProgramacionFormValue>(() =>
    createEmptyProgramacionForm(ficha),
  );
  const [editing, setEditing] =
    useState<ProgramacionCompetenciaDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalProgrammedHours = seguimiento.programaciones.reduce(
    (total, programacion) => total + programacion.horasProgramadas,
    0,
  );

  const openCreate = () => {
    setEditing(null);
    setFormValue(createEmptyProgramacionForm(ficha));
    setError(null);
    setIsFormOpen(true);
  };

  const openEdit = (programacion: ProgramacionCompetenciaDto) => {
    setEditing(programacion);
    setFormValue(toFormValue(programacion));
    setError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (value: CreateProgramacionDto) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = editing
        ? await updateProgramacionAction(
            ficha.id,
            seguimiento.id,
            editing.id,
            value,
          )
        : await createProgramacionAction(
            ficha.id,
            seguimiento.id,
            value,
          );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onFichaChange(result.value.data);
      setEditing(null);
      setIsFormOpen(false);
    } catch {
      setError(
        "La solicitud no llegó al servidor. Verifica tu conexión y vuelve a guardar la programación.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (programacionId: string) => {
    setDeletingId(programacionId);
    setError(null);

    try {
      const result = await deleteProgramacionAction(
        ficha.id,
        seguimiento.id,
        programacionId,
      );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onFichaChange(result.value.data);
    } catch {
      setError(
        "La solicitud de eliminación no llegó al servidor. Actualiza la página y vuelve a intentarlo.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (
    status: SeguimientoCompetenciaEstado,
  ) => {
    setIsChangingStatus(true);
    setError(null);

    try {
      const result = await updateSeguimientoEstadoAction(
        ficha.id,
        seguimiento.id,
        { estado: status },
      );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onFichaChange(result.value.data);
    } catch {
      setError(
        "La solicitud no llegó al servidor. Verifica tu conexión y vuelve a seleccionar el estado.",
      );
    } finally {
      setIsChangingStatus(false);
    }
  };

  return (
    <Modal
      closeOnBackdrop={!isSubmitting}
      isOpen
      onClose={onClose}
      showCloseButton={!isSubmitting}
      size="xl"
      title={
        isFormOpen
          ? editing
            ? "Editar programación"
            : "Nueva programación"
          : "Administrar competencia"
      }
    >
      {isFormOpen ? (
        <ProgramacionForm
          editingProgramacionId={editing?.id}
          error={error}
          ficha={ficha}
          instructores={instructores}
          isSubmitting={isSubmitting}
          onCancel={() => {
            setError(null);
            setIsFormOpen(false);
          }}
          onChange={setFormValue}
          onSubmit={handleSubmit}
          seguimiento={seguimiento}
          value={formValue}
        />
      ) : (
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {seguimiento.competenciaNombre}
                </h3>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-500">
                  {seguimiento.competenciaNorma}
                </p>
              </div>
              <Badge variant={statusVariants[seguimiento.estado]}>
                {SEGUIMIENTO_ESTADO_LABELS[seguimiento.estado]}
              </Badge>
            </div>
          </div>

          {error ? (
            <Alert title="No se pudo actualizar la competencia">
              {error}
            </Alert>
          ) : null}

          <div className="grid gap-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950/60 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <Select
              disabled={isChangingStatus}
              label="Estado de la competencia"
              onChange={(event) =>
                void handleStatusChange(
                  event.target.value as SeguimientoCompetenciaEstado,
                )
              }
              options={statusOptions}
              value={seguimiento.estado}
            />
            <div className="text-sm">
              <p className="text-zinc-500">Programadas / plan</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {totalProgrammedHours} / {seguimiento.horasPlan} h
              </p>
            </div>
            <Button
              disabled={instructores.length === 0 || isChangingStatus}
              onClick={openCreate}
            >
              Agregar segmento
            </Button>
          </div>

          {instructores.length === 0 ? (
            <Alert title="No hay instructores disponibles" variant="warning">
              Debes registrar un instructor activo en{" "}
              <Link className="font-semibold underline" href="/instructores">
                Instructores
              </Link>{" "}
              antes de crear una programación.
            </Alert>
          ) : null}

          {seguimiento.programaciones.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 px-5 py-10 text-center dark:border-zinc-700">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                Aún no hay horarios asignados
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Agrega un segmento con instructor, fechas y bloques semanales.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {seguimiento.programaciones.map((programacion) => (
                <article
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  key={programacion.id}
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {programacion.instructorNombre}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {programacion.instructorCorreo}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                        <span>
                          {formatFichaDate(programacion.fechaInicio)} –{" "}
                          {formatFichaDate(programacion.fechaFin)}
                        </span>
                        <span className="font-medium">
                          {programacion.horasProgramadas} horas
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {programacion.bloques.map((block) => (
                          <span
                            className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            key={block.id}
                          >
                            {DIA_SEMANA_LABELS[block.dia]} · {block.horaInicio}–
                            {block.horaFin}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        disabled={deletingId !== null}
                        onClick={() => openEdit(programacion)}
                        size="sm"
                        variant="secondary"
                      >
                        Editar
                      </Button>
                      <Button
                        disabled={deletingId !== null}
                        isLoading={deletingId === programacion.id}
                        onClick={() => void handleDelete(programacion.id)}
                        size="sm"
                        variant="danger"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <NovedadSection
            ficha={ficha}
            onFichaChange={onFichaChange}
            seguimiento={seguimiento}
          />
        </div>
      )}
    </Modal>
  );
}
