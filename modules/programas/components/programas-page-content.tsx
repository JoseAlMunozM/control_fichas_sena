"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  Button,
  Card,
  ConfirmDialog,
  Pagination,
} from "@/components/ui";

import {
  createProgramaAction,
  deleteProgramaAction,
  filterProgramasAction,
  findAllProgramasAction,
  searchProgramasAction,
  updateProgramaAction,
} from "../actions";
import type {
  CreateProgramaDto,
  ProgramaActionError,
  ProgramaDto,
  ProgramaFilters,
  ProgramasResponse,
} from "../types";
import { ProgramaEmptyState } from "./programa-empty-state";
import {
  ProgramaFiltersPanel,
} from "./programa-filters";
import {
  ProgramaForm,
  type ProgramaFormErrors,
} from "./programa-form";
import { ProgramaLoading } from "./programa-loading";
import { ProgramaModal } from "./programa-modal";
import { ProgramaTable } from "./programa-table";
import { ProgramaToolbar } from "./programa-toolbar";

const emptyForm: CreateProgramaDto = {
  codigo: "",
  nombre: "",
  descripcion: "",
  estado: true,
};

function getFormErrors(
  fieldErrors: ProgramaActionError["fieldErrors"],
): ProgramaFormErrors {
  return Object.fromEntries(
    Object.entries(fieldErrors ?? {}).map(([field, messages]) => [
      field,
      messages?.[0],
    ]),
  ) as ProgramaFormErrors;
}

async function loadProgramas(filters: ProgramaFilters) {
  const { search, ...remainingFilters } = filters;
  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    return searchProgramasAction(
      normalizedSearch,
      remainingFilters,
    );
  }

  const hasFilters = Boolean(
    filters.codigo?.trim() ||
      filters.nombre?.trim() ||
      filters.estado !== undefined,
  );

  return hasFilters
    ? filterProgramasAction(filters)
    : findAllProgramasAction(filters);
}

export interface ProgramasPageContentProps {
  initialData: ProgramasResponse;
}

export function ProgramasPageContent({
  initialData,
}: ProgramasPageContentProps) {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<ProgramaFilters>({
    page: initialData.pagination.page,
    pageSize: initialData.pagination.pageSize,
  });
  const [appliedFilters, setAppliedFilters] =
    useState<ProgramaFilters>({
      page: initialData.pagination.page,
      pageSize: initialData.pagination.pageSize,
    });
  const [formValue, setFormValue] =
    useState<CreateProgramaDto>(emptyForm);
  const [formErrors, setFormErrors] =
    useState<ProgramaFormErrors>({});
  const [editingPrograma, setEditingPrograma] =
    useState<ProgramaDto | null>(null);
  const [deletingPrograma, setDeletingPrograma] =
    useState<ProgramaDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const updateFilter = <Key extends keyof ProgramaFilters>(
    field: Key,
    value: ProgramaFilters[Key],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  };

  const updateForm = <Key extends keyof CreateProgramaDto>(
    field: Key,
    value: CreateProgramaDto[Key],
  ) => {
    setFormValue((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const refreshProgramas = async (
    nextFilters: ProgramaFilters,
  ) => {
    setIsLoading(true);

    try {
      const result = await loadProgramas(nextFilters);

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
      setAppliedFilters(resolvedFilters);
      setFilters(resolvedFilters);
      setErrorMessage(null);

      return true;
    } catch {
      setErrorMessage("No fue posible cargar los programas.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPrograma(null);
    setFormValue({ ...emptyForm });
    setFormErrors({});
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (programa: ProgramaDto) => {
    setEditingPrograma(programa);
    setFormValue({
      codigo: programa.codigo,
      nombre: programa.nombre,
      descripcion: programa.descripcion,
      estado: programa.estado,
    });
    setFormErrors({});
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingPrograma(null);
      setFormErrors({});
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    setErrorMessage(null);

    try {
      const result = editingPrograma
        ? await updateProgramaAction(editingPrograma.id, formValue)
        : await createProgramaAction(formValue);

      if (!result.success) {
        setErrorMessage(result.error.message);
        setFormErrors(getFormErrors(result.error.fieldErrors));
        return;
      }

      setIsModalOpen(false);
      setEditingPrograma(null);
      await refreshProgramas(appliedFilters);
    } catch {
      setErrorMessage("No fue posible guardar el programa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPrograma) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deleteProgramaAction(
        deletingPrograma.id,
      );

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      const nextPage =
        data.data.length === 1 &&
        data.pagination.page > 1
          ? data.pagination.page - 1
          : data.pagination.page;

      setDeletingPrograma(null);
      await refreshProgramas({
        ...appliedFilters,
        page: nextPage,
      });
    } catch {
      setErrorMessage("No fue posible eliminar el programa.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApplyFilters = async () => {
    await refreshProgramas({
      ...filters,
      page: 1,
    });
  };

  const handleClearFilters = async () => {
    const clearedFilters: ProgramaFilters = {
      page: 1,
      pageSize: data.pagination.pageSize,
    };

    setFilters(clearedFilters);
    await refreshProgramas(clearedFilters);
  };

  const errorAlert = errorMessage ? (
    <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p
          className="text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {errorMessage}
        </p>
        <Button
          onClick={() => setErrorMessage(null)}
          size="sm"
          variant="ghost"
        >
          Cerrar
        </Button>
      </div>
    </Card>
  ) : null;

  return (
    <div className="space-y-6">
      <ProgramaToolbar onCreate={openCreateModal} />

      {!isModalOpen ? errorAlert : null}

      <ProgramaFiltersPanel
        disabled={isLoading}
        filters={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onCodigoChange={(value) => updateFilter("codigo", value)}
        onEstadoChange={(value) => updateFilter("estado", value)}
        onNombreChange={(value) => updateFilter("nombre", value)}
        onSearchChange={(value) => updateFilter("search", value)}
      />

      {isLoading ? (
        <ProgramaLoading />
      ) : (
        <ProgramaTable
          disabled={isDeleting}
          emptyState={
            <ProgramaEmptyState
              action={
                <Button onClick={openCreateModal}>
                  Crear programa
                </Button>
              }
            />
          }
          onDelete={setDeletingPrograma}
          onEdit={openEditModal}
          programas={data.data}
        />
      )}

      <Pagination
        currentPage={data.pagination.page}
        disabled={isLoading}
        onPageChange={(page) =>
          refreshProgramas({ ...appliedFilters, page })
        }
        totalPages={data.pagination.totalPages}
      />

      <ProgramaModal
        isOpen={isModalOpen}
        mode={editingPrograma ? "edit" : "create"}
        onClose={closeModal}
      >
        <div className="space-y-5">
          {errorAlert}
          <ProgramaForm
            errors={formErrors}
            isSubmitting={isSubmitting}
            onCancel={closeModal}
            onCodigoChange={(value) => updateForm("codigo", value)}
            onDescripcionChange={(value) =>
              updateForm("descripcion", value)
            }
            onEstadoChange={(value) => updateForm("estado", value)}
            onNombreChange={(value) => updateForm("nombre", value)}
            onSubmit={handleSubmit}
            submitLabel={
              editingPrograma
                ? "Actualizar programa"
                : "Crear programa"
            }
            value={formValue}
          />
        </div>
      </ProgramaModal>

      <ConfirmDialog
        confirmLabel="Eliminar programa"
        description={
          deletingPrograma
            ? `Se eliminará el programa "${deletingPrograma.nombre}". Esta acción no se puede deshacer.`
            : ""
        }
        isLoading={isDeleting}
        isOpen={deletingPrograma !== null}
        onCancel={() => setDeletingPrograma(null)}
        onConfirm={handleDelete}
        title="Eliminar programa"
      />
    </div>
  );
}
