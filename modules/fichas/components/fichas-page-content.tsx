"use client";

import { useState, type FormEvent } from "react";

import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  Pagination,
  SearchInput,
  Select,
} from "@/components/ui";
import type { ProgramaDto } from "@/modules/programas/types";

import {
  createFichaAction,
  deleteFichaAction,
  findAllFichasAction,
  updateFichaAction,
} from "../actions";
import { FICHA_ESTADO, FICHA_ESTADO_LABELS } from "../constants";
import type {
  CreateFichaDto,
  FichaDto,
  FichaFilters,
  FichasResponse,
} from "../types";
import {
  emptyFichaForm,
  FichaForm,
  type FichaFormErrors,
  type FichaFormValue,
} from "./ficha-form";
import { FichaTable } from "./ficha-table";

export interface FichasPageContentProps {
  initialData: FichasResponse;
  programas: readonly ProgramaDto[];
}

const statusOptions = [
  { label: "Todos", value: "all" },
  ...Object.values(FICHA_ESTADO).map((value) => ({
    label: FICHA_ESTADO_LABELS[value],
    value,
  })),
];

function getDefaultForm(programas: readonly ProgramaDto[]): FichaFormValue {
  const programa = programas[0];
  const plan =
    programa?.planes.find((item) => item.estado) ?? programa?.planes[0];

  return {
    ...emptyFichaForm,
    diasFormacion: [...emptyFichaForm.diasFormacion],
    programaId: programa?.id ?? "",
    planId: plan?.id ?? "",
  };
}

function toCreateFichaDto(value: FichaFormValue): CreateFichaDto {
  return {
    numero: value.numero,
    programaId: value.programaId,
    planId: value.planId,
    municipio: value.municipio,
    sede: value.sede,
    modalidad: value.modalidad,
    diasFormacion: value.diasFormacion,
    horaInicio: value.horaInicio,
    horaFin: value.horaFin,
    fechaInicio: value.fechaInicio,
    fechaFinLectiva: value.fechaFinLectiva,
    fechaFinPractica: value.fechaFinPractica,
    observaciones: value.observaciones,
  };
}

export function FichasPageContent({
  initialData,
  programas,
}: FichasPageContentProps) {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<FichaFilters>({
    page: initialData.pagination.page,
    pageSize: initialData.pagination.pageSize,
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [formValue, setFormValue] = useState<FichaFormValue>(() =>
    getDefaultForm(programas),
  );
  const [formErrors, setFormErrors] = useState<FichaFormErrors>({});
  const [editingFicha, setEditingFicha] = useState<FichaDto | null>(null);
  const [deletingFicha, setDeletingFicha] = useState<FichaDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const programOptions = [
    { label: "Todos", value: "all" },
    ...programas.map((programa) => ({
      label: `${programa.codigo} · ${programa.nombre}`,
      value: programa.id,
    })),
  ];

  const refreshFichas = async (nextFilters: FichaFilters) => {
    setIsLoading(true);

    try {
      const result = await findAllFichasAction(nextFilters);

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
      setErrorMessage("No fue posible cargar las fichas.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = <Key extends keyof FichaFormValue>(
    field: Key,
    value: FichaFormValue[Key],
  ) => {
    setFormValue((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const openCreateModal = () => {
    setEditingFicha(null);
    setFormValue(getDefaultForm(programas));
    setFormErrors({});
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ficha: FichaDto) => {
    setEditingFicha(ficha);
    setFormValue({
      numero: ficha.numero,
      programaId: ficha.programaId,
      planId: ficha.planId,
      municipio: ficha.municipio,
      sede: ficha.sede,
      modalidad: ficha.modalidad,
      diasFormacion: [...ficha.diasFormacion],
      horaInicio: ficha.horaInicio,
      horaFin: ficha.horaFin,
      fechaInicio: ficha.fechaInicio,
      fechaFinLectiva: ficha.fechaFinLectiva,
      fechaFinPractica: ficha.fechaFinPractica,
      observaciones: ficha.observaciones,
      estado: ficha.estado,
    });
    setFormErrors({});
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingFicha(null);
      setFormErrors({});
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    setErrorMessage(null);

    try {
      const result = editingFicha
        ? await updateFichaAction(editingFicha.id, {
            numero: formValue.numero,
            municipio: formValue.municipio,
            sede: formValue.sede,
            modalidad: formValue.modalidad,
            diasFormacion: formValue.diasFormacion,
            horaInicio: formValue.horaInicio,
            horaFin: formValue.horaFin,
            fechaInicio: formValue.fechaInicio,
            fechaFinLectiva: formValue.fechaFinLectiva,
            fechaFinPractica: formValue.fechaFinPractica,
            observaciones: formValue.observaciones,
            estado: formValue.estado,
          })
        : await createFichaAction(toCreateFichaDto(formValue));

      if (!result.success) {
        setErrorMessage(result.error.message);
        setFormErrors(
          Object.fromEntries(
            Object.entries(result.error.fieldErrors ?? {}).map(
              ([field, messages]) => [field, messages?.[0]],
            ),
          ) as FichaFormErrors,
        );
        return;
      }

      setIsModalOpen(false);
      setEditingFicha(null);
      await refreshFichas(appliedFilters);
    } catch {
      setErrorMessage("No fue posible guardar la ficha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingFicha) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deleteFichaAction(deletingFicha.id);

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      const nextPage =
        data.data.length === 1 && data.pagination.page > 1
          ? data.pagination.page - 1
          : data.pagination.page;
      setDeletingFicha(null);
      await refreshFichas({ ...appliedFilters, page: nextPage });
    } catch {
      setErrorMessage("No fue posible eliminar la ficha.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Fichas
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Crea fichas desde un plan y administra su información general.
          </p>
        </div>
        <Button disabled={programas.length === 0} onClick={openCreateModal}>
          Nueva ficha
        </Button>
      </div>

      {errorMessage && !isModalOpen ? (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            {errorMessage}
          </p>
        </Card>
      ) : null}

      <Card title="Filtros">
        <div className="grid gap-4 md:grid-cols-3">
          <SearchInput
            disabled={isLoading}
            label="Búsqueda"
            onValueChange={(search) =>
              setFilters((current) => ({ ...current, search }))
            }
            placeholder="Ficha, municipio o líder..."
            value={filters.search ?? ""}
          />
          <Select
            disabled={isLoading}
            label="Programa"
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                programaId:
                  event.target.value === "all"
                    ? undefined
                    : event.target.value,
              }))
            }
            options={programOptions}
            value={filters.programaId ?? "all"}
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
                    : (event.target.value as FichaDto["estado"]),
              }))
            }
            options={statusOptions}
            value={filters.estado ?? "all"}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            disabled={isLoading}
            onClick={() => {
              const cleared = {
                page: 1,
                pageSize: data.pagination.pageSize,
              };
              setFilters(cleared);
              void refreshFichas(cleared);
            }}
            size="sm"
            variant="ghost"
          >
            Limpiar
          </Button>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            onClick={() => void refreshFichas({ ...filters, page: 1 })}
            size="sm"
          >
            Aplicar filtros
          </Button>
        </div>
      </Card>

      {data.data.length > 0 ? (
        <FichaTable
          disabled={isDeleting || isLoading}
          fichas={data.data}
          onDelete={setDeletingFicha}
          onEdit={openEditModal}
        />
      ) : (
        <EmptyState
          action={
            programas.length > 0 ? (
              <Button onClick={openCreateModal}>Crear primera ficha</Button>
            ) : undefined
          }
          description={
            programas.length > 0
              ? "Selecciona un programa y una versión del plan para generar sus competencias."
              : "Primero debes crear un programa con una versión de plan."
          }
          title="No hay fichas registradas"
        />
      )}

      <Pagination
        currentPage={data.pagination.page}
        disabled={isLoading}
        onPageChange={(page) =>
          void refreshFichas({ ...appliedFilters, page })
        }
        totalPages={data.pagination.totalPages}
      />

      <Modal
        closeOnBackdrop={!isSubmitting}
        isOpen={isModalOpen}
        onClose={closeModal}
        size="xl"
        title={editingFicha ? "Editar ficha" : "Crear ficha"}
      >
        {errorMessage ? (
          <p
            className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
        <FichaForm
          errors={formErrors}
          isSubmitting={isSubmitting}
          mode={editingFicha ? "edit" : "create"}
          onCancel={closeModal}
          onChange={updateForm}
          onSubmit={handleSubmit}
          programas={programas}
          value={formValue}
        />
      </Modal>

      <ConfirmDialog
        confirmLabel="Eliminar ficha"
        description={
          deletingFicha
            ? `Se eliminará la ficha ${deletingFicha.numero} y sus seguimientos temporales.`
            : ""
        }
        isLoading={isDeleting}
        isOpen={deletingFicha !== null}
        onCancel={() => setDeletingFicha(null)}
        onConfirm={handleDelete}
        title="Eliminar ficha"
      />
    </div>
  );
}
