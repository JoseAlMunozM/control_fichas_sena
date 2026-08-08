"use client";

import { useState, type FormEvent } from "react";

import { Badge, Button, Input, Select, Textarea } from "@/components/ui";

import {
  createNovedadAction,
  deleteNovedadAction,
  updateNovedadAction,
} from "../actions";
import {
  NOVEDAD_COMPETENCIA_TIPO,
  NOVEDAD_COMPETENCIA_TIPO_LABELS,
} from "../constants";
import type {
  FichaDto,
  FichaSeguimientoDto,
  NovedadCompetenciaDto,
  NovedadCompetenciaTipo,
} from "../types";
import { formatFichaDate } from "../utils";

interface NovedadFormValue {
  fecha: string;
  tipo: NovedadCompetenciaTipo;
  descripcion: string;
}

export interface NovedadSectionProps {
  ficha: FichaDto;
  seguimiento: FichaSeguimientoDto;
  onFichaChange: (ficha: FichaDto) => void;
}

const noveltyOptions = Object.values(NOVEDAD_COMPETENCIA_TIPO).map(
  (type) => ({
    label: NOVEDAD_COMPETENCIA_TIPO_LABELS[type],
    value: type,
  }),
);

function getEmptyValue(ficha: FichaDto): NovedadFormValue {
  return {
    fecha: ficha.fechaInicio,
    tipo: NOVEDAD_COMPETENCIA_TIPO.OBSERVACION,
    descripcion: "",
  };
}

function toFormValue(novedad: NovedadCompetenciaDto): NovedadFormValue {
  return {
    fecha: novedad.fecha,
    tipo: novedad.tipo,
    descripcion: novedad.descripcion,
  };
}

export function NovedadSection({
  ficha,
  onFichaChange,
  seguimiento,
}: NovedadSectionProps) {
  const [formValue, setFormValue] = useState<NovedadFormValue>(() =>
    getEmptyValue(ficha),
  );
  const [editing, setEditing] = useState<NovedadCompetenciaDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormValue(getEmptyValue(ficha));
    setError(null);
    setIsFormOpen(true);
  };

  const openEdit = (novedad: NovedadCompetenciaDto) => {
    setEditing(novedad);
    setFormValue(toFormValue(novedad));
    setError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = editing
        ? await updateNovedadAction(
            ficha.id,
            seguimiento.id,
            editing.id,
            formValue,
          )
        : await createNovedadAction(ficha.id, seguimiento.id, formValue);

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onFichaChange(result.value.data);
      setEditing(null);
      setIsFormOpen(false);
    } catch {
      setError("No fue posible guardar la novedad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (novedadId: string) => {
    setDeletingId(novedadId);
    setError(null);

    try {
      const result = await deleteNovedadAction(
        ficha.id,
        seguimiento.id,
        novedadId,
      );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onFichaChange(result.value.data);
    } catch {
      setError("No fue posible eliminar la novedad.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Novedades
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Conserva observaciones, reprogramaciones y cambios importantes.
          </p>
        </div>
        <Button onClick={openCreate} size="sm" variant="secondary">
          Registrar novedad
        </Button>
      </div>

      {error ? (
        <p
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {isFormOpen ? (
        <form
          className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              disabled={isSubmitting}
              label="Fecha"
              max={ficha.fechaFinPractica}
              min={ficha.fechaInicio}
              onChange={(event) =>
                setFormValue((current) => ({
                  ...current,
                  fecha: event.target.value,
                }))
              }
              required
              type="date"
              value={formValue.fecha}
            />
            <Select
              disabled={isSubmitting}
              label="Tipo"
              onChange={(event) =>
                setFormValue((current) => ({
                  ...current,
                  tipo: event.target.value as NovedadCompetenciaTipo,
                }))
              }
              options={noveltyOptions}
              value={formValue.tipo}
            />
          </div>
          <Textarea
            disabled={isSubmitting}
            label="Descripción de la novedad"
            onChange={(event) =>
              setFormValue((current) => ({
                ...current,
                descripcion: event.target.value,
              }))
            }
            required
            rows={3}
            value={formValue.descripcion}
          />
          <div className="flex justify-end gap-2">
            <Button
              disabled={isSubmitting}
              onClick={() => setIsFormOpen(false)}
              size="sm"
              variant="ghost"
            >
              Cancelar
            </Button>
            <Button isLoading={isSubmitting} size="sm" type="submit">
              Guardar novedad
            </Button>
          </div>
        </form>
      ) : null}

      {seguimiento.novedades.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No hay novedades registradas.
        </p>
      ) : (
        <div className="space-y-2">
          {[...seguimiento.novedades]
            .sort((first, second) => second.fecha.localeCompare(first.fecha))
            .map((novedad) => (
              <article
                className="flex flex-col justify-between gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-start"
                key={novedad.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="warning">
                      {NOVEDAD_COMPETENCIA_TIPO_LABELS[novedad.tipo]}
                    </Badge>
                    <span className="text-sm text-zinc-500">
                      {formatFichaDate(novedad.fecha)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {novedad.descripcion}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Registrada por {novedad.registradoPorNombre}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    disabled={deletingId !== null}
                    onClick={() => openEdit(novedad)}
                    size="sm"
                    variant="ghost"
                  >
                    Editar
                  </Button>
                  <Button
                    disabled={deletingId !== null}
                    isLoading={deletingId === novedad.id}
                    onClick={() => void handleDelete(novedad.id)}
                    size="sm"
                    variant="danger"
                  >
                    Eliminar
                  </Button>
                </div>
              </article>
            ))}
        </div>
      )}
    </section>
  );
}
