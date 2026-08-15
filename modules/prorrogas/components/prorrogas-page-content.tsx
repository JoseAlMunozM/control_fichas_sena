"use client";

import { useState, type FormEvent } from "react";

import {
  Alert,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  Pagination,
  SearchInput,
  Select,
  Textarea,
} from "@/components/ui";
import { FICHA_ESTADO } from "@/modules/fichas/constants";
import type { FichaDto } from "@/modules/fichas/types";
import { formatFichaDate } from "@/modules/fichas/utils";

import {
  createProrrogaAction,
  deleteProrrogaAction,
  findAllProrrogasAction,
  resolveProrrogaAction,
  updateProrrogaAction,
} from "../actions";
import {
  PRORROGA_ESTADO,
  PRORROGA_ESTADO_LABELS,
} from "../constants";
import type {
  ProrrogaDto,
  ProrrogaEstado,
  ProrrogaFilters,
  ProrrogasResponse,
} from "../types";
import { addDaysToDate } from "../utils";
import {
  ProrrogaForm,
  type ProrrogaFormErrors,
  type ProrrogaFormValue,
} from "./prorroga-form";
import { ProrrogaTable } from "./prorroga-table";

export interface ProrrogasPageContentProps {
  initialData: ProrrogasResponse;
  initialFichas: readonly FichaDto[];
}

const statusOptions = [
  { label: "Todos", value: "all" },
  ...Object.values(PRORROGA_ESTADO).map((status) => ({
    label: PRORROGA_ESTADO_LABELS[status],
    value: status,
  })),
];

function getEligibleFichas(fichas: readonly FichaDto[]): readonly FichaDto[] {
  return fichas.filter(
    (ficha) =>
      ficha.estado !== FICHA_ESTADO.FINALIZADA &&
      ficha.estado !== FICHA_ESTADO.CANCELADA,
  );
}

function getDefaultForm(fichas: readonly FichaDto[]): ProrrogaFormValue {
  const ficha = getEligibleFichas(fichas)[0];

  return {
    fichaId: ficha?.id ?? "",
    fechaFinLectivaNueva: ficha
      ? addDaysToDate(ficha.fechaFinLectiva, 30)
      : "",
    fechaFinPracticaNueva: ficha
      ? addDaysToDate(ficha.fechaFinPractica, 30)
      : "",
    motivo: "",
  };
}

export function ProrrogasPageContent({
  initialData,
  initialFichas,
}: ProrrogasPageContentProps) {
  const [data, setData] = useState(initialData);
  const [fichas, setFichas] = useState(initialFichas);
  const eligibleFichas = getEligibleFichas(fichas);
  const [filters, setFilters] = useState<ProrrogaFilters>({
    page: initialData.pagination.page,
    pageSize: initialData.pagination.pageSize,
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [formValue, setFormValue] = useState<ProrrogaFormValue>(() =>
    getDefaultForm(initialFichas),
  );
  const [formErrors, setFormErrors] = useState<ProrrogaFormErrors>({});
  const [editing, setEditing] = useState<ProrrogaDto | null>(null);
  const [deleting, setDeleting] = useState<ProrrogaDto | null>(null);
  const [resolving, setResolving] = useState<ProrrogaDto | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<
    "APROBADA" | "RECHAZADA"
  >(PRORROGA_ESTADO.APROBADA);
  const [resolutionObservation, setResolutionObservation] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = async (nextFilters: ProrrogaFilters) => {
    setIsLoading(true);

    try {
      const result = await findAllProrrogasAction(nextFilters);

      if (!result.success) {
        setErrorMessage(result.error.message);
        return false;
      }

      const resolvedFilters = {
        ...nextFilters,
        page: result.value.pagination.page,
        pageSize: result.value.pagination.pageSize,
      };
      setData(result.value);
      setFilters(resolvedFilters);
      setAppliedFilters(resolvedFilters);
      setErrorMessage(null);

      return true;
    } catch {
      setErrorMessage(
        "La solicitud no llegó al servidor. Verifica tu conexión, actualiza la página e intenta cargar las prórrogas nuevamente.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormValue(getDefaultForm(fichas));
    setFormErrors({});
    setErrorMessage(null);
    setIsFormModalOpen(true);
  };

  const openEdit = (prorroga: ProrrogaDto) => {
    setEditing(prorroga);
    setFormValue({
      fichaId: prorroga.fichaId,
      fechaFinLectivaNueva: prorroga.fechaFinLectivaNueva,
      fechaFinPracticaNueva: prorroga.fechaFinPracticaNueva,
      motivo: prorroga.motivo,
    });
    setFormErrors({});
    setErrorMessage(null);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    if (!isSubmitting) {
      setIsFormModalOpen(false);
      setEditing(null);
      setErrorMessage(null);
    }
  };

  const updateForm = <Key extends keyof ProrrogaFormValue>(
    field: Key,
    value: ProrrogaFormValue[Key],
  ) => {
    setFormValue((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleFichaChange = (fichaId: string) => {
    const ficha = fichas.find((item) => item.id === fichaId);

    setFormValue((current) => ({
      ...current,
      fichaId,
      fechaFinLectivaNueva: ficha
        ? addDaysToDate(ficha.fechaFinLectiva, 30)
        : "",
      fechaFinPracticaNueva: ficha
        ? addDaysToDate(ficha.fechaFinPractica, 30)
        : "",
    }));
    setFormErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    setErrorMessage(null);

    try {
      const result = editing
        ? await updateProrrogaAction(editing.id, {
            fechaFinLectivaNueva: formValue.fechaFinLectivaNueva,
            fechaFinPracticaNueva: formValue.fechaFinPracticaNueva,
            motivo: formValue.motivo,
          })
        : await createProrrogaAction(formValue);

      if (!result.success) {
        setErrorMessage(result.error.message);
        setFormErrors(
          Object.fromEntries(
            Object.entries(result.error.fieldErrors ?? {}).map(
              ([field, messages]) => [field, messages?.[0]],
            ),
          ) as ProrrogaFormErrors,
        );
        return;
      }

      setIsFormModalOpen(false);
      setEditing(null);
      await refresh(appliedFilters);
    } catch {
      setErrorMessage(
        "La solicitud no llegó al servidor. Verifica tu conexión y vuelve a guardar la prórroga.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openResolution = (
    prorroga: ProrrogaDto,
    status: "APROBADA" | "RECHAZADA",
  ) => {
    setResolving(prorroga);
    setResolutionStatus(status);
    setResolutionObservation("");
    setErrorMessage(null);
    setIsResolutionModalOpen(true);
  };

  const handleResolve = async () => {
    if (!resolving) return;

    setIsResolving(true);
    setErrorMessage(null);

    try {
      const result = await resolveProrrogaAction(resolving.id, {
        estado: resolutionStatus,
        observacionRespuesta: resolutionObservation,
      });

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      if (resolutionStatus === PRORROGA_ESTADO.APROBADA) {
        setFichas((current) =>
          current.map((ficha) =>
            ficha.id === resolving.fichaId
              ? {
                  ...ficha,
                  fechaFinLectiva: resolving.fechaFinLectivaNueva,
                  fechaFinPractica: resolving.fechaFinPracticaNueva,
                }
              : ficha,
          ),
        );
      }
      setIsResolutionModalOpen(false);
      setResolving(null);
      await refresh(appliedFilters);
    } catch {
      setErrorMessage(
        "La solicitud no llegó al servidor. Verifica tu conexión y vuelve a confirmar la decisión.",
      );
    } finally {
      setIsResolving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deleteProrrogaAction(deleting.id);

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setDeleting(null);
      await refresh(appliedFilters);
    } catch {
      setErrorMessage(
        "La solicitud de eliminación no llegó al servidor. Actualiza la página y vuelve a intentarlo.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Prórrogas
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Administra ampliaciones de las etapas lectiva y práctica.
          </p>
        </div>
        <Button disabled={eligibleFichas.length === 0} onClick={openCreate}>
          Nueva prórroga
        </Button>
      </div>

      {errorMessage && !isFormModalOpen && !isResolutionModalOpen ? (
        <Alert title="No se pudo completar la acción">
          {errorMessage}
        </Alert>
      ) : null}

      <Card title="Filtros">
        <div className="grid gap-4 sm:grid-cols-[1fr_16rem_auto] sm:items-end">
          <SearchInput
            disabled={isLoading}
            label="Ficha, programa, municipio o motivo"
            onValueChange={(search) =>
              setFilters((current) => ({ ...current, search }))
            }
            value={filters.search ?? ""}
          />
          <Select
            disabled={isLoading}
            label="Estado"
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                estado:
                  event.target.value === "all"
                    ? undefined
                    : (event.target.value as ProrrogaEstado),
              }))
            }
            options={statusOptions}
            value={filters.estado ?? "all"}
          />
          <Button
            isLoading={isLoading}
            onClick={() => void refresh({ ...filters, page: 1 })}
          >
            Aplicar filtros
          </Button>
        </div>
      </Card>

      {data.data.length > 0 ? (
        <ProrrogaTable
          disabled={isLoading || isResolving || isDeleting}
          onDelete={setDeleting}
          onEdit={openEdit}
          onResolve={openResolution}
          prorrogas={data.data}
        />
      ) : (
        <EmptyState
          action={
            eligibleFichas.length > 0 ? (
              <Button onClick={openCreate}>Crear solicitud</Button>
            ) : undefined
          }
          description="Las solicitudes pendientes, aprobadas y rechazadas aparecerán aquí."
          title="No hay prórrogas registradas"
        />
      )}

      <Pagination
        currentPage={data.pagination.page}
        disabled={isLoading}
        onPageChange={(page) => void refresh({ ...appliedFilters, page })}
        totalPages={data.pagination.totalPages}
      />

      <Modal
        closeOnBackdrop={!isSubmitting}
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        size="lg"
        title={editing ? "Editar prórroga" : "Nueva prórroga"}
      >
        {errorMessage ? (
          <Alert className="mb-5" title="No se pudo guardar la prórroga">
            {errorMessage}
          </Alert>
        ) : null}
        <ProrrogaForm
          errors={formErrors}
          fichas={eligibleFichas}
          isSubmitting={isSubmitting}
          mode={editing ? "edit" : "create"}
          onCancel={closeFormModal}
          onChange={updateForm}
          onFichaChange={handleFichaChange}
          onSubmit={handleSubmit}
          value={formValue}
        />
      </Modal>

      <Modal
        closeOnBackdrop={!isResolving}
        isOpen={isResolutionModalOpen}
        onClose={() => {
          if (!isResolving) setIsResolutionModalOpen(false);
        }}
        size="md"
        title={
          resolutionStatus === PRORROGA_ESTADO.APROBADA
            ? "Aprobar prórroga"
            : "Rechazar prórroga"
        }
      >
        {resolving ? (
          <div className="space-y-5">
            <div className="rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-950/60">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Ficha {resolving.fichaNumero}
              </p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                Fin lectivo: {formatFichaDate(resolving.fechaFinLectivaAnterior)} →{" "}
                {formatFichaDate(resolving.fechaFinLectivaNueva)}
              </p>
              <p className="text-zinc-600 dark:text-zinc-300">
                Fin práctico: {formatFichaDate(resolving.fechaFinPracticaAnterior)} →{" "}
                {formatFichaDate(resolving.fechaFinPracticaNueva)}
              </p>
            </div>
            {errorMessage ? (
              <Alert title="No se pudo resolver la prórroga">
                {errorMessage}
              </Alert>
            ) : null}
            <Textarea
              disabled={isResolving}
              label="Observación de la decisión"
              onChange={(event) =>
                setResolutionObservation(event.target.value)
              }
              rows={3}
              value={resolutionObservation}
            />
            <div className="flex justify-end gap-3">
              <Button
                disabled={isResolving}
                onClick={() => setIsResolutionModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button
                isLoading={isResolving}
                onClick={() => void handleResolve()}
                variant={
                  resolutionStatus === PRORROGA_ESTADO.APROBADA
                    ? "primary"
                    : "danger"
                }
              >
                {resolutionStatus === PRORROGA_ESTADO.APROBADA
                  ? "Aprobar"
                  : "Rechazar"}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        confirmLabel="Eliminar solicitud"
        description={
          deleting
            ? `Se eliminará la solicitud pendiente de la ficha ${deleting.fichaNumero}.`
            : ""
        }
        isLoading={isDeleting}
        isOpen={deleting !== null}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Eliminar prórroga"
      />
    </div>
  );
}
